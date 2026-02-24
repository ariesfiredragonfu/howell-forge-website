/**
 * ARIA chat widget for Howell Forge website.
 * Set window.ARIA_CHAT_WS_URL (e.g. "wss://your-agent-host/ws/chat") to use live ARIA.
 * Same protocol as dashboard useAriaChat: send { message: "..." }, receive { type: "chunk", text } then { type: "done" }.
 */
(function() {
    var ARIA_WS_URL = typeof window !== 'undefined' && (window.ARIA_CHAT_WS_URL || (function() {
        var s = document.currentScript;
        return s && s.getAttribute && s.getAttribute('data-aria-ws');
    })());

    var s = document.createElement('style');
    s.textContent = [
        '#aria-chat-wrap { position: fixed; bottom: 4rem; right: 1rem; z-index: 9999; }',
        '#aria-chat-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #0052ff, #003dbf); color: white; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(0,82,255,0.5); display: flex; align-items: center; justify-content: center; }',
        '#aria-chat-btn:hover { transform: scale(1.05); }',
        '#aria-chat-btn svg { width: 26px; height: 26px; }',
        '#aria-chat-panel { display: none; position: absolute; bottom: calc(100% + 10px); right: 0; width: 360px; max-width: calc(100vw - 2rem); height: 420px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }',
        '#aria-chat-panel.open { display: flex; }',
        '#aria-chat-panel .head { padding: 0.75rem 1rem; border-bottom: 1px solid #333; color: #fff; font-weight: bold; }',
        '#aria-chat-panel .head span { color: #4d9fff; font-size: 0.8rem; font-weight: normal; }',
        '#aria-chat-panel .msgs { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }',
        '#aria-chat-panel .row { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid #333; }',
        '#aria-chat-panel input { flex: 1; padding: 0.5rem 0.75rem; background: #111; border: 1px solid #444; border-radius: 8px; color: #fff; font-size: 0.9rem; }',
        '#aria-chat-panel button.send { padding: 0.5rem 1rem; background: #0052ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }',
        '.aria-msg { max-width: 85%; padding: 0.5rem 0.75rem; border-radius: 10px; font-size: 0.9rem; }',
        '.aria-msg.user { align-self: flex-end; background: #0052ff; color: white; }',
        '.aria-msg.bot { align-self: flex-start; background: #252525; border: 1px solid #444; color: #ddd; }',
        '.aria-msg.loading { align-self: flex-start; color: #888; font-style: italic; }'
    ].join('\n');
    document.head.appendChild(s);

    var wrap = document.createElement('div');
    wrap.id = 'aria-chat-wrap';
    wrap.innerHTML = [
        '<div id="aria-chat-panel">',
        '  <div class="head">Chat <span>— ARIA</span></div>',
        '  <div class="msgs" id="aria-msgs"><div class="aria-msg bot">Hi, I\'m ARIA. Ask about metal parts, AgentForge, pricing, or anything else.</div></div>',
        '  <div class="row">',
        '    <input type="text" id="aria-input" placeholder="Type a message..." />',
        '    <button type="button" class="send" id="aria-send">Send</button>',
        '  </div>',
        '</div>',
        '<button type="button" id="aria-chat-btn" aria-label="Open chat">',
        '  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
        '</button>'
    ].join('');
    document.body.appendChild(wrap);

    var panel = document.getElementById('aria-chat-panel');
    var btn = document.getElementById('aria-chat-btn');
    var msgs = document.getElementById('aria-msgs');
    var input = document.getElementById('aria-input');
    var sendBtn = document.getElementById('aria-send');

    btn.onclick = function() { panel.classList.toggle('open'); };

    function addMsg(role, text, isLoading) {
        var d = document.createElement('div');
        d.className = 'aria-msg ' + role + (isLoading ? ' loading' : '');
        d.textContent = text || (isLoading ? 'ARIA is thinking…' : '');
        if (role === 'bot' && isLoading) d.setAttribute('data-aria-streaming', '1');
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
        return d;
    }

    function removeStreamingPlaceholder() {
        var el = msgs.querySelector('.aria-msg.bot.loading[data-aria-streaming="1"]');
        if (el) el.remove();
    }

    function stubReply(text) {
        var lower = text.toLowerCase();
        if (lower.indexOf('price') >= 0 || lower.indexOf('pricing') >= 0 || lower.indexOf('cost') >= 0) return 'AgentForge: Self-setup $497, Full $1,497, or $97/month. See AgentForge page for Stripe checkout.';
        if (lower.indexOf('quote') >= 0 || lower.indexOf('metal') >= 0 || lower.indexOf('part') >= 0 || lower.indexOf('cnc') >= 0) return "Use the Get a Quote form on this site. We'll reply within one business day.";
        if (lower.indexOf('contact') >= 0 || lower.indexOf('email') >= 0) return 'Email chrishowell@howell-forge.com. Mon–Fri 9–5 EST.';
        return "I'm ARIA. I can help with metal fabrication, AgentForge, pricing, and quotes. What would you like to know?";
    }

    var ws = null;

    function connectWS() {
        if (!ARIA_WS_URL || (ws && (ws.readyState === 0 || ws.readyState === 1))) return;
        try {
            ws = new WebSocket(ARIA_WS_URL);
            ws.onclose = function() { ws = null; };
            ws.onerror = function() { if (ws) ws.close(); };
        } catch (e) { ws = null; }
    }

    function sendToAria(text) {
        if (!ws || ws.readyState !== 1) return false;
        var streamingEl = addMsg('bot', 'ARIA is thinking…', true);
        var buf = '';
        var handler = function(e) {
            var data;
            try { data = JSON.parse(e.data); } catch { return; }
            if (data.type === 'chunk' && data.text) {
                buf += data.text;
                streamingEl.textContent = buf || 'ARIA is thinking…';
                streamingEl.classList.remove('loading');
                msgs.scrollTop = msgs.scrollHeight;
            }
            if (data.type === 'done') {
                ws.removeEventListener('message', handler);
                removeStreamingPlaceholder();
                addMsg('bot', buf || 'Sorry, I didn\'t get a response. Try again or email chrishowell@howell-forge.com.');
                sendBtn.disabled = false;
            }
            if (data.type === 'error') {
                ws.removeEventListener('message', handler);
                removeStreamingPlaceholder();
                addMsg('bot', 'Something went wrong. Please try again or email chrishowell@howell-forge.com.');
                sendBtn.disabled = false;
            }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ message: text }));
        sendBtn.disabled = true;
        setTimeout(function() {
            if (streamingEl.parentNode && streamingEl.getAttribute('data-aria-streaming') === '1') {
                ws.removeEventListener('message', handler);
                removeStreamingPlaceholder();
                addMsg('bot', 'Request timed out. Try again or email chrishowell@howell-forge.com.');
                sendBtn.disabled = false;
            }
        }, 30000);
        return true;
    }

    function onSend() {
        var text = (input.value || '').trim();
        if (!text) return;
        addMsg('user', text);
        input.value = '';

        if (!ARIA_WS_URL) {
            setTimeout(function() { addMsg('bot', stubReply(text)); }, 400);
            return;
        }

        connectWS();
        if (sendToAria(text)) return;

        var streamingEl = addMsg('bot', 'Connecting to ARIA…', true);
        sendBtn.disabled = true;
        var once = function() {
            if (ws && ws.readyState === 1) {
                ws.removeEventListener('open', once);
                removeStreamingPlaceholder();
                sendToAria(text);
                return;
            }
            if (ws && (ws.readyState === 2 || ws.readyState === 3)) {
                ws.removeEventListener('open', once);
                removeStreamingPlaceholder();
                addMsg('bot', 'ARIA is unavailable. Try again later or email chrishowell@howell-forge.com.');
                sendBtn.disabled = false;
            }
        };
        ws.onopen = once;
        setTimeout(function() {
            if (streamingEl.parentNode && streamingEl.textContent.indexOf('Connecting') >= 0) {
                ws.removeEventListener('open', once);
                removeStreamingPlaceholder();
                addMsg('bot', stubReply(text));
                sendBtn.disabled = false;
            }
        }, 5000);
    }

    sendBtn.onclick = onSend;
    input.onkeydown = function(e) { if (e.key === 'Enter') onSend(); }
})();

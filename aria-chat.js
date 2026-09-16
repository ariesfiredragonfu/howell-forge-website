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
        '#aria-chat-panel .head { padding: 0.75rem 1rem; border-bottom: 1px solid #333; color: #fff; font-weight: bold; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }',
        '#aria-chat-panel .head span { color: #4d9fff; font-size: 0.8rem; font-weight: normal; }',
        '#aria-chat-panel .head .aria-close { background: none; border: none; color: #888; font-size: 1.4rem; cursor: pointer; line-height: 1; padding: 0.25rem; flex-shrink: 0; }',
        '#aria-chat-panel .head .aria-close:hover { color: #fff; }',
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
        '  <div class="head">Chat <span>— ARIA</span><button type="button" class="aria-close" id="aria-close-btn" aria-label="Minimize chat">×</button></div>',
        '  <div class="msgs" id="aria-msgs"><div class="aria-msg bot">Hi, I\'m ARIA. Ask about GroundChiFlow, shop-floor CAM, quotes, or Agent Forge ops.</div></div>',
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

    function closePanel() { panel.classList.remove('open'); }
    btn.onclick = function() { panel.classList.toggle('open'); };
    var closeBtn = document.getElementById('aria-close-btn');
    if (closeBtn) closeBtn.onclick = closePanel;

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
        var lower = text.toLowerCase().trim();

        /* GroundChiFlow first */
        if (/\bgcf\b|groundchiflow|ground chi|breathwork|tai chi|wellness app|health app/.test(lower))
            return 'GroundChiFlow is the public product: nervous system, breathwork, gut, tai chi, rehab, and nutrition in one browser app. Open howell-forge.com/gcf/ or the GroundChiFlow tab. Subscribe $9.99/mo or $79.99/yr via the existing Stripe links on that page. Wellness/education only — not a medical device.';

        /* Withdrawn / hidden lanes — do not sell */
        if (/voice-?to-?part|voice-?to-?pcb|business ai audit|keyguard|ai ecosystem/.test(lower))
            return 'That lane is not a public sellable on this site. Start with GroundChiFlow (howell-forge.com/gcf/) or request a metal/CAM quote. Agent Forge is listed as honest ops tooling only — not a quantum-enabled product.';

        /* Quantum Agent Health (before generic “quantum” / forge) */
        if (/\bquantum agent health\b|\bqah\b|reforge|rehab planning agent|pennylane.*rehab|rehab.*pennylane/.test(lower))
            return 'Quantum Agent Health / ReForge is optional rehab-planning with simulator-first, caveated language (PennyLane on high-fidelity simulators by default). Founding $25/mo or $250/yr on the Quantum Agent Health tab, using existing Stripe links. We do not claim FDA clearance, exclusive hardware, or quantum-enabled Agent Forge.';

        /* Pricing / cost */
        if (/price|pricing|cost|how much|497|1497|97\/?mo|monthly|one-?time|playbook|39|\b25\b|\b250\b|9\.99/.test(lower))
            return 'Public focus: GroundChiFlow $9.99/mo or $79.99/yr (GroundChiFlow tab / howell-forge.com/gcf/). Agent Forge ops packages (Playbook $39; Starter $497; Done For You $1,497; Retainer $97/mo) stay on the Agent Forge tab with honest, non-quantum copy. Quantum Agent Health founding $25/mo or $250/yr, caveated. We do not sell Voice-to-Part, Voice-to-PCB, or Business AI Audit here.';

        /* Quote / metal / fabrication / Picatinny / SurfNDive */
        if (/quote|metal|part|cnc|machining|fabricat|order|prototype|custom part|picatinny|surfn ?dive|4-?axis|fixture/.test(lower))
            return 'Shop-floor verified: Picatinny Rail CAM on 3-axis. SurfNDive hull is design exploration only — we do not claim 4-axis, adaptive clearing, or a production fixture. For a quote, use Get a Quote: material, dimensions, quantity, tolerances, timeline.';

        /* Contact / email */
        if (/contact|email|reach|phone|call|hours|est/.test(lower))
            return 'Email chrishowell@howell-forge.com. Business hours: Mon–Fri 9–5 EST.';

        /* Agent Forge / agents / crew — honest, no quantum-enabled */
        if (/quantum agent forge|q agent forge|agentforge|agent forge|agents?|crew|elizaos|eliza|deploy|forged?|business crew/.test(lower))
            return 'Agent Forge is a practical ops crew (monitors, security scripts, customer lookup, marketing drafts with human approval). Not quantum-enabled. See the Agent Forge tab for existing packages. Public sellable focus is GroundChiFlow.';

        /* What is / how does / explain */
        if (/what is|what\'s|howell forge|who are you|tell me about/.test(lower))
            return 'Howell Forge: GroundChiFlow (the public app), 3-axis Picatinny Rail CAM verified on the shop floor, and honest Agent Forge ops tooling. We do not sell quantum-enabled agents or unverified 4-axis/fixture production.';

        /* Stripe / payment / buy */
        if (/stripe|payment|pay|buy|purchase|checkout|card/.test(lower))
            return 'Stripe on this site uses existing Payment Links only: GroundChiFlow, Agent Forge ops packages, and caveated Quantum Agent Health. Venmo, Cash App, and USDC on Base are on the home page for metal/jobs. We do not invent new checkout URLs.';

        /* USDC / crypto */
        if (/usdc|crypto|base|wallet|0x/.test(lower))
            return 'We accept USDC on the Base network for metal parts. Send to the address shown on the home page. Only USDC on Base — other tokens or networks may result in loss of funds.';

        /* Greetings */
        if (/^(hi|hello|hey|howdy|yo)\s*!?$|^hi there|good (morning|afternoon|evening)/.test(lower))
            return "Hi! I'm ARIA. Ask about GroundChiFlow, a shop-floor quote, or Agent Forge ops. What would you like to know?";

        /* Help */
        if (/help|what can you|what do you|options?|assist/.test(lower))
            return 'I can answer about GroundChiFlow, 3-axis Picatinny CAM, quotes, Agent Forge ops (not quantum-enabled), caveated Quantum Agent Health, and contact.';

        /* Default */
        return "I'm ARIA. Try: GroundChiFlow, a metal/CAM quote, or Agent Forge ops. Public focus is GroundChiFlow at howell-forge.com/gcf/.";
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

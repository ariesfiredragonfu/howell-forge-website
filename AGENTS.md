# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **static HTML website** (no build step, no `package.json`) for Howell Forge. React 18, ReactDOM, Web3.js, and Babel are loaded from CDN at runtime. The site is a single-page application served from `index.html`.

### Running the dev server

```bash
cd /workspace && python3 -m http.server 8000
```

Open http://localhost:8000 — the site requires internet access for CDN scripts (React, Babel, Web3).

### Key files

- `index.html` — main SPA (React + Web3 wallet connect, multi-page routing)
- `aria-chat.js` — ARIA chat widget (WebSocket-based; uses client-side stub when no WS server is available)
- `ai-ecosystem/` — sub-site for AI automation packages (plain HTML/CSS/JS)
- `qah.html`, `funnel-gcf.html` — standalone product pages

### Lint / validation

There is no formal linter configured. Use Python's `html.parser` for basic HTML validation:

```bash
python3 -c "
import html.parser, os
class V(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.errors=[]
    def error(self, m): self.errors.append(m)
for root, dirs, files in os.walk('/workspace'):
    if '.git' in root: continue
    for f in files:
        if f.endswith('.html'):
            path=os.path.join(root,f)
            p=V(); p.feed(open(path).read())
            print(f'{path}: {\"OK\" if not p.errors else p.errors}')
"
```

### Gotchas

- **No npm/node needed** — do not run `npm install` or similar; there is no `package.json`.
- **ARIA chat in local mode** — `index.html` sets `window.ARIA_CHAT_WS_URL = ""` when on localhost, so the chat widget uses built-in stub responses. This is expected behavior for local dev.
- **GroundChiFlow (`/gcf/`)** — built in CI from a separate repo (`ariesfiredragonfu/ground-chi-flow`), not present locally. Do not attempt to build it here.
- **Ports** — per user convention, port 8000 is used for the static dev server. Ports 5000, 5004, 5050, 8080, 8765, 8766, 8090 are reserved for other Howell Forge stack services.

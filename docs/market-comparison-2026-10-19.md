# Howell Forge market comparison & site audit

**Date:** 2026-10-19  
**Scope:** Public positioning on [howell-forge.com](https://howell-forge.com/) and this repository (`howell-forge-website`). Research and audit only; no product claims beyond what the site/repo supports.  
**Method:** Repo review, live URL checks (HTTP HEAD/GET), competitor pricing pages and app stores (links below). Pricing was captured on or about 2026-10-19 and will change.

---

## Executive summary

Howell Forge combines **Fusion 360 mechanical modeling** (portfolio/contact), **Agent Forge** (ElizaOS-based ops agent kit with Stripe checkout), **GroundChiFlow** (hosted wellness app at `/gcf/`), a **soft-secondary QAH** lane, and **USDC-on-Base + browser wallet** payment on the main SPA. Strengths: honest QAH caveats, validation placeholder on the home page, clear Picatinny proof wording, and working core navigation. Gaps versus market leaders: **content libraries, native apps, EMR/HEP integrations, marketplace trust/reviews, and turnkey crypto checkout** (vs Shopify/Coinbase Commerce). The public site does **not** currently name a product **“Forge Lens Web3 Agent Kit”**; that section below maps the brief to what is actually shipped and to adjacent market offers.

**Picatinny rail (required wording):** modeled in Fusion 360 and cut on a 3-axis machine.

---

## Howell Forge — current public offers (baseline)

| Lane | Public price (site) | Where |
|------|---------------------|--------|
| GroundChiFlow | $9.99/mo, $79.99/yr | `index.html`, `funnel-gcf.html`, Stripe links |
| Agent Forge Starter | $497 one-time | `index.html`, `/agent-forge/` |
| Agent Forge Done For You | $1,497 one-time | same |
| Agent Forge retainer | $97/mo | same |
| The Playbook | $39 one-time | `index.html` |
| QAH (secondary) | $25/mo, $250/yr founding | `index.html?page=qah`, `qah.html` |
| Fusion parts modeling | Contact for quote | `/portfolio/`, `/contact/` |
| USDC (parts) | Manual address + optional wallet connect | Home → pay sections |
| “Kaito Template” | $49 one-time **listed on home card** | Home only; **no dedicated Stripe link** on that card |

GroundChiFlow app is a **separate Expo build** deployed to `/gcf/` via CI (not in this repo). Local clone has no `/gcf/` folder; production URL returned HTTP 200.

---

## 1. GroundChiFlow (wellness: breathwork, tai chi, rehab, gut, longevity)

**Howell positioning:** Browser-based app; subscription via Stripe; marketing claims a broad bundle in one product (`index.html` groundchiflow page: “No one else combines all of this” — **not independently verified** in this audit).

### Competitors

| Competitor | Link | Typical pricing (US, public) | Features Howell lacks (or weaker on market) |
|------------|------|------------------------------|---------------------------------------------|
| **Calm** | [App Store](https://apps.apple.com/us/app/calm/id571800810) · [calm.com](https://www.calm.com/) | ~$14.99/mo or $69.99/yr; lifetime ~$399.99 (App Store listing) | Massive sleep story/meditation catalog; celebrity content; strong brand; native iOS/Android/TV apps; published clinical/partnership narrative |
| **Headspace** | [App Store](https://apps.apple.com/us/app/headspace-meditation-sleep/id493145008) | ~$12.99/mo or $69.99/yr (App Store) | Coaching tier, structured programs, employer/B2B channel, native apps, large content team |
| **Breathwrk** | [breathwrk.com/pro](https://www.breathwrk.com/breathwrk-pro) · [App Store](https://apps.apple.com/us/app/breathwrk-breathing-exercises/id1481804500) | Pro from ~$5.75/mo (annual messaging); App Store IAP tiers | Peloton bundle distribution; HRV/lung tests; Apple Health; daily refreshed classes; 2M+ user scale |
| **Othership** | [othership.us/app](https://www.othership.us/app) · [App Store](https://apps.apple.com/us/app/othership-guided-breathwork/id1590348936) | ~$10.83/mo annual (~$129.99/yr); monthly ~$17.99 (App Store / site) | 500+ guided breathwork sessions; music-driven UX; community positioning; mature mobile apps |
| **Tai Chi / movement (example: Dr. Peter Wayne programs)** | [taichiforhealthinstitute.org](https://taichiforhealthinstitute.org/) (institute; various paid courses) | Course-based (varies) | Deep single-modality credibility, instructor-led cohorts, published research tie-ins |

**Howell advantages (factual, from site):** Lower entry price ($9.99/mo) than Calm/Headspace/Othership monthly list prices; **explicit** combination positioning (breath + tai chi + rehab + gut + nutrition in copy). **Risks:** GCF is a web app shell at `/gcf/` without marketing keywords in initial HTML (Expo); competitors win on **store presence, reviews, and content volume**.

---

## 2. QAH (Quantum Agent Health / ReForge — soft secondary)

**Howell positioning:** Clinic-adjacent rehab planning, GCF handoff JSON, PennyLane simulator-first “quantum-informed” risk; **not** primary nav; strong disclaimers (`qah.html`, `index.html` quantumAgentHealth).

### Competitors

| Competitor | Link | Typical pricing (US, public) | Features Howell lacks |
|------------|------|------------------------------|------------------------|
| **Medbridge (Premium)** | [medbridge.com/pricing](https://www.medbridge.com/pricing) | $325/yr (individual Premium; includes HEP + patient app) | 1,000s of exercises, patient portal (Medbridge GO), CE library, established clinic trust |
| **Physitrack** | [physitrack.com/physitrack-pricing](https://www.physitrack.com/physitrack-pricing) | ~$18.99/practitioner/mo (~$227.88/yr) | 18,000+ exercise library, PhysiApp, telehealth trial, EMR integrations |
| **Exercise Pro Live** | [exerciseprolive.com/hep-software-pricing](https://www.exerciseprolive.com/hep-software-pricing/) | ~$134/yr solo ($99 intro year); RTM included | 7,000+ videos, 130+ languages, dedicated patient apps, RTM billing feature set |
| **HEP2Go** (budget HEP) | [hep2go.com](https://www.hep2go.com/) (vendor site) | Often cited ~$120–240/yr in comparison articles | Simpler HEP focused UX; print/email programs; long market presence |
| **Spry / full EMR stacks** | [sprypt.com](https://www.sprypt.com/) | Platform pricing (varies) | AI form feedback, EMR-native HEP, billing, scheduling in one stack |

**Howell advantages:** Very low founding price ($25/mo); **GCF handoff** story for continuity; transparent “soft / not primary offer” framing. **Gaps:** QAH lists **exercise video library on roadmap**; competitors ship **large video libraries, RTM, and EMR connectors**. PennyLane/IBM optional path is niche vs mainstream clinic procurement.

---

## 3. Crypto wallet / USDC checkout (Web3 payments on main site)

**Howell positioning:** Static USDC address on Base, QR, warnings; MetaMask/Brave connect via Web3.js on home SPA (`index.html`). Not a full merchant crypto stack.

### Competitors

| Competitor | Link | Typical pricing (public) | Features Howell lacks |
|------------|------|--------------------------|------------------------|
| **Shopify Payments (USDC)** | [Shopify Help: USDC](https://help.shopify.com/en/manual/payments/shopify-payments/usdc-payments) | Standard Shopify Payments rates; no extra USDC fee cited in help docs | Checkout-integrated USDC, 480+ wallets, fiat payout option, dispute/refund policies tied to commerce platform |
| **Coinbase Commerce** | [Coinbase Commerce fees](https://help.coinbase.com/en/commerce/getting-started/fees) | **1%** per crypto payment | Hosted invoices, payment history, reporting, customer payment UI |
| **Coinbase Developer Platform (Commerce API)** | [coinbase.com/developer-platform/pricing](https://www.coinbase.com/developer-platform/pricing) | 1% transaction fee (Commerce) | Programmatic charges, webhooks, reconciliation |
| **BitPay** | [bitpay.com](https://www.bitpay.com/) | Tiered merchant pricing (quote) | Invoicing, POS, settlement to fiat, compliance tooling |
| **Request Network / crypto invoicing tools** | [request.network](https://request.network/) | Network + product fees vary | On-chain payment requests, audit trail, ERP integrations |

**Howell advantages:** Zero platform fee for manual P2P USDC; simple for **trusted** buyers who already have Base USDC. **Gaps:** No automated order matching, no fiat conversion, no subscription support in-wallet, higher **user error risk** (wrong chain/token) despite warnings.

---

## 4. Agent Forge kits (8-agent ElizaOS business crew)

**Howell positioning:** $497 / $1,497 / $97/mo + $39 playbook; Telegram, Stripe, monitoring/security/marketing personas; self-host/Docker (`index.html`, `/agent-forge/`). Site copy avoids “quantum-enabled agents” on main pages; internal `aria-chat.js` still uses outdated “Quantum Agent Forge” / Voice-to-Part language (see audit).

### Competitors

| Competitor | Link | Typical pricing (public) | Features Howell lacks |
|------------|------|--------------------------|------------------------|
| **n8n (cloud)** | [n8n.io pricing](https://n8n.io/pricing/) · [comparison via Lindy blog](https://www.lindy.ai/blog/relevanceai-vs-n8n) | Starter ~$24/mo cloud; self-host free CE | 2,200+ integrations, visual workflow builder, large community templates, execution history |
| **Lindy.ai** | [lindy.ai](https://www.lindy.ai/) | From ~$29.99–49.99/mo (plan-dependent) | Polished no-code agent builder, 200+ SaaS integrations, managed hosting |
| **Relevance AI** | [relevanceai.com](https://relevanceai.com/) | From ~$29/mo (Pro, cited in comparisons) | Multi-agent workforce UI, tool marketplace, faster time-to-first-agent for non-devs |
| **Eliza Cloud (official hosting)** | [docs.elizaos.ai deploy](https://docs.elizaos.ai/guides/deploy-to-cloud) · [elizaOS/cloud README](https://github.com/elizaOS/cloud) | ~$0.67/day per container (~$20/mo) + usage credits | One-command deploy, HTTPS, logs, ERC-8004 / X402 marketplace story on platform |
| **Microsoft Copilot Studio** | [Microsoft pricing](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio) | ~$30/mo base (ecosystem-dependent) | M365/Teams integration, enterprise procurement path |

**Howell advantages:** **Fixed-price source kit + done-for-you** positioning; vertical story (shop floor REX, metal parts quote flow); bundled **eight named personas** vs generic automation. **Gaps:** No public plugin marketplace, fewer third-party integrations than n8n/Lindy, **Eliza Cloud** undercuts ongoing hosting narrative for technical buyers who only need hosting.

---

## 5. “Forge Lens Web3 Agent Kit” (brief vs site reality)

**Finding:** No matches for `Forge Lens`, `Lens Web3`, or `Forge Lens Web3 Agent Kit` in this repository or on crawled howell-forge.com HTML (2026-10-19). Unrelated “Forge Lens” products exist elsewhere (e.g. pitch-review AI, manufacturing video analysis) — **not Howell Forge**.

**Closest Howell shipped bundle for this brief:**

- **Agent Forge** (ElizaOS agents, Stripe, ops personas)
- **Browser wallet + USDC on Base** on the main site
- **Eliza ecosystem** public docs for **ERC-8004** identity/reputation ([npm `@elizaos/plugin-8004`](https://www.npmjs.com/package/@elizaos/plugin-8004), [EIP-8004](https://eips.ethereum.org/EIPS/eip-8004))

### Competitors (Web3 agent / on-chain agent identity kits)

| Competitor | Link | Typical pricing (public) | Features Howell lacks |
|------------|------|--------------------------|------------------------|
| **Eliza Cloud + marketplace** | [Deploy to Eliza Cloud](https://docs.elizaos.ai/guides/deploy-to-cloud) | ~$20/mo/container + credits | Official deploy path, ERC-8004 discovery, X402 payments narrative |
| **`@elizaos/plugin-8004`** | [npm package](https://www.npmjs.com/package/@elizaos/plugin-8004) | Open-source plugin; gas costs on-chain | On-chain agent registry, endorse/penalize reputation, multi-chain registry support |
| **Thirdweb / similar Web3 SDKs** | [thirdweb.com](https://thirdweb.com/) | Usage-based | Wallets, contracts, dashboards for NFT/token gating |
| **Coinbase Smart Wallet / paymasters** | [CDP docs](https://www.coinbase.com/developer-platform) | Dev platform pricing | Sponsored txs, embedded wallets, commerce APIs |
| **Autonolas / Olas agent frameworks** | [olas.network](https://olas.network/) | Token/protocol economics | On-chain agent services marketplace |

**Recommendation:** If “Forge Lens Web3 Agent Kit” is a **planned** SKU, add a dedicated page with scope (ERC-8004? wallet? lens social?) before marketing the name; until then, treat **Agent Forge + USDC** as the honest public Web3-adjacent offer.

---

## 6. Fusion 360 / FreeCAD parts (CAD → STEP/STL → CNC-ready)

**Howell positioning:** Solo studio; packages “contact for quote”; proof: accessory rail **modeled in Fusion 360 and cut on a 3-axis machine** (`portfolio/index.html`). **FreeCAD** appears only in deprecated **Voice-to-Part** docs (`VOICE_TO_PART_STRIPE_CHECKLIST.md`, `ai-ecosystem/FINAL_COPY_LIBRARY.md`), not active portfolio copy.

### Competitors

| Competitor | Link | Typical pricing (public) | Features Howell lacks |
|------------|------|--------------------------|------------------------|
| **Fiverr Fusion 360 gigs** | e.g. [shaaz_h Fusion 360](https://www.fiverr.com/shaaz_h/design-professional-3d-cad-models-in-fusion-360) from **~$10** basic | Marketplace reviews, fast turnaround tiers, global supply |
| **Fiverr CNC-ready + CAM** | [Protodreamer3d CAM](https://www.fiverr.com/protodreamer3d/program-your-cnc-machine-using-fusion-360-cam) from **~€45** | Dedicated CAM programmers, Fusion Teams collaboration |
| **Xometry / Fictiv** | [xometry.com](https://www.xometry.com/) · [fictiv.com](https://www.fictiv.com/) | Quote-based manufacturing | Instant quoting, vetted shop network, DFM feedback, production at scale |
| **CAD Crowd** | [cadcrowd.com](https://www.cadcrowd.com/) | Project bids | Large designer pool, NDAs, enterprise procurement |
| **Freelance mechanical (e.g. Ismail on Fiverr)** | [fiverr.com/ismailsaghar](https://www.fiverr.com/ismailsaghar) from **~$30** | GD&T drawings, renders, stated manufacturing-ready deliverables |

**Howell advantages:** Personal brand, Sylva NC story, **video/sim proof** on portfolio, honest prototype labeling. **Gaps:** No instant online quote, placeholder photos (“coming soon”), **no published package dollar amounts**, limited social proof/reviews vs Fiverr stars.

---

## Site audit (howell-forge.com + repo)

### Broken links & routing

| Check | Result |
|-------|--------|
| Live HEAD on core paths (`/`, `/portfolio/`, `/contact/`, `/agent-forge/`, `/qah.html`, `/funnel-gcf.html`, `/gcf/`, media, resume PDF) | **HTTP 200** (audit run 2026-10-19) |
| `/voice/` | **200** — redirects messaging to Agent Forge (Voice-to-Part removed) |
| `/ai-ecosystem/` | **200** but **`robots.txt` Disallow** — intentional staging; risk if linked from marketing |
| Local repo `/gcf/` path | **Not present** locally (expected; CI artifact) |
| `funnel-gcf.html` → `/gcf/` | Valid in production; broken only in local static serve without GCF build |

No widespread broken external CDN links detected (React, Babel, Web3.js returned 200).

### UX

- **Strengths:** QAH de-emphasized in main nav; validation-status panel on home; expandable agent cards; mobile stacking for CTAs (`@media max-width 600px`); portfolio/contact use readable `clamp()` headings.
- **Issues:**
  - Home **“Kaito Template $49”** card routes to AI Forge page — **no one-click Stripe** (expectation mismatch).
  - **ARIA chat stub** contradicts main site: “quantum-enabled agents,” **Voice-to-Part**, old AI Forge price list (`aria-chat.js`).
  - **Portfolio** still has placeholder blocks (“Photo: finished rail…”, “coming soon”) — weak trust vs competitors’ photo-heavy gigs.
  - **QAH** reachable via `?page=qah` but **not in header** — fine for “soft,” but deep links from `qah.html` may confuse users who expect a tab.
  - **`/voice/`** redirect is easy to hit from old bookmarks; OK but worth a single 301 policy in hosting config if not already unified.
  - GCF: Expo shell uses `body { overflow: hidden }` — verify scroll/accessibility inside app (not fully exercised in this audit).

### Copy & claims hygiene

| Item | Severity | Notes |
|------|----------|--------|
| GroundChiFlow: “No one else combines all of this” | High | Unverifiable superlative; competitors cover subsets; recommend qualify or remove. |
| About: “battle-hardened on our own live business” | Medium | Marketing tone; align with `ai-ecosystem/SAFE_TO_CLAIM_MATRIX.md` (“partial / qualify” for several ops claims). |
| ARIA: “quantum-enabled AI agents” | High | Conflicts with main site (“No quantum-enabled claims” on About). |
| ARIA: Voice-to-Part pricing | High | Product removed (`voice/index.html`). |
| Agent naming drift (“Quantum Agent Forge” vs “Agent Forge”) | Medium | Hurts brand consistency and SEO. |
| Picatinny wording | OK | Matches required claim: **modeled in Fusion 360 and cut on a 3-axis machine**. |

### SEO

- **Strengths:** Canonical on home; `sitemap.xml`; JSON-LD `WebPage` on home; visible `hf-seo-narrative` article for crawlers; `robots.txt` blocks `index-to-restore.html` and `/ai-ecosystem/`.
- **Issues:**
  - Very long `meta keywords` and hashtag block — low value; can look spammy to auditors.
  - `article:tag` meta on a non-article page.
  - **`/agent-forge/` missing from `sitemap.xml`** (page exists, canonical set on that HTML).
  - Subpages (`qah.html`, `funnel-gcf.html`) weaker Open Graph coverage than home.
  - SPA primary content loads after React — mitigated by SEO narrative but **duplicate/near-duplicate** prose (hero vs article).
  - Staging **ai-ecosystem** pricing ($10k–$50k) live at URL though disallowed — avoid accidental backlinks.

### Mobile

- `background-attachment: fixed` on `body` (`index.html`, `static/services.css`) — known **iOS scroll jank / performance** issue; consider `scroll` or `@media` override.
- Nav uses `flex-wrap` — acceptable; many header buttons on small screens (6+ items).
- Payment QR shrinks to 100px width under 600px — may be hard to scan.
- Computer-use mobile pass **not completed** (environment limit); issues above from CSS + live HTML review.

---

## Prioritized improvements (quick wins first, $0 cost)

1. **Fix `aria-chat.js` stub copy** — remove Voice-to-Part; drop “quantum-enabled agents”; sync prices with `index.html` / `agent-forge/index.html` (content-only, high trust impact).
2. **Remove or reword GCF superlative** (“No one else combines…”) unless you publish a sourced comparison.
3. **Add `/agent-forge/` to `sitemap.xml`** and bump `lastmod`.
4. **Kaito $49 card** — add Stripe link or change CTA to “Contact” / remove price until checkout exists.
5. **Align branding** — pick **Agent Forge** everywhere public; reserve “Quantum” for QAH product name only.
6. **Portfolio placeholders** — replace “coming soon” with one real photo or remove placeholder boxes (uses existing media).
7. **iOS/mobile CSS** — set `background-attachment: scroll` under `max-width: 768px` on shared `body` styles.
8. **QAH / Voice legacy** — add `noindex` to `voice/index.html` if still indexed; ensure `sitemap` priority stays low for `qah.html` (already 0.3).
9. **Structured data** — add minimal `Organization` or `Product` JSON-LD on `/agent-forge/` and GCF funnel (copy from visible prices only).
10. **Internal doc cleanup** — mark `ai-ecosystem/*` and Voice-to-Part checklists as **non-public** in README to prevent accidental promotion of draft $10k packages.
11. **Forge Lens naming** — if product is real, add one landing section; if not, remove from external pitch decks to match site truth.
12. **FreeCAD** — do not claim FreeCAD deliverables on public pages until Voice-to-Part or a FreeCAD package returns; portfolio stays Fusion-forward.

---

## Evidence log

- Live URL checks: automated HEAD/GET against `https://howell-forge.com/*` (2026-10-19).
- HTML parser walk: 0 errors across workspace `.html` files (excluding `_assemble` blobs).
- Competitor pricing: linked vendor pages and App Store listings cited in tables above.
- Claim governance reference: `ai-ecosystem/SAFE_TO_CLAIM_MATRIX.md` (staging; aligns with conservative public copy on main site).

---

## Document control

- **Branch:** `cursor/market-comparison-2026-10-19-04bd`
- **File:** `docs/market-comparison-2026-10-19.md`
- **PR:** Intentionally not opened (research deliverable only).

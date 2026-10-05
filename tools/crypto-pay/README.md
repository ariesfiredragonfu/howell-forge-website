# Crypto pay frontend bundle

Standalone checkout for `/crypto-pay.html`: Phantom extension (via `@phantom/browser-sdk`) + locally rendered Solana Pay QR.

## Pinned dependency versions

| Package | Version |
|---------|---------|
| `@phantom/browser-sdk` | 2.0.4 |
| `@solana/web3.js` (transitive) | 1.99.0 |
| `qrcode` | 1.5.4 |
| `esbuild` (dev) | 0.28.2 |

## Build

```bash
cd tools/crypto-pay
npm ci
npm run build          # writes ../../static/crypto-pay/crypto-pay.bundle.js
npm run build:check    # rebuild + fail if committed bundle differs
```

Latest committed bundle size: **~619 KB** minified (~**185 KB** gzip). No Buffer/process shims required.

## Local test (devnet)

### Backend (`howell-forge-business`, branch `cursor/crypto-pay-devnet`)

```bash
python3.11 -m venv .venv-crypto && . .venv-crypto/bin/activate
pip install -r fulfillment/requirements-stripe-fulfillment.txt -r fulfillment/requirements-crypto.txt
cp fulfillment/crypto.devnet.env.example fulfillment/crypto.devnet.env   # set MERCHANT_ADDRESS (devnet test addr)
set -a; . fulfillment/crypto.devnet.env; set +a
STRIPE_SECRET_KEY=sk_test_dummy RESEND_API_KEY=re_dummy uvicorn fulfillment.stripe_fulfillment_app:app --port 8781
```

### Site (this repo, branch `cursor/crypto-pay-devnet`)

```bash
cd /path/to/howell-forge-website
python3 -m http.server 8899
```

Open **http://127.0.0.1:8899/crypto-pay.html** (meta tag `crypto-pay-api` points at `http://127.0.0.1:8781/crypto`).

### Phantom

1. Install the [Phantom extension](https://phantom.app/).
2. **Settings → Developer Settings → Testnet Mode** → enable, choose **Solana Devnet**.
3. Fund devnet USDC via [faucet.circle.com](https://faucet.circle.com/) (manual; captcha-gated).

### Happy path

1. Enter amount ($1–$1000), note, and email → **Continue to payment**.
2. QR shows the `solana:` transfer URL from the API.
3. Desktop: **Connect Phantom** → **Pay with Phantom** (or scan QR with another wallet).
4. Status polls every 4s: Waiting → Payment seen → **Paid ✓** with explorer link.

## Smoke test (optional, no wallet)

With the static server running on 8899, you can mock the API with a local proxy; the HTML validates form fields client-side before POST.

## Phase 3 reminders

- Point `crypto-pay-api` meta at production fulfillment URL; tighten CSP (drop localhost).
- Link from site nav; retire Base USDC block in `index.html` separately.
- CORS prod origin on backend.

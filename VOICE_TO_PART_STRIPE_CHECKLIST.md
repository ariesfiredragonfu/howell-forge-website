# Voice-to-Part: Stripe + Staging + Live Checklist

Use this after adding Voice-to-Part to the products page.

---

## 1. Create Stripe products (Dashboard)

1. Go to [dashboard.stripe.com/products](https://dashboard.stripe.com/products).
2. Click **Add product**.
3. **Voice-to-Part Starter**
   - Name: `Voice-to-Part Starter`
   - Description: `Voice or text → STL/STEP. Blender or FreeCAD. Manufacturing Sim add-on included. 14-day free trial.`
   - Pricing: **Recurring** → Monthly **$19** (optional: add yearly **$199** as second price).
   - Save → copy the **Payment link** (e.g. `https://buy.stripe.com/xxxxx`).
4. **Voice-to-Part Pro**
   - Name: `Voice-to-Part Pro`
   - Description: `Everything in Starter. Higher volume, priority support. For shops and makers.`
   - Pricing: **Recurring** → Monthly **$49** (optional: yearly **$499**).
   - Save → copy the **Payment link**.

---

## 2. Paste Stripe links into the website

1. Open **index.html** in the website repo.
2. Find `REPLACE_VOICE_PART_STARTER` and replace that full URL with your Starter payment link (e.g. `https://buy.stripe.com/abc123...`).  
   - In the onClick, the variable is: `var u = 'https://buy.stripe.com/REPLACE_VOICE_PART_STARTER'`  
   - Replace so it becomes: `var u = 'https://buy.stripe.com/YOUR_ACTUAL_STARTER_ID';`
3. Find `REPLACE_VOICE_PART_PRO` and replace with your Pro payment link.
4. Save. The buttons will then go to Stripe checkout instead of opening the contact email.

---

## 3. Staging (test before live)

- **Option A — Branch preview:** Push to branch `staging` or `voice-to-part`. If you use GitHub Pages from a branch, open the staging URL and confirm Voice-to-Part appears above AgentForge and links look correct.
- **Option B — Local:** Run a static server in the repo (`python3 -m http.server 8000` or `npx serve .`) and open `http://localhost:8000` → click **AI Forge** → scroll to see Voice-to-Part then AgentForge. Test both buy buttons (with placeholders they open mailto; after pasting Stripe links they open checkout).

---

## 4. Go live

1. Merge `staging` into `main` (or push the changes to `main`).
2. Let the deploy run (GitHub Pages or IONOS per your setup).
3. Open **howell-forge.com** (or your live URL) → **AI Forge** → confirm Voice-to-Part at top, AgentForge below, and Stripe buttons work.
4. Do a test checkout in Stripe test mode if you want (switch to live when ready).

---

## 5. Quick reference

| Item | Where |
|------|--------|
| Voice-to-Part section | `index.html` — first block when `page === 'products'` |
| Starter button URL | Search for `REPLACE_VOICE_PART_STARTER` |
| Pro button URL | Search for `REPLACE_VOICE_PART_PRO` |
| AgentForge | Unchanged; still below Voice-to-Part |

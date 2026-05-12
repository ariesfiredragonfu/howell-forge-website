# Quantum Agent Health — Stripe Payment Links (staging → live)

## Staging / sandbox (test mode)

### Option A — API script (Hardware_Factory)

From the **Hardware_Factory** repo, with a Stripe **test** secret key (`sk_test_...`):

```bash
# Key in env, or in ~/.config/cursor-stripe-test-secret-key (chmod 600)
export STRIPE_SECRET_KEY=sk_test_...
python3 scripts/stripe_create_qah_products_test.py
```

The script prints `const STRIPE_QAH_MONTHLY_TEST` / `STRIPE_QAH_ANNUAL_TEST` lines to paste into `index.html`.  
Re-running creates **additional** products/links; clean up duplicates in the Dashboard if needed.

### Option B — Dashboard (manual)

1. Stripe Dashboard → enable **Test mode** (toggle).
2. **Product catalog** → Product **Quantum Agent Health** with two recurring prices:
   - **$99.00 / month**
   - **$999.99 / year**
3. **Payment Links** → create one link per price (test mode).
4. Copy each URL into `index.html`:
   - `STRIPE_QAH_MONTHLY_TEST`
   - `STRIPE_QAH_ANNUAL_TEST`  
   Test links usually look like `https://buy.stripe.com/test_...`

5. Open the site → **QAH** tab → click **Subscribe** → pay with a [Stripe test card](https://docs.stripe.com/testing).

6. When satisfied, repeat in **Live mode**, create **live** Payment Links, replace constants (and rename to live constants if you prefer), then deploy.

## Go live

Follow project rule: test mode → local verification → live products + live links. See Hardware_Factory `.cursor/rules/stripe-go-live.mdc`.

## If buttons show an alert

The page checks that each URL starts with `https://buy.stripe.com/`. Paste your real Payment Link URLs from the Dashboard.

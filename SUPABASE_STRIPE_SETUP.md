# PromptDrop, Phase 2 setup (Supabase + Stripe)

Everything below the line marked **already done** is live. The short **your turn** list is
the only thing left to switch payments on. Accounts and plan-gating already work right now.

---

## Already done (wired and deployed)

**Supabase project**

- Name: `promptdrop`
- Ref: `wbqteajanwvfcwvjqozt`
- URL: `https://wbqteajanwvfcwvjqozt.supabase.co`

**Database** (row-level security on every table)

- `profiles`, one row per user, created automatically on signup.
- `subscriptions`, one row per user, written only by the Stripe webhook (service role). Users can read their own row.
- `scripts`, owner-only, ready for cloud sync.
- Signup trigger creates the profile + a default `free` subscription. The trigger function is locked down (no public RPC).

**Edge functions** (deployed, reading their secrets at runtime)

- `stripe-checkout`, creates a Checkout Session for the signed-in user.
- `stripe-portal`, opens the Stripe billing portal.
- `stripe-webhook`, verifies Stripe's signature and writes the plan/status into `subscriptions`.

**Web app**

- Real email + password auth (sign in / sign up / sign out, account chip, account page).
- Plan resolved from the `subscriptions` table; feature gating runs off the real plan.
- Pricing buttons open real Stripe Checkout; account page opens the real billing portal.
- `.env` is filled with the project URL + publishable key (both client-safe).

Until the Stripe secrets below are set, checkout returns an honest "payments aren't switched
on yet" message instead of pretending. No fake billing anywhere.

---

## Your turn (about 10 minutes, all in dashboards)

### 1. Create the products + prices in Stripe

In the Stripe Dashboard → Products, create two products, each with a **monthly** and a **yearly**
recurring price:

| Product | Monthly | Yearly |
|---|---|---|
| Creator Pro | $5 / month | $56 / year |
| Studio Pro | $9 / month | $95 / year |

Copy the four **price IDs** (they look like `price_1AbC...`).

### 2. Add the webhook endpoint in Stripe

Stripe Dashboard → Developers → Webhooks → Add endpoint:

- Endpoint URL: `https://wbqteajanwvfcwvjqozt.supabase.co/functions/v1/stripe-webhook`
- Events to send: `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`
- After creating it, copy the **signing secret** (`whsec_...`).

### 3. Set the secrets on Supabase

Supabase Dashboard → Project `promptdrop` → Edge Functions → **Manage secrets**
(or run `supabase secrets set KEY=value` with the CLI). Add:

```
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_CREATOR_MONTHLY=price_...
STRIPE_PRICE_CREATOR_YEARLY=price_...
STRIPE_PRICE_STUDIO_MONTHLY=price_...
STRIPE_PRICE_STUDIO_YEARLY=price_...
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically, don't add them.
The functions read secrets at runtime, so there's no need to redeploy after setting them.

### 4. (Optional) email confirmation

New Supabase projects require email confirmation on signup by default, so a new user gets a
confirmation email before they can sign in. For frictionless testing you can turn this off at
Supabase → Authentication → Providers → Email → "Confirm email". Leave it on for production.

---

## Test the full loop

1. `npm install && npm run dev`, open the printed URL.
2. Sign up, confirm the email if confirmation is on.
3. Pricing → pick Creator Pro → you land on Stripe Checkout (use test card `4242 4242 4242 4242`).
4. After paying you return to `/account`; within a few seconds the webhook flips your plan to Creator Pro.
5. Account → Manage billing opens the Stripe portal.

If checkout still says "payments aren't switched on", a secret in step 3 is missing or misnamed.

---

## AI features (transcription, notes, summaries, Ask, interview assistant)

Transcription and all AI generation run as Supabase Edge Functions (`transcribe`, `assistant`)
that call an LLM provider. They're deployed and wired; they return an honest "not switched on
yet" until you add one secret:

Supabase Dashboard -> project `promptdrop` -> Edge Functions -> Manage secrets:

```
OPENAI_API_KEY=sk-...
```

Optional overrides: `TRANSCRIBE_MODEL` (default `whisper-1`), `ASSISTANT_MODEL` (default `gpt-4o-mini`).

Once the key is set, web Studio "Transcribe / Make notes / Ask" produce real output. No redeploy needed.

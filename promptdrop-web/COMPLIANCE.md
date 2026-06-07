# PromptDrop — Compliance & Legal Readiness

**Read this first.** I'm not a lawyer and this is not legal advice. No document or feature
can guarantee immunity from lawsuits. The drafts I've added (Privacy Policy, Terms of Service,
Acceptable Use Policy) and the consent UX are a strong, professional starting point that covers
the major risks for a product like this, but you must have a qualified lawyer review them before
you rely on them — especially the recording-consent and data-protection pieces, which carry
criminal as well as civil liability in some places.

---

## What's the biggest risk, honestly

**Recording consent (wiretap / eavesdropping law).** PromptDrop records calls and meetings,
sometimes both sides of the audio. In many US states (California, Florida, Illinois, Maryland,
Massachusetts, Montana, New Hampshire, Pennsylvania, Washington, and others) and across much of
the EU/UK, you must have the consent of **every** participant before recording. Violations can
mean criminal charges and statutory civil damages (the US federal Wiretap Act alone allows the
greater of $100/day or $10,000, plus up to 5 years imprisonment).

You reduce *your* exposure by making clear, in the product and the Terms, that **the user** is
responsible for getting consent — which is exactly what I've built (see below). But you cannot
fully eliminate it, and a lawyer should confirm the wording for your launch markets.

Sources: [Recording Law: two-party consent states](https://www.recordinglaw.com/party-two-party-consent-states/), [Justia 50-state survey](https://www.justia.com/50-state-surveys/recording-phone-calls-and-conversations/), [KTS Wiretap Laws overview](https://ktslaw.com/en/Insights/Alert/2024/7/Wiretap-Laws-in-the-United-States).

---

## What I've already built into the product

- **Privacy Policy, Terms of Service, Acceptable Use Policy** — live at `/privacy`, `/terms`,
  `/acceptable-use`, linked in the footer.
- **Signup agreement** — new accounts must tick a box agreeing to the Terms + Privacy Policy and
  acknowledging responsibility for recording consent (clickwrap, the enforceable kind).
- **Recording-consent gate** — before the first recording in the web Studio, users must confirm
  they have consent and the legal right to record; a permanent reminder sits by the record
  button, and the desktop overlay shows the same reminder.
- **Data minimisation by design** — recordings stay on the user's device unless they choose an
  AI action; we state we don't sell data and don't train models on user content.
- **Honest AI disclaimer** — Terms say AI output may be wrong and isn't professional advice.

---

## Your action checklist before a public, paid launch

1. **Get a lawyer to review** the three documents for your launch countries/states. Budget for this.
2. **Fill in the entity details** in `src/pages/Legal.jsx`: legal company name, governing-law
   jurisdiction (currently "England and Wales"), and a real contact inbox (currently
   `privacy@promptdrop.app` — set this mailbox up or change it).
3. **Sign Data Processing Agreements (DPAs)** with each sub-processor (links below). Keep copies.
4. **Decide your cookie/consent posture for the EU.** Today PromptDrop uses only strictly-necessary
   storage (auth + settings), so a full cookie banner likely isn't required — but confirm with
   your lawyer, and add a banner if you introduce analytics or marketing cookies later.
5. **Stand up a data-deletion path.** You must honour "delete my data" requests. Right now that's
   manual via the contact email; document who handles it and within what timeframe (GDPR: 30 days).
6. **Age gate.** Terms require 18+ to purchase / 16+ to use. Keep that consistent; don't market to
   minors (COPPA/again, lawyer territory).
7. **Run a short DPIA** (Data Protection Impact Assessment) for the recording + AI flows. It's
   expected under GDPR for this kind of processing and is a good liability shield.
8. **Business basics:** register the business, sort sales-tax/VAT on subscriptions (Stripe Tax can
   help), and consider tech E&O / general liability insurance.
9. **Set the Site URL** in Supabase → Auth so confirmation emails point to your live domain.

---

## Sub-processors (who touches data, and the DPA to sign)

| Provider | Role | Data | DPA |
|---|---|---|---|
| Supabase | Auth, database, storage | email, scripts, subscription, recordings you upload | supabase.com/legal/dpa |
| Stripe | Payments & subscriptions | billing/customer data (no card data stored by you) | stripe.com/legal/dpa |
| Vercel | Web/app hosting | request logs | vercel.com/legal/dpa |
| OpenAI | Transcription + AI generation | audio/text you submit to an AI feature | openai.com/policies (API DPA) |

Keep this list current and publish it (the Privacy Policy says it's available on request).
Note: OpenAI's API does not train on data sent via the API by default — confirm and document that.

---

## Data flow summary (for your DPIA / lawyer)

- **Account**: email + display name → Supabase (auth + `profiles`).
- **Scripts**: optional, → Supabase `scripts` (owner-only via row-level security).
- **Recordings**: created and stored **on the user's device** (IndexedDB / desktop). Only the
  specific file is sent to OpenAI (via our server function) when the user taps Transcribe / Notes
  / Summary / Ask. We don't retain a server copy beyond delivering the result.
- **Payments**: handled by Stripe; we store plan/status/customer-id only.
- **AI key**: one server-side OpenAI key, never exposed to users.

---

## Honest limits

- "Private mode" / screen-share hiding is best-effort and not guaranteed — the Terms say so.
- The consent gate reduces but does not remove your liability; it depends on users telling the truth.
- These documents are templates, not a substitute for counsel licensed in your markets.

Once your lawyer has reviewed and you've filled in the entity details, you'll be in a genuinely
defensible position for a small-scale launch. Treat this as the floor, not the ceiling.

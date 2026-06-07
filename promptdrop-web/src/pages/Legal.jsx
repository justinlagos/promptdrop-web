import React from "react";
import { useParams, Link } from "react-router-dom";

// ---- Configure these for your legal entity before launch ----
const COMPANY = "PromptDrop";
const CONTACT = "privacy@promptdrop.app";          // set up a real inbox or change this
const GOVERNING = "England and Wales";             // your governing-law jurisdiction
const UPDATED = "7 June 2026";

const PRIVACY = `
# Privacy Policy
_Last updated: ${UPDATED}_

This Privacy Policy explains how ${COMPANY} ("we", "us") collects, uses, and protects your information when you use the PromptDrop website, web app, and desktop apps (the "Service"). We aim to collect as little personal data as possible and to keep your content on your device by default.

## 1. Who we are
${COMPANY} is the controller of personal data processed through the Service. For any privacy question or to exercise your rights, contact us at ${CONTACT}.

## 2. Information we collect
- Account data: your email address, a display name, and authentication data, when you create an account.
- Scripts you create: if you choose to save scripts to your account, their text is stored for you (cloud sync). If you stay signed out, scripts stay on your device.
- Recordings: video/audio you record are stored locally on your device (in your browser or the desktop app) by default. They are only sent to our servers if you choose an AI action (Transcribe, Notes, Summary, Ask).
- AI inputs and outputs: when you use an AI feature, the relevant audio or text is sent to our AI provider to generate the result, and the result is returned to you.
- Billing data: if you subscribe, payments are processed by Stripe. We do not store your card details; we receive limited data such as your plan, status, and a customer reference.
- Technical data: basic logs needed to run and secure the Service (for example, request metadata and error logs).
- Cookies and local storage: we use only the storage strictly necessary to keep you signed in and to remember your settings. We do not use advertising cookies.

## 3. How we use your information
- To provide and operate the Service (prompting, recording, transcription, notes, Ask).
- To manage your account, plan, and billing.
- To provide support and respond to your requests.
- To keep the Service secure and prevent abuse.
- To comply with legal obligations.

We do not sell your personal information, and we do not use your recordings, scripts, or transcripts to train our own models.

## 4. Legal bases (GDPR / UK GDPR)
- Performance of a contract: to provide the Service you request.
- Consent: for optional features such as sending your recording to the AI provider, and where required by law.
- Legitimate interests: to secure, maintain, and improve the Service, balanced against your rights.
- Legal obligation: to meet our legal and regulatory duties.

## 5. AI processing and sub-processors
To deliver the Service we use trusted providers that may process personal data on our behalf:
- Supabase, for authentication, database, and storage.
- Stripe, for payments and subscription management.
- Vercel, for website and app hosting.
- OpenAI, for transcription and AI generation, when you use an AI feature.

These providers act as our processors under data-processing terms. The audio or text you submit to an AI feature is sent to the AI provider only to produce your result. A current list of sub-processors is available on request at ${CONTACT}.

## 6. Recordings and your responsibilities
Recordings are content that you create and control. You are solely responsible for obtaining any consent required to record other people and for complying with all applicable recording, wiretapping, privacy, and data-protection laws in your jurisdiction and theirs. Many places require the consent of every participant before a call or conversation may be recorded. See our Terms of Service and Acceptable Use Policy.

## 7. Sharing your information
We share personal data only with the processors listed above, with professional advisers where necessary, with authorities where legally required, and in connection with a business transfer (with notice). We do not sell personal information, and we do not share it for cross-context behavioural advertising.

## 8. International transfers
We and our providers may process data outside your country, including in the United States. Where required, we rely on appropriate safeguards such as the EU Standard Contractual Clauses and the UK Addendum.

## 9. Data retention
- Recordings stay on your device until you delete them; we do not keep a copy unless required to deliver a feature you requested.
- Account, script, and subscription data are kept while your account is active and for a reasonable period afterwards to meet legal, tax, and security obligations, then deleted or anonymised.

## 10. Your rights
Depending on where you live (for example under GDPR/UK GDPR or the CCPA/CPRA), you may have the right to: access your data; correct it; delete it; restrict or object to processing; data portability; withdraw consent; and, for California residents, to know, delete, correct, and to opt out of "sale" or "sharing" (we do neither). To exercise any right, email ${CONTACT}. We will not discriminate against you for exercising your rights. You also have the right to complain to your local data-protection authority.

## 11. Security
We use industry-standard measures including encryption in transit, access controls, and row-level security on stored data. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.

## 12. Children
The Service is not directed to children. You must be at least 16 (or the age of digital consent in your country, and at least 18 to purchase) to use it. We do not knowingly collect data from children; if you believe a child has provided data, contact us and we will delete it.

## 13. Changes to this policy
We may update this policy. If changes are material we will provide notice in the app or by email. Continued use after changes take effect means you accept the updated policy.

## 14. Contact
Questions or requests: ${CONTACT}.
`;

const TERMS = `
# Terms of Service
_Last updated: ${UPDATED}_

These Terms of Service ("Terms") are a binding agreement between you and ${COMPANY} governing your use of the PromptDrop website, web app, and desktop apps (the "Service"). By using the Service you agree to these Terms. If you do not agree, do not use the Service.

## 1. Eligibility
You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account or purchase a plan. By using the Service you represent that you meet this requirement and that the information you provide is accurate.

## 2. The Service
PromptDrop is a teleprompter and meeting tool that can display scripts near your camera, record video/audio you capture, and, where enabled, transcribe and summarise recordings and answer questions about them using AI. Features vary by plan and platform and may change over time.

## 3. Your account
You are responsible for your account and for keeping your credentials secure. You are responsible for all activity under your account. Notify us promptly of any unauthorised use.

## 4. Plans, billing, and cancellation
Paid plans are billed in advance on a recurring basis through Stripe until cancelled. Prices are shown at checkout. Subscriptions renew automatically; you can cancel at any time from your account, and cancellation takes effect at the end of the current billing period. Except where required by law, payments are non-refundable. Access codes, where offered, grant time-limited access and may be changed or revoked.

## 5. Recording, consent, and legal compliance (important)
You are solely responsible for your use of the recording features and for compliance with all laws that apply to recording, intercepting, storing, and sharing communications and personal data, including wiretap, eavesdropping, one-party and all-party (two-party) consent, privacy, and data-protection laws. In many jurisdictions you must obtain the consent of every participant before recording a call or conversation. You agree to obtain all required consents and provide all required notices before recording, and to use recordings lawfully. You are the controller of the recordings and personal data you capture. You agree to indemnify us for any claim arising from your recordings or your failure to obtain required consent.

## 6. Acceptable use
You agree to follow our Acceptable Use Policy. We may suspend or terminate accounts that violate it.

## 7. Your content
You retain all rights to the scripts, recordings, transcripts, and other content you create ("Your Content"). You grant us a limited licence to host, process, and transmit Your Content solely to operate the Service for you (for example, to sync a script you save, or to send a recording to the AI provider when you request transcription). We claim no ownership of Your Content and do not use it to train our models.

## 8. AI features and accuracy
AI-generated transcripts, notes, summaries, and answers are produced by automated systems and may be inaccurate, incomplete, or out of date. They are provided for convenience only and are not professional, legal, medical, or financial advice. You are responsible for reviewing and verifying any AI output before relying on or sharing it.

## 9. Intellectual property
The Service, including its software, design, and brand, is owned by ${COMPANY} and protected by law. We grant you a personal, non-exclusive, non-transferable, revocable licence to use the Service per these Terms. You may not copy, modify, reverse-engineer, resell, or create derivative works except as permitted by law.

## 10. Disclaimers
The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation. Features such as "private mode" and screen-share hiding are best-effort and not guaranteed on every device or platform.

## 11. Limitation of liability
To the maximum extent permitted by law, ${COMPANY} will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill. Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us in the 12 months before the claim, or USD 100. Nothing in these Terms limits liability that cannot be limited by law.

## 12. Indemnification
You agree to indemnify and hold harmless ${COMPANY} from any claim, loss, or expense (including reasonable legal fees) arising from your use of the Service, Your Content, your recordings, or your breach of these Terms or of any law.

## 13. Termination
You may stop using the Service at any time. We may suspend or terminate your access if you breach these Terms or to protect the Service or others. On termination, the licences granted to you end; sections that by their nature should survive will survive.

## 14. Governing law and disputes
These Terms are governed by the laws of ${GOVERNING}, without regard to conflict-of-laws rules. The courts of ${GOVERNING} will have jurisdiction, subject to any mandatory consumer protections in your country of residence.

## 15. Changes
We may update these Terms. If changes are material we will provide notice. Continued use after changes take effect means you accept the updated Terms.

## 16. Contact
Questions: ${CONTACT}.
`;

const AUP = `
# Acceptable Use Policy
_Last updated: ${UPDATED}_

This Acceptable Use Policy is part of our Terms of Service. When using PromptDrop, you must not:

## Recording and privacy
- Record any person without the consent required by law, or in violation of any wiretap, eavesdropping, one-party or all-party consent, privacy, or data-protection law.
- Record in places or situations where there is a reasonable expectation of privacy without authorisation.
- Use recordings, transcripts, or AI outputs to harass, stalk, blackmail, defame, or harm anyone.

## Content and conduct
- Upload, create, or share content that is illegal, infringing, defamatory, harassing, hateful, or sexually exploitative, including any content that sexualises or endangers minors.
- Impersonate others or misrepresent your affiliation.
- Infringe anyone's intellectual property or privacy rights.

## Security and integrity
- Attempt to breach, probe, or disrupt the Service, or bypass authentication, rate limits, or usage controls.
- Introduce malware, scrape at scale, or use the Service to build a competing dataset or model.
- Resell or share access in breach of your plan.

## AI use
- Use AI features to generate unlawful, deceptive, or harmful content, or to make automated decisions about people without appropriate human review and legal basis.

## Consequences
Violations may lead to suspension or termination of your account and, where appropriate, reporting to authorities. You remain responsible for any harm caused. Report abuse to ${CONTACT}.
`;

const DOCS = { privacy: PRIVACY, terms: TERMS, "acceptable-use": AUP };

// Tiny markdown-ish renderer for our controlled content.
function render(md) {
  const lines = md.trim().split("\n");
  const out = [];
  let list = null;
  lines.forEach((ln, i) => {
    if (ln.startsWith("## ")) { if (list) { out.push(list); list = null; } out.push(<h2 key={i} style={{ fontSize: 18, fontWeight: 700, margin: "26px 0 8px" }}>{ln.slice(3)}</h2>); }
    else if (ln.startsWith("# ")) { out.push(<h1 key={i} style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>{ln.slice(2)}</h1>); }
    else if (ln.startsWith("_") && ln.endsWith("_")) { out.push(<p key={i} style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12, margin: "4px 0 8px" }}>{ln.slice(1, -1)}</p>); }
    else if (ln.startsWith("- ")) { if (!list) list = []; list.push(<li key={"l" + i} style={{ marginBottom: 6 }}>{ln.slice(2)}</li>); }
    else if (ln.trim() === "") { if (list) { out.push(<ul key={"u" + i} style={{ paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>{list}</ul>); list = null; } }
    else { if (list) { out.push(<ul key={"u" + i} style={{ paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>{list}</ul>); list = null; } out.push(<p key={i} style={{ color: "var(--text-secondary)", lineHeight: 1.65, fontSize: 15, margin: "0 0 10px" }}>{ln}</p>); }
  });
  if (list) out.push(<ul key="ul-end" style={{ paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>{list}</ul>);
  return out;
}

export default function Legal({ doc: docProp }) {
  const { doc } = useParams();
  const md = DOCS[docProp || doc] || PRIVACY;
  return (
    <main className="wrap" style={{ padding: "48px 24px 80px", maxWidth: 760 }}>
      {render(md)}
      <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 14 }}>
        <Link className="link" to="/privacy">Privacy</Link>
        <Link className="link" to="/terms">Terms</Link>
        <Link className="link" to="/acceptable-use">Acceptable Use</Link>
      </div>
    </main>
  );
}

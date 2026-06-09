import React from "react";
import { Link } from "react-router-dom";
import Drop from "../components/Drop.jsx";
import { PLANS } from "../services/planService.js";
import { useIsMobile } from "../mobile/useIsMobile.js";

const I = (d) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

// OS-aware desktop download button. Hidden on phones (you can't run a desktop app on a phone).
function DownloadBtn() {
  const mobile = useIsMobile();
  if (mobile) return null;
  const isWin = typeof navigator !== "undefined" && /Win/i.test(navigator.userAgent || navigator.platform || "");
  return <Link className="btn btn--secondary btn--lg" to="/download">{isWin ? "Download for Windows" : "Download for Mac"}</Link>;
}

export default function Landing() {
  const mobile = useIsMobile();
  return (
    <main>
      {/* HERO */}
      <header style={{ textAlign: "center", padding: "72px 0 24px", position: "relative" }}>
        <div className="wrap">
          <span className="badge badge--accent" style={{ marginBottom: 22 }}><i style={{ width: 6, height: 6, borderRadius: 9, background: "var(--accent-primary)" }} /> Camera-level teleprompter + meeting overlay</span>
          <h1 style={{ fontSize: "clamp(36px,6vw,66px)", fontWeight: 800, letterSpacing: "-.038em", lineHeight: 1.02, maxWidth: "15ch", margin: "12px auto 0" }}>
            A teleprompter that lives <span style={{ color: "var(--accent-primary)" }}>beside your camera.</span>
          </h1>
          <p style={{ fontSize: 19, color: "var(--text-secondary)", maxWidth: "56ch", margin: "22px auto 30px", lineHeight: 1.55 }}>
            Read naturally on camera with a floating prompt that stays close to your lens, helps you speak clearly, and keeps your eyes up.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--primary btn--lg" to="/app">{mobile ? "Open the app" : "Start free"}</Link>
            <DownloadBtn />
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16, fontFamily: "var(--font-mono)", letterSpacing: ".02em" }}>
            {mobile ? "Free in your browser · add to your home screen for the full app" : "Use it in your browser today · desktop overlay for meetings & presentations"}
          </p>
          <div style={{ marginTop: 40 }}><Drop scriptLine="Hi, I’m Justin." /></div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="block" id="how"><div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 12 }}>How PromptDrop works</div>
        <h2>Three steps to a natural take.</h2>
        <div className="grid3" style={{ marginTop: 44 }}>
          {[
            [I(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>), "Write or paste your script", "Bring text from anywhere or write it in the studio. Pause markers and reading time are built in."],
            [I(<><rect x="2" y="6" width="14" height="12" rx="2.5" /><path d="m22 8-6 4 6 4V8Z" /></>), "Align the drop near your camera", "Position the black drop right by your lens so your eyes never drift off camera."],
            [I(<polyline points="20 6 9 17 4 12" />), "Read, record, review, improve", "Prompt at your pace, record the take, and review playback, all on your device."],
          ].map(([ic, t, d], i) => (
            <div key={i} className="feat"><div className="feat__ic">{ic}</div><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div></section>

      {/* CAMERA-LEVEL */}
      <Split id="camera"
        eyebrow="Camera-level prompting"
        title="Your words, right where your eyes already are."
        body="Most teleprompters put the script in the middle of the screen, so you visibly read. PromptDrop keeps the line beside the lens, and follows your voice, pause to breathe and it waits, speed up and it gently catches up. It never jumps."
        side={<Drop scriptLine="So you sound like a person." />} />

      {/* MEETING OVERLAY */}
      <Split id="meetings" reverse
        eyebrow="Meeting overlay · Studio Pro"
        title="Float PromptDrop above any meeting."
        body="On the desktop app, the drop floats over Zoom, Google Meet, Teams, Loom, Riverside, Keynote and PowerPoint. Keep cue cards near your camera, stay on message, and hide instantly with a shortcut."
        side={<MiniRow chips={["Zoom", "Meet", "Teams", "Loom", "Keynote", "PowerPoint"]} />} />

      {/* RECORD + TRANSCRIBE */}
      <Split id="record"
        eyebrow="Record &amp; transcribe"
        title="Record your calls and turn them into notes."
        body="Studio Pro records your meeting and transcribes it, then pulls out summaries, action items, decisions and open questions. You control when recording starts, the indicator is always visible, and you're responsible for consent where required."
        side={<FeatureList items={["Meeting recording", "Live & post transcription", "Summaries & action items", "Decisions & open questions"]} />} />

      {/* ASK MODE */}
      <Split id="ask" reverse
        eyebrow="Ask during meetings"
        title="Ask PromptDrop a question, mid-call."
        body="A compact Ask field lets you ask things like “what did they just ask?”, “summarise the last five minutes”, or “what are the action items?”, answered from the meeting transcript, in one quiet card that never clutters your prompt."
        side={<AskCard />} />

      {/* MOBILE */}
      <Split id="mobile"
        eyebrow="Mobile"
        title="Prepare and record on your phone."
        body="Write or paste scripts, tune your prompt, record a selfie take and review it, all on mobile, with large touch controls and a calm, uncluttered layout. Sync across devices on Creator Pro and up."
        side={<Drop scriptLine="Recording on my phone." />} />

      {/* PRICING PREVIEW */}
      <section className="block"><div className="wrap" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Pricing</div>
        <h2 style={{ margin: "0 auto" }}>Start free. Upgrade when PromptDrop joins your workflow.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 40, textAlign: "left" }}>
          {["free", "creator_pro", "studio_pro"].map((id) => {
            const p = PLANS[id];
            return (
              <div key={id} className="card" style={{ padding: 22, borderColor: p.badge ? "rgba(76,141,255,.4)" : undefined }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div className="muted" style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.blurb}</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", margin: "12px 0 2px" }}>{p.price}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>{p.cycle}</span></div>
                {p.priceYear && <div className="muted" style={{ fontSize: 12, color: "var(--text-muted)" }}>or {p.priceYear}</div>}
              </div>
            );
          })}
        </div>
        <Link className="btn btn--secondary btn--lg" to="/pricing" style={{ marginTop: 28 }}>See full pricing</Link>
      </div></section>

      {/* FAQ */}
      <section className="block" style={{ paddingTop: 0 }}><div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>FAQ</div>
        {FAQ.map(([q, a], i) => (
          <details key={i} style={{ borderBottom: "1px solid var(--border-subtle)", padding: "16px 0" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 16, listStyle: "none" }}>{q}</summary>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginTop: 10 }}>{a}</p>
          </details>
        ))}
      </div></section>

      {/* FINAL CTA */}
      <section className="block" style={{ textAlign: "center", paddingTop: 0 }}><div className="wrap">
        <h2 style={{ margin: "0 auto" }}>Keep your eyes on the lens.</h2>
        <p className="lead" style={{ margin: "12px auto 26px" }}>{mobile ? "Start free in your browser, no install needed." : "Start free in your browser, or get the desktop app for meetings and presentations."}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--primary btn--lg" to="/app">{mobile ? "Open the app" : "Start free"}</Link>
          <DownloadBtn />
        </div>
      </div></section>
    </main>
  );
}

function Split({ id, eyebrow, title, body, side, reverse }) {
  return (
    <section className="block split" id={id} style={{ paddingTop: 24 }}><div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: eyebrow }} />
        <h2>{title}</h2>
        <p className="lead">{body}</p>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>{side}</div>
      <style>{`@media (max-width:860px){.split .wrap{grid-template-columns:1fr!important}.split [style*="order: 2"],.split [style*="order:2"]{order:0!important}}`}</style>
    </div></section>
  );
}
function MiniRow({ chips }) {
  return <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{chips.map((c) => <span key={c} className="badge" style={{ fontSize: 13, padding: "8px 14px" }}>{c}</span>)}</div>;
}
function FeatureList({ items }) {
  return <div className="card" style={{ padding: 22 }}>{items.map((t, i) => (
    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none", fontSize: 14, color: "var(--text-secondary)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>{t}
    </div>))}</div>;
}
function AskCard() {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {["Summarise so far", "What did they ask?", "Action items?"].map((c) => <span key={c} className="badge" style={{ fontSize: 12 }}>{c}</span>)}
      </div>
      <div style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "var(--text-secondary)" }}>
        Ask PromptDrop… <span style={{ color: "var(--text-muted)" }}>(connects to your AI provider)</span>
      </div>
    </div>
  );
}

const FAQ = [
  ["Is there a free trial?", "Yes. Create an account and you get a 7-day free trial with full access. After the trial, choose Creator Pro or Studio Pro to keep your paid features. Your scripts and takes stay saved either way."],
  ["Do I need to sign up?", "Yes. PromptDrop is account-based so your scripts, takes and settings sync securely across your devices. Signing up takes a few seconds and starts your 7-day trial."],
  ["Does it work on mobile?", "Yes, write, paste, prompt, record a selfie take and review on your phone, with large touch controls."],
  ["Does it work with Zoom or Google Meet?", "The Studio Pro desktop overlay floats above Zoom, Meet, Teams, Loom, Riverside, Keynote and PowerPoint."],
  ["Can the prompt stay private during screen sharing?", "Private Prompt Mode attempts to keep the overlay out of supported screen shares and captures. It can't be guaranteed on every app, OS or capture method."],
  ["What happens to my recordings?", "Local recordings stay on your device unless you turn on cloud sync. You're responsible for getting consent where meeting recording requires it."],
  ["Creator Pro vs Studio Pro?", "Creator Pro ($5/mo) adds AI, voice-follow, cloud sync and advanced review. Studio Pro ($9/mo) adds the desktop overlay, meeting recording, transcription and Ask Mode."],
];

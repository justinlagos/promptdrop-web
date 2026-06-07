import React from "react";
import { Link } from "react-router-dom";
import { desktopDownloadService } from "../services/index.js";

export default function Download() {
  const macUrl = desktopDownloadService.url();
  const macReady = desktopDownloadService.available();
  const winUrl = desktopDownloadService.winUrl();
  const winReady = desktopDownloadService.winAvailable();
  const version = desktopDownloadService.version();
  const isWindows = typeof navigator !== "undefined" && /Win/i.test(navigator.platform || navigator.userAgent || "");

  const Card = ({ os, sub, ready, url, primary }) => (
    <div className="card" style={{ padding: 26, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderColor: primary ? "var(--accent-primary)" : undefined }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>PromptDrop for {os}</div>
        <div className="muted" style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
      </div>
      {ready
        ? <a className={"btn btn--lg " + (primary ? "btn--primary" : "btn--secondary")} href={url} download>Download for {os}</a>
        : <button className="btn btn--secondary btn--lg" disabled>{os} build coming soon</button>}
    </div>
  );

  return (
    <main className="wrap" style={{ padding: "56px 24px 24px", maxWidth: 880 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>PromptDrop desktop</div>
      <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-.03em" }}>Float PromptDrop above any app.</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 17, maxWidth: "56ch", margin: "12px 0 26px", lineHeight: 1.55 }}>
        Use PromptDrop above meetings, presentations and recording tools, Zoom, Meet, Teams, Keynote, PowerPoint and more. Always-on-top, private where supported, hidden instantly with a shortcut.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card os="Mac" sub={`Apple Silicon${version ? ` · ${version}` : ""}`} ready={macReady} url={macUrl} primary={!isWindows} />
        <Card os="Windows" sub="Windows 10/11 · 64-bit" ready={winReady} url={winUrl} primary={isWindows} />
      </div>
      <p className="muted" style={{ fontSize: 13, color: "var(--text-muted)", margin: "12px 2px 0" }}>
        Or <Link className="link" to="/app">use the full studio right in your browser</Link>, no install needed.
      </p>

      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Install</h2>
        <ol style={{ paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15 }}>
          <li>Open the <code>.dmg</code> and drag PromptDrop to Applications.</li>
          <li>First launch: right-click PromptDrop → <strong>Open</strong> (one-time, until the build is notarised).</li>
          <li>Allow Camera and Microphone when asked.</li>
          <li>For global shortcuts and the floating overlay, grant <strong>Accessibility</strong> and <strong>Screen Recording</strong> in System Settings → Privacy &amp; Security.</li>
        </ol>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Using the overlay</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {[
            ["Open / close overlay", "⌘⇧O"],
            ["Hide instantly (panic)", "⌘⇧H"],
            ["Lock / unlock (click-through)", "⌘⇧L"],
            ["Pause / resume", "Space"],
            ["Restart", "R"],
            ["Exit live mode", "Esc"],
          ].map(([t, k]) => (
            <div key={t} className="card" style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>{t}</span>
              <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderBottomWidth: 2, borderRadius: 6, padding: "3px 8px" }}>{k}</kbd>
            </div>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 14, lineHeight: 1.55 }}>
          The overlay can always be closed: a visible close button appears when unlocked, Esc exits (it asks first if you’re recording), and ⌘⇧H hides it from anywhere.
        </p>
      </section>

      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn--secondary" to="/pricing">See Studio Pro</Link>
        <Link className="btn btn--ghost" to="/app">Use in browser</Link>
      </div>
    </main>
  );
}

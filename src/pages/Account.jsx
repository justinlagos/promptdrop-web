import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { billingService, planService, desktopDownloadService, featureGateService } from "../services/index.js";
import { PLANS } from "../services/planService.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

// 7-day trial status, read from the server-authoritative entitlement.
function TrialBanner() {
  const ws = useWorkspace() || {};
  const e = ws.entitlements;
  if (!e || e.status !== "trialing" || !e.current_period_end) return null;
  const end = new Date(e.current_period_end).getTime();
  const days = Math.ceil((end - Date.now()) / 86400000);
  const expired = days <= 0;
  return (
    <div className="card" style={{ padding: 16, marginBottom: 16, borderColor: expired ? "var(--recording)" : "var(--accent-primary)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{expired ? "Your free trial has ended" : days === 1 ? "Trial ends today" : `${days} days left in your trial`}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{expired ? "Choose a plan to keep recording. Your scripts and takes are safe." : "Full access during your trial. Pick a plan any time."}</div>
        </div>
        <Link className="btn btn--primary" to="/pricing">Choose a plan</Link>
      </div>
    </div>
  );
}

function MacAppCard({ plan }) {
  const canDesktop = featureGateService.can("desktopOverlay");   // Studio Pro
  const url = desktopDownloadService.url();
  const [exists, setExists] = useState(null);   // null = checking, true/false after HEAD
  useEffect(() => {
    let alive = true;
    if (!url) { setExists(false); return; }
    // HEAD-check, but a cross-origin host (e.g. GitHub Releases) may block the probe with
    // CORS; a thrown error is NOT proof the file is missing, so we assume present then.
    fetch(url, { method: "HEAD", mode: "cors" })
      .then((r) => alive && setExists(r.status === 404 || r.status === 403 ? false : true))
      .catch(() => alive && setExists(true));
    return () => { alive = false; };
  }, [url]);
  return (
    <div className="card" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>PromptDrop for Mac</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Camera-level overlay + meeting mode (record both sides, transcribe, summarise, Ask).
            {desktopDownloadService.version() ? ` v${desktopDownloadService.version()}` : ""}
          </div>
        </div>
        {!canDesktop
          ? <Link to="/pricing" className="btn btn--secondary">Studio Pro to unlock</Link>
          : exists === null
            ? <button className="btn btn--secondary" disabled>Checking…</button>
            : exists
              ? <a className="btn btn--primary" href={url} download>Download .dmg</a>
              : <button className="btn btn--secondary" disabled>Mac app build pending</button>}
      </div>
      {canDesktop && exists && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>Apple Silicon · unsigned build: right-click the .dmg → Open the first time.</div>}
      {canDesktop && exists === false && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>The Mac build hasn't been uploaded yet. It'll appear here once it's published.</div>}
    </div>
  );
}

function RedeemBox({ onRedeemed }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  async function redeem() {
    if (!code.trim()) return;
    setBusy(true); setMsg(null);
    const r = await billingService.redeemCode(code.trim());
    setBusy(false);
    if (!r.ok) { setMsg({ type: "err", text: r.message || "That code didn't work." }); return; }
    const until = r.until ? new Date(r.until).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    setMsg({ type: "ok", text: `Redeemed. ${(PLANS[r.plan] || {}).name || r.plan} active${until ? ` until ${until}` : ""}.` });
    setCode("");
    onRedeemed && onRedeemed();
  }
  return (
    <div className="card" style={{ padding: 24, marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Have an access code?</div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>Enter a tester or friend code to unlock your plan, no card needed.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input className="ask-input" style={{ maxWidth: 260, textTransform: "uppercase" }} value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. PROMPTDROP-VIP" onKeyDown={(e) => e.key === "Enter" && redeem()} />
        <button className="btn btn--primary" onClick={redeem} disabled={busy}>{busy ? "Redeeming…" : "Redeem"}</button>
      </div>
      {msg && <div className={`note note--${msg.type === "err" ? "err" : "ok"}`} style={{ marginTop: 12 }}>{msg.text}</div>}
    </div>
  );
}

export default function Account() {
  const { user, sub, plan, loading, isSignedIn, openAuth, signOut, refresh } = useAuth();
  const [params, setParams] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  // After returning from Stripe, refresh the plan (webhook may take a moment).
  useEffect(() => {
    if (params.get("checkout") === "success") {
      setNote({ type: "ok", text: "Thanks. Confirming your subscription…" });
      let tries = 0;
      const t = setInterval(async () => {
        await refresh(); tries++;
        if (planService.current() !== "free" || tries > 5) { clearInterval(t); setNote({ type: "ok", text: "You're all set." }); }
      }, 2000);
      params.delete("checkout"); setParams(params, { replace: true });
      return () => clearInterval(t);
    }
  }, []); // eslint-disable-line

  if (loading) return <main className="wrap" style={{ padding: "64px 24px" }}><p style={{ color: "var(--text-muted)" }}>Loading…</p></main>;

  if (!isSignedIn) {
    return (
      <main className="wrap" style={{ padding: "64px 24px", maxWidth: 520 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Your account</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Sign in to see your plan and manage billing.</p>
        <button className="btn btn--primary btn--lg" onClick={openAuth}>Sign in</button>
      </main>
    );
  }

  const planDef = PLANS[plan] || PLANS.free;
  const status = sub?.status || "inactive";
  const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

  async function manage() {
    setBusy(true); setNote(null);
    const r = await billingService.openPortal();
    setBusy(false);
    if (!r.ok) setNote({ type: r.reason === "stripe-pending" ? "warn" : "err", text: r.message });
  }

  return (
    <main className="wrap" style={{ padding: "56px 24px", maxWidth: 620 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Account</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 14 }}>{user.email}</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <Link className="btn btn--ghost" to="/account/security">Security</Link>
        <Link className="btn btn--ghost" to="/app/workspace">Workspace</Link>
      </div>

      <TrialBanner />

      <div className="card" style={{ padding: 16, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Appearance</span>
        <ThemeToggle />
      </div>

      {note && <div className={`note note--${note.type === "err" ? "err" : note.type === "warn" ? "warn" : "ok"}`} style={{ marginBottom: 18 }}>{note.text}</div>}

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Current plan</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{planDef.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {plan === "free" ? "Free, local-first." : `${status}${sub?.billing_cycle ? ` · billed ${sub.billing_cycle}` : ""}${periodEnd ? ` · renews ${periodEnd}` : ""}`}
              {sub?.cancel_at_period_end ? " · cancels at period end" : ""}
            </div>
          </div>
          {plan === "free"
            ? <Link className="btn btn--primary" to="/pricing">Upgrade</Link>
            : <button className="btn btn--secondary" onClick={manage} disabled={busy}>{busy ? "Opening…" : "Manage billing"}</button>}
        </div>
      </div>

      <MacAppCard plan={plan} />

      <RedeemBox onRedeemed={refresh} />

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Scripts &amp; takes</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Your account is ready for cloud sync. Recordings stay on your device; script sync rolls out with the web studio.
        </p>
      </div>

      <button className="link" onClick={signOut}>Sign out</button>
    </main>
  );
}

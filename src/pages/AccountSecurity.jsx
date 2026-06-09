import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { authService } from "../services/index.js";
import { supabase } from "../services/supabaseClient.js";

export default function AccountSecurity() {
  const { user } = useAuth() || {};
  const ws = useWorkspace() || {};
  const [factors, setFactors] = useState([]);
  const [aal, setAal] = useState(null);
  const [events, setEvents] = useState([]);
  const [enroll, setEnroll] = useState(null);     // { factorId, qr, secret }
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const f = await authService.listFactors(); setFactors(f.totp || []);
    setAal(await authService.getAAL());
    if (supabase && user) {
      const { data } = await supabase.from("security_events").select("event_type, risk_level, created_at").order("created_at", { ascending: false }).limit(10);
      setEvents(data || []);
    }
  };
  useEffect(() => { refresh(); }, [user?.id]);

  const note = (type, text) => setMsg({ type, text });
  const hasMfa = factors.some((f) => f.status === "verified");

  async function startEnroll() {
    setMsg(null);
    const r = await authService.enrollTOTP();
    if (!r.ok) return note("err", r.message || "Could not start MFA setup.");
    setEnroll(r);
  }
  async function confirmEnroll() {
    setBusy(true);
    const r = await authService.verifyTOTP(enroll.factorId, code.trim());
    setBusy(false);
    if (!r.ok) return note("err", r.message || "That code did not verify.");
    setEnroll(null); setCode(""); note("ok", "Two-factor authentication is on.");
    refresh();
  }
  async function disableMfa(factorId) {
    setMsg(null);
    const pwd = window.prompt("Confirm your password to turn off two-factor:");
    if (!pwd) return;
    const re = await authService.reauthenticate(pwd);
    if (!re.ok) return note("err", "Password did not match. Two-factor was not changed.");
    const r = await authService.disableTOTP(factorId);
    if (!r.ok) return note("err", r.message || "Could not disable MFA.");
    note("ok", "Two-factor authentication is off."); refresh();
  }
  async function changePassword() {
    setMsg(null);
    if (pw.next.length < 8) return note("err", "Use at least 8 characters.");
    setBusy(true);
    const re = await authService.reauthenticate(pw.current);
    if (!re.ok) { setBusy(false); return note("err", "Current password did not match."); }
    const r = await authService.updatePassword(pw.next);
    setBusy(false);
    if (!r.ok) return note("err", r.message || "Could not change password.");
    setPw({ current: "", next: "" }); note("ok", "Password updated.");
  }
  async function signOutEverywhere() {
    if (supabase) { try { await supabase.auth.signOut({ scope: "global" }); } catch {} }
    window.location.href = "/welcome";
  }

  if (!user) return (
    <main className="wrap" style={{ padding: "64px 24px", maxWidth: 560 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Account security</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Sign in to manage your security settings.</p>
      <Link className="btn btn--primary" to="/welcome" style={{ marginTop: 16, display: "inline-block" }}>Sign in</Link>
    </main>
  );

  const providers = ws.securityStatus?.providers?.length ? ws.securityStatus.providers : ["password"];

  return (
    <main className="wrap" style={{ padding: "40px 24px 96px", maxWidth: 720 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Account</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>Security</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Manage how you sign in and protect your account.</p>
      {msg && <div className={`note note--${msg.type}`} style={{ marginBottom: 18 }}>{msg.text}</div>}

      <Section title="Sign-in">
        <Row label="Email" value={user.email} />
        <Row label="Connected providers" value={providers.join(", ")} />
      </Section>

      <Section title="Password">
        <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
          <input className="ask-input" type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
          <input className="ask-input" type="password" placeholder="New password (8+ characters)" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
          <div><button className="btn btn--secondary" disabled={busy} onClick={changePassword}>Update password</button></div>
        </div>
      </Section>

      <Section title="Two-factor authentication">
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
          Status: <strong style={{ color: hasMfa ? "var(--success,#34C759)" : "var(--text-primary)" }}>{hasMfa ? "On" : "Off"}</strong>
          {aal?.currentLevel ? ` (assurance ${aal.currentLevel})` : ""}
        </p>
        {!hasMfa && !enroll && <button className="btn btn--primary" onClick={startEnroll}>Set up an authenticator app</button>}
        {enroll && (
          <div className="card" style={{ padding: 16, maxWidth: 460 }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>Scan this with your authenticator app, then enter the 6-digit code.</p>
            {enroll.qr && <img src={enroll.qr} alt="TOTP QR code" style={{ width: 180, height: 180, background: "#fff", borderRadius: 8 }} />}
            {enroll.secret && <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, color: "var(--text-muted)", marginTop: 8, wordBreak: "break-all" }}>{enroll.secret}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input className="ask-input" inputMode="numeric" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} style={{ maxWidth: 140 }} />
              <button className="btn btn--primary" disabled={busy} onClick={confirmEnroll}>Verify</button>
              <button className="btn btn--ghost" onClick={() => { setEnroll(null); setCode(""); }}>Cancel</button>
            </div>
          </div>
        )}
        {hasMfa && factors.filter((f) => f.status === "verified").map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <span style={{ fontSize: 14 }}>{f.friendly_name || "Authenticator"}</span>
            <button className="btn btn--ghost" style={{ color: "var(--recording,#FF3B30)" }} onClick={() => disableMfa(f.id)}>Turn off</button>
          </div>
        ))}
      </Section>

      <Section title="Sessions">
        <button className="btn btn--secondary" onClick={signOutEverywhere}>Sign out of all devices</button>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8 }}>A per-device session list is coming. For now this signs you out everywhere.</p>
      </Section>

      <Section title="Recent security activity">
        {events.length === 0
          ? <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No recorded security events yet.</p>
          : <div>{events.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: 14 }}>{e.event_type}</span>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{new Date(e.created_at).toLocaleString("en-GB")}</span>
              </div>))}</div>}
      </Section>

      <Section title="Passkeys">
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Passwordless sign-in with passkeys is on our roadmap. We will turn it on once it is fully ready, with no placeholder buttons until then.</p>
      </Section>

      <Section title="Danger zone" danger>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 10 }}>Deleting your account permanently removes your data. For your safety this needs a verified, recent sign-in and is handled through support so nothing is destroyed by accident.</p>
        <a className="btn btn--ghost" style={{ color: "var(--recording,#FF3B30)" }} href="mailto:support@promptdrop.app?subject=Delete%20my%20account">Request account deletion</a>
      </Section>
    </main>
  );
}

function Section({ title, children, danger }) {
  return (
    <section style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border-subtle)" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: danger ? "var(--recording,#FF3B30)" : "var(--text-primary)" }}>{title}</h2>
      {children}
    </section>
  );
}
function Row({ label, value }) {
  return (<div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0" }}><span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{label}</span><span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span></div>);
}

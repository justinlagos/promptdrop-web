import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { authService } from "../services/index.js";

// Email + password sign in / sign up. Honest about email confirmation and local mode.
export default function AuthModal() {
  const { authOpen, authMode, closeAuth, signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin");
  React.useEffect(() => { if (authOpen) setMode(authMode || "signin"); }, [authOpen, authMode]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [agree, setAgree] = useState(false);

  if (!authOpen) return null;
  const connected = authService.configured();

  async function submit(e) {
    e.preventDefault();
    if (mode === "signup" && !agree) { setMsg({ type: "err", text: "Please agree to the Terms and Privacy Policy to continue." }); return; }
    setBusy(true); setMsg(null);
    const r = mode === "signin" ? await signIn(email, pw) : await signUp(email, pw, name);
    setBusy(false);
    if (!r.ok) { setMsg({ type: "err", text: r.message || "Something went wrong." }); return; }
    if (mode === "signup" && r.needsConfirm) { setMsg({ type: "ok", text: "Check your email to confirm your account, then sign in." }); return; }
    closeAuth();
  }

  async function google() {
    setBusy(true); setMsg(null);
    const r = await authService.signInWithGoogle();
    setBusy(false);
    if (!r.ok) setMsg({ type: "err", text: r.message || "Google sign-in is not available yet." });
  }
  async function forgot() {
    if (!email) { setMsg({ type: "err", text: "Enter your email above, then tap reset." }); return; }
    await authService.sendPasswordReset(email);
    setMsg({ type: "ok", text: "Check your email for the reset link." });
  }

  return (
    <div className="modal" onMouseDown={closeAuth}>
      <div className="modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal__x" onClick={closeAuth} aria-label="Close">×</button>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
          {connected ? "Sync scripts and your plan across devices." : "Accounts aren't connected in this build."}
        </p>

        {!connected ? (
          <div className="note">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts.</div>
        ) : (
          <form onSubmit={submit} className="authform">
            <button type="button" className="btn btn--secondary btn--lg" onClick={google} disabled={busy} style={{ width: "100%", marginBottom: 12 }}>Continue with Google</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 12px", color: "var(--text-muted)", fontSize: 12 }}><span style={{ flex: 1, height: 1, background: "var(--border-default)" }} />or<span style={{ flex: 1, height: 1, background: "var(--border-default)" }} /></div>
            {mode === "signup" && (
              <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
            )}
            <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
            <label>Password<input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
            {mode === "signin" && <button type="button" className="link" onClick={forgot} style={{ alignSelf: "flex-end", fontSize: 12.5, background: "none", border: "none", cursor: "pointer" }}>Forgot password?</button>}
            {mode === "signup" && (
              <label style={{ flexDirection: "row", alignItems: "flex-start", gap: 9, fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 400, lineHeight: 1.45 }}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, flex: "none" }} />
                <span>I agree to the <Link className="link" to="/terms" target="_blank">Terms</Link> and <Link className="link" to="/privacy" target="_blank">Privacy Policy</Link>, and I understand I'm responsible for getting consent before recording anyone.</span>
              </label>
            )}
            {msg && <div className={msg.type === "err" ? "note note--err" : "note note--ok"}>{msg.text}</div>}
            <button className="btn btn--primary btn--lg" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-secondary)", textAlign: "center" }}>
          {mode === "signin" ? (
            <>New here? <button className="link" onClick={() => { setMode("signup"); setMsg(null); }}>Create an account</button></>
          ) : (
            <>Already have an account? <button className="link" onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}

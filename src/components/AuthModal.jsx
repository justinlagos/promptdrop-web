import React, { useState } from "react";
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

  if (!authOpen) return null;
  const connected = authService.configured();

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const r = mode === "signin" ? await signIn(email, pw) : await signUp(email, pw, name);
    setBusy(false);
    if (!r.ok) { setMsg({ type: "err", text: r.message || "Something went wrong." }); return; }
    if (mode === "signup" && r.needsConfirm) { setMsg({ type: "ok", text: "Check your email to confirm your account, then sign in." }); return; }
    closeAuth();
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
            {mode === "signup" && (
              <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
            )}
            <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
            <label>Password<input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
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

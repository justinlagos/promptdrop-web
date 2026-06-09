import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Mark = () => (
  <svg width="72" height="72" viewBox="0 0 512 512" aria-hidden="true" style={{ filter: "drop-shadow(0 10px 30px rgba(76,141,255,.35))" }}>
    <rect x="8" y="8" width="496" height="496" rx="120" fill="#101117" stroke="rgba(255,255,255,.08)" />
    <rect x="120" y="96" width="272" height="320" rx="92" fill="#000" />
    <circle cx="222" cy="156" r="14" fill="#F4F4F5" /><circle cx="256" cy="156" r="14" fill="#F4F4F5" /><circle cx="290" cy="156" r="14" fill="#F4F4F5" />
    <rect x="156" y="286" width="200" height="24" rx="12" fill="#4C8DFF" />
  </svg>
);

// Friendly first-run screen. Eyes-up onboarding: one clear choice, nothing else.
export default function Welcome() {
  const { isSignedIn, openAuth } = useAuth() || {};
  const nav = useNavigate();
  const [params] = useSearchParams();
  useEffect(() => { if (isSignedIn) { const next = params.get("next"); nav(next && next.startsWith("/") ? next : "/app", { replace: true }); } }, [isSignedIn, nav, params]);

  return (
    <main className="welcome">
      <div className="welcome__glow" />
      <div className="welcome__card">
        <Mark />
        <div className="welcome__brand">prompt<span>drop</span></div>
        <h1 className="welcome__h">Welcome</h1>
        <p className="welcome__sub">A teleprompter that lives beside your camera, follows your voice, and turns your calls into notes.</p>
        <button className="btn btn--primary btn--lg welcome__btn" onClick={() => openAuth("signin")}>Log in</button>
        <button className="btn btn--secondary btn--lg welcome__btn" onClick={() => openAuth("signup")}>Create account</button>
        <p className="welcome__fine">Free to start. No card needed. Have a tester code? Create an account, then redeem it.</p>
      </div>
    </main>
  );
}

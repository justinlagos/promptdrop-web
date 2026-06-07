import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const Tile = ({ title, sub, onClick, accent }) => (
  <button className="mtile" onClick={onClick} style={accent ? { borderColor: "var(--accent-primary)" } : undefined}>
    <span className="mtile__t">{title}</span>
    <span className="mtile__s">{sub}</span>
  </button>
);

export default function Home() {
  const nav = useNavigate();
  const { isSignedIn, openAuth, user, plan } = useAuth() || {};
  const name = isSignedIn && user?.email ? user.email.split("@")[0] : "there";

  return (
    <div className="mscreen">
      <header className="mhead mhead--hero">
        <div className="mhead__eyebrow">PromptDrop</div>
        <h1>Hi {name} 👋</h1>
        <p>Read naturally, keep your eyes on the lens.</p>
      </header>
      <div className="mbody">
        <Tile title="Start prompting" sub="Full-screen teleprompter" accent onClick={() => nav("/app/prompt")} />
        <Tile title="Record a meeting" sub="Capture, transcribe, notes & ask" onClick={() => nav("/app/record")} />
        <Tile title="Your scripts" sub="Write and sync across devices" onClick={() => nav("/app/scripts")} />
        {!isSignedIn
          ? <Tile title="Sign in" sub="Save scripts, unlock your plan" onClick={() => openAuth("signin")} />
          : <Tile title="Account" sub={plan && plan !== "free" ? "Studio Pro" : "Free plan · manage"} onClick={() => nav("/app/account")} />}
      </div>
    </div>
  );
}

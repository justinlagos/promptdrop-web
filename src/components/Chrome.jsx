import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Glyph = () => (
  <svg className="brand__glyph" viewBox="0 0 512 512" aria-hidden="true">
    <rect x="8" y="8" width="496" height="496" rx="116" fill="#1C1C21" />
    <rect x="116" y="96" width="280" height="320" rx="92" fill="#000" />
    <circle cx="220" cy="150" r="13" fill="#F4F4F5" /><circle cx="256" cy="150" r="13" fill="#F4F4F5" /><circle cx="292" cy="150" r="13" fill="#F4F4F5" />
    <rect x="156" y="276" width="200" height="22" rx="11" fill="#4C8DFF" />
  </svg>
);

export function TopNav() {
  const { isSignedIn, openAuth, user } = useAuth() || {};
  const initials = user?.email ? String(user.email)[0].toUpperCase() : "";
  return (
    <nav className="nav"><div className="wrap nav__in">
      <Link className="brand" to="/"><Glyph /><span className="brand__txt">prompt<span>drop</span></span></Link>
      <div className="nav__links">
        <a href="/#how">How it works</a>
        <a href="/#meetings">Meetings</a>
        <Link to="/pricing">Pricing</Link>
        <Link to="/download">Download</Link>
      </div>
      <div className="nav__cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="nav__theme"><ThemeToggle compact /></span>
        {isSignedIn ? (
          <Link className="nav__chip" to="/account"><span className="nav__avatar">{initials}</span>Account</Link>
        ) : (
          <>
            <button className="btn btn--ghost" onClick={() => openAuth("signin")}>Sign in</button>
            <Link className="btn btn--primary" to="/welcome">Start free</Link>
          </>
        )}
      </div>
    </div></nav>
  );
}

export function Footer() {
  return (
    <footer className="foot"><div className="wrap">
      <div className="foot__row">
        <div style={{ maxWidth: 280 }}>
          <Link className="brand" to="/" style={{ marginBottom: 12 }}><Glyph /><span className="brand__txt">prompt<span>drop</span></span></Link>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 10 }}>A teleprompter that lives beside your camera.</p>
        </div>
        <div className="foot__col"><h4>Product</h4><a href="/#how">How it works</a><a href="/#meetings">Meeting overlay</a><Link to="/pricing">Pricing</Link><Link to="/download">Mac app</Link></div>
        <div className="foot__col"><h4>Legal</h4><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/acceptable-use">Acceptable use</Link></div>
      </div>
      <div className="foot__legal">© 2026 PromptDrop · Keep your eyes on the lens.</div>
    </div></footer>
  );
}

export function MobileBottomNav() {
  const { isSignedIn, openAuth } = useAuth() || {};
  const { pathname } = useLocation();
  // Shown across the signed-in surfaces, real routes only.
  const show = pathname === "/meeting" || pathname === "/account" || pathname === "/pricing" || pathname === "/scripts";
  if (!show) return null;
  const active = (to) => pathname === to;
  const items = [["Studio", "/app"], ["Meeting", "/meeting"], ["Scripts", "/scripts"], ["Account", "/account"]];
  return (
    <nav className="mbnav"><div className="mbnav__row">
      {items.map(([label, to]) => (
        <Link key={to} to={to} className={active(to) ? "on" : ""}>{label}</Link>
      ))}
      {!isSignedIn && <button className="mbnav__cta" onClick={openAuth}>Sign in</button>}
    </div></nav>
  );
}

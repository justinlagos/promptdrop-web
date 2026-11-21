import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import Brand, { StaticBrand } from "./Logo.jsx";
import { onScroll } from "../motion/smoothScroll.js";

export function TopNav() {
  const { isSignedIn, openAuth, user } = useAuth() || {};
  const initials = user?.email ? String(user.email)[0].toUpperCase() : "";
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => onScroll((st) => setScrolled(st.y > 8)), []);
  return (
    <nav className={"nav" + (scrolled ? " nav--scrolled" : "")}><div className="wrap nav__in">
      <Brand />
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
            <Link className="btn btn--primary" to="/app">Open the app</Link>
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
          <StaticBrand style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 10 }}>A teleprompter that lives beside your camera.</p>
          <div className="foot__theme"><ThemeToggle compact /></div>
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

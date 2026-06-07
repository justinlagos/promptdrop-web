import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./Home.jsx";
import Prompt from "./Prompt.jsx";
import Scripts from "../pages/Scripts.jsx";
import Studio from "../pages/Studio.jsx";
import Account from "../pages/Account.jsx";

const I = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>,
  prompt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="14" rx="3" /><path d="M7 20h10" /></svg>,
  scripts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h10l4 4v14H5z" /><path d="M9 9h6M9 13h6M9 17h4" /></svg>,
  record: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.4" fill="currentColor" /></svg>,
  account: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>,
};

const TABS = [
  ["/app", "Home", I.home],
  ["/app/prompt", "Prompt", I.prompt],
  ["/app/scripts", "Scripts", I.scripts],
  ["/app/record", "Record", I.record],
  ["/app/account", "Account", I.account],
];

// Mobile-only app: full-screen screens + a persistent bottom tab bar (the full menu, always visible).
export default function MobileShell() {
  return (
    <div className="mshell">
      <div className="mshell__body">
        <Routes>
          <Route path="/app" element={<Home />} />
          <Route path="/app/prompt" element={<Prompt />} />
          <Route path="/app/scripts" element={<Scripts />} />
          <Route path="/app/record" element={<Studio />} />
          <Route path="/app/account" element={<Account />} />
          <Route path="/app/*" element={<Home />} />
        </Routes>
      </div>
      {/* Persistent bottom tab bar. The full-screen teleprompter (.tp) overlays it while running. */}
      <nav className="mtabs">
        {TABS.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === "/app"} className={({ isActive }) => "mtab" + (isActive ? " on" : "")}>
            <span className="mtab__i">{icon}</span>
            <span className="mtab__l">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

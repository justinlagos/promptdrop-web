import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import AuthModal from "./components/AuthModal.jsx";
import { TopNav, Footer, MobileBottomNav } from "./components/Chrome.jsx";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import Download from "./pages/Download.jsx";
import Account from "./pages/Account.jsx";
import Studio from "./pages/Studio.jsx";
import Meetings from "./pages/Meetings.jsx";
import Scripts from "./pages/Scripts.jsx";
import Welcome from "./pages/Welcome.jsx";
import StudioEmbed from "./pages/StudioEmbed.jsx";
import Legal from "./pages/Legal.jsx";
import AccountSecurity from "./pages/AccountSecurity.jsx";
import WorkspacePage from "./pages/Workspace.jsx";
import { useIsMobile } from "./mobile/useIsMobile.js";

// Phones get the purpose-built native mobile app (vendored at /m); large screens get the studio.
function MobileApp() {
  return <iframe title="PromptDrop" src="/m/index.html" allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write" style={{ position: "fixed", inset: 0, width: "100vw", height: "100dvh", border: "none", background: "#0a0a0b" }} />;
}
function DesktopApp() {
  const [view, setView] = React.useState("prompter");   // prompter | meetings
  const tab = (id, label) => (
    <button onClick={() => setView(id)} style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", background: view === id ? "var(--surface-raised, #1b1d24)" : "transparent", color: view === id ? "var(--text-primary, #fff)" : "var(--text-secondary, #9aa0ad)" }}>{label}</button>
  );
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#07080b" }}>
      <div style={{ flexShrink: 0, height: 52, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid var(--border-default, #23262e)", background: "rgba(10,11,13,0.9)", backdropFilter: "blur(10px)" }}>
        <span style={{ fontWeight: 800, letterSpacing: "-.02em", marginRight: 10, color: "var(--text-primary,#fff)" }}>PromptDrop</span>
        <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken, #131419)", border: "1px solid var(--border-default,#23262e)", borderRadius: 10 }}>
          {tab("prompter", "Teleprompter")}
          {tab("meetings", "Meetings")}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: view === "meetings" ? "auto" : "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: view === "prompter" ? "block" : "none" }}><StudioEmbed /></div>
        {view === "meetings" && <Meetings />}
      </div>
    </div>
  );
}

function AppLoader() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)", font: "14px var(--font-sans)" }}>
      Loading your workspace...
    </div>
  );
}

// Guest access is removed: every app route requires an account. Auth must resolve
// before any content renders, so users never see a Guest state first.
function AppArea() {
  const mobile = useIsMobile();
  const { isSignedIn, loading } = useAuth();
  const { pathname, search } = useLocation();
  if (loading) return <AppLoader />;
  if (!isSignedIn) return <Navigate to={`/welcome?next=${encodeURIComponent(pathname + search)}`} replace />;
  return mobile ? <MobileApp /> : <DesktopApp />;
}

// Cloud-only routes: must be signed in. No guest access anywhere.
function RequireAuth({ children }) {
  const { isSignedIn, loading } = useAuth();
  const { pathname, search } = useLocation();
  if (loading) return <div style={{ minHeight: "50vh" }} />;
  if (!isSignedIn) return <Navigate to={`/welcome?next=${encodeURIComponent(pathname + search)}`} replace />;
  return children;
}

function Shell() {
  const { pathname } = useLocation();
  // The guest-allowed full-screen app is exactly /app (studio + mobile shell).
  // Cloud sub-pages (account security, workspace, billing, team) render with chrome.
  const bare = pathname === "/app";

  if (bare) return <AppArea />;

  return (
    <>
      <TopNav />
      <AuthModal />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/download" element={<Download />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/security" element={<RequireAuth><AccountSecurity /></RequireAuth>} />
        <Route path="/app/account/security" element={<RequireAuth><AccountSecurity /></RequireAuth>} />
        <Route path="/app/workspace" element={<RequireAuth><WorkspacePage /></RequireAuth>} />
        <Route path="/app/team" element={<RequireAuth><WorkspacePage /></RequireAuth>} />
        <Route path="/app/billing" element={<Navigate to="/account" replace />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/meeting" element={<Studio />} />
        <Route path="/privacy" element={<Legal doc="privacy" />} />
        <Route path="/terms" element={<Legal doc="terms" />} />
        <Route path="/acceptable-use" element={<Legal doc="acceptable-use" />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <Shell />
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

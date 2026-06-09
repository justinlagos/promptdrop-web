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
import Takes from "./pages/Takes.jsx";
import Scripts from "./pages/Scripts.jsx";
import Welcome from "./pages/Welcome.jsx";
import StudioEmbed from "./pages/StudioEmbed.jsx";
import Legal from "./pages/Legal.jsx";
import AccountSecurity from "./pages/AccountSecurity.jsx";
import WorkspacePage from "./pages/Workspace.jsx";
import { useIsMobile } from "./mobile/useIsMobile.js";

// The cloud-backed app (vendored at /m). On phones it is full-bleed; on desktop it is
// presented in its own focused, branded frame so it has a deliberate desktop shape
// rather than a stretched phone.
function MobileApp() {
  const mobile = useIsMobile();
  const frame = (
    <iframe title="PromptDrop" src="/m/index.html" allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
      style={mobile
        ? { position: "fixed", inset: 0, width: "100vw", height: "100dvh", border: "none", background: "#0a0a0b" }
        : { width: "100%", height: "100%", border: "none", background: "#0a0a0b", display: "block" }} />
  );
  if (mobile) return frame;
  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(1200px 700px at 50% -10%, rgba(76,141,255,0.14), transparent 60%), var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 22, left: 30, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", color: "var(--text-primary)" }}>prompt<span style={{ color: "var(--accent-primary)" }}>drop</span></span>
      </div>
      <div style={{ position: "absolute", top: 26, right: 30, fontSize: 12.5, color: "var(--text-muted)" }}>Synced across your devices</div>
      <div style={{ width: "min(460px, 94vw)", height: "min(900px, 92vh)", borderRadius: 30, overflow: "hidden", background: "#0a0a0b", boxShadow: "0 50px 130px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" }}>
        {frame}
      </div>
    </div>
  );
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
          {tab("takes", "Takes")}
          {tab("meetings", "Meetings")}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: view === "prompter" ? "hidden" : "auto" }}>
        <div style={{ position: "absolute", inset: 0, display: view === "prompter" ? "block" : "none" }}><StudioEmbed /></div>
        {view === "takes" && <Takes />}
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
// ONE cloud-backed app on every device (the /m experience) so the same account
// always shows the same scripts and content on desktop and mobile.
function AppArea() {
  const { isSignedIn, loading } = useAuth();
  const { pathname, search } = useLocation();
  if (loading) return <AppLoader />;
  if (!isSignedIn) return <Navigate to={`/welcome?next=${encodeURIComponent(pathname + search)}`} replace />;
  return <MobileApp />;
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

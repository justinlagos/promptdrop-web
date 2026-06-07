import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import AuthModal from "./components/AuthModal.jsx";
import { TopNav, Footer, MobileBottomNav } from "./components/Chrome.jsx";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import Download from "./pages/Download.jsx";
import Account from "./pages/Account.jsx";
import Studio from "./pages/Studio.jsx";
import Scripts from "./pages/Scripts.jsx";
import Welcome from "./pages/Welcome.jsx";
import StudioEmbed from "./pages/StudioEmbed.jsx";
import Legal from "./pages/Legal.jsx";

function Shell() {
  const { pathname } = useLocation();
  const bare = pathname.startsWith("/app");   // app runs full-screen, no marketing chrome

  // Same studio on every device (mobile gets a touch-optimised layout via studio mobile.css).
  if (bare) return <StudioEmbed />;

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
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

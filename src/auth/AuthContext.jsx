import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, planService } from "../services/index.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sub, setSub] = useState(null);          // resolved subscription row { plan, status, ... }
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  const refresh = useCallback(async () => {
    const u = await authService.getUser();
    setUser(u);
    if (u) setSub(await planService.resolve());
    else { setSub(null); planService.setLocal("free"); }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => { await refresh(); if (alive) setLoading(false); })();
    const off = authService.onChange(async () => { await refresh(); });
    return () => { alive = false; off(); };
  }, [refresh]);

  const value = {
    user, sub, loading,
    plan: sub?.plan || "free",
    isSignedIn: !!user,
    authOpen, authMode,
    openAuth: (mode = "signin") => { setAuthMode(mode === "signup" ? "signup" : "signin"); setAuthOpen(true); },
    closeAuth: () => setAuthOpen(false),
    refresh,
    signIn: async (e, p) => { const r = await authService.signIn(e, p); if (r.ok) await refresh(); return r; },
    signUp: async (e, p, n) => { const r = await authService.signUp(e, p, n); if (r.ok && r.session) await refresh(); return r; },
    signOut: async () => { await authService.signOut(); await refresh(); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

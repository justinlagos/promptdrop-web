import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { loadTenantContext } from "../services/tenant.js";
import { canUseFeature, featureGateReason } from "../services/featureGate.js";

const Ctx = createContext(null);
export const useWorkspace = () => useContext(Ctx);

const GUEST = { isGuest: true, user: null, profile: null, workspace: null, role: null, plan: "free", entitlement: null, securityStatus: { mfa: false, providers: [] } };

export function WorkspaceProvider({ children }) {
  const auth = useAuth() || {};
  const [ctx, setCtx] = useState(GUEST);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setCtx(await loadTenantContext()); }
    catch (e) { setCtx(GUEST); }
    finally { setLoading(false); }
  }, []);

  // Re-resolve whenever auth state settles or the signed-in user changes.
  useEffect(() => { if (!auth.loading) refresh(); }, [auth.loading, auth.user?.id, refresh]);

  // Explicit auth state so the app never renders content (or a Guest flash) before it resolves.
  let authStatus = "loading";
  if (!loading) {
    if (ctx.isGuest) authStatus = "unauthenticated";
    else if (ctx.trial?.active) authStatus = "trial_active";
    else if (ctx.plan && ctx.plan !== "free") authStatus = "subscribed";
    else if (ctx.trial?.expired) authStatus = "trial_expired";
    else authStatus = "free";
  }

  const value = {
    ...ctx,
    isLoading: loading,
    authStatus,
    currentWorkspace: ctx.workspace,
    currentRole: ctx.role,
    currentPlan: ctx.plan,
    entitlements: ctx.entitlement,
    trial: ctx.trial || null,
    refresh,
    can: (featureKey) => canUseFeature(ctx, featureKey),
    gateReason: (featureKey) => featureGateReason(ctx, featureKey),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

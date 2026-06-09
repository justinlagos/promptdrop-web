// Tenant / workspace context. Server-authoritative: the plan comes from
// public.billing_entitlements (protected by RLS), never from localStorage.
import { supabase } from "./supabaseClient.js";

const GUEST_CONTEXT = {
  isGuest: true, user: null, profile: null,
  workspace: null, role: null, plan: "free", entitlement: null,
  securityStatus: { mfa: false, providers: ["password"] },
};

// Ensure the signed-in user has a personal workspace (repairs if missing).
export async function ensurePersonalWorkspace() {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("ensure_personal_workspace");
  if (error) return null;
  return data; // workspace uuid
}

// Resolve the full tenant context for the current session.
// Returns GUEST_CONTEXT when signed out or when cloud is not configured.
export async function loadTenantContext() {
  if (!supabase) return { ...GUEST_CONTEXT };
  const { data: ures } = await supabase.auth.getUser();
  const user = ures?.user || null;
  if (!user) return { ...GUEST_CONTEXT };

  // profile (created by the signup trigger; repaired if absent)
  let { data: profile } = await supabase.from("profiles").select("id, email, display_name, avatar_url, default_workspace_id, onboarding_completed").eq("id", user.id).maybeSingle();

  let workspaceId = profile?.default_workspace_id || null;
  if (!workspaceId) workspaceId = await ensurePersonalWorkspace();

  // membership (role) for the active workspace
  let role = null, workspace = null, entitlement = null;
  if (workspaceId) {
    const [{ data: member }, { data: ws }, { data: ent }] = await Promise.all([
      supabase.from("workspace_members").select("role, status").eq("workspace_id", workspaceId).eq("user_id", user.id).maybeSingle(),
      supabase.from("workspaces").select("id, name, type, owner_id, plan_id").eq("id", workspaceId).maybeSingle(),
      supabase.from("billing_entitlements").select("plan_id, status, current_period_end, founder_lifetime").eq("workspace_id", workspaceId).maybeSingle(),
    ]);
    role = member?.role || null;
    workspace = ws || null;
    entitlement = ent || null;
  }

  // Authoritative plan: active, or a trial that has not yet expired. Mirrors the
  // server-side can_access_entitlement check so an expired trial drops to free.
  const now = Date.now();
  const trialEnd = entitlement && entitlement.current_period_end ? new Date(entitlement.current_period_end).getTime() : null;
  const trialActive = !!(entitlement && entitlement.status === "trialing" && trialEnd && trialEnd > now);
  const trialExpired = !!(entitlement && entitlement.status === "trialing" && trialEnd && trialEnd <= now);
  const isActive = !!(entitlement && entitlement.status === "active");
  const plan = (isActive || trialActive) ? entitlement.plan_id : "free";
  const trial = { active: trialActive, expired: trialExpired, endsAt: trialEnd, daysLeft: trialEnd ? Math.ceil((trialEnd - now) / 86400000) : null };

  // MFA / providers (best-effort, no faking)
  let mfa = false, providers = ["password"];
  try {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    mfa = aal?.currentLevel === "aal2" || aal?.nextLevel === "aal2";
  } catch (e) {}
  try { providers = (user.app_metadata?.providers) || (user.app_metadata?.provider ? [user.app_metadata.provider] : ["password"]); } catch (e) {}

  return {
    isGuest: false, user, profile: profile || { id: user.id, email: user.email },
    workspace, role, plan, entitlement, trial,
    securityStatus: { mfa, providers },
  };
}

// List all workspaces the user belongs to (for the workspace switcher architecture).
export async function listWorkspaces() {
  if (!supabase) return [];
  const { data } = await supabase.from("workspaces").select("id, name, type, plan_id");
  return data || [];
}

// Migrate guest-created local scripts into the user's personal workspace.
// Only writes into a workspace the user can edit (RLS enforces this server-side too).
export async function migrateGuestScripts(workspaceId, ownerId, scripts) {
  if (!supabase || !workspaceId || !Array.isArray(scripts) || scripts.length === 0) return { ok: false, count: 0 };
  const rows = scripts.slice(0, 200).map((s) => ({
    workspace_id: workspaceId, owner_id: ownerId, user_id: ownerId,
    title: (s.title || "Untitled").slice(0, 200), body: (s.body || "").slice(0, 100000),
  }));
  const { error, count } = await supabase.from("scripts").insert(rows, { count: "exact" });
  if (error) return { ok: false, count: 0, message: error.message };
  return { ok: true, count: count || rows.length };
}

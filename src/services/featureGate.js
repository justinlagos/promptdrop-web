// Central feature gate. The ONLY place plan/role checks live.
// Guest access has been removed: a signed-in account is required for everything.
// The authoritative entitlement is enforced server-side by RLS; this gate is for
// UX (what to show/offer).
import { FEATURES, can, requiredPlan, PLANS } from "./planService.js";

// Role requirements for workspace-scoped actions (in addition to plan).
const ROLE_REQUIRED = {
  editScript: ["owner", "admin", "editor"],
  deleteTake: ["owner", "admin", "editor"],
  manageBilling: ["owner", "admin"],
  inviteMember: ["owner", "admin"],
  deleteWorkspace: ["owner"],
};

// Plans that include the full Studio Pro feature set are normalised to studio_pro
// for feature lookups. Founder Lifetime, Team, and Enterprise all qualify.
function normalisePlan(plan) {
  if (plan === "founder_lifetime" || plan === "team" || plan === "enterprise") return "studio_pro";
  return plan || "free";
}

// ctx = { isGuest, plan, role } from the tenant context.
export function canUseFeature(ctx, featureKey) {
  const c = ctx || { isGuest: true, plan: "free", role: null };
  if (c.isGuest) return false;   // no guest access: an account is always required

  // role-gated workspace action
  const roles = ROLE_REQUIRED[featureKey];
  if (roles && !(c.role && roles.includes(c.role))) return false;

  // plan-gated feature (missing from FEATURES map = available to all signed-in users)
  return can(normalisePlan(c.plan), featureKey);
}

// Honest, non-leaky reason the user can't use a feature, plus what unlocks it.
export function featureGateReason(ctx, featureKey) {
  const c = ctx || { isGuest: true, plan: "free", role: null };
  if (c.isGuest) return { reason: "guest", message: "Sign in to use PromptDrop." };
  const roles = ROLE_REQUIRED[featureKey];
  if (roles && !(c.role && roles.includes(c.role))) return { reason: "role", message: "You do not have permission for this in this workspace." };
  if (!can(c.plan || "free", featureKey)) {
    const need = requiredPlan(featureKey);
    const name = (PLANS[need] && PLANS[need].name) || "a paid plan";
    return { reason: "plan", needPlan: need, message: `This feature needs ${name}.` };
  }
  return null;
}

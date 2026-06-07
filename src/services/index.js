// Service boundaries. Phase 2 wires Supabase auth + Stripe (via edge functions)
// behind the SAME API the UI already used.
import { ENV, isConfigured } from "./env.js";
import { PLANS, can, limit, requiredPlan } from "./planService.js";
import { supabase } from "./supabaseClient.js";

async function accessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

// ---- authService (Supabase email + password) ----
export const authService = {
  configured: () => isConfigured.supabase(),
  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  },
  async getUser() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
  onChange(cb) {
    if (!supabase) return () => {};
    const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session));
    return () => data?.subscription?.unsubscribe?.();
  },
  async signUp(email, password, displayName) {
    if (!supabase) return { ok: false, reason: "not-connected", message: "Accounts aren't connected." };
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { display_name: displayName || String(email).split("@")[0] } },
    });
    if (error) return { ok: false, reason: "error", message: error.message };
    // If email confirmation is on, there is no session yet.
    return { ok: true, session: data.session, needsConfirm: !data.session };
  },
  async signIn(email, password) {
    if (!supabase) return { ok: false, reason: "not-connected", message: "Accounts aren't connected." };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, reason: "error", message: error.message };
    return { ok: true, session: data.session };
  },
  async signOut() {
    if (supabase) await supabase.auth.signOut();
    try { localStorage.removeItem("pd.plan"); } catch {}
    return { ok: true };
  },
  displayName(user) {
    if (!user) return "Guest";
    return (user.user_metadata && user.user_metadata.display_name) || (user.email ? String(user.email).split("@")[0] : "Account");
  },
};

// ---- planService (resolves the real plan from the subscriptions table) ----
const PLAN_KEY = "pd.plan";
export const planService = {
  // Synchronous best-known plan: dev flag > cached resolved plan > free.
  current() {
    if (ENV.devUnlockPlan && PLANS[ENV.devUnlockPlan]) return ENV.devUnlockPlan; // dev flag only
    try { return localStorage.getItem(PLAN_KEY) || "free"; } catch { return "free"; }
  },
  setLocal(p) { try { localStorage.setItem(PLAN_KEY, p); } catch {} },
  plan(id) { return PLANS[id] || PLANS.free; },
  // Fetch the user's subscription and cache the resolved plan. Returns the full row.
  async resolve() {
    if (!supabase) return { plan: this.current(), status: "local" };
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { this.setLocal("free"); return { plan: "free", status: "signed-out" }; }
    const { data, error } = await supabase
      .from("subscriptions")
      .select("plan,status,billing_cycle,current_period_end,cancel_at_period_end")
      .eq("user_id", u.user.id)
      .maybeSingle();
    if (error || !data) { this.setLocal("free"); return { plan: "free", status: "inactive" }; }
    const active = ["active", "trialing", "past_due"].includes(data.status);
    const resolved = active ? data.plan : "free";
    this.setLocal(resolved);
    return { ...data, plan: resolved };
  },
};

// ---- featureGateService ----
export const featureGateService = {
  can(feature) { return can(planService.current(), feature); },
  requiredPlan,
  limit: (key) => limit(planService.current(), key),
};

// ---- billingService (Stripe via Supabase Edge Functions; the token authenticates the user) ----
async function callFn(endpoint, body) {
  const token = await accessToken();
  if (!token) return { ok: false, reason: "not-authenticated", message: "Sign in first." };
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, apikey: ENV.supabaseAnonKey },
      body: JSON.stringify(body || {}),
    });
  } catch (e) { return { ok: false, reason: "network", message: String(e.message || e) }; }
  let data = {}; try { data = await res.json(); } catch {}
  if (res.status === 503 || data.error === "stripe_not_configured" || data.error === "no_price")
    return { ok: false, reason: "stripe-pending", message: "Payments aren't switched on yet (Stripe keys pending on the server)." };
  if (!res.ok || data.error) return { ok: false, reason: data.error || "error", message: data.message || "Could not complete that." };
  return { ok: true, ...data };
}

export const billingService = {
  configured: () => isConfigured.stripe(),
  // Opens Stripe Checkout for a plan + cycle. Redirects on success.
  async startCheckout(planId, cycle = "monthly") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const r = await callFn(ENV.checkoutEndpoint, {
      plan: planId, cycle,
      successUrl: `${origin}/account?checkout=success`,
      cancelUrl: `${origin}/pricing?checkout=cancelled`,
    });
    if (r.ok && r.url) { window.location.href = r.url; }
    return r;
  },
  async openPortal() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const r = await callFn(ENV.portalEndpoint, { returnUrl: `${origin}/account` });
    if (r.ok && r.url) { window.location.href = r.url; }
    return r;
  },
  // Redeem a tester/friend access code -> grants a plan for N days (no card).
  async redeemCode(code) {
    const r = await callFn(ENV.redeemEndpoint, { code });
    return r; // { ok, plan, until } | { ok:false, reason, message }
  },
};

// ---- desktopDownloadService ----
export const desktopDownloadService = {
  available: () => isConfigured.dmg(),
  url: () => ENV.dmgUrl,
  winAvailable: () => !!ENV.winUrl,
  winUrl: () => ENV.winUrl,
  version: () => ENV.dmgVersion || "",
};

// ---- meeting* + media + take services (Phase 3 interfaces; honest now) ----
export const mediaPermissionService = {
  async canCaptureScreen() { return typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia); },
  async canCaptureSystemAudio() { return false; }, // browser support is unreliable; never claim it
};
export const meetingRecordingService = {
  configured: () => typeof window !== "undefined" && !!(navigator.mediaDevices && window.MediaRecorder),
  note: "Camera/mic and screen recording work in the browser and stay on your device. System audio capture isn't reliable in browsers, use PromptDrop Desktop for full meeting capture.",
};

// Transcription: posts the audio/video blob to a configured endpoint. Honest until set.
export const transcriptionService = {
  configured: () => isConfigured.transcription(),
  async transcribeRecording(blob) {
    if (!isConfigured.transcription())
      return { ok: false, reason: "not-connected", message: "Connect a transcription provider (VITE_TRANSCRIPTION_ENDPOINT) to turn recordings into text." };
    const token = await accessToken();
    const form = new FormData();
    form.append("file", blob, "recording.webm");
    try {
      const res = await fetch(ENV.transcriptionEndpoint, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, reason: "error", message: data.message || "Transcription failed." };
      return { ok: true, text: data.text || data.transcript || "", segments: data.segments || null };
    } catch (e) { return { ok: false, reason: "network", message: String(e.message || e) }; }
  },
};

// Ask Mode: posts a question (+ optional transcript context) to a configured LLM endpoint.
export const meetingAssistantService = {
  configured: () => isConfigured.assistant(),
  async ask(question, context = "") {
    if (!isConfigured.assistant())
      return { ok: false, reason: "not-connected", message: "Connect an AI endpoint (VITE_ASSISTANT_ENDPOINT) to enable Ask Mode." };
    const token = await accessToken();
    try {
      const res = await fetch(ENV.assistantEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, reason: "error", message: data.message || "Ask failed." };
      return { ok: true, answer: data.answer || data.text || "" };
    } catch (e) { return { ok: false, reason: "network", message: String(e.message || e) }; }
  },
};
export const overlayStateService = {
  // bridges to the Electron overlay when running in the desktop app
  isDesktop: () => typeof window !== "undefined" && !!window.promptdrop && !!window.promptdrop.isDesktop,
};

export { ENV, isConfigured };

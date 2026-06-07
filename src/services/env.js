// Single place that reads build-time config. Nothing here is secret (Vite only
// exposes VITE_* to the client). Server secrets live in serverless functions.
const e = import.meta.env;
const supabaseUrl = e.VITE_SUPABASE_URL || "";
const fnBase = supabaseUrl ? `${supabaseUrl}/functions/v1` : "";
export const ENV = {
  appEnv: e.VITE_APP_ENV || "development",
  // accounts
  supabaseUrl,
  supabaseAnonKey: e.VITE_SUPABASE_ANON_KEY || "",
  // billing: checkout/portal are Supabase Edge Functions (server holds the Stripe secret).
  // The price IDs and Stripe keys live ON THE SERVER (edge function secrets), never here.
  checkoutEndpoint: `${fnBase}/stripe-checkout`,
  portalEndpoint: `${fnBase}/stripe-portal`,
  redeemEndpoint: `${fnBase}/redeem-code`,
  // meeting intelligence (Supabase Edge Functions; provider key lives on the server)
  transcriptionEndpoint: e.VITE_TRANSCRIPTION_ENDPOINT || (fnBase ? `${fnBase}/transcribe` : ""),
  assistantEndpoint: e.VITE_ASSISTANT_ENDPOINT || (fnBase ? `${fnBase}/assistant` : ""),
  // desktop download
  dmgUrl: e.VITE_DMG_URL || "",
  winUrl: e.VITE_WIN_URL || "",
  dmgVersion: e.VITE_DMG_VERSION || "",
  // dev-only: let a flag grant a plan locally for testing (never in prod)
  devUnlockPlan: e.VITE_DEV_UNLOCK_PLAN || "",
};
export const isConfigured = {
  // Client can only know the checkout endpoint exists; whether Stripe keys are set
  // lives on the server, so billing calls handle a 503 honestly at call time.
  stripe: () => !!ENV.checkoutEndpoint,
  supabase: () => !!(ENV.supabaseUrl && ENV.supabaseAnonKey),
  transcription: () => !!ENV.transcriptionEndpoint,
  assistant: () => !!ENV.assistantEndpoint,
  dmg: () => !!ENV.dmgUrl,
};

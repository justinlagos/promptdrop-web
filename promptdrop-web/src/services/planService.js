// Central plan + feature config. Single source of truth for gating.
export const PLANS = {
  free:             { id: "free",             name: "Free",             price: "$0",  cycle: "",       blurb: "For trying PromptDrop",                          cta: "Start free" },
  creator_pro:      { id: "creator_pro",      name: "Creator Pro",      price: "$5",  cycle: "/month", priceYear: "$56/year", blurb: "For regular video creators", cta: "Upgrade to Creator Pro" },
  studio_pro:       { id: "studio_pro",       name: "Studio Pro",       price: "$9",  cycle: "/month", priceYear: "$95/year", blurb: "For meetings, overlays & serious recording", cta: "Upgrade to Studio Pro", badge: "Best value" },
  team:             { id: "team",             name: "Team",             price: "Coming soon", cycle: "", blurb: "For teams and organisations",                  cta: "Join team waitlist", soon: true },
  enterprise:       { id: "enterprise",       name: "Enterprise",       price: "Custom", cycle: "",    blurb: "For larger organisations",                       cta: "Contact sales" },
};
export const PLAN_ORDER = ["free", "creator_pro", "studio_pro"];

// feature -> plans that include it. Missing feature = available to all.
export const FEATURES = {
  cloudSync: ["creator_pro", "studio_pro"],
  aiRewrite: ["creator_pro", "studio_pro"],
  voiceFollow: ["creator_pro", "studio_pro"],
  advancedReview: ["creator_pro", "studio_pro"],
  importDocx: ["creator_pro", "studio_pro"],
  captionExport: ["creator_pro", "studio_pro"],
  unlimitedScripts: ["creator_pro", "studio_pro"],
  unlimitedTakes: ["creator_pro", "studio_pro"],
  desktopOverlay: ["studio_pro"],
  meetingMode: ["studio_pro"],
  meetingRecording: ["studio_pro"],
  meetingTranscription: ["studio_pro"],
  askMode: ["studio_pro"],
  privatePrompt: ["studio_pro"],
  advancedVoice: ["studio_pro"],
  deliveryCoach: ["studio_pro"],
};
export const LIMITS = { free: { scripts: 3, takes: 5 } };

export const PLAN_BENEFITS = {
  free: ["Camera-level teleprompter", "Manual speed, size & colour", "Camera alignment", "Up to 3 scripts · 5 takes", "Local recordings & basic review", "No account needed"],
  creator_pro: ["Everything in Free", "Unlimited scripts & takes", "AI rewrite tools", "Voice-follow & hybrid pace", "Advanced review & captions", "DOCX/PDF import", "Cloud sync"],
  studio_pro: ["Everything in Creator Pro", "Desktop overlay over any app", "Meeting Mode", "Meeting recording & transcription", "Ask PromptDrop during meetings", "Private prompt where supported", "Priority support"],
};

export function requiredPlan(feature) {
  const a = FEATURES[feature]; if (!a) return null;
  return PLAN_ORDER.find((p) => a.includes(p)) || a[0];
}
export function can(plan, feature) { const a = FEATURES[feature]; return a ? a.includes(plan) : true; }
export function limit(plan, key) { const l = LIMITS[plan]; return l && l[key] != null ? l[key] : Infinity; }

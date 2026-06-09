// Feature-gate unit tests. Run: node src/services/featureGate.test.mjs
import { canUseFeature } from "./featureGate.js";
import assert from "node:assert";

const guest = { isGuest: true, plan: "free", role: null };
const free = { isGuest: false, plan: "free", role: "owner" };
const creator = { isGuest: false, plan: "creator_pro", role: "owner" };
const studio = { isGuest: false, plan: "studio_pro", role: "owner" };
const founder = { isGuest: false, plan: "founder_lifetime", role: "owner" };
const viewer = { isGuest: false, plan: "studio_pro", role: "viewer" };

let pass = 0;
function check(name, cond) { assert.ok(cond, name); pass++; }

// Guest access removed: a guest/unauthenticated context can use nothing.
check("guest cannot use local scripts", canUseFeature(guest, "localScripts") === false);
check("guest cannot use AI rewrite", canUseFeature(guest, "aiRewrite") === false);
check("guest cannot use cloud sync", canUseFeature(guest, "cloudSync") === false);

// Free signed-in cannot use paid features
check("free cannot use AI rewrite", canUseFeature(free, "aiRewrite") === false);
check("free cannot use voice-follow", canUseFeature(free, "voiceFollow") === false);

// Creator Pro can use creator features but not Studio-only
check("creator can use AI rewrite", canUseFeature(creator, "aiRewrite") === true);
check("creator can use voice-follow", canUseFeature(creator, "voiceFollow") === true);
check("creator cannot use desktop overlay", canUseFeature(creator, "desktopOverlay") === false);
check("creator cannot use meeting recording", canUseFeature(creator, "meetingRecording") === false);

// Studio Pro can use Studio features
check("studio can use desktop overlay", canUseFeature(studio, "desktopOverlay") === true);
check("studio can use meeting recording", canUseFeature(studio, "meetingRecording") === true);
check("studio can use AI rewrite", canUseFeature(studio, "aiRewrite") === true);

// Founder Lifetime maps to Studio Pro core features
check("founder can use desktop overlay", canUseFeature(founder, "desktopOverlay") === true);
check("founder can use meeting recording", canUseFeature(founder, "meetingRecording") === true);

// Role gating: viewer cannot perform editor/admin actions even on a paid plan
check("viewer cannot edit script", canUseFeature(viewer, "editScript") === false);
check("viewer cannot manage billing", canUseFeature(viewer, "manageBilling") === false);
check("owner can manage billing", canUseFeature(studio, "manageBilling") === true);

console.log(`featureGate: ${pass} assertions passed`);

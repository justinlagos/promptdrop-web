function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
; /* plans.jsx */
// PromptDrop, central plan config + feature gates. One source of truth.
// No billing is wired yet, so plan changes happen via an honest local switch
// (Account → "Plan (local testing)"); upgrade sheets say payment is coming.
const PD_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    cycle: "",
    blurb: "For trying PromptDrop",
    cta: "Start free"
  },
  creator_pro: {
    id: "creator_pro",
    name: "Creator Pro",
    price: "$5",
    cycle: "/month",
    priceYear: "$56/year",
    blurb: "For regular video creators",
    cta: "Upgrade to Creator Pro"
  },
  studio_pro: {
    id: "studio_pro",
    name: "Studio Pro",
    price: "$9",
    cycle: "/month",
    priceYear: "$95/year",
    blurb: "For meetings, overlays, and serious recording",
    cta: "Upgrade to Studio Pro",
    badge: "Best value"
  },
  team: {
    id: "team",
    name: "Team",
    price: "Coming soon",
    cycle: "",
    blurb: "For teams and organisations",
    cta: "Join team waitlist",
    soon: true
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cycle: "",
    blurb: "For larger organisations",
    cta: "Contact sales"
  }
};
const PD_PLAN_ORDER = ["free", "creator_pro", "studio_pro"];

// feature -> plans that include it. Absent feature = available to everyone.
const PD_FEATURES = {
  cloudSync: ["creator_pro", "studio_pro"],
  aiRewrite: ["creator_pro", "studio_pro"],
  voiceFollow: ["creator_pro", "studio_pro"],
  advancedReview: ["creator_pro", "studio_pro"],
  importDocx: ["creator_pro", "studio_pro"],
  unlimitedScripts: ["creator_pro", "studio_pro"],
  unlimitedTakes: ["creator_pro", "studio_pro"],
  characterCustom: ["creator_pro", "studio_pro"],
  desktopOverlay: ["studio_pro"],
  meetingMode: ["studio_pro"],
  privatePrompt: ["studio_pro"]
};
const PD_LIMITS = {
  free: {
    scripts: 3,
    takes: 5
  }
};

// which plan a feature first requires (for upgrade copy)
function PD_requiredPlan(feature) {
  const arr = PD_FEATURES[feature];
  if (!arr) return null;
  return PD_PLAN_ORDER.find(p => arr.includes(p)) || arr[0];
}
function PD_can(plan, feature) {
  const a = PD_FEATURES[feature];
  return a ? a.includes(plan) : true;
}
function PD_limit(plan, key) {
  const l = PD_LIMITS[plan];
  return l && l[key] != null ? l[key] : Infinity;
}
const PD_UPGRADE_COPY = {
  aiRewrite: ["AI script rewriting is part of Creator Pro.", "Sharpen scripts, shorten drafts, and turn notes into camera-ready lines."],
  voiceFollow: ["Voice-follow is part of Creator Pro.", "PromptDrop gently follows your pace while you speak."],
  importDocx: ["DOCX and PDF import are part of Creator Pro.", "Bring scripts in from anywhere."],
  advancedReview: ["Advanced take review is part of Creator Pro.", "Transcript comparison, pacing and caption export."],
  cloudSync: ["Cloud sync is part of Creator Pro.", "Keep your scripts and takes across devices."],
  unlimitedScripts: ["You’ve reached the Free script limit.", "Upgrade for unlimited scripts and cloud sync, or delete an old script."],
  unlimitedTakes: ["You’ve reached the Free recording limit.", "Upgrade for unlimited takes and advanced review, or delete an old recording."],
  desktopOverlay: ["Desktop overlay is part of Studio Pro.", "Float PromptDrop above Zoom, Meet, Keynote and any app."],
  meetingMode: ["Meeting Mode is part of Studio Pro.", "Keep a private prompt near your camera during live calls."],
  privatePrompt: ["Private Prompt Mode is part of Studio Pro.", "Hide the prompt from screen-share where the OS supports it."]
};
Object.assign(window, {
  PD_PLANS,
  PD_PLAN_ORDER,
  PD_FEATURES,
  PD_LIMITS,
  PD_requiredPlan,
  PD_can,
  PD_limit,
  PD_UPGRADE_COPY
});
; /* data.jsx */
// PromptDrop, real application store: scripts (localStorage) + recordings
// (IndexedDB blobs) + settings + routing. No mock data.
const {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  createContext
} = React;
const uid = () => 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Demo/seed data is OFF. Production never ships seeded scripts or fake users.
const ENABLE_DEMO_DATA = false;

// ---- real, auth-safe display name (no fake person names, ever) ----
function getDisplayName(user) {
  if (!user) return "Guest";
  if (user.profile && user.profile.fullName) return user.profile.fullName;
  if (user.user_metadata && user.user_metadata.name) return user.user_metadata.name;
  if (user.email) return String(user.email).split("@")[0];
  return "Account";
}
function getInitials(user) {
  if (!user) return "G";
  const n = getDisplayName(user);
  if (n === "Account") return "A";
  const p = n.trim().split(/\s+/);
  return ((p[0] || "")[0] || "") + ((p[1] || "")[0] || "") || (n[0] || "A").toUpperCase();
}

// One-time cleanup of any demo/legacy data left in storage by earlier builds.
function migrateDemoCleanup() {
  try {
    if (localStorage.getItem("promptdrop_demo_cleanup_v1")) return;
    ["pd.scriptText", "pd.scriptTitle", "pd.live"].forEach(k => localStorage.removeItem(k));
    try {
      const a = JSON.parse(localStorage.getItem("pd.scripts") || "null");
      // drop the untouched seeded sample if it's the only script
      if (Array.isArray(a) && a.length === 1 && a[0] && a[0].title === "Morning launch take" && (a[0].body || "").indexOf("It's a teleprompter") > -1) {
        localStorage.removeItem("pd.scripts");
        localStorage.removeItem("pd.activeId");
      }
    } catch {}
    localStorage.setItem("promptdrop_demo_cleanup_v1", "true");
  } catch {}
}
const DEFAULT_SETTINGS = {
  wpm: 132,
  fontSize: 38,
  width: 64,
  adjacentOpacity: 42,
  position: "Top centre",
  align: "Centre",
  countdown: 3,
  smoothScroll: true,
  pauseAtMarkers: true,
  showCharacter: true,
  characterIntensity: "Normal",
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  pacing: "Follow my voice",
  autoRecord: true,
  resolution: "1080p",
  textColour: "#F4F4F5",
  liveFrame: "mac"
};

// ---- helpers ----
function wordCount(t) {
  return (t || "").trim().split(/\s+/).filter(Boolean).length;
}
function readTimeSec(t, wpm) {
  return Math.round(wordCount(t) / (wpm || 132) * 60);
}
function fmtClock(s) {
  s = Math.max(0, Math.round(s || 0));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
function relTime(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return Math.floor(d / 60) + "m ago";
  if (d < 86400) return Math.floor(d / 3600) + "h ago";
  if (d < 604800) return Math.floor(d / 86400) + "d ago";
  return new Date(ts).toLocaleDateString();
}

// Parse free-typed script into teleprompter lines.
function pdSplitLine(p) {
  const words = p.split(/\s+/).filter(Boolean);
  const out = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 40) {
      if (cur) out.push(cur.trim());
      cur = w;
    } else cur = (cur ? cur + " " : "") + w;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parseScriptText(text) {
  const lines = [];
  const paras = (text || "").replace(/\r/g, "").split(/\n\s*\n/);
  paras.forEach((para, pi) => {
    if (!para.trim()) return;
    para.split(/\n/).forEach(raw => {
      const t = raw.trim();
      if (!t) return;
      if (/^\[\s*pause\s*\]$/i.test(t)) {
        lines.push({
          pause: true
        });
        return;
      }
      pdSplitLine(t).forEach(seg => lines.push({
        t: seg
      }));
    });
    if (pi < paras.length - 1) lines.push({
      pause: true
    });
  });
  return lines.length ? lines : [{
    t: ""
  }];
}

// ---- IndexedDB for recordings (blobs) ----
const IDB_NAME = "promptdrop-app",
  IDB_VER = 1;
let _db = null;
function idbOpen() {
  return new Promise(res => {
    if (typeof indexedDB === "undefined") return res(null);
    const rq = indexedDB.open(IDB_NAME, IDB_VER);
    rq.onupgradeneeded = () => {
      const d = rq.result;
      if (!d.objectStoreNames.contains("takes")) d.createObjectStore("takes", {
        keyPath: "id"
      });
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => res(null);
  });
}
async function idb() {
  if (!_db) _db = await idbOpen();
  return _db;
}
async function idbPut(rec) {
  const d = await idb();
  if (!d) return;
  return new Promise(r => {
    const tx = d.transaction("takes", "readwrite");
    tx.objectStore("takes").put(rec);
    tx.oncomplete = () => r(true);
    tx.onerror = () => r(false);
  });
}
async function idbAll() {
  const d = await idb();
  if (!d) return [];
  return new Promise(r => {
    const rq = d.transaction("takes", "readonly").objectStore("takes").getAll();
    rq.onsuccess = () => r(rq.result || []);
    rq.onerror = () => r([]);
  });
}
async function idbDel(id) {
  const d = await idb();
  if (!d) return;
  return new Promise(r => {
    const tx = d.transaction("takes", "readwrite");
    tx.objectStore("takes").delete(id);
    tx.oncomplete = () => r(true);
    tx.onerror = () => r(false);
  });
}

// ---- hash routing ----
const SUBVIEWS = {
  studio: "studio",
  settings: "settings",
  review: "review",
  library: "library",
  preferences: "preferences",
  pricing: "pricing"
};
function parseHash(h) {
  h = (h || "").replace(/^#/, "");
  if (!h || h === "/") return {
    world: "app",
    appView: "dashboard",
    live: false
  };
  if (h.indexOf("/app") === 0) {
    const sub = h.slice(4).replace(/^\//, "");
    if (sub === "live") return {
      world: "app",
      live: true
    };
    if (SUBVIEWS[sub]) return {
      world: "app",
      appView: SUBVIEWS[sub],
      live: false
    };
    return {
      world: "app",
      appView: "dashboard",
      live: false
    };
  }
  return {
    world: "app",
    appView: "dashboard",
    live: false
  };
}
function routeFor(world, appView) {
  if (appView === "dashboard") return "/app";
  return "/app/" + appView;
}

// ---- store ----
const PDContext = createContext(null);
function loadScripts() {
  try {
    const a = JSON.parse(localStorage.getItem("pd.scripts") || "null");
    if (Array.isArray(a)) return a;
  } catch {}
  return []; // no seeded demo scripts, empty state until the user creates one
}
function PDProvider({
  children
}) {
  if (typeof localStorage !== "undefined") migrateDemoCleanup();
  const init = parseHash(typeof location !== "undefined" ? location.hash : "");
  // No auth backend yet: the app runs in local guest mode. Wire real auth here later.
  const user = null;
  const [appView, setAppViewS] = useState(init.appView || "dashboard");
  const [liveOn, setLiveOn] = useState(!!init.live);
  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(localStorage.getItem("pd.settings") || "{}")
      };
    } catch {
      return {
        ...DEFAULT_SETTINGS
      };
    }
  });
  const [scripts, setScripts] = useState(loadScripts);
  const [activeId, setActiveId] = useState(() => {
    try {
      return localStorage.getItem("pd.activeId") || null;
    } catch {
      return null;
    }
  });
  const [takes, setTakes] = useState([]); // {id,scriptId,title,dur,created,url,blob,size}
  const [currentTakeId, setCurrentTakeId] = useState(null);

  // ---- plan + feature gating (local; no billing wired) ----
  const [plan, setPlanS] = useState(() => {
    try {
      return localStorage.getItem("pd.plan") || "free";
    } catch {
      return "free";
    }
  });
  const setPlan = useCallback(p => {
    setPlanS(p);
    try {
      localStorage.setItem("pd.plan", p);
    } catch {}
  }, []);
  const [upsell, setUpsell] = useState(null); // feature key being gated, or null
  const can = useCallback(f => window.PD_can(plan, f), [plan]);
  const requireFeature = useCallback((f, cb) => {
    if (window.PD_can(plan, f)) {
      cb && cb();
      return true;
    }
    setUpsell(f);
    return false;
  }, [plan]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("pd.settings", JSON.stringify(settings));
    } catch {}
  }, [settings]);
  useEffect(() => {
    try {
      localStorage.setItem("pd.scripts", JSON.stringify(scripts));
    } catch {}
  }, [scripts]);
  useEffect(() => {
    try {
      if (activeId) localStorage.setItem("pd.activeId", activeId);
    } catch {}
  }, [activeId]);

  // keep activeId valid, but never auto-create a script (empty state instead)
  useEffect(() => {
    if (scripts.length && (!activeId || !scripts.find(x => x.id === activeId))) setActiveId(scripts[0].id);
  }, [scripts, activeId]);

  // load recordings from IndexedDB
  useEffect(() => {
    (async () => {
      const all = await idbAll();
      all.sort((a, b) => b.created - a.created);
      setTakes(all.map(t => ({
        ...t,
        url: t.blob ? URL.createObjectURL(t.blob) : null
      })));
    })();
  }, []);

  // routing
  const apply = useCallback(() => {
    const r = parseHash(location.hash);
    if (r.appView) setAppViewS(r.appView);
    setLiveOn(!!r.live);
  }, []);
  useEffect(() => {
    if (!location.hash) location.replace("#/app");
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [apply]);
  const nav = useCallback(path => {
    if ("#" + path === location.hash) apply();else location.hash = path;
  }, [apply]);
  const setAppView = useCallback(v => nav(v === "dashboard" ? "/app" : "/app/" + v), [nav]);
  const openLive = useCallback(() => nav("/app/live"), [nav]);
  const closeLive = useCallback(() => nav(routeFor("app", appView)), [nav, appView]);
  const setWorld = useCallback(w => {
    if (w === "live" || w === "phone") nav("/app/live");else nav("/app");
  }, [nav]);
  const setSetting = useCallback((k, v) => setSettings(s => ({
    ...s,
    [k]: v
  })), []);

  // ---- script CRUD ----
  const active = scripts.find(x => x.id === activeId) || scripts[0] || null;
  const patchScript = useCallback((id, patch) => setScripts(arr => arr.map(s => s.id === id ? {
    ...s,
    ...patch,
    updated: Date.now()
  } : s)), []);
  const setScriptText = useCallback(t => {
    if (active) patchScript(active.id, {
      body: t
    });
  }, [active, patchScript]);
  const setScriptTitle = useCallback(t => {
    if (active) patchScript(active.id, {
      title: t
    });
  }, [active, patchScript]);
  const newScript = useCallback(seed => {
    // Free plan is capped; gate with an upgrade sheet instead of silently failing.
    if (!window.PD_can(plan, "unlimitedScripts") && scripts.length >= window.PD_limit("free", "scripts")) {
      setUpsell("unlimitedScripts");
      return null;
    }
    const s = {
      id: uid(),
      title: seed && seed.title || "Untitled script",
      body: seed && seed.body || "",
      tag: seed && seed.tag || "Draft",
      updated: Date.now()
    };
    setScripts(a => [s, ...a]);
    setActiveId(s.id);
    return s.id;
  }, [plan, scripts.length]);
  const duplicateScript = useCallback(id => {
    const o = scripts.find(x => x.id === id);
    if (!o) return;
    const s = {
      ...o,
      id: uid(),
      title: o.title + " copy",
      fav: false,
      updated: Date.now()
    };
    setScripts(a => [s, ...a]);
    setActiveId(s.id);
  }, [scripts]);
  const deleteScript = useCallback(id => setScripts(a => a.filter(s => s.id !== id)), []);
  const toggleFav = useCallback(id => setScripts(a => a.map(s => s.id === id ? {
    ...s,
    fav: !s.fav
  } : s)), []);
  const openScript = useCallback(id => {
    setActiveId(id);
    nav("/app/studio");
  }, [nav]);
  const readLines = React.useMemo(() => parseScriptText(active ? active.body : ""), [active]);

  // ---- takes ----
  const addTake = useCallback(async ({
    blob,
    dur,
    scriptId,
    title
  }) => {
    const rec = {
      id: "t" + Date.now().toString(36),
      scriptId,
      title: title || "Take",
      dur: dur || 0,
      created: Date.now(),
      size: blob ? blob.size : 0
    };
    await idbPut({
      ...rec,
      blob
    });
    const url = blob ? URL.createObjectURL(blob) : null;
    setTakes(arr => [{
      ...rec,
      blob,
      url
    }, ...arr]);
    setCurrentTakeId(rec.id);
    return rec.id;
  }, []);
  const deleteTake = useCallback(async id => {
    await idbDel(id);
    setTakes(arr => arr.filter(t => t.id !== id));
  }, []);
  const clearTakes = useCallback(async () => {
    for (const t of takes) await idbDel(t.id);
    setTakes([]);
  }, [takes]);
  const value = {
    appView,
    liveOn,
    nav,
    setWorld,
    setAppView,
    openLive,
    closeLive,
    settings,
    setSetting,
    setSettings,
    // account (local guest mode, no fake identity)
    user,
    displayName: getDisplayName(user),
    initials: getInitials(user),
    // plan + gating
    plan,
    setPlan,
    can,
    requireFeature,
    upsell,
    setUpsell,
    planName: (window.PD_PLANS[plan] || {}).name || "Free",
    scriptLimit: window.PD_limit("free", "scripts"),
    takeLimit: window.PD_limit("free", "takes"),
    // scripts
    scripts,
    active,
    activeId,
    setActive: setActiveId,
    openScript,
    scriptText: active ? active.body : "",
    setScriptText,
    scriptTitle: active ? active.title : "",
    setScriptTitle,
    newScript,
    duplicateScript,
    deleteScript,
    toggleFav,
    patchScript,
    script: {
      title: active ? active.title : "",
      lines: readLines
    },
    readLines,
    // takes
    takes,
    addTake,
    deleteTake,
    clearTakes,
    currentTakeId,
    setCurrentTakeId,
    // utils
    wordCount,
    readTimeSec,
    fmtClock,
    relTime
  };
  return React.createElement(PDContext.Provider, {
    value
  }, children);
}
const usePD = () => useContext(PDContext);
Object.assign(window, {
  PDContext,
  PDProvider,
  usePD,
  PD_DEFAULT_SETTINGS: DEFAULT_SETTINGS,
  pdWordCount: wordCount,
  pdFmtClock: fmtClock,
  pdRelTime: relTime,
  pdReadTimeSec: readTimeSec
});
; /* icons.jsx */
// PromptDrop control app, inline icon set (Lucide-style, 1.75 stroke)
const Icon = ({
  d,
  size = 18,
  fill = false,
  sw = 1.75,
  ...p
}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: fill ? "currentColor" : "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, p), d);
const Icons = {
  grid: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }))
  })),
  pen: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 20h9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
    }))
  })),
  video: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "6",
      width: "14",
      height: "12",
      rx: "2.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m22 8-6 4 6 4V8Z"
    }))
  })),
  library: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
    }))
  })),
  settings: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
    }))
  })),
  play: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    fill: true,
    d: /*#__PURE__*/React.createElement("polygon", {
      points: "6 4 20 12 6 20 6 4"
    })
  })),
  plus: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }))
  })),
  search: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "21",
      y1: "21",
      x2: "16.65",
      y2: "16.65"
    }))
  })),
  sparkles: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5 10.1 7.6 12 3Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z"
    }))
  })),
  clock: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 7 12 12 15 14"
    }))
  })),
  arrowRight: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    }))
  })),
  chevronRight: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement("polyline", {
      points: "9 18 15 12 9 6"
    })
  })),
  rocket: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
    }))
  })),
  mic: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "2",
      width: "6",
      height: "12",
      rx: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 10a7 7 0 0 0 14 0"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12",
      y2: "21"
    }))
  })),
  cam: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M23 7l-7 5 7 5V7Z"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "5",
      width: "15",
      height: "14",
      rx: "2.5"
    }))
  })),
  type: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
      points: "4 7 4 4 20 4 20 7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "20",
      x2: "15",
      y2: "20"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "4",
      x2: "12",
      y2: "20"
    }))
  })),
  move: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
      points: "5 9 2 12 5 15"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "9 5 12 2 15 5"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "15 19 12 22 9 19"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "19 9 22 12 19 15"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "2",
      y1: "12",
      x2: "22",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "2",
      x2: "12",
      y2: "22"
    }))
  })),
  dots: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "5",
      cy: "12",
      r: "1.4",
      fill: "currentColor"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "1.4",
      fill: "currentColor"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "19",
      cy: "12",
      r: "1.4",
      fill: "currentColor"
    }))
  })),
  bolt: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement("polygon", {
      points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
    })
  })),
  check: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })
  })),
  download: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "7 10 12 15 17 10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "15",
      x2: "12",
      y2: "3"
    }))
  })),
  pause: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    fill: true,
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "5",
      width: "4",
      height: "14",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "5",
      width: "4",
      height: "14",
      rx: "1"
    }))
  })),
  star: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement("polygon", {
      points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    })
  })),
  copy: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "13",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    }))
  })),
  trash: p => /*#__PURE__*/React.createElement(Icon, _extends({}, p, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
      points: "3 6 5 6 21 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 11v6M14 11v6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
    }))
  }))
};
window.PDIcon = Icon;
window.PDIcons = Icons;
; /* appshell.jsx */
// PromptDrop, app shell (sidebar, topbar, mini drop preview)
const I = window.PDIcons;

// sliders icon for Prompt Settings (tuning)
const SlidersIcon = p => React.createElement(window.PDIcon, {
  ...p,
  d: React.createElement(React.Fragment, null, React.createElement("line", {
    x1: 4,
    y1: 7,
    x2: 20,
    y2: 7
  }), React.createElement("line", {
    x1: 4,
    y1: 12,
    x2: 20,
    y2: 12
  }), React.createElement("line", {
    x1: 4,
    y1: 17,
    x2: 20,
    y2: 17
  }), React.createElement("circle", {
    cx: 15,
    cy: 7,
    r: 2.4,
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: 8,
    cy: 12,
    r: 2.4,
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: 16,
    cy: 17,
    r: 2.4,
    fill: "currentColor"
  }))
});
function PDLogo() {
  const pd = window.usePD();
  return React.createElement("a", {
    className: "pd-lockup",
    onClick: () => pd.nav("/"),
    style: {
      padding: "2px 4px 0"
    }
  }, React.createElement("span", {
    className: "pd-mark",
    style: {
      width: 30,
      height: 30,
      fontSize: 30
    }
  }, React.createElement("i"), React.createElement("i"), React.createElement("i")), React.createElement("span", {
    className: "pd-wordmark",
    style: {
      fontSize: 18
    }
  }, "prompt", React.createElement("span", null, "drop")));
}
const NAV = [{
  id: "dashboard",
  label: "Dashboard",
  icon: I.grid
}, {
  id: "studio",
  label: "Script Studio",
  icon: I.pen
}, {
  id: "settings",
  label: "Prompt Settings",
  icon: SlidersIcon
}, {
  id: "live",
  label: "Live PromptDrop",
  icon: I.rocket,
  live: true
}, {
  id: "review",
  label: "Take Review",
  icon: I.video
}, {
  id: "library",
  label: "Library",
  icon: I.library
}, {
  id: "preferences",
  label: "Settings",
  icon: I.settings
}];
function Sidebar() {
  const pd = window.usePD();
  return React.createElement("nav", {
    className: "nav"
  }, React.createElement(PDLogo, null), React.createElement("div", {
    className: "nav__section"
  }, "Workspace"), NAV.map(n => {
    const active = n.live ? pd.liveOn : !pd.liveOn && pd.appView === n.id;
    return React.createElement("button", {
      key: n.id,
      className: "navitem " + (active ? "navitem--active" : "") + (n.live ? " navitem--live" : ""),
      onClick: () => n.live ? pd.openLive() : pd.setAppView(n.id)
    }, React.createElement(n.icon, {
      size: 18
    }), " ", n.label);
  }), React.createElement("div", {
    className: "nav__spacer"
  }), React.createElement("hr", {
    className: "divider"
  }), React.createElement("button", {
    className: "navitem",
    style: {
      marginBottom: 4
    },
    onClick: () => pd.setAppView("pricing")
  }, React.createElement(I.star, {
    size: 18
  }), " Plans & pricing"), React.createElement("div", {
    className: "nav__profile",
    onClick: () => pd.setAppView("preferences")
  }, React.createElement("span", {
    className: "avatar avatar--accent"
  }, pd.initials), React.createElement("div", {
    className: "stack"
  }, React.createElement("span", {
    className: "nm"
  }, pd.displayName), React.createElement("span", {
    className: "pl"
  }, pd.user ? "Signed in" : pd.plan && pd.plan !== "free" ? pd.planName : "Local mode"))));
}
function Topbar({
  title,
  crumb,
  right
}) {
  return React.createElement("header", {
    className: "topbar"
  }, React.createElement("div", {
    className: "topbar__left"
  }, crumb && React.createElement("span", {
    className: "topbar__bc"
  }, crumb), React.createElement("h1", null, title)), React.createElement("div", {
    className: "topbar__right"
  }, right));
}

// Live mini PromptDrop preview reflecting current settings (DS hero component)
// Settings-driven live preview: re-renders instantly as sliders move and mirrors
// font size, previous-line opacity, reading width, alignment and text colour.
function MiniDrop({
  w = 264
}) {
  const pd = window.usePD();
  const s = pd.settings || {};
  const all = (pd.readLines || []).filter(l => !l.pause).map(l => l.t).filter(Boolean);
  const sample = all.length ? all : ["Your script preview appears here", "as you adjust the settings", "the current line stays bright", "and neighbouring lines dim"];
  const cur = Math.min(2, sample.length - 1);
  const h = Math.round(w * 0.86);
  const scale = w / 640;
  const fs = Math.max(11, (s.fontSize || 38) * scale);
  const adj = Math.max(0, Math.min(1, (s.adjacentOpacity != null ? s.adjacentOpacity : 42) / 100));
  const left = s.align === "Left",
    right = s.align === "Right";
  const align = left ? "left" : right ? "right" : "center";
  const widthPct = Math.max(40, Math.min(100, s.width || 64));
  const colour = s.textColour || "#F4F4F5";
  const win = sample.slice(Math.max(0, cur - 2), cur + 3);
  const base = Math.max(0, cur - 2);
  return React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, React.createElement("div", {
    style: {
      width: w,
      height: h,
      background: "#000",
      border: "1px solid rgba(255,255,255,.14)",
      borderRadius: 28,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 7%"
    }
  }, React.createElement("div", {
    style: {
      width: widthPct + "%",
      display: "flex",
      flexDirection: "column",
      alignItems: left ? "flex-start" : right ? "flex-end" : "center",
      gap: fs * 0.5
    }
  }, win.map((t, i) => {
    const isCur = base + i === cur;
    return React.createElement("div", {
      key: i,
      style: {
        fontSize: isCur ? fs : fs * 0.78,
        opacity: isCur ? 1 : adj,
        color: isCur ? colour : "#F4F4F5",
        textAlign: align,
        lineHeight: 1.3,
        fontWeight: isCur ? 700 : 500,
        width: "100%",
        transition: "font-size .1s linear, opacity .1s linear"
      }
    }, t);
  }))));
}
window.PDLogo = PDLogo;
window.PDSidebar = Sidebar;
window.PDTopbar = Topbar;
window.PDMiniDrop = MiniDrop;
; /* appscreens.jsx */
// PromptDrop, control app screens, fully wired to the real store (no mock data).
const I2 = window.PDIcons;
const {
  useState: useS,
  useRef: useR
} = React;
function pdWords(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}
function metaFor(pd, s) {
  const w = pdWords(s.body);
  return w + " words · " + pd.fmtClock(pd.readTimeSec(s.body, pd.settings.wpm));
}

// ---- local AI rewrites (real, deterministic text transforms, no network) ----
function aiRewrite(kind, text) {
  let t = text || "";
  if (kind === "shorten") {
    t = t.replace(/\b(just|really|very|actually|basically|literally|kind of|sort of|you know|i mean|honestly|simply|that)\b ?/gi, "").replace(/[ \t]{2,}/g, " ").replace(/ ([,.;:])/g, "$1");
  } else if (kind === "punchier") {
    t = t.replace(/([^.!?\n]{55,}?),\s+/g, "$1.\n"); // break long clauses into lines
    t = t.replace(/\b(in order to)\b/gi, "to").replace(/\b(at this point in time)\b/gi, "now");
  } else if (kind === "casual") {
    const map = {
      "do not": "don't",
      "does not": "doesn't",
      "did not": "didn't",
      "I am": "I'm",
      "it is": "it's",
      "you are": "you're",
      "we are": "we're",
      "they are": "they're",
      "cannot": "can't",
      "will not": "won't",
      "that is": "that's",
      "there is": "there's",
      "I will": "I'll",
      "you will": "you'll",
      "let us": "let's"
    };
    Object.keys(map).forEach(a => {
      t = t.replace(new RegExp("\\b" + a + "\\b", "g"), map[a]);
    });
  }
  return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ============ DASHBOARD (minimal, real) ============
function Dashboard() {
  const pd = window.usePD();
  const a = pd.active;
  const others = a ? pd.scripts.filter(s => s.id !== a.id).slice(0, 3) : pd.scripts.slice(0, 3);
  const recentTakes = pd.takes.slice(0, 2);
  const pasteScript = async () => {
    let txt = "";
    try {
      txt = await navigator.clipboard.readText();
    } catch (e) {}
    if (txt && txt.trim()) pd.newScript({
      title: "Pasted script",
      body: txt,
      tag: "Draft"
    });
    pd.setAppView("studio");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 780,
      paddingTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "A teleprompter that lives beside your camera"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: "-.03em",
      lineHeight: 1.05,
      marginBottom: 26
    }
  }, "Keep your eyes", /*#__PURE__*/React.createElement("br", null), "on the lens."), a ? /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      alignItems: "flex-start",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Current script"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "-.01em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, a.title || "Untitled script"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      fontFamily: "var(--font-mono)"
    }
  }, metaFor(pd, a))), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      flex: "none"
    }
  }, window.promptdrop && window.promptdrop.overlay && /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--lg",
    title: "Float a private prompt over any app (Studio Pro)",
    onClick: () => pd.requireFeature("desktopOverlay", () => window.promptdrop.overlay.toggle ? window.promptdrop.overlay.toggle() : window.promptdrop.overlay.open())
  }, /*#__PURE__*/React.createElement(I2.move, {
    size: 16
  }), " Float overlay"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--launch btn--lg",
    onClick: () => pd.openLive(),
    disabled: pd.wordCount(a.body) === 0
  }, /*#__PURE__*/React.createElement(I2.rocket, {
    size: 18
  }), " Launch")))) : /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      marginBottom: 16,
      textAlign: "center",
      padding: 36
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 6
    }
  }, "No scripts yet"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 14
    }
  }, "Paste or write your first script to launch PromptDrop.")), /*#__PURE__*/React.createElement("div", {
    className: "grid-3",
    style: {
      marginBottom: others.length ? 28 : 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "card card--pad card--int",
    onClick: () => pd.setAppView("studio"),
    style: {
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      background: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--blue-tint)",
      color: "var(--blue-400)",
      borderColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(I2.pen, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "Edit script")), /*#__PURE__*/React.createElement("button", {
    className: "card card--pad card--int",
    onClick: pasteScript,
    style: {
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      background: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--violet-tint)",
      color: "var(--violet-400)",
      borderColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(I2.type, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "Paste a script")), /*#__PURE__*/React.createElement("button", {
    className: "card card--pad card--int",
    onClick: () => {
      pd.newScript();
      pd.setAppView("studio");
    },
    style: {
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      background: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--green-tint)",
      color: "var(--green-400)",
      borderColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "New script"))), others.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-secondary)"
    }
  }, "Recent scripts"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => pd.setAppView("library")
  }, "Library ", /*#__PURE__*/React.createElement(I2.chevronRight, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 8
    }
  }, others.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "card card--int",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px"
    },
    onClick: () => pd.openScript(s.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--surface-raised)",
      color: "var(--text-muted)",
      flex: "none",
      width: 34,
      height: 34
    }
  }, /*#__PURE__*/React.createElement(I2.pen, {
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, s.title), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, metaFor(pd, s), " \xB7 ", pd.relTime(s.updated))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: e => {
      e.stopPropagation();
      pd.setActive(s.id);
      pd.openLive();
    }
  }, "Launch"))))), recentTakes.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-secondary)"
    }
  }, "Recent recordings"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => pd.setAppView("review")
  }, "All takes ", /*#__PURE__*/React.createElement(I2.chevronRight, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 8
    }
  }, recentTakes.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card card--int",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12
    },
    onClick: () => {
      pd.setCurrentTakeId(t.id);
      pd.setAppView("review");
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 40,
      borderRadius: 8,
      background: "linear-gradient(135deg,#1C1C21,#0A0A0B)",
      border: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(I2.play, {
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, t.title), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, pd.fmtClock(t.dur), " \xB7 ", pd.relTime(t.created))))))));
}

// ============ SCRIPT STUDIO (real list + editor + AI) ============
function ScriptStudio() {
  const pd = window.usePD();
  const a = pd.active;
  const [q, setQ] = useS("");
  const [undo, setUndo] = useS(null);
  const taRef = useR(null);
  if (!a) return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      textAlign: "center",
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      margin: "0 auto 14px",
      width: 48,
      height: 48,
      background: "var(--surface-raised)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(I2.pen, {
    size: 20
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 6
    }
  }, "No scripts yet"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 14,
      marginBottom: 18
    }
  }, "Create one to start writing."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    style: {
      margin: "0 auto"
    },
    onClick: () => pd.newScript()
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }), " New script")));
  const words = pdWords(a.body);
  const secs = pd.readTimeSec(a.body, pd.settings.wpm);
  const list = pd.scripts.filter(s => !q || s.title.toLowerCase().includes(q.toLowerCase()) || (s.body || "").toLowerCase().includes(q.toLowerCase()));
  const insertPause = () => {
    const ta = taRef.current;
    const pos = ta ? ta.selectionStart : a.body.length;
    const before = a.body.slice(0, pos),
      after = a.body.slice(pos);
    pd.setScriptText(before.replace(/\s*$/, "") + "\n\n[ pause ]\n\n" + after.replace(/^\s*/, ""));
  };
  const doAI = kind => {
    if (!pd.requireFeature("aiRewrite")) return;
    setUndo(a.body);
    pd.setScriptText(aiRewrite(kind, a.body));
  };
  const exportTxt = () => {
    const blob = new Blob([a.body || ""], {
      type: "text/plain"
    });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = (a.title || "script").replace(/\s+/g, "-").toLowerCase() + ".txt";
    el.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "240px minmax(360px,1fr) 300px",
      height: "100%",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      borderRight: "1px solid var(--divider)",
      padding: 16,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Scripts"), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "New script",
    onClick: () => pd.newScript()
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "input-icon",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(I2.search, {
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Search\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 2
    }
  }, list.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: "navitem " + (s.id === a.id ? "navitem--active" : ""),
    style: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
      padding: "9px 10px"
    },
    onClick: () => pd.setActive(s.id)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, s.fav && /*#__PURE__*/React.createElement(I2.star, {
    size: 12,
    style: {
      color: "var(--amber-400)"
    }
  }), s.title || "Untitled"), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, metaFor(pd, s)))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      padding: "8px 10px"
    }
  }, "No matches."))), /*#__PURE__*/React.createElement("main", {
    style: {
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      padding: "12px 24px",
      borderBottom: "1px solid var(--divider)",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: insertPause
  }, /*#__PURE__*/React.createElement(I2.pause, {
    size: 14
  }), " Pause"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => pd.toggleFav(a.id)
  }, /*#__PURE__*/React.createElement(I2.star, {
    size: 14,
    style: a.fav ? {
      color: "var(--amber-400)"
    } : null
  }), " ", a.fav ? "Favourited" : "Favourite"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => pd.duplicateScript(a.id)
  }, /*#__PURE__*/React.createElement(I2.copy, {
    size: 14
  }), " Duplicate"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: exportTxt
  }, /*#__PURE__*/React.createElement(I2.download, {
    size: 14
  }), " Export")), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge--success"
  }, /*#__PURE__*/React.createElement("i", null), " Saved"), pd.scripts.length > 1 && /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      color: "var(--red-400)"
    },
    onClick: () => {
      if (confirm("Delete this script?")) pd.deleteScript(a.id);
    }
  }, /*#__PURE__*/React.createElement(I2.trash, {
    size: 14
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      width: "100%",
      margin: "0 auto",
      flex: 1,
      boxSizing: "border-box",
      padding: "32px 28px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: a.title,
    onChange: e => pd.setScriptTitle(e.target.value),
    placeholder: "Script title",
    style: {
      background: "none",
      border: "none",
      outline: "none",
      color: "var(--text-primary)",
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: "-.02em",
      width: "100%",
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      marginBottom: 22
    }
  }, words, " words \xB7 ~", pd.fmtClock(secs), " at ", pd.settings.wpm, " wpm"), /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: a.body,
    onChange: e => pd.setScriptText(e.target.value),
    placeholder: "Write or paste your script here. Leave a blank line for a breath, or type [ pause ] for a hold.",
    style: {
      width: "100%",
      minHeight: 360,
      background: "none",
      border: "none",
      outline: "none",
      resize: "none",
      color: "var(--text-primary)",
      fontSize: 17,
      lineHeight: 1.75,
      fontFamily: "var(--font-sans)"
    }
  }))), /*#__PURE__*/React.createElement("aside", {
    style: {
      borderLeft: "1px solid var(--divider)",
      padding: 20,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--accent card--pad",
    style: {
      background: "linear-gradient(150deg, rgba(139,124,255,.12), rgba(76,141,255,.06))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(I2.sparkles, {
    size: 16,
    style: {
      color: "var(--violet-400)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, "Rewrite")), /*#__PURE__*/React.createElement("p", {
    className: "sec",
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      marginBottom: 12
    }
  }, "Tighten or relax your script. Applied to the draft, undo anytime."), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm",
    onClick: () => doAI("shorten")
  }, "Shorten"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm",
    onClick: () => doAI("punchier")
  }, "Punchier"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm",
    onClick: () => doAI("casual")
  }, "Casual"), undo != null && /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => {
      pd.setScriptText(undo);
      setUndo(null);
    }
  }, "Undo"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Quick settings"), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, "Scroll speed"), /*#__PURE__*/React.createElement("div", {
    className: "setrow__control"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, pd.settings.wpm, " wpm"))), /*#__PURE__*/React.createElement("input", {
    className: "slider",
    style: {
      width: "100%",
      backgroundSize: `${(pd.settings.wpm - 60) / 200 * 100}% 100%`,
      margin: "4px 0 12px"
    },
    type: "range",
    min: "60",
    max: "260",
    value: pd.settings.wpm,
    onChange: e => pd.setSetting("wpm", +e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, "Pacing")), /*#__PURE__*/React.createElement(Seg, {
    opts: ["Follow my voice", "Steady speed"],
    value: pd.settings.pacing,
    onPick: v => {
      if (v === "Follow my voice" && !pd.requireFeature("voiceFollow")) return;
      pd.setSetting("pacing", v);
    },
    block: true,
    style: {
      marginTop: 8
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Preview"), /*#__PURE__*/React.createElement(window.PDMiniDrop, {
    w: 264
  }))));
}

// ============ PROMPT SETTINGS ============
function PromptSettings() {
  const pd = window.usePD();
  const s = pd.settings;
  const set = pd.setSetting;
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: 32,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Text",
    icon: I2.type
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Font size",
    sub: "Current line"
  }, /*#__PURE__*/React.createElement(Range, {
    min: 24,
    max: 72,
    v: s.fontSize,
    onChange: v => set("fontSize", v),
    suffix: "px"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Text colour"
  }, /*#__PURE__*/React.createElement(Swatches, {
    v: s.textColour,
    onPick: c => set("textColour", c)
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Previous line opacity"
  }, /*#__PURE__*/React.createElement(Range, {
    min: 10,
    max: 70,
    v: s.adjacentOpacity,
    onChange: v => set("adjacentOpacity", v),
    suffix: "%"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Reading width"
  }, /*#__PURE__*/React.createElement(Range, {
    min: 40,
    max: 100,
    v: s.width,
    onChange: v => set("width", v),
    suffix: "%"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Alignment"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Left", "Centre", "Right"],
    value: s.align,
    onPick: v => set("align", v)
  }))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Motion & pacing",
    icon: I2.bolt
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Scroll speed",
    sub: `${s.wpm} words per minute`
  }, /*#__PURE__*/React.createElement(Range, {
    min: 60,
    max: 260,
    v: s.wpm,
    onChange: v => set("wpm", v),
    suffix: " wpm"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Pacing",
    sub: "How the prompter keeps up"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Follow my voice", "Steady speed"],
    value: s.pacing,
    onPick: v => {
      if (v === "Follow my voice" && !pd.requireFeature("voiceFollow")) return;
      set("pacing", v);
    }
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Countdown",
    sub: "Before reading starts"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Off", "3s", "5s"],
    value: s.countdown === 0 ? "Off" : s.countdown + "s",
    onPick: v => set("countdown", v === "Off" ? 0 : parseInt(v))
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Smooth scroll",
    k: "smoothScroll"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Pause at markers",
    k: "pauseAtMarkers"
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Character",
    icon: I2.sparkles
  }, /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Show character",
    k: "showCharacter"
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Intensity"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Off", "Quiet", "Normal", "Expressive"],
    value: s.characterIntensity,
    onPick: v => set("characterIntensity", v)
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Reduced motion",
    k: "reducedMotion"
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Recording",
    icon: I2.video
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Resolution"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["720p", "1080p", "4K"],
    value: s.resolution,
    onPick: v => set("resolution", v)
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Auto-record after countdown",
    k: "autoRecord"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Live preview"), /*#__PURE__*/React.createElement(window.PDMiniDrop, {
    w: 280
  })));
}
function SettingsGroup({
  title,
  icon: Ico,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    size: 16,
    style: {
      color: "var(--accent-primary)"
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, title)), children);
}
function Row({
  label,
  sub,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    className: "setrow__sub"
  }, sub)), /*#__PURE__*/React.createElement("div", {
    className: "setrow__control"
  }, children));
}
function SwitchRow({
  label,
  k
}) {
  const pd = window.usePD();
  return /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, label), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!pd.settings[k],
    onChange: e => pd.setSetting(k, e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "track"
  })));
}
function Range({
  v,
  min = 0,
  max = 100,
  onChange,
  suffix = ""
}) {
  const pct = (v - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "slider",
    style: {
      width: 150,
      backgroundSize: `${pct}% 100%`
    },
    type: "range",
    min: min,
    max: max,
    value: v,
    onChange: e => onChange && onChange(+e.target.value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      width: 56,
      textAlign: "right"
    }
  }, v, suffix));
}
function Seg({
  opts,
  value,
  onPick,
  block,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "seg" + (block ? " seg--block" : ""),
    style: style
  }, opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    className: o === value ? "on" : "",
    onClick: () => onPick && onPick(o)
  }, o)));
}
function Swatches({
  v,
  onPick
}) {
  const cols = ["#F4F4F5", "#4C8DFF", "#8B7CFF", "#2FCF8F", "#F5A524"];
  return /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    onClick: () => onPick && onPick(c),
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: c,
      boxShadow: c === v ? "0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-primary)" : "inset 0 0 0 1px var(--border-subtle)",
      cursor: "pointer"
    }
  })));
}

// ============ LIBRARY (real CRUD) ============
function Library() {
  const pd = window.usePD();
  const [q, setQ] = useS("");
  const [tag, setTag] = useS("All");
  const tags = ["All", ...Array.from(new Set(pd.scripts.map(s => s.tag).filter(Boolean)))];
  let list = pd.scripts;
  if (tag !== "All") list = list.filter(s => s.tag === tag);
  if (q) list = list.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || (s.body || "").toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "page page--wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 18,
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "input-icon",
    style: {
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(I2.search, {
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Search scripts\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => pd.newScript()
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }), " New script")), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: `tag ${t === tag ? "tag--active" : ""}`,
    onClick: () => setTag(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, list.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "card card--pad card--int",
    onClick: () => pd.openScript(s.id),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: 132
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge--accent"
  }, s.tag || "Draft"), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "Favourite",
    onClick: e => {
      e.stopPropagation();
      pd.toggleFav(s.id);
    }
  }, /*#__PURE__*/React.createElement(I2.star, {
    size: 15,
    style: s.fav ? {
      color: "var(--amber-400)"
    } : null
  })), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "Duplicate",
    onClick: e => {
      e.stopPropagation();
      pd.duplicateScript(s.id);
    }
  }, /*#__PURE__*/React.createElement(I2.copy, {
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "Delete",
    onClick: e => {
      e.stopPropagation();
      if (pd.scripts.length > 1 && confirm("Delete “" + s.title + "”?")) pd.deleteScript(s.id);
    }
  }, /*#__PURE__*/React.createElement(I2.trash, {
    size: 15
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      marginTop: "auto"
    }
  }, s.title || "Untitled"), /*#__PURE__*/React.createElement("div", {
    className: "between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, metaFor(pd, s)), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, pd.relTime(s.updated))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--launch btn--sm",
    onClick: e => {
      e.stopPropagation();
      pd.setActive(s.id);
      pd.openLive();
    },
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(I2.rocket, {
    size: 14
  }), " Launch"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--ghost card--int",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 132,
      color: "var(--text-muted)",
      gap: 8
    },
    onClick: () => pd.newScript()
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }), " New script")));
}

// ============ TAKE REVIEW (real recordings) ============
function TakeReview() {
  const pd = window.usePD();
  const takes = pd.takes;
  const current = takes.find(t => t.id === pd.currentTakeId) || takes[0];
  if (!takes.length) return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      textAlign: "center",
      padding: 48
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      margin: "0 auto 14px",
      width: 48,
      height: 48,
      background: "var(--surface-raised)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(I2.video, {
    size: 20
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 6
    }
  }, "No takes yet"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 14,
      marginBottom: 18
    }
  }, "Launch the prompter with recording on, and your takes appear here, saved on this Mac."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--launch",
    onClick: () => pd.openLive(),
    style: {
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(I2.rocket, {
    size: 16
  }), " Launch & record")));
  const sizeMB = current.size ? (current.size / 1048576).toFixed(1) + " MB" : "-";
  return /*#__PURE__*/React.createElement("div", {
    className: "page page--wide",
    style: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-elevated)",
      background: "#000"
    }
  }, current.url ? /*#__PURE__*/React.createElement("video", {
    src: current.url,
    controls: true,
    style: {
      width: "100%",
      display: "block",
      aspectRatio: "16/9",
      background: "#000"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16/9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)"
    }
  }, "Video unavailable")), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, /*#__PURE__*/React.createElement(Stat, {
    k: "Duration",
    v: pd.fmtClock(current.dur)
  }), /*#__PURE__*/React.createElement(Stat, {
    k: "Recorded",
    v: pd.relTime(current.created)
  }), /*#__PURE__*/React.createElement(Stat, {
    k: "Size",
    v: sizeMB
  })), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 10
    }
  }, current.url && /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: current.url,
    download: (current.title || "take").replace(/\s+/g, "-").toLowerCase() + ".webm"
  }, /*#__PURE__*/React.createElement(I2.download, {
    size: 16
  }), " Download"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary",
    onClick: () => {
      pd.openLive();
    }
  }, "Retake"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      color: "var(--red-400)"
    },
    onClick: () => {
      if (confirm("Delete this take permanently?")) pd.deleteTake(current.id);
    }
  }, /*#__PURE__*/React.createElement(I2.trash, {
    size: 16
  }), " Delete"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "All takes \xB7 ", takes.length), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 8
    }
  }, takes.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card card--int " + (t.id === current.id ? "card--accent" : ""),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 10
    },
    onClick: () => pd.setCurrentTakeId(t.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 36,
      borderRadius: 6,
      background: "linear-gradient(135deg,#1C1C21,#0A0A0B)",
      border: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(I2.play, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.title), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, pd.fmtClock(t.dur), " \xB7 ", pd.relTime(t.created))))))));
}
function Stat({
  k,
  v,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-.02em",
      marginTop: 4,
      color: tone === "success" ? "var(--green-400)" : "var(--text-primary)",
      fontFamily: "var(--font-mono)"
    }
  }, v));
}

// ============ SETTINGS (preferences) ============
const SHORTCUTS = [["Space", "Pause / resume"], ["Esc", "Exit live mode"], ["⌘ ⇧ H", "Hide / private mode"]];
function Preferences() {
  const pd = window.usePD();
  const s = pd.settings;
  const set = pd.setSetting;
  const used = pd.takes.reduce((a, t) => a + (t.size || 0), 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Account",
    icon: I2.star
  }, /*#__PURE__*/React.createElement(Row, {
    label: pd.displayName,
    sub: pd.user ? "Signed in" : "Synced to your PromptDrop account"
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar avatar--accent"
  }, pd.initials)), /*#__PURE__*/React.createElement(Row, {
    label: "Plan",
    sub: pd.plan === "free" ? `${pd.scripts.length}/${pd.scriptLimit} scripts · ${pd.takes.length}/${pd.takeLimit} takes` : "All features unlocked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge " + (pd.plan === "free" ? "" : "badge--accent")
  }, /*#__PURE__*/React.createElement("i", null), " ", pd.planName), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm",
    onClick: () => pd.setAppView("pricing")
  }, "See plans"))), !pd.user && /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      marginTop: 4
    }
  }, "Accounts and cloud sync activate when a backend is connected. Until then PromptDrop runs fully on this device.")), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Accessibility",
    icon: I2.sparkles
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Character feedback",
    sub: "The line-art assistant"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Off", "Quiet", "Normal", "Expressive"],
    value: s.characterIntensity,
    onPick: v => set("characterIntensity", v)
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Reduced motion",
    k: "reducedMotion"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "High contrast",
    k: "highContrast"
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Large reading text",
    k: "largeText"
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Keyboard shortcuts",
    icon: I2.bolt
  }, SHORTCUTS.map(([k, label]) => /*#__PURE__*/React.createElement("div", {
    className: "setrow",
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "setrow__control"
  }, /*#__PURE__*/React.createElement("kbd", {
    className: "pd-kbd"
  }, k))))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Data & storage",
    icon: I2.download
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Recordings",
    sub: "Kept on this Mac, never uploaded"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13
    }
  }, pd.takes.length, " take", pd.takes.length === 1 ? "" : "s", " \xB7 ", (used / 1048576).toFixed(1), " MB")), /*#__PURE__*/React.createElement(Row, {
    label: "Scripts"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13
    }
  }, pd.scripts.length)), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      color: "var(--red-400)"
    },
    onClick: () => {
      if (pd.takes.length && confirm("Delete all local recordings? This cannot be undone.")) pd.clearTakes();
    }
  }, "Clear recordings"))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "About",
    icon: I2.star
  }, /*#__PURE__*/React.createElement(Row, {
    label: "PromptDrop",
    sub: "Synced to your PromptDrop account"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge--success"
  }, /*#__PURE__*/React.createElement("i", null), " v1.6")))));
}

// ============ PRICING ============
const PLAN_BENEFITS = {
  free: ["Camera-level teleprompter", "Manual speed, size & colour", "Up to 3 scripts · 5 takes", "Local recordings & basic review", "No account needed"],
  creator_pro: ["Everything in Free", "Unlimited scripts & takes", "AI rewrite tools", "Voice-follow & hybrid pace", "Advanced review & captions", "Cloud sync (when connected)"],
  studio_pro: ["Everything in Creator Pro", "Desktop overlay over any app", "Meeting Mode & private prompt", "Global shortcuts", "Long-form scripts", "Priority support"]
};
function Pricing() {
  const pd = window.usePD();
  const P = window.PD_PLANS,
    order = window.PD_PLAN_ORDER;
  const claim = id => {
    if (id === "free") {
      pd.setPlan("free");
      return;
    }
    if (id === "team" || id === "enterprise") return;
    if (confirm("Payment isn’t connected yet.\n\nActivate " + P[id].name + " locally for testing? No charge, this is a local switch until billing is wired.")) pd.setPlan(id);
  };
  const Card = (id, feat) => {
    const p = P[id];
    const active = pd.plan === id;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      className: "card card--pad " + (p.badge ? "card--accent" : ""),
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        borderColor: active ? "var(--accent-primary)" : undefined
      }
    }, p.badge && /*#__PURE__*/React.createElement("span", {
      className: "badge badge--accent",
      style: {
        position: "absolute",
        top: -11,
        left: 20
      }
    }, p.badge), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 16
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        fontSize: 13
      }
    }, p.blurb)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: "-.03em"
      }
    }, p.price), p.cycle && /*#__PURE__*/React.createElement("span", {
      className: "muted",
      style: {
        fontSize: 14
      }
    }, p.cycle)), p.priceYear && /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        fontSize: 12,
        marginTop: -8
      }
    }, "or ", p.priceYear), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        margin: "4px 0 8px",
        flex: 1
      }
    }, feat.map((t, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: "flex",
        gap: 8,
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, /*#__PURE__*/React.createElement(I2.check, {
      size: 16,
      style: {
        color: "var(--success)",
        flex: "none",
        marginTop: 1
      }
    }), t))), active ? /*#__PURE__*/React.createElement("button", {
      className: "btn btn--secondary",
      disabled: true,
      style: {
        justifyContent: "center"
      }
    }, "Current plan") : /*#__PURE__*/React.createElement("button", {
      className: "btn " + (p.badge ? "btn--primary" : "btn--secondary"),
      style: {
        justifyContent: "center"
      },
      onClick: () => claim(id)
    }, p.cta));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page page--wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Plans & pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      letterSpacing: "-.03em",
      marginBottom: 8
    }
  }, "Choose how you want to prompt."), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 15,
      maxWidth: 60 + "ch",
      marginBottom: 24,
      lineHeight: 1.55
    }
  }, "Start free with the camera-level teleprompter. Upgrade when you need AI, voice-follow, take review, cloud sync, desktop overlay and meeting mode."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: 16
    }
  }, order.map(id => Card(id, PLAN_BENEFITS[id]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: 16,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Team ", /*#__PURE__*/React.createElement("span", {
    className: "badge",
    style: {
      marginLeft: 6
    }
  }, "Coming soon")), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 2
    }
  }, "Shared library, brand kits, roles. $25/user/mo.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    disabled: true
  }, "Join waitlist")), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad",
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Enterprise"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 2
    }
  }, "SSO, admin, custom retention.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, "Contact sales"))), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 12,
      marginTop: 18
    }
  }, "Payment isn\u2019t connected yet, upgrades activate locally for testing until billing is wired. No card is charged."));
}

// ============ UPGRADE SHEET ============
function UpgradeSheet() {
  const pd = window.usePD();
  const f = pd.upsell;
  if (!f) return null;
  const copy = window.PD_UPGRADE_COPY[f] || ["This is a paid feature.", ""];
  const req = window.PD_requiredPlan(f) || "creator_pro";
  const plan = window.PD_PLANS[req] || {};
  const close = () => pd.setUpsell(null);
  return /*#__PURE__*/React.createElement("div", {
    onClick: close,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 4000,
      background: "var(--overlay-dim, rgba(5,5,6,.72))",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "card",
    style: {
      width: "min(460px,94vw)",
      margin: 24,
      padding: 24,
      borderRadius: "var(--radius-xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--violet-tint)",
      color: "var(--violet-400)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(I2.sparkles, {
    size: 18
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, copy[0])), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 14,
      lineHeight: 1.55,
      marginBottom: 18
    }
  }, copy[1]), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    style: {
      justifyContent: "center"
    },
    onClick: () => {
      close();
      pd.setAppView("pricing");
    }
  }, "See plans"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary",
    style: {
      justifyContent: "center"
    },
    onClick: () => {
      pd.setPlan(req);
      close();
    }
  }, "Use ", plan.name, " locally (testing)"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      justifyContent: "center"
    },
    onClick: close
  }, "Not now")), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      fontSize: 11,
      textAlign: "center",
      marginTop: 12
    }
  }, "Payment isn\u2019t wired yet, local activation is for testing only.")));
}
Object.assign(window, {
  PDDashboard: Dashboard,
  PDScriptStudio: ScriptStudio,
  PDPromptSettings: PromptSettings,
  PDLibrary: Library,
  PDTakeReview: TakeReview,
  PDPreferences: Preferences,
  PDPricing: Pricing,
  PDUpgradeSheet: UpgradeSheet
});
; /* live-real.jsx */
// PromptDrop, LIVE prompting surface, prototype design wired to the REAL engine.
// Real camera, real MediaRecorder, real voice-follow (Vosk via the desktop bridge,
// Web Speech fallback) driving the reader. Same visual design as the prototype.
const {
  useState: useStateL,
  useEffect: useEffectL,
  useRef: useRefL,
  useCallback: useCbL
} = React;

/* ---- matrix-verified no-jump tracker (same engine as everywhere) ---- */
const RT_CONF = {
  highMs: 2200,
  medMs: 4800,
  lowMs: 9000
};
function rtTracker(words) {
  return {
    words,
    ptr: 0,
    lastMatch: 0,
    look: 16,
    reset(n) {
      this.ptr = 0;
      this.lastMatch = n;
    },
    confidence(n) {
      const s = n - this.lastMatch;
      return s < RT_CONF.highMs ? 'high' : s < RT_CONF.medMs ? 'medium' : s < RT_CONF.lowMs ? 'low' : 'lost';
    },
    feed(heard, n) {
      if (!heard || !heard.length || !this.words.length) return 0;
      const st = this.ptr;
      for (const h of heard.slice(-8)) {
        if (h.length < 2) continue;
        const lim = Math.min(this.words.length, this.ptr + this.look);
        for (let i = this.ptr; i < lim; i++) {
          if (this.words[i].norm === h) {
            this.ptr = i + 1;
            this.lastMatch = n;
            break;
          }
        }
      }
      return this.ptr - st;
    }
  };
}
const LT_STYLE_ID = "pd-live-styles";
const LT_CSS = `
.lt-scene { position:absolute; inset:0; overflow:hidden; display:flex; flex-direction:column; align-items:center; font-family:var(--font-sans); color:var(--text-primary); user-select:none; }
.lt-feed { position:absolute; inset:0; background:radial-gradient(120% 90% at 50% 6%, #1b1f27 0%, #121319 44%, #08090d 100%); }
.lt-cam { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 40%; transform:scaleX(-1); filter:brightness(.84) contrast(1.02); }
.lt-camveil { position:absolute; inset:0; pointer-events:none; background:radial-gradient(120% 95% at 50% 4%, rgba(8,9,13,.30) 0%, rgba(8,9,13,.50) 52%, rgba(5,6,9,.82) 100%); }
.lt-feedlabel { position:absolute; bottom:18px; left:20px; font-family:var(--font-mono); font-size:12px; letter-spacing:.04em; color:rgba(255,255,255,.6); display:flex; align-items:center; gap:8px; z-index:2; }
.lt-feedlabel i { width:7px;height:7px;border-radius:50%; background:var(--recording); box-shadow:0 0 8px var(--rec-glow); }
.lt-notch { position:absolute; top:0; left:50%; transform:translateX(-50%); width:150px; height:20px; background:#000; border-radius:0 0 14px 14px; }
.lt-top { position:absolute; top:0; left:0; right:0; display:flex; justify-content:center; pointer-events:none; }
.lt-top > * { pointer-events:auto; }
.lt-bottom { position:absolute; bottom:0; left:0; right:0; display:flex; justify-content:center; pointer-events:none; }
.lt-bottom > * { pointer-events:auto; }
.lt-drop { position:relative; background:#000; border:1px solid rgba(255,255,255,.1); border-top:none; border-radius:0 0 var(--radius-promptdrop) var(--radius-promptdrop); box-shadow:0 36px 90px -24px rgba(0,0,0,.92), 0 0 0 1px rgba(255,255,255,.05), inset 0 1px 0 rgba(255,255,255,.06); display:flex; flex-direction:column; align-items:center; overflow:hidden; transition: width var(--dur-expand) var(--ease-drop), height var(--dur-expand) var(--ease-drop), box-shadow var(--dur-slow) var(--ease-out), opacity var(--dur-standard) var(--ease-out); }
.lt-drop[data-rec="1"] { box-shadow:0 36px 90px -24px rgba(0,0,0,.92), var(--glow-recording), inset 0 1px 0 rgba(255,255,255,.06); }
.lt-drop[data-hidden="1"] { opacity:0; pointer-events:none; }
.lt-dots { display:flex; gap:12px; padding-top:18px; flex:none; }
.lt-dots i { width:8px;height:8px;border-radius:50%;background:#F4F4F5;opacity:.92; }
.lt-body { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:22px; text-align:center; box-sizing:border-box; min-height:0; }
.lt-title { font-size:17px; font-weight:600; letter-spacing:-.01em; }
.lt-status { font-family:var(--font-mono); font-size:11px; letter-spacing:.09em; text-transform:uppercase; color:var(--text-muted); display:inline-flex; align-items:center; gap:8px; }
.lt-status--rec { color:#FF8077; }
.lt-status--rec::before { content:""; width:7px;height:7px;border-radius:50%; background:var(--recording); box-shadow:0 0 8px var(--rec-glow); animation:lt-pulse var(--pulse-period) infinite; }
@keyframes lt-pulse { 0%,100%{opacity:1} 50%{opacity:.32} }
.lt-play { width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;background:#fff;color:#000; flex:none; display:flex;align-items:center;justify-content:center;transition:var(--transition-fast); box-shadow:0 8px 24px -6px rgba(0,0,0,.5); }
.lt-play:hover { transform:scale(1.06); } .lt-play:active{ transform:scale(.97); }
.lt-count { font-weight:700; letter-spacing:-.03em; line-height:1; font-variant-numeric:tabular-nums; animation:lt-countpop var(--dur-slow) var(--ease-out); }
@keyframes lt-countpop { from{ transform:scale(.7); opacity:0 } to{ transform:scale(1); opacity:1 } }
.lt-reader { position:relative; width:100%; flex:1; min-height:0; overflow:hidden; }
.lt-reader::before, .lt-reader::after { content:""; position:absolute; left:0; right:0; height:22%; z-index:2; pointer-events:none; }
.lt-reader::before { top:0; background:linear-gradient(180deg, #000, transparent); }
.lt-reader::after { bottom:0; background:linear-gradient(0deg, #000, transparent); }
.lt-track { position:absolute; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:0; transition:transform var(--dur-slow) var(--ease-out); will-change:transform; padding:0 4%; }
.lt-line { line-height:1.34; letter-spacing:-.01em; font-weight:500; transition:opacity var(--dur-standard), color var(--dur-standard); text-wrap:pretty; }
.lt-line[data-cur="1"] { color:var(--tp-current); font-weight:600; }
.lt-line[data-em="1"][data-cur="1"] { color:#fff; }
.lt-pausemark { display:flex; align-items:center; justify-content:center; gap:6px; }
.lt-pausemark i { width:4px;height:4px;border-radius:50%; background:var(--tp-far); }
.lt-progress { position:absolute; bottom:0; left:0; height:3px; background:var(--accent-primary); border-radius:0 3px 3px 0; transition:width var(--dur-slow) linear; }
.lt-pace { position:absolute; top:14px; right:16px; display:flex; align-items:center; gap:7px; font-family:var(--font-mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); }
.lt-pace .wave { display:flex; align-items:center; gap:2px; height:12px; }
.lt-pace .wave span { width:2px; background:var(--accent-primary); border-radius:2px; animation:lt-wave 1s ease-in-out infinite; }
.lt-pace .wave span:nth-child(2){animation-delay:.12s}.lt-pace .wave span:nth-child(3){animation-delay:.24s}.lt-pace .wave span:nth-child(4){animation-delay:.36s}
@keyframes lt-wave { 0%,100%{height:3px} 50%{height:12px} }
.lt-pace[data-mode="hold"] .wave span { animation:none; height:3px; background:var(--amber-500); }
.lt-msg { font-size:14px; color:var(--text-secondary); max-width:84%; line-height:1.5; }
.lt-actions { display:flex; gap:9px; flex-wrap:wrap; justify-content:center; }
.lt-btn { font-family:var(--font-sans); font-size:13px; font-weight:600; padding:9px 16px; border-radius:var(--radius-md); cursor:pointer; border:1px solid transparent; transition:var(--transition-fast); }
.lt-btn--primary { background:var(--accent-primary); color:#fff; } .lt-btn--primary:hover{ filter:brightness(1.08); }
.lt-btn--ghost { background:rgba(255,255,255,.06); color:var(--text-primary); border-color:rgba(255,255,255,.1); }
.lt-btn--ghost:hover { background:rgba(255,255,255,.12); }
.lt-statgrid { display:flex; gap:18px; margin:2px 0 4px; }
.lt-stat { text-align:center; } .lt-stat b{ display:block; font-family:var(--font-mono); font-size:20px; font-weight:700; letter-spacing:-.02em; }
.lt-stat span{ font-family:var(--font-mono); font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); }
.lt-privacy { position:relative; margin-top:26px; display:flex; align-items:center; gap:9px; padding:9px 14px; border-radius:var(--radius-pill); background:rgba(10,10,11,.82); border:1px solid rgba(255,255,255,.1); backdrop-filter:blur(10px); font-family:var(--font-mono); font-size:11px; letter-spacing:.05em; color:var(--text-secondary); cursor:pointer; }
.lt-privacy i { width:6px;height:6px;border-radius:50%; background:var(--text-muted); }
.lt-bar { position:relative; margin-bottom:20px; display:flex; align-items:center; gap:6px; padding:7px; border-radius:var(--radius-pill); background:rgba(10,10,11,.7); border:1px solid rgba(255,255,255,.08); backdrop-filter:blur(12px); box-shadow:0 12px 30px -10px rgba(0,0,0,.6); opacity:.55; transition:opacity var(--dur-fast); }
.lt-scene:hover .lt-bar { opacity:1; }
.lt-bar button { display:inline-flex; align-items:center; gap:7px; height:34px; padding:0 13px; border-radius:var(--radius-pill); border:none; background:transparent; color:var(--text-secondary); font-size:12.5px; font-weight:600; cursor:pointer; font-family:var(--font-sans); transition:var(--transition-fast); white-space:nowrap; }
.lt-bar button:hover { background:rgba(255,255,255,.08); color:var(--text-primary); }
.lt-bar .lt-bar__rec { color:#FF8077; } .lt-bar .lt-bar__sep{ width:1px; height:20px; background:rgba(255,255,255,.1); margin:0 2px; }
.lt-bar .lt-bar__kbd { font-family:var(--font-mono); font-size:10px; color:var(--text-muted); padding:2px 6px; border:1px solid rgba(255,255,255,.12); border-radius:5px; }
@media (prefers-reduced-motion: reduce){ .lt-drop,.lt-track,.lt-count,.lt-pace .wave span{ transition:none!important; animation:none!important; } }
`;
function ltStyles() {
  if (!document.getElementById(LT_STYLE_ID)) {
    const e = document.createElement("style");
    e.id = LT_STYLE_ID;
    e.textContent = LT_CSS;
    document.head.appendChild(e);
  }
}
const PlayG = React.createElement("svg", {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, React.createElement("polygon", {
  points: "7 4 20 12 7 20 7 4"
}));
function Wave() {
  return React.createElement("span", {
    className: "wave"
  }, [0, 1, 2, 3].map(i => React.createElement("span", {
    key: i
  })));
}
const fmtDur = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function LiveReader({
  lines,
  index,
  scale,
  s
}) {
  s = s || {};
  const anchor = 0.40,
    lh = 1.34;
  const wrapRef = useRefL(null);
  const [offset, setOffset] = useStateL(0);
  useEffectL(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cur = wrap.querySelector(`[data-i="${index}"]`);
    if (!cur) return;
    const vh = wrap.clientHeight;
    const target = cur.offsetTop + cur.offsetHeight / 2;
    setOffset(vh * anchor - target);
  }, [index, lines, scale, s.fontSize, s.width, s.align]);
  // live-driven from Prompt Settings
  const fs = (s.fontSize || 38) * scale;
  const adj = Math.max(0, Math.min(1, (s.adjacentOpacity != null ? s.adjacentOpacity : 42) / 100));
  const curColour = s.textColour || "#F4F4F5";
  const left = s.align === "Left";
  const widthPct = Math.max(40, Math.min(100, s.width || 64));
  const trackStyle = {
    transform: `translateY(${offset}px)`,
    maxWidth: widthPct + "%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: left ? "flex-start" : "center",
    textAlign: left ? "left" : "center"
  };
  return React.createElement("div", {
    className: "lt-reader",
    ref: wrapRef
  }, React.createElement("div", {
    className: "lt-track",
    style: trackStyle
  }, lines.map((ln, i) => {
    if (ln.pause) return React.createElement("div", {
      key: i,
      "data-i": i,
      className: "lt-line lt-pausemark",
      style: {
        height: fs * lh * 0.7
      }
    }, React.createElement("i"), React.createElement("i"), React.createElement("i"));
    const dist = Math.abs(i - index);
    const op = i === index ? 1 : dist === 1 ? adj : dist === 2 ? adj * 0.45 : adj * 0.18;
    const size = i === index ? fs : fs * 0.74;
    return React.createElement("div", {
      key: i,
      "data-i": i,
      "data-cur": i === index ? 1 : 0,
      "data-em": ln.emphasis ? 1 : 0,
      className: "lt-line",
      style: {
        opacity: op,
        fontSize: size,
        padding: `${fs * 0.22}px 0`,
        width: "100%",
        textAlign: left ? "left" : "center",
        color: i === index ? curColour : undefined
      }
    }, ln.t);
  })));
}
function LiveTake({
  frame = "mac",
  onReview,
  onExit
}) {
  ltStyles();
  const pd = window.usePD();
  const s = {
    ...pd.settings,
    showCharacter: pd.settings.showCharacter && pd.settings.characterIntensity !== "Off"
  };
  const lines = pd.readLines;
  const PChar = window.PromptDropDesignSystem_82c6c3.PromptCharacter;
  const [phase, setPhase] = useStateL("idle");
  const [count, setCount] = useStateL(s.countdown || 3);
  const [idx, setIdx] = useStateL(0);
  const [hidden, setHidden] = useStateL(false);
  const [pace, setPace] = useStateL("follow");
  const [voiceReady, setVoiceReady] = useStateL(false);
  const [voiceDead, setVoiceDead] = useStateL(false); // voice started but no words landing -> let steady carry it
  const lastAdvRef = useRefL(0);
  const recording = phase === "countdown" && s.autoRecord || phase === "prompting" || phase === "paused";
  const isPhone = frame === "phone";
  const scale = isPhone ? 0.62 : 1;

  // refs for the real engine
  const videoRef = useRefL(null);
  const streamRef = useRefL(null);
  const recRef = useRefL(null);
  const chunksRef = useRefL([]);
  const recStartRef = useRefL(0);
  const trackerRef = useRefL(null);
  const speechRef = useRefL(null);
  const offlineRef = useRefL(false);
  const idxRef = useRefL(0);
  const phaseRef = useRefL("idle");
  const [takeDur, setTakeDur] = useStateL(0);
  useEffectL(() => {
    idxRef.current = idx;
  }, [idx]);
  useEffectL(() => {
    phaseRef.current = phase;
  }, [phase]);

  // build word→line map for voice tracking (skip pause lines)
  const words = React.useMemo(() => {
    const w = [];
    lines.forEach((ln, li) => {
      if (ln.pause || !ln.t) return;
      ln.t.split(/\s+/).forEach(tok => {
        const norm = tok.toLowerCase().replace(/[^a-z0-9']/g, '');
        if (norm) w.push({
          norm,
          line: li
        });
      });
    });
    return w;
  }, [lines]);

  // ---- acquire camera + mic once, show real preview ----
  useEffectL(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {/* no camera/mic, the prompter still works */}
    })();
    return () => {
      cancelled = true;
      stopVoice();
      stopRecorder(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);
  const start = useCbL(() => {
    setPhase("countdown");
    setCount(s.countdown || 3);
    setIdx(0);
  }, [s.countdown]);
  const restart = useCbL(() => {
    setIdx(0);
    setPhase("countdown");
    setCount(s.countdown || 3);
  }, [s.countdown]);

  // countdown
  useEffectL(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      const t = setTimeout(() => setPhase("prompting"), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c - 1), 850);
    return () => clearTimeout(t);
  }, [phase, count]);

  // start/stop recording with the session
  useEffectL(() => {
    if (phase === "countdown" && s.autoRecord && !recRef.current) startRecorder();
    if (phase === "idle" || phase === "ready") stopRecorder(false);
  }, [phase, s.autoRecord]);

  // start/stop voice with prompting (Follow my voice)
  useEffectL(() => {
    if (phase === "prompting" && s.pacing === "Follow my voice") {
      lastAdvRef.current = performance.now();
      setVoiceDead(false);
      startVoice();
    } else {
      stopVoice();
      setVoiceDead(false);
    }
  }, [phase, s.pacing]);

  // Voice watchdog: if words stop landing for 6s, let steady scroll take over (never freeze).
  useEffectL(() => {
    if (phase !== "prompting" || s.pacing !== "Follow my voice" || !voiceReady) return;
    const iv = setInterval(() => {
      if (performance.now() - lastAdvRef.current > 6000) setVoiceDead(true);
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, s.pacing, voiceReady]);

  // STEADY mode (or no/stalled voice): timed auto-advance at wpm
  useEffectL(() => {
    if (phase !== "prompting") return;
    if (s.pacing === "Follow my voice" && voiceReady && !voiceDead) return; // live voice drives idx instead
    if (idx >= lines.length - 1) {
      const t = setTimeout(() => finish(), 1200);
      return () => clearTimeout(t);
    }
    const ln = lines[idx];
    const wcount = ln.pause ? 0 : ln.t.trim().split(/\s+/).filter(Boolean).length;
    const dwell = ln.pause ? s.pauseAtMarkers ? 850 : 300 : Math.max(750, wcount / s.wpm * 60000);
    const t = setTimeout(() => setIdx(i => i + 1), dwell);
    return () => clearTimeout(t);
  }, [phase, idx, s.wpm, s.pauseAtMarkers, lines, s.pacing, voiceReady, voiceDead]);

  // pace pill reflects real confidence in follow mode
  useEffectL(() => {
    if (phase !== "prompting" || s.pacing !== "Follow my voice") {
      setPace("follow");
      return;
    }
    const iv = setInterval(() => {
      const tr = trackerRef.current;
      if (!tr) {
        setPace("follow");
        return;
      }
      const c = tr.confidence(performance.now());
      setPace(c === "high" || c === "medium" ? "follow" : c === "low" ? "listen" : "hold");
    }, 400);
    return () => clearInterval(iv);
  }, [phase, s.pacing]);

  // keyboard
  useEffectL(() => {
    const onKey = e => {
      if (e.key === " ") {
        e.preventDefault();
        setPhase(p => p === "prompting" ? "paused" : p === "paused" ? "prompting" : p);
      } else if (e.key === "Escape") {
        onExit && onExit();
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setHidden(h => !h);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // ---- recording ----
  function startRecorder() {
    const stream = streamRef.current;
    if (!stream || !("MediaRecorder" in window)) return;
    chunksRef.current = [];
    try {
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm";
      recRef.current = new MediaRecorder(stream, {
        mimeType: mime
      });
    } catch (e) {
      try {
        recRef.current = new MediaRecorder(stream);
      } catch (e2) {
        recRef.current = null;
        return;
      }
    }
    recRef.current.ondataavailable = e => {
      if (e.data && e.data.size) chunksRef.current.push(e.data);
    };
    recStartRef.current = performance.now();
    recRef.current.start(1000);
  }
  function stopRecorder(saveIt) {
    const r = recRef.current;
    if (!r) return;
    recRef.current = null;
    try {
      r.onstop = () => {
        const dur = (performance.now() - recStartRef.current) / 1000;
        if (saveIt && chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, {
            type: "video/webm"
          });
          setTakeDur(dur);
          // persist the real recording into the app's library (IndexedDB)
          if (pd.addTake) pd.addTake({
            blob,
            dur,
            scriptId: pd.activeId,
            title: pd.scriptTitle || "Take"
          });
        }
        chunksRef.current = [];
      };
      r.stop();
    } catch (e) {}
  }

  // ---- voice ----
  function feedHeard(text) {
    const tr = trackerRef.current;
    if (!tr) return;
    const heard = (text || "").toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9']/g, "")).filter(Boolean);
    if (!heard.length) return;
    const adv = tr.feed(heard, performance.now());
    if (adv > 0) {
      lastAdvRef.current = performance.now();
      setVoiceDead(false);
    } // voice is alive again
    const w = words[Math.min(tr.ptr, words.length - 1)];
    if (w && phaseRef.current === "prompting") {
      if (w.line !== idxRef.current) {
        setIdx(w.line);
      }
    }
    if (tr.ptr >= words.length - 1) {
      setTimeout(() => {
        if (phaseRef.current === "prompting") finish();
      }, 900);
    }
  }
  async function startVoice() {
    if (speechRef.current || offlineRef.current) return;
    trackerRef.current = rtTracker(words);
    trackerRef.current.reset(performance.now());
    // offline Vosk via desktop bridge
    if (window.promptdrop && window.promptdrop.voice) {
      try {
        const res = await window.promptdrop.voice.start("en-US");
        if (res && res.ok) {
          const stream = streamRef.current || (await navigator.mediaDevices.getUserMedia({
            audio: true
          }));
          const Ctx = window.AudioContext || window.webkitAudioContext;
          const ctx = new Ctx({
            sampleRate: 16000
          });
          offlineRef.current = ctx;
          const src = ctx.createMediaStreamSource(stream);
          const proc = ctx.createScriptProcessor(4096, 1, 1);
          const sink = ctx.createGain();
          sink.gain.value = 0;
          proc.onaudioprocess = e => {
            const f = e.inputBuffer.getChannelData(0);
            const i16 = new Int16Array(f.length);
            for (let i = 0; i < f.length; i++) {
              const v = Math.max(-1, Math.min(1, f[i]));
              i16[i] = v < 0 ? v * 0x8000 : v * 0x7FFF;
            }
            window.promptdrop.voice.audio(i16.buffer);
          };
          src.connect(proc);
          proc.connect(sink);
          sink.connect(ctx.destination);
          offlineRef.current.__proc = proc;
          if (window.promptdrop.voice.onResult) window.promptdrop.voice.onResult(p => {
            if (offlineRef.current && p && p.text) feedHeard(p.text);
          });
          setVoiceReady(true);
          return;
        }
      } catch (e) {}
    }
    // Web Speech fallback (browser)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";
      r.onresult = ev => {
        let latest = "";
        for (let i = ev.resultIndex; i < ev.results.length; i++) latest += " " + ev.results[i][0].transcript;
        feedHeard(latest);
      };
      r.onerror = () => {};
      r.onend = () => {
        if (phaseRef.current === "prompting") {
          try {
            r.start();
          } catch (e) {}
        }
      };
      try {
        r.start();
        speechRef.current = r;
        setVoiceReady(true);
        return;
      } catch (e) {}
    }
    setVoiceReady(false); // nothing available → steady auto-advance carries it
  }
  function stopVoice() {
    setVoiceReady(false);
    if (offlineRef.current) {
      try {
        window.promptdrop.voice.stop();
      } catch (e) {}
      try {
        offlineRef.current.__proc && (offlineRef.current.__proc.onaudioprocess = null, offlineRef.current.__proc.disconnect());
      } catch (e) {}
      try {
        offlineRef.current.close();
      } catch (e) {}
      offlineRef.current = false;
    }
    if (speechRef.current) {
      const r = speechRef.current;
      speechRef.current = null;
      try {
        r.onend = null;
        r.stop();
      } catch (e) {}
    }
  }
  function finish() {
    stopVoice();
    stopRecorder(true);
    setPhase("processing");
  }

  // processing -> complete
  useEffectL(() => {
    if (phase !== "processing") return;
    const t = setTimeout(() => {
      setPhase("complete");
      pd.setHasTake(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [phase]);
  const progress = phase === "prompting" || phase === "paused" ? Math.round(idx / (lines.length - 1) * 100) : phase === "complete" ? 100 : 0;
  const baseW = isPhone ? 288 : Math.max(480, Math.round(s.width / 100 * 820));
  const dropH = {
    idle: isPhone ? 196 : 264,
    ready: isPhone ? 196 : 264,
    countdown: isPhone ? 220 : 300,
    prompting: isPhone ? 320 : 404,
    paused: isPhone ? 320 : 404,
    lost: isPhone ? 270 : 336,
    processing: isPhone ? 200 : 264,
    complete: isPhone ? 250 : 316,
    warning: isPhone ? 210 : 264,
    error: isPhone ? 210 : 264
  }[phase] || 260;
  const dropW = phase === "prompting" || phase === "paused" || phase === "lost" ? baseW : Math.max(isPhone ? 260 : 430, Math.round(baseW * 0.82));
  const charSize = isPhone ? 60 : 86;
  const countSize = isPhone ? 68 : 108;
  const wordsTotal = words.length;
  let body;
  if (phase === "idle" || phase === "ready") body = React.createElement(React.Fragment, null, s.showCharacter && React.createElement(PChar, {
    state: "idle",
    size: charSize
  }), React.createElement("div", {
    className: "lt-title"
  }, pd.script.title), React.createElement("div", {
    className: "lt-status" + (s.autoRecord ? " lt-status--rec" : "")
  }, s.autoRecord ? "Will record" : "Ready"), React.createElement("button", {
    className: "lt-play",
    onClick: start,
    "aria-label": "Start"
  }, PlayG));else if (phase === "countdown") body = React.createElement(React.Fragment, null, s.showCharacter && React.createElement(PChar, {
    state: "countdown",
    size: charSize - 12
  }), React.createElement("div", {
    className: "lt-count",
    key: count,
    style: {
      fontSize: countSize
    }
  }, count <= 0 ? "Go" : count), s.autoRecord && React.createElement("div", {
    className: "lt-status lt-status--rec"
  }, "Recording"));else if (phase === "prompting" || phase === "paused") body = React.createElement(React.Fragment, null, React.createElement("div", {
    className: "lt-pace",
    "data-mode": phase === "paused" ? "hold" : pace === "follow" ? "follow" : "hold"
  }, phase === "paused" ? React.createElement(React.Fragment, null, "Paused") : s.pacing === "Follow my voice" ? React.createElement(React.Fragment, null, Wave(), pace === "follow" ? "Following" : pace === "listen" ? "Finding your place" : "Holding") : React.createElement(React.Fragment, null, "Steady · " + s.wpm + " wpm")), React.createElement(LiveReader, {
    lines,
    index: idx,
    scale,
    s
  }), phase === "paused" ? React.createElement("div", {
    className: "lt-actions"
  }, React.createElement("button", {
    className: "lt-btn lt-btn--primary",
    onClick: () => setPhase("prompting")
  }, "Resume"), React.createElement("button", {
    className: "lt-btn lt-btn--ghost",
    onClick: () => setPhase("lost")
  }, "Lost my place"), React.createElement("button", {
    className: "lt-btn lt-btn--ghost",
    onClick: restart
  }, "Restart")) : React.createElement("div", {
    className: "lt-status" + (recording ? " lt-status--rec" : "")
  }, s.showCharacter && React.createElement(PChar, {
    state: "prompting",
    size: 22
  }), recording ? "Recording" : "Prompting"));else if (phase === "lost") body = React.createElement(React.Fragment, null, s.showCharacter && React.createElement(PChar, {
    state: "warning",
    size: charSize - 8
  }), React.createElement("div", {
    className: "lt-title"
  }, "Finding your place"), React.createElement("div", {
    className: "lt-msg",
    style: {
      color: "var(--tp-current)",
      fontSize: 19,
      fontWeight: 600
    }
  }, lines[idx] && lines[idx].t ? lines[idx].t : lines[Math.max(0, idx - 1)].t), React.createElement("div", {
    className: "lt-actions"
  }, React.createElement("button", {
    className: "lt-btn lt-btn--primary",
    onClick: () => {
      if (trackerRef.current) trackerRef.current.lastMatch = performance.now();
      setPhase("prompting");
    }
  }, "Resume here"), React.createElement("button", {
    className: "lt-btn lt-btn--ghost",
    onClick: () => {
      setIdx(i => Math.max(0, i - 2));
      setPhase("prompting");
    }
  }, "Back a little")));else if (phase === "processing") body = React.createElement(React.Fragment, null, s.showCharacter && React.createElement(PChar, {
    state: "processing",
    size: charSize
  }), React.createElement("div", {
    className: "lt-msg"
  }, "Saving your take…"));else if (phase === "complete") body = React.createElement(React.Fragment, null, s.showCharacter && React.createElement(PChar, {
    state: "complete",
    size: charSize
  }), React.createElement("div", {
    className: "lt-title"
  }, "Nice take."), React.createElement("div", {
    className: "lt-statgrid"
  }, React.createElement("div", {
    className: "lt-stat"
  }, React.createElement("b", null, fmtDur(takeDur || 0)), React.createElement("span", null, "Length")), React.createElement("div", {
    className: "lt-stat"
  }, React.createElement("b", null, wordsTotal), React.createElement("span", null, "words")), React.createElement("div", {
    className: "lt-stat"
  }, React.createElement("b", {
    style: {
      color: "var(--green-400)"
    }
  }, "100%"), React.createElement("span", null, "covered"))), React.createElement("div", {
    className: "lt-actions"
  }, React.createElement("button", {
    className: "lt-btn lt-btn--primary",
    onClick: () => onReview && onReview()
  }, "Review take"), React.createElement("button", {
    className: "lt-btn lt-btn--ghost",
    onClick: restart
  }, "Start again")));
  const bar = (phase === "prompting" || phase === "paused" || phase === "lost") && React.createElement("div", {
    className: "lt-bar"
  }, React.createElement("button", {
    className: "lt-bar__rec"
  }, React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 9,
      background: "var(--recording)",
      display: "inline-block",
      boxShadow: "0 0 8px var(--rec-glow)"
    }
  }), "REC"), React.createElement("span", {
    className: "lt-bar__sep"
  }), React.createElement("button", {
    onClick: () => setPhase(p => p === "prompting" ? "paused" : "prompting")
  }, phase === "prompting" ? "Pause" : "Resume"), React.createElement("button", {
    onClick: restart
  }, "Restart"), React.createElement("button", {
    onClick: () => setHidden(true)
  }, "Hide", React.createElement("span", {
    className: "lt-bar__kbd"
  }, "⌘⇧H")), React.createElement("span", {
    className: "lt-bar__sep"
  }), React.createElement("button", {
    onClick: () => onExit && onExit()
  }, "Exit"));
  const dropTop = isPhone ? 56 : 0;
  return React.createElement("div", {
    className: "lt-scene"
  }, React.createElement("div", {
    className: "lt-feed"
  }), React.createElement("video", {
    className: "lt-cam",
    ref: videoRef,
    autoPlay: true,
    muted: true,
    playsInline: true
  }), React.createElement("div", {
    className: "lt-camveil"
  }), !isPhone && React.createElement("div", {
    className: "lt-feedlabel"
  }, React.createElement("i"), "Your camera · " + s.resolution), !isPhone && React.createElement("div", {
    className: "lt-notch"
  }), React.createElement("div", {
    className: "lt-top",
    style: {
      paddingTop: dropTop
    }
  }, hidden ? React.createElement("div", {
    className: "lt-privacy",
    onClick: () => setHidden(false)
  }, React.createElement("i"), "Prompter hidden, tap or ⌘⇧H") : React.createElement("div", {
    className: "lt-drop",
    "data-rec": recording ? 1 : 0,
    "data-hidden": hidden ? 1 : 0,
    style: {
      width: dropW,
      height: dropH
    }
  }, React.createElement("div", {
    className: "lt-dots"
  }, React.createElement("i"), React.createElement("i"), React.createElement("i")), React.createElement("div", {
    className: "lt-body"
  }, body), (phase === "prompting" || phase === "paused" || phase === "complete") && React.createElement("div", {
    className: "lt-progress",
    style: {
      width: progress + "%"
    }
  }))), bar && React.createElement("div", {
    className: "lt-bottom"
  }, React.cloneElement(bar, {
    style: {
      marginBottom: isPhone ? 44 : 20
    }
  })));
}
window.PDLiveTake = LiveTake;
; /* app-boot.jsx */
// PromptDrop Desktop, renderer root. The prototype's control app + the REAL
// live prompter, in a normal app window (no marketing, no faux Mac chrome).
const {
  useEffect: useEffectB
} = React;
function ControlApp() {
  const pd = window.usePD();
  const I = window.PDIcons;
  const view = pd.appView;
  const TITLES = {
    dashboard: ["Dashboard", "Home"],
    studio: ["Script Studio", "Scripts"],
    settings: ["Prompt Settings", "Configure"],
    review: ["Take Review", "Recordings"],
    library: ["Library", "Scripts"],
    preferences: ["Settings", "Account"],
    pricing: ["Plans & pricing", "Account"]
  };
  const [t, crumb] = TITLES[view] || TITLES.dashboard;
  // Single, non-duplicated top-bar action per view. Pages own their own New-script
  // and Export affordances, so the top bar only carries the live launch.
  const right = view === "studio" || view === "settings" ? React.createElement("button", {
    className: "btn btn--launch",
    onClick: pd.openLive
  }, React.createElement(I.rocket, {
    size: 16
  }), " Launch PromptDrop") : null;
  let screen;
  if (view === "dashboard") screen = React.createElement(window.PDDashboard);else if (view === "studio") screen = React.createElement(window.PDScriptStudio);else if (view === "settings") screen = React.createElement(window.PDPromptSettings);else if (view === "library") screen = React.createElement(window.PDLibrary);else if (view === "preferences") screen = React.createElement(window.PDPreferences);else if (view === "pricing") screen = React.createElement(window.PDPricing);else screen = React.createElement(window.PDTakeReview);
  return React.createElement("div", {
    className: "app pd-app"
  }, React.createElement(window.PDSidebar), React.createElement("div", {
    className: "main"
  }, React.createElement(window.PDTopbar, {
    title: t,
    crumb,
    right
  }), React.createElement("div", {
    className: "scroll"
  }, screen)));
}
function DesktopRoot() {
  const pd = window.usePD();
  return React.createElement("div", {
    className: "pd-area"
  }, React.createElement("div", {
    className: "pd-frame pd-frame--full"
  }, pd.liveOn ? React.createElement(window.PDLiveTake, {
    frame: "mac",
    onReview: () => pd.setAppView("review"),
    onExit: pd.closeLive
  }) : React.createElement(ControlApp)), window.PDUpgradeSheet ? React.createElement(window.PDUpgradeSheet) : null);
}
function Root() {
  return React.createElement(window.PDProvider, null, React.createElement("div", {
    className: "pd-shell"
  }, React.createElement(DesktopRoot)));
}
ReactDOM.createRoot(document.getElementById("pd-root")).render(React.createElement(Root));
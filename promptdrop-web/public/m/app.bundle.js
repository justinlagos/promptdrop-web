
;/* frames/ios-frame.jsx */
function IOSStatusBar({ dark = false, time = "9:41" }) {
  const c = dark ? "#fff" : "#000";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 154,
    alignItems: "center",
    justifyContent: "center",
    padding: "21px 24px 19px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 20,
    width: "100%"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 1.5 } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: '-apple-system, "SF Pro", system-ui',
    fontWeight: 590,
    fontSize: 17,
    lineHeight: "22px",
    color: c
  } }, time)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, paddingTop: 1, paddingRight: 1 } }, /* @__PURE__ */ React.createElement("svg", { width: "19", height: "12", viewBox: "0 0 19 12" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "7.5", width: "3.2", height: "4.5", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "4.8", y: "5", width: "3.2", height: "7", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "9.6", y: "2.5", width: "3.2", height: "9.5", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "14.4", y: "0", width: "3.2", height: "12", rx: "0.7", fill: c })), /* @__PURE__ */ React.createElement("svg", { width: "17", height: "12", viewBox: "0 0 17 12" }, /* @__PURE__ */ React.createElement("path", { d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z", fill: c }), /* @__PURE__ */ React.createElement("path", { d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z", fill: c }), /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "10.5", r: "1.5", fill: c })), /* @__PURE__ */ React.createElement("svg", { width: "27", height: "13", viewBox: "0 0 27 13" }, /* @__PURE__ */ React.createElement("rect", { x: "0.5", y: "0.5", width: "23", height: "12", rx: "3.5", stroke: c, strokeOpacity: "0.35", fill: "none" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "20", height: "9", rx: "2", fill: c }), /* @__PURE__ */ React.createElement("path", { d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z", fill: c, fillOpacity: "0.4" }))));
}
function IOSGlassPill({ children, dark = false, style = {} }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    height: 44,
    minWidth: 44,
    borderRadius: 9999,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: dark ? "0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)",
    ...style
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 9999,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    background: dark ? "rgba(120,120,128,0.28)" : "rgba(255,255,255,0.5)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 9999,
    boxShadow: dark ? "inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)" : "inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)",
    border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.06)"
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", padding: "0 4px" } }, children));
}
function IOSNavBar({ title = "Title", dark = false, trailingIcon = true }) {
  const muted = dark ? "rgba(255,255,255,0.6)" : "#404040";
  const text = dark ? "#fff" : "#000";
  const pillIcon = (content) => /* @__PURE__ */ React.createElement(IOSGlassPill, { dark }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" } }, content));
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 62,
    paddingBottom: 10,
    position: "relative",
    zIndex: 5
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px"
  } }, pillIcon(
    /* @__PURE__ */ React.createElement("svg", { width: "12", height: "20", viewBox: "0 0 12 20", fill: "none", style: { marginLeft: -1 } }, /* @__PURE__ */ React.createElement("path", { d: "M10 2L2 10l8 8", stroke: muted, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }))
  ), trailingIcon && pillIcon(
    /* @__PURE__ */ React.createElement("svg", { width: "22", height: "6", viewBox: "0 0 22 6" }, /* @__PURE__ */ React.createElement("circle", { cx: "3", cy: "3", r: "2.5", fill: muted }), /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "3", r: "2.5", fill: muted }), /* @__PURE__ */ React.createElement("circle", { cx: "19", cy: "3", r: "2.5", fill: muted }))
  )), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 16px",
    fontFamily: "-apple-system, system-ui",
    fontSize: 34,
    fontWeight: 700,
    lineHeight: "41px",
    color: text,
    letterSpacing: 0.4
  } }, title));
}
function IOSListRow({ title, detail, icon, chevron = true, isLast = false, dark = false }) {
  const text = dark ? "#fff" : "#000";
  const sec = dark ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)";
  const ter = dark ? "rgba(235,235,245,0.3)" : "rgba(60,60,67,0.3)";
  const sep = dark ? "rgba(84,84,88,0.65)" : "rgba(60,60,67,0.12)";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    minHeight: 52,
    padding: "0 16px",
    position: "relative",
    fontFamily: "-apple-system, system-ui",
    fontSize: 17,
    letterSpacing: -0.43
  } }, icon && /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: icon,
    marginRight: 12,
    flexShrink: 0
  } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: text } }, title), detail && /* @__PURE__ */ React.createElement("span", { style: { color: sec, marginRight: 6 } }, detail), chevron && /* @__PURE__ */ React.createElement("svg", { width: "8", height: "14", viewBox: "0 0 8 14", style: { flexShrink: 0 } }, /* @__PURE__ */ React.createElement("path", { d: "M1 1l6 6-6 6", stroke: ter, strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" })), !isLast && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: icon ? 58 : 16,
    height: 0.5,
    background: sep
  } }));
}
function IOSList({ header, children, dark = false }) {
  const hc = dark ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)";
  const bg = dark ? "#1C1C1E" : "#fff";
  return /* @__PURE__ */ React.createElement("div", null, header && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "-apple-system, system-ui",
    fontSize: 13,
    color: hc,
    textTransform: "uppercase",
    padding: "8px 36px 6px",
    letterSpacing: -0.08
  } }, header), /* @__PURE__ */ React.createElement("div", { style: {
    background: bg,
    borderRadius: 26,
    margin: "0 16px",
    overflow: "hidden"
  } }, children));
}
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    width,
    height,
    borderRadius: 48,
    overflow: "hidden",
    position: "relative",
    background: dark ? "#000" : "#F2F2F7",
    boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)",
    fontFamily: "-apple-system, system-ui, sans-serif",
    WebkitFontSmoothing: "antialiased"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 11,
    left: "50%",
    transform: "translateX(-50%)",
    width: 126,
    height: 37,
    borderRadius: 24,
    background: "#000",
    zIndex: 50
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 } }, /* @__PURE__ */ React.createElement(IOSStatusBar, { dark })), /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column" } }, title !== void 0 && /* @__PURE__ */ React.createElement(IOSNavBar, { title, dark }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto" } }, children), keyboard && /* @__PURE__ */ React.createElement(IOSKeyboard, { dark })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    height: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 8,
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 139,
    height: 5,
    borderRadius: 100,
    background: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.25)"
  } })));
}
function IOSKeyboard({ dark = false }) {
  const glyph = dark ? "rgba(255,255,255,0.7)" : "#595959";
  const sugg = dark ? "rgba(255,255,255,0.6)" : "#333";
  const keyBg = dark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.85)";
  const icons = {
    shift: /* @__PURE__ */ React.createElement("svg", { width: "19", height: "17", viewBox: "0 0 19 17" }, /* @__PURE__ */ React.createElement("path", { d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z", fill: glyph })),
    del: /* @__PURE__ */ React.createElement("svg", { width: "23", height: "17", viewBox: "0 0 23 17" }, /* @__PURE__ */ React.createElement("path", { d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z", fill: "none", stroke: glyph, strokeWidth: "1.6", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M10 5l7 7M17 5l-7 7", stroke: glyph, strokeWidth: "1.6", strokeLinecap: "round" })),
    ret: /* @__PURE__ */ React.createElement("svg", { width: "20", height: "14", viewBox: "0 0 20 14" }, /* @__PURE__ */ React.createElement("path", { d: "M18 1v6H4m0 0l4-4M4 7l4 4", fill: "none", stroke: "#fff", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }))
  };
  const key = (content, { w, flex, ret, fs = 25, k } = {}) => /* @__PURE__ */ React.createElement("div", { key: k, style: {
    height: 42,
    borderRadius: 8.5,
    flex: flex ? 1 : void 0,
    width: w,
    minWidth: 0,
    background: ret ? "#08f" : keyBg,
    boxShadow: "0 1px 0 rgba(0,0,0,0.075)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '-apple-system, "SF Compact", system-ui',
    fontSize: fs,
    fontWeight: 458,
    color: ret ? "#fff" : glyph
  } }, content);
  const row = (keys, pad = 0) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6.5, justifyContent: "center", padding: `0 ${pad}px` } }, keys.map((l) => key(l, { flex: true, k: l })));
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 15,
    borderRadius: 27,
    overflow: "hidden",
    padding: "11px 0 2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: dark ? "0 -2px 20px rgba(0,0,0,0.09)" : "0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 27,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    background: dark ? "rgba(120,120,128,0.14)" : "rgba(255,255,255,0.25)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 27,
    boxShadow: dark ? "inset 1.5px 1.5px 1px rgba(255,255,255,0.15)" : "inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)",
    border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.06)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    padding: "8px 22px 13px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative"
  } }, ['"The"', "the", "to"].map((w, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 25, background: "#ccc", opacity: 0.3 } }), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    textAlign: "center",
    fontFamily: "-apple-system, system-ui",
    fontSize: 17,
    color: sugg,
    letterSpacing: -0.43,
    lineHeight: "22px"
  } }, w)))), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 13,
    padding: "0 6.5px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative"
  } }, row(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]), row(["a", "s", "d", "f", "g", "h", "j", "k", "l"], 20), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14.25, alignItems: "center" } }, key(icons.shift, { w: 45, k: "shift" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6.5, flex: 1 } }, ["z", "x", "c", "v", "b", "n", "m"].map((l) => key(l, { flex: true, k: l }))), key(icons.del, { w: 45, k: "del" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, key("ABC", { w: 92.25, fs: 18, k: "abc" }), key("", { flex: true, k: "space" }), key(icons.ret, { w: 92.25, ret: true, k: "ret" }))), /* @__PURE__ */ React.createElement("div", { style: { height: 56, width: "100%", position: "relative" } }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});

;/* app/data.jsx */
const ICONS = {
  library: "M4 5.5A1.5 1.5 0 0 1 5.5 4H9a1.5 1.5 0 0 1 1.5 1.5V19M4 5.5V19a1.5 1.5 0 0 0 1.5 1.5H9A1.5 1.5 0 0 0 10.5 19M14 4.2l4 .9a1.5 1.5 0 0 1 1.13 1.8L16.5 19.2",
  record: "CIRCLE_DOT",
  meetings: "M5 8a7 7 0 0 1 14 0v3.5M5 8v3.5M5 11.5a2 2 0 0 0 2 2h.5a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-1-1H7a2 2 0 0 0-2 2Zm14 0a2 2 0 0 1-2 2h-.5a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1H17a2 2 0 0 1 2 2ZM12 18.5v0a4 4 0 0 0 4-4",
  account: "M5 20a7 7 0 0 1 14 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4",
  plus: "M12 5v14M5 12h14",
  back: "M15 5l-7 7 7 7",
  chevronR: "M9 5l7 7-7 7",
  chevronDown: "M6 9l6 6 6-6",
  more: "DOTS_H",
  play: "TRI",
  pause: "M9 5v14M15 5v14",
  sparkle: "M12 4l1.6 4.8L18 10l-4.4 1.2L12 16l-1.6-4.8L6 10l4.4-1.2L12 4ZM18 4l.7 2 .3.7M5 17l.5 1.5.5.5",
  gear: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12a7 7 0 0 0-.1-1.2l1.8-1.4-2-3.4-2.1.9a7 7 0 0 0-2-1.2L12.3 3h-.6l-.3 2.5a7 7 0 0 0-2 1.2l-2.1-.9-2 3.4 1.8 1.4A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-1.8 1.4 2 3.4 2.1-.9a7 7 0 0 0 2 1.2l.3 2.3h.6l.3-2.3a7 7 0 0 0 2-1.2l2.1.9 2-3.4-1.8-1.4A7 7 0 0 0 19 12Z",
  mic: "M12 14.5a3 3 0 0 0 3-3v-4a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3ZM6 11a6 6 0 0 0 12 0M12 17.5V21M9 21h6",
  video: "M3.5 8.5A1.5 1.5 0 0 1 5 7h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 13 17H5a1.5 1.5 0 0 1-1.5-1.5v-7ZM14.5 11l5-2.5v7L14.5 13",
  check: "M5 12.5l4.5 4.5L19 6.5",
  checkCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5L16 9",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2",
  x: "M6 6l12 12M18 6L6 18",
  type: "M5 7V5h14v2M12 5v14M9 19h6",
  gauge: "M12 14l4-4M5.5 17a8 8 0 1 1 13 0M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  redo: "M20 9H9a5 5 0 0 0 0 10h6M20 9l-3-3M20 9l-3 3",
  trash: "M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13",
  share: "M12 15V4M12 4L8 8M12 4l4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5",
  shield: "M12 3l7 2.5V11c0 5-3.5 8-7 9.5C8.5 19 5 16 5 11V5.5L12 3ZM9 12l2 2 4-4",
  zap: "M13 3L5 13h6l-1 8 8-10h-6l1-8Z",
  pencil: "M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3",
  list: "M8 7h12M8 12h12M8 17h8M4 7h.01M4 12h.01M4 17h.01",
  send: "M5 12L20 5l-5 15-3-7-7-1Z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5",
  waveform: "M4 12h2M9 7v10M14 4v16M19 9v6M22 11h-1",
  flag: "M6 21V4M6 4h11l-2 4 2 4H6",
  bell: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 19a2 2 0 0 0 4 0",
  lens: "LENS",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  download: "M12 4v11M12 15l-4-4M12 15l4-4M5 19h14",
  star: "M12 4l2.3 5.2 5.7.5-4.3 3.8 1.3 5.5L12 16.6 7 18.5l1.3-5.5L4 9.2l5.7-.5L12 4Z",
  refresh: "M20 12a8 8 0 1 1-2.3-5.6M20 4v3.5h-3.5",
  helpDots: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.3-1.4 1-1.4 1.9v.3M12 16.5h.01"
};
function Icon({ name, size = 24, stroke = 1.75, color = "currentColor", fill = "none", style }) {
  const d = ICONS[name] || "";
  const common = { width: size, height: size, viewBox: "0 0 24 24", style, "aria-hidden": true };
  if (d === "CIRCLE_DOT") return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.5", fill: "none", stroke: color, strokeWidth: stroke }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "4", fill: color }));
  if (d === "TRI") return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("polygon", { points: "8 5 19 12 8 19", fill: color }));
  if (d === "DOTS_H") return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "6", cy: "12", r: "1.6", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.6", fill: color }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "12", r: "1.6", fill: color }));
  if (d === "LENS") return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "7.5", fill: "none", stroke: color, strokeWidth: stroke }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3", fill: "none", stroke: color, strokeWidth: stroke }), /* @__PURE__ */ React.createElement("circle", { cx: "14.5", cy: "9.5", r: "1", fill: color }));
  return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d, fill, stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" }));
}
const TOP_INSET = 58;
const TAB_H = 84;
function Eyebrow({ children, color = "var(--text-muted)", style }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color,
    ...style
  } }, children);
}
function Screen({ children, pad = true, style }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...style
  } }, children);
}
function ScrollArea({ children, padBottom = TAB_H, style }) {
  return /* @__PURE__ */ React.createElement("div", { className: "pd-scroll", style: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
    paddingBottom: padBottom,
    ...style
  } }, children);
}
function LargeTitle({ eyebrow, title, trailing, sub }) {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: `${TOP_INSET}px 20px 8px` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("div", null, eyebrow && /* @__PURE__ */ React.createElement(Eyebrow, { style: { marginBottom: 8 } }, eyebrow), /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.05 } }, title), sub && /* @__PURE__ */ React.createElement("p", { style: { margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.4 } }, sub)), trailing));
}
function NavHeader({ onBack, title, action, transparent }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    paddingTop: TOP_INSET - 18,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    background: transparent ? "transparent" : "var(--bg-primary)",
    position: "relative",
    zIndex: 4
  } }, /* @__PURE__ */ React.createElement("button", { onClick: onBack, className: "pd-tap", style: iconBtn }, /* @__PURE__ */ React.createElement(Icon, { name: "back", size: 22, color: "var(--text-primary)" })), title && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)", position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" } }, title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, zIndex: 1 } }, action));
}
const iconBtn = {
  width: 40,
  height: 40,
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};
function RoundBtn({ onClick, children, size = 52, bg = "rgba(255,255,255,0.12)", style }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, className: "pd-tap", style: {
    width: size,
    height: size,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: bg,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    ...style
  } }, children);
}
function CameraView({ children, dim = 0, style }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: "radial-gradient(120% 80% at 50% 18%, #1b2230 0%, #11151d 45%, #08090d 100%)",
    ...style
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "-18%", left: "50%", transform: "translateX(-50%)", width: "120%", height: "70%", background: "radial-gradient(60% 60% at 50% 50%, rgba(108,140,190,0.22), transparent 70%)", filter: "blur(8px)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: "-6%", left: "50%", transform: "translateX(-50%)", width: 280, height: 360 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 220, height: 240, borderRadius: "120px 120px 0 0", background: "linear-gradient(180deg, rgba(40,52,72,0.55), rgba(20,26,36,0.2))" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", width: 130, height: 150, borderRadius: "50%", background: "linear-gradient(180deg, rgba(52,66,90,0.6), rgba(28,36,50,0.25))" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: `rgba(5,6,9,${dim})`, transition: "background .4s" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-radial-gradient(circle at 20% 30%, #fff 0 0.5px, transparent 1px 3px)", mixBlendMode: "overlay" } }), children);
}
const PD_SUPA_URL = "https://wbqteajanwvfcwvjqozt.supabase.co";
const PD_SUPA_ANON = "sb_publishable_SMHHkaM94jLb9M9LRuQKgQ_QAdF-WPH";
const PD_FN = PD_SUPA_URL + "/functions/v1";
const _sb = window.supabase && window.supabase.createClient ? window.supabase.createClient(PD_SUPA_URL, PD_SUPA_ANON, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
function pdWords(t) {
  t = (t || "").trim();
  return t ? t.split(/\s+/).length : 0;
}
function pdDurFor(words, wpm) {
  const s = Math.round(words / (wpm || 142) * 60);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
function pdRel(ts) {
  if (!ts) return "";
  const d = (Date.now() - new Date(ts).getTime()) / 1e3;
  if (d < 60) return "just now";
  if (d < 3600) return Math.floor(d / 60) + "m ago";
  if (d < 86400) return Math.floor(d / 3600) + "h ago";
  if (d < 172800) return "yesterday";
  return Math.floor(d / 86400) + "d ago";
}
function pdClock(ms) {
  const s = Math.round((ms || 0) / 1e3);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
function _idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("promptdrop", 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains("recordings")) d.createObjectStore("recordings", { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function _idbAll() {
  const d = await _idb();
  return new Promise((res, rej) => {
    const out = [];
    const c = d.transaction("recordings", "readonly").objectStore("recordings").openCursor();
    c.onsuccess = () => {
      const cur = c.result;
      if (cur) {
        const { blob, ...meta } = cur.value;
        out.push(meta);
        cur.continue();
      } else res(out.sort((a, b) => b.createdAt - a.createdAt));
    };
    c.onerror = () => rej(c.error);
  });
}
async function _idbGet(id) {
  const d = await _idb();
  return new Promise((res, rej) => {
    const r = d.transaction("recordings", "readonly").objectStore("recordings").get(id);
    r.onsuccess = () => res(r.result || null);
    r.onerror = () => rej(r.error);
  });
}
async function _idbPut(rec) {
  const d = await _idb();
  return new Promise((res, rej) => {
    const t = d.transaction("recordings", "readwrite");
    t.objectStore("recordings").put(rec);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
async function _idbDel(id) {
  const d = await _idb();
  return new Promise((res, rej) => {
    const t = d.transaction("recordings", "readwrite");
    t.objectStore("recordings").delete(id);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
const PDsvc = {
  sb: _sb,
  FN: PD_FN,
  anon: PD_SUPA_ANON,
  words: pdWords,
  durFor: pdDurFor,
  rel: pdRel,
  clock: pdClock,
  async token() {
    var _a;
    if (!_sb) return null;
    const { data } = await _sb.auth.getSession();
    return ((_a = data == null ? void 0 : data.session) == null ? void 0 : _a.access_token) || null;
  },
  async getUser() {
    if (!_sb) return null;
    const { data } = await _sb.auth.getUser();
    return (data == null ? void 0 : data.user) || null;
  },
  async plan(uid) {
    if (!_sb || !uid) return "free";
    const { data } = await _sb.from("subscriptions").select("plan,status").eq("user_id", uid).maybeSingle();
    if (!data) return "free";
    return ["active", "trialing", "past_due"].includes(data.status) ? data.plan : "free";
  },
  async scripts() {
    if (!_sb) return [];
    const { data, error } = await _sb.from("scripts").select("id,title,body,updated_at").order("updated_at", { ascending: false });
    return error ? [] : data || [];
  },
  async createScript(title, body) {
    if (!_sb) return null;
    const { data: u } = await _sb.auth.getUser();
    if (!(u == null ? void 0 : u.user)) return null;
    const { data, error } = await _sb.from("scripts").insert({ user_id: u.user.id, title: title || "Untitled", body: body || "" }).select().single();
    return error ? null : data;
  },
  async updateScript(id, patch) {
    if (!_sb || !id) return;
    await _sb.from("scripts").update({ ...patch, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  },
  async deleteScript(id) {
    if (!_sb || !id) return;
    await _sb.from("scripts").delete().eq("id", id);
  },
  takes: _idbAll,
  getTake: _idbGet,
  putTake: _idbPut,
  delTake: _idbDel,
  async transcribe(blob) {
    try {
      const fd = new FormData();
      fd.append("file", blob, "rec.webm");
      const r = await fetch(PD_FN + "/transcribe", { method: "POST", headers: { Authorization: "Bearer " + PD_SUPA_ANON, apikey: PD_SUPA_ANON }, body: fd });
      const d = await r.json().catch(() => ({}));
      if (r.status === 503) return { ok: false, msg: "AI is not switched on yet on the server." };
      if (!r.ok || d.error) return { ok: false, msg: d.message || "Transcription failed" };
      return { ok: true, text: d.text || "" };
    } catch (e) {
      return { ok: false, msg: String(e.message || e) };
    }
  },
  async ask(question, context) {
    try {
      const r = await fetch(PD_FN + "/assistant", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + PD_SUPA_ANON, apikey: PD_SUPA_ANON }, body: JSON.stringify({ question, context }) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 503) return { ok: false, msg: "AI is not switched on yet on the server." };
      if (!r.ok || d.error) return { ok: false, msg: d.message || "Request failed" };
      return { ok: true, text: d.answer || d.text || "" };
    } catch (e) {
      return { ok: false, msg: String(e.message || e) };
    }
  },
  async checkout(plan, cycle) {
    const t = await this.token();
    if (!t) return { ok: false, msg: "Sign in first." };
    try {
      const r = await fetch(PD_FN + "/stripe-checkout", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + t, apikey: PD_SUPA_ANON }, body: JSON.stringify({ plan, cycle, successUrl: location.origin + "/app", cancelUrl: location.origin + "/app" }) });
      const d = await r.json().catch(() => ({}));
      if (d.url) {
        location.href = d.url;
        return { ok: true };
      }
      return { ok: false, msg: d.message || "Payments aren't switched on yet." };
    } catch (e) {
      return { ok: false, msg: String(e.message || e) };
    }
  },
  async signIn(email, pw) {
    if (!_sb) return { ok: false, msg: "Accounts not connected" };
    const { error } = await _sb.auth.signInWithPassword({ email, password: pw });
    return error ? { ok: false, msg: error.message } : { ok: true };
  },
  async signUp(email, pw, name) {
    if (!_sb) return { ok: false, msg: "Accounts not connected" };
    const { data, error } = await _sb.auth.signUp({ email, password: pw, options: { data: { display_name: name } } });
    return error ? { ok: false, msg: error.message } : { ok: true, needsConfirm: !data.session };
  },
  async signOut() {
    if (_sb) await _sb.auth.signOut();
  }
};
const PDDataCtx = React.createContext(null);
function DataProvider({ children }) {
  const [st, setSt] = React.useState({ loading: true, user: null, plan: "free", scripts: [], takes: [] });
  const reload = React.useCallback(async () => {
    const user = await PDsvc.getUser();
    const plan = user ? await PDsvc.plan(user.id) : "free";
    const scripts = user ? await PDsvc.scripts() : [];
    let takes = [];
    try {
      takes = await PDsvc.takes();
    } catch (e) {
    }
    setSt({ loading: false, user, plan, scripts, takes });
  }, []);
  React.useEffect(() => {
    reload();
    const o = _sb ? _sb.auth.onAuthStateChange(() => reload()) : null;
    return () => {
      try {
        o && o.data.subscription.unsubscribe();
      } catch (e) {
      }
    };
  }, [reload]);
  return React.createElement(PDDataCtx.Provider, { value: { ...st, reload, svc: PDsvc } }, children);
}
function useData() {
  return React.useContext(PDDataCtx) || { loading: true, user: null, plan: "free", scripts: [], takes: [], reload() {
  }, svc: PDsvc };
}
Object.assign(window, {
  Icon,
  Eyebrow,
  Screen,
  ScrollArea,
  LargeTitle,
  NavHeader,
  RoundBtn,
  CameraView,
  iconBtn,
  TOP_INSET,
  TAB_H,
  PDsvc,
  DataProvider,
  useData,
  PromptCharacter: window.PromptDropDesignSystem_82c6c3.PromptCharacter
});

;/* app/screens-library.jsx */
const DS = window.PromptDropDesignSystem_82c6c3;
function ScriptRow({ s, onOpen, last }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, className: "pd-tap", style: { width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderBottom: last ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, s.title || "Untitled"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 5, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" } }, s.dur, " \xB7 ", String(s.updated || "").toUpperCase())), /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 18, color: "var(--ink-600)" }));
}
function TakeRow({ t, onOpen, last }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, className: "pd-tap", style: { width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 50, height: 50, borderRadius: 12, background: "radial-gradient(120% 90% at 50% 20%, #1b2230, #0a0d13)", position: "relative", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: "play", size: 16, color: "rgba(255,255,255,0.9)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, t.script), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" } }, t.dur, " \xB7 ", String(t.when || "").toUpperCase())), /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 18, color: "var(--ink-600)" }));
}
function LibraryScreen({ app }) {
  const pd = useData();
  const [seg, setSeg] = React.useState("Scripts");
  const [q, setQ] = React.useState("");
  const scripts = pd.scripts.filter((s) => (s.title || "").toLowerCase().includes(q.toLowerCase())).map((s) => {
    const w = pd.svc.words(s.body);
    return { id: s.id, title: s.title, dur: pd.svc.durFor(w, 142), updated: "edited " + pd.svc.rel(s.updated_at), body: s.body };
  });
  const takes = (pd.takes || []).filter((t) => t.source !== "meeting").map((t) => ({ id: t.id, script: t.title || (t.source === "screen" ? "Screen take" : "Camera take"), dur: pd.svc.clock(t.durationMs), when: pd.svc.rel(t.createdAt) }));
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(ScrollArea, null, /* @__PURE__ */ React.createElement(
    LargeTitle,
    {
      title: "Library",
      trailing: /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => app.nav("script", { id: null }), style: { width: 44, height: 44, borderRadius: 999, border: "none", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 22, color: "#fff" }))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 20px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "var(--surface-elevated)", border: "none", borderRadius: 12, padding: "0 12px", height: 42 } }, /* @__PURE__ */ React.createElement(Icon, { name: "search", size: 18, color: "var(--text-muted)" }), /* @__PURE__ */ React.createElement("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search scripts", style: { flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 15, fontFamily: "var(--font-sans)" } }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "var(--surface-sunken)", borderRadius: 10, padding: 3, gap: 2 } }, ["Scripts", "Takes"].map((o) => /* @__PURE__ */ React.createElement("button", { key: o, onClick: () => setSeg(o), className: "pd-tap", style: { flex: 1, height: 34, borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, background: seg === o ? "var(--surface-raised)" : "transparent", color: seg === o ? "var(--text-primary)" : "var(--text-muted)", boxShadow: seg === o ? "var(--shadow-subtle)" : "none" } }, o)))), seg === "Scripts" && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 20px 0" } }, scripts.map((s, i) => /* @__PURE__ */ React.createElement(ScriptRow, { key: s.id, s, last: i === scripts.length - 1, onOpen: () => app.nav("script", { id: s.id }) })), scripts.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "48px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, color: "var(--text-secondary)" } }, "No scripts yet."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 13, color: "var(--text-muted)" } }, "Tap + to write your first one. It syncs to your account."))), seg === "Takes" && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 20px 0" } }, takes.map((t, i) => /* @__PURE__ */ React.createElement(TakeRow, { key: t.id, t, last: i === takes.length - 1, onOpen: () => app.nav("takeReview", { id: t.id }) })), takes.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "48px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, color: "var(--text-secondary)" } }, "No takes yet."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 13, color: "var(--text-muted)" } }, "Record one from a script and it appears here, on this device.")))));
}
const REWRITES = ["Make punchier", "Shorten", "More conversational", "Warm up the intro"];
function ScriptScreen({ app }) {
  const pd = useData();
  const existing = pd.scripts.find((x) => x.id === app.params.id);
  const isNew = !app.params.id;
  const [title, setTitle] = React.useState(existing ? existing.title : "");
  const [body, setBody] = React.useState(existing ? existing.body || "" : "");
  const [aiOpen, setAiOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const idRef = React.useRef(app.params.id || null);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const secs = Math.round(words / 142 * 60);
  const dur = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  async function persist() {
    const t = title || "Untitled script";
    if (idRef.current) {
      await pd.svc.updateScript(idRef.current, { title: t, body });
    } else if (body.trim() || title.trim()) {
      const row = await pd.svc.createScript(t, body);
      if (row) idRef.current = row.id;
    }
    pd.reload();
  }
  async function rewrite(kind) {
    if (!body.trim()) return;
    setBusy(true);
    const r = await pd.svc.ask(`Rewrite this script to be ${kind.toLowerCase()}. Return only the rewritten script.`, body);
    setBusy(false);
    if (r.ok && r.text) {
      setBody(r.text);
      app.toast("Rewritten");
    } else {
      app.toast(r.msg || "AI not available");
    }
  }
  const launch = async () => {
    await persist();
    app.nav("recordSetup", { id: idRef.current, title: title || "Untitled script", lines: body.trim() ? body.split(/\n\n+/).map((l) => l.trim()).filter(Boolean) : [] });
  };
  const back = async () => {
    await persist();
    app.back();
  };
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(NavHeader, { onBack: back, action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", style: iconBtn, onClick: () => setAiOpen((v) => !v) }, /* @__PURE__ */ React.createElement(Icon, { name: "sparkle", size: 20, color: aiOpen ? "var(--accent-secondary)" : "var(--text-secondary)" })), /* @__PURE__ */ React.createElement("button", { className: "pd-tap", style: iconBtn, onClick: async () => {
    if (idRef.current) {
      await pd.svc.deleteScript(idRef.current);
      pd.reload();
    }
    app.back();
  } }, /* @__PURE__ */ React.createElement(Icon, { name: "trash", size: 19, color: "var(--text-secondary)" }))) }), /* @__PURE__ */ React.createElement(ScrollArea, { padBottom: 120 }, /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 20px 0" } }, /* @__PURE__ */ React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Untitled script", style: { width: "100%", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "var(--font-sans)" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em" } }, /* @__PURE__ */ React.createElement("span", null, words, " WORDS"), /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.4 } }, "\xB7"), /* @__PURE__ */ React.createElement("span", null, "~", dur, " AT 142 WPM"))), aiOpen && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px 0" } }, /* @__PURE__ */ React.createElement(DS.Card, { variant: "accent", style: { borderRadius: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Icon, { name: "sparkle", size: 18, color: "var(--accent-secondary)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--text-primary)" } }, "Rewrite with AI")), /* @__PURE__ */ React.createElement("p", { style: { margin: "6px 0 12px", fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.45 } }, "Tighten your intro or change the tone. ", busy ? "Working\u2026" : "Tap an option to rewrite your script."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, REWRITES.map((r) => /* @__PURE__ */ React.createElement("button", { key: r, className: "pd-tap", disabled: busy, onClick: () => rewrite(r), style: { height: 34, padding: "0 13px", borderRadius: 999, border: "1px solid var(--border-default)", background: "var(--surface-raised)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer" } }, r))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 20px 0" } }, /* @__PURE__ */ React.createElement("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Write or paste your script\u2026", style: { width: "100%", minHeight: 320, background: "none", border: "none", outline: "none", resize: "none", color: "var(--text-primary)", fontSize: 19, lineHeight: 1.6, fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" } }))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px calc(12px + env(safe-area-inset-bottom, 22px))", background: "linear-gradient(transparent, var(--bg-primary) 28%)" } }, /* @__PURE__ */ React.createElement(DS.Button, { variant: "launch", size: "lg", fullWidth: true, onClick: launch, iconRight: /* @__PURE__ */ React.createElement(Icon, { name: "arrowRight", size: 18, color: "#fff" }) }, "Launch Prompt Drop")));
}
Object.assign(window, { LibraryScreen, ScriptScreen });

;/* app/screens-record.jsx */
const DSr = window.PromptDropDesignSystem_82c6c3;
function SettingRow({ children, top }) {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: top ? "2px 0 16px" : "16px 0 0" } }, children);
}
function RecordSetupScreen({ app }) {
  const p = app.params;
  const lines = p.lines && p.lines.length ? p.lines : ["Your script is empty. Add lines in the editor, or just press record."];
  const [speed, setSpeed] = React.useState(142);
  const [font, setFont] = React.useState(40);
  const [pos, setPos] = React.useState("Centre");
  const [autoRec, setAutoRec] = React.useState(true);
  const [follow, setFollow] = React.useState(false);
  const [sheet, setSheet] = React.useState(true);
  return /* @__PURE__ */ React.createElement(Screen, { style: { background: "#000" } }, /* @__PURE__ */ React.createElement(CameraView, { dim: 0.12 }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 8, right: 8, height: 92, background: "#000", borderRadius: "0 0 28px 28px", border: "1px solid var(--promptdrop-border)", borderTop: "none", boxShadow: "0 18px 40px -16px rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(Eyebrow, { color: "var(--text-muted)", style: { fontSize: 10 } }, autoRec ? "Will record" : "Prompt only"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 14, fontWeight: 700, color: "var(--text-primary)", maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, p.title))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 54, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 5 } }, /* @__PURE__ */ React.createElement(RoundBtn, { size: 44, onClick: app.back }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 20, color: "#fff" }))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 110, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "rgba(255,255,255,0.5)" } }, "YOUR CAMERA")), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--bg-secondary)", borderTopLeftRadius: 24, borderTopRightRadius: 24, border: "1px solid var(--border-default)", borderBottom: "none", boxShadow: "0 -20px 50px -20px rgba(0,0,0,0.7)", transition: "transform .42s cubic-bezier(.22,1,.36,1)", transform: sheet ? "translateY(0)" : "translateY(calc(100% - 168px))" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSheet((v) => !v), className: "pd-tap", style: { width: "100%", background: "none", border: "none", cursor: "pointer", padding: "10px 0 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 5, borderRadius: 9, background: "var(--ink-600)", margin: "0 auto" } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 20px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" } }, "Prompt settings"), /* @__PURE__ */ React.createElement(Eyebrow, null, follow ? "Follow voice" : "Steady")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(SettingRow, { top: true }, /* @__PURE__ */ React.createElement(DSr.Slider, { label: "Scroll speed", min: 80, max: 240, value: speed, suffix: " wpm", onChange: (e) => setSpeed(+e.target.value) })), /* @__PURE__ */ React.createElement(SettingRow, null, /* @__PURE__ */ React.createElement(DSr.Slider, { label: "Font size", min: 28, max: 64, value: font, suffix: "px", onChange: (e) => setFont(+e.target.value) })), /* @__PURE__ */ React.createElement(SettingRow, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" } }, "Text alignment"), /* @__PURE__ */ React.createElement(DSr.SegmentedControl, { options: ["Left", "Centre", "Right"], value: pos, onChange: setPos }))), /* @__PURE__ */ React.createElement(SettingRow, null, /* @__PURE__ */ React.createElement(DSr.Switch, { spread: true, label: "Follow my voice", checked: follow, onChange: (e) => setFollow(e.target.checked) })), /* @__PURE__ */ React.createElement(SettingRow, null, /* @__PURE__ */ React.createElement(DSr.Switch, { spread: true, label: "Record after countdown", checked: autoRec, onChange: (e) => setAutoRec(e.target.checked) })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 20px calc(16px + env(safe-area-inset-bottom, 22px))", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => app.openLive({ title: p.title, lines, speed, font, pos, autoRec, follow }), style: { flex: 1, height: 60, borderRadius: 18, border: "none", cursor: "pointer", background: autoRec ? "var(--recording)" : "var(--accent-primary)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: autoRec ? "var(--glow-recording)" : "var(--glow-accent)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 14, height: 14, borderRadius: autoRec ? 999 : 4, background: "#fff" } }), autoRec ? "Record take" : "Start prompting"))));
}
function LiveSession({ cfg, onExit, onComplete }) {
  const lines = cfg.lines;
  const [phase, setPhase] = React.useState("countdown");
  const [count, setCount] = React.useState(3);
  const [idx, setIdx] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [camOk, setCamOk] = React.useState(false);
  const recording = cfg.autoRec;
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const recRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const startedRef = React.useRef(0);
  const savingRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => setExpanded(true), 60);
    return () => clearTimeout(t);
  }, []);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } }, audio: true });
        if (!alive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setCamOk(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {
          });
        }
      } catch (e) {
        setCamOk(false);
      }
    })();
    return () => {
      alive = false;
      try {
        streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {
      }
    };
  }, []);
  function startRec() {
    const stream = streamRef.current;
    if (!stream || !recording || !("MediaRecorder" in window) || recRef.current) return;
    try {
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm";
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      mr.start(1e3);
      recRef.current = mr;
      startedRef.current = Date.now();
    } catch (e) {
    }
  }
  async function finishRec() {
    const mr = recRef.current;
    recRef.current = null;
    if (!mr || savingRef.current) {
      onComplete({});
      return;
    }
    savingRef.current = true;
    mr.onstop = async () => {
      const dur = Date.now() - startedRef.current;
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || "video/webm" });
      const id = crypto.randomUUID ? crypto.randomUUID() : "tk" + Date.now();
      try {
        await PDsvc.putTake({ id, createdAt: Date.now(), durationMs: dur, size: blob.size, source: "camera", title: cfg.title, blob });
      } catch (e) {
      }
      try {
        streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {
      }
      onComplete({ id });
    };
    try {
      mr.stop();
    } catch (e) {
      onComplete({});
    }
  }
  React.useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      setPhase("prompting");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 850);
    return () => clearTimeout(t);
  }, [phase, count]);
  React.useEffect(() => {
    if (phase === "prompting") startRec();
  }, [phase]);
  React.useEffect(() => {
    if (phase !== "prompting") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1e3);
    return () => clearInterval(t);
  }, [phase]);
  React.useEffect(() => {
    if (phase !== "prompting" || cfg.follow) return;
    const words = (lines[idx] || "").split(/\s+/).length;
    const ms = Math.max(1500, words / cfg.speed * 60 * 1e3);
    const t = setTimeout(() => setIdx((i) => {
      if (i + 1 >= lines.length) {
        setPhase("complete");
        return i;
      }
      return i + 1;
    }), ms);
    return () => clearTimeout(t);
  }, [phase, idx, cfg.follow, cfg.speed, lines]);
  React.useEffect(() => {
    if (phase === "complete") finishRec();
  }, [phase]);
  const advance = () => {
    if (phase === "prompting" && cfg.follow) setIdx((i) => {
      if (i + 1 >= lines.length) {
        setPhase("complete");
        return i;
      }
      return i + 1;
    });
  };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progress = phase === "complete" ? 100 : idx / Math.max(1, lines.length - 1) * 100;
  const dim = phase === "prompting" ? 0.5 : 0.2;
  const dropH = phase === "complete" ? 360 : phase === "countdown" ? 320 : "min(64%, 520px)";
  const Line = ({ i, kind }) => {
    const t = lines[i];
    if (!t) return /* @__PURE__ */ React.createElement("div", { style: { height: 6 } });
    const styles = { cur: { fontSize: Math.min(cfg.font, 40), color: "var(--tp-current)", fontWeight: 600 }, adj: { fontSize: Math.min(cfg.font - 8, 30), color: "var(--tp-adjacent)", fontWeight: 500 }, far: { fontSize: Math.min(cfg.font - 14, 24), color: "var(--tp-far)", fontWeight: 500 } }[kind];
    const align = cfg.pos === "Left" ? "left" : cfg.pos === "Right" ? "right" : "center";
    return /* @__PURE__ */ React.createElement("div", { style: { ...styles, opacity: 1, lineHeight: 1.34, letterSpacing: "-0.01em", textAlign: align, transition: "all .45s ease", padding: "6px 0" } }, t);
  };
  const exit = () => {
    try {
      streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop());
    } catch (e) {
    }
    onExit();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "#000", zIndex: 30, overflow: "hidden" } }, camOk ? /* @__PURE__ */ React.createElement("video", { ref: videoRef, playsInline: true, muted: true, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", filter: `brightness(${1 - dim})` } }) : /* @__PURE__ */ React.createElement(CameraView, { dim }), /* @__PURE__ */ React.createElement("div", { onClick: advance, style: { position: "absolute", top: 0, left: 6, right: 6, height: expanded ? dropH : 84, background: "#000", borderRadius: "0 0 40px 40px", border: "1px solid var(--promptdrop-border)", borderTop: "none", boxShadow: "var(--shadow-promptdrop)", transition: "height .48s cubic-bezier(.22,1,.36,1)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", zIndex: 31 } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 50, display: "flex", alignItems: "center", gap: 8, height: 24 } }, recording && phase !== "complete" && /* @__PURE__ */ React.createElement("span", { className: "pd-rec-dot" }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: recording ? "#FF8077" : "var(--text-muted)" } }, phase === "countdown" ? recording ? "GET READY" : "STARTING" : phase === "complete" ? "COMPLETE" : recording ? `REC ${fmt(elapsed)}` : `PROMPTING ${fmt(elapsed)}`)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 26px" } }, phase === "countdown" && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(PromptCharacter, { state: "countdown", size: 64 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 96, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", lineHeight: 1, marginTop: 6 } }, count === 0 ? "Go" : count)), (phase === "prompting" || phase === "paused") && /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 420 } }, /* @__PURE__ */ React.createElement(Line, { i: idx - 1, kind: "far" }), /* @__PURE__ */ React.createElement(Line, { i: idx, kind: "cur" }), /* @__PURE__ */ React.createElement(Line, { i: idx + 1, kind: "adj" }), /* @__PURE__ */ React.createElement(Line, { i: idx + 2, kind: "far" }), cfg.follow && phase === "prompting" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)" } }, "TAP TO ADVANCE")), phase === "complete" && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(PromptCharacter, { state: "complete", size: 76 }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" } }, "Nice take."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--text-muted)" } }, fmt(elapsed), " \xB7 ", cfg.speed, " WPM"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 12.5, color: "var(--text-muted)" } }, "Saving your take\u2026"))), (phase === "prompting" || phase === "paused") && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, height: 3, width: `${progress}%`, background: "var(--accent-primary)", borderRadius: "0 3px 0 0", transition: "width .4s linear" } })), phase !== "complete" && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 24px calc(26px + env(safe-area-inset-bottom, 22px))", zIndex: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement(RoundBtn, { size: 56, onClick: () => {
    setPhase("countdown");
    setCount(3);
    setIdx(0);
    setElapsed(0);
  } }, /* @__PURE__ */ React.createElement(Icon, { name: "redo", size: 22, color: "#fff" })), /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => setPhase((p) => p === "paused" ? "prompting" : "paused"), disabled: phase === "countdown", style: { width: 76, height: 76, borderRadius: 999, border: "4px solid rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: phase === "countdown" ? 0.4 : 1 } }, /* @__PURE__ */ React.createElement(Icon, { name: phase === "paused" ? "play" : "pause", size: 30, color: "#fff" })), /* @__PURE__ */ React.createElement(RoundBtn, { size: 56, bg: "rgba(255,59,48,0.22)", style: { borderColor: "rgba(255,59,48,0.5)" }, onClick: () => setPhase("complete") }, /* @__PURE__ */ React.createElement("span", { style: { width: 20, height: 20, borderRadius: 5, background: "var(--recording)" } }))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: exit, style: { background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, "Close"))));
}
function TakeReviewScreen({ app }) {
  const pd = useData();
  const [take, setTake] = React.useState(null);
  const [url, setUrl] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const vref = React.useRef(null);
  React.useEffect(() => {
    let live = true;
    (async () => {
      const t = await pd.svc.getTake(app.params.id);
      if (!live) return;
      setTake(t);
      if (t && t.blob) setUrl(URL.createObjectURL(t.blob));
    })();
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [app.params.id]);
  const fmtSize = (b) => b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.round(b / 1e3) + " KB";
  const insights = take ? [
    { icon: "clock", label: "Duration", value: pd.svc.clock(take.durationMs) },
    { icon: "video", label: "Source", value: take.source === "screen" ? "Screen + mic" : "Camera + mic" },
    { icon: "download", label: "Size", value: fmtSize(take.size || 0) }
  ] : [];
  function toggle() {
    const v = vref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }
  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "promptdrop-take.webm";
    a.click();
  }
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(NavHeader, { onBack: app.back, title: "Take", action: /* @__PURE__ */ React.createElement("button", { className: "pd-tap", style: iconBtn, onClick: download }, /* @__PURE__ */ React.createElement(Icon, { name: "download", size: 19, color: "var(--text-secondary)" })) }), /* @__PURE__ */ React.createElement(ScrollArea, { padBottom: 120 }, /* @__PURE__ */ React.createElement("div", { style: { margin: "6px 16px 0", borderRadius: 22, overflow: "hidden", position: "relative", aspectRatio: "9 / 13", maxHeight: 380, background: "#000" } }, url ? /* @__PURE__ */ React.createElement("video", { ref: vref, src: url, playsInline: true, onEnded: () => setPlaying(false), style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ React.createElement(CameraView, { dim: 0.18 }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" } }, !playing && /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: toggle, style: { width: 64, height: 64, borderRadius: 999, border: "none", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", pointerEvents: "auto" } }, /* @__PURE__ */ React.createElement(Icon, { name: "play", size: 26, color: "#000" }))), playing && /* @__PURE__ */ React.createElement("div", { onClick: toggle, style: { position: "absolute", inset: 0 } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px 0" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, take ? pd.svc.rel(take.createdAt) : ""), /* @__PURE__ */ React.createElement("h2", { style: { margin: "6px 0 0", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" } }, take ? take.title || "Take" : "Loading\u2026")), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-elevated)", borderRadius: 16, overflow: "hidden" } }, insights.map((i, n) => /* @__PURE__ */ React.createElement("div", { key: i.label, style: { display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderBottom: n === insights.length - 1 ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement(Icon, { name: i.icon, size: 19, color: "var(--text-muted)", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 14.5, color: "var(--text-secondary)" } }, i.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14.5, fontWeight: 600, color: "var(--text-primary)" } }, i.value)))))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px calc(12px + env(safe-area-inset-bottom, 22px))", background: "linear-gradient(transparent, var(--bg-primary) 28%)", display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(DSr.Button, { variant: "secondary", size: "lg", onClick: async () => {
    if (take) {
      await pd.svc.delTake(take.id);
      pd.reload();
    }
    app.back();
  }, iconLeft: /* @__PURE__ */ React.createElement(Icon, { name: "trash", size: 17, color: "var(--text-primary)" }) }, "Delete"), /* @__PURE__ */ React.createElement(DSr.Button, { variant: "primary", size: "lg", fullWidth: true, onClick: () => {
    app.toast("Saved to your takes");
    app.back();
  }, iconLeft: /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18, color: "#fff" }) }, "Done")));
}
Object.assign(window, { RecordSetupScreen, LiveSession, TakeReviewScreen });

;/* app/screens-meetings.jsx */
const DSm = window.PromptDropDesignSystem_82c6c3;
function MeetingsScreen({ app }) {
  const pd = useData();
  const meetings = (pd.takes || []).filter((t) => t.source === "meeting").map((t) => ({ id: t.id, title: t.title || "Meeting", when: pd.svc.rel(t.createdAt), dur: pd.svc.clock(t.durationMs) }));
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(ScrollArea, null, /* @__PURE__ */ React.createElement(LargeTitle, { title: "Meetings" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 20px 0" } }, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => app.openMeeting(), style: { width: "100%", textAlign: "left", cursor: "pointer", border: "none", borderRadius: 16, padding: 16, background: "var(--surface-elevated)", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 46, height: 46, borderRadius: 999, background: "var(--recording)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: "mic", size: 22, color: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)" } }, "Record a meeting"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 3, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 } }, "Transcript, summary and actions.")), /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 20, color: "var(--ink-600)" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 20px 0" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, "Recent")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px" } }, meetings.map((m, i) => /* @__PURE__ */ React.createElement("button", { key: m.id, className: "pd-tap", onClick: () => app.nav("meeting", { id: m.id }), style: { width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "15px 0", borderBottom: i === meetings.length - 1 ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, m.title), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.04em" } }, String(m.when).toUpperCase(), " \xB7 ", m.dur.toUpperCase())), /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 18, color: "var(--ink-600)" }))), meetings.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "40px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, color: "var(--text-secondary)" } }, "No meetings yet."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 13, color: "var(--text-muted)" } }, "Record one and get a transcript, summary and actions.")))));
}
function MeetingLive({ onExit, onDone }) {
  const [phase, setPhase] = React.useState("recording");
  const [elapsed, setElapsed] = React.useState(0);
  const [note, setNote] = React.useState("Transcribing the recording\u2026");
  const streamRef = React.useRef(null);
  const recRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const startRef = React.useRef(0);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!alive) {
          stream.getTracks().forEach((t2) => t2.stop());
          return;
        }
        streamRef.current = stream;
        chunksRef.current = [];
        const mime = window.MediaRecorder && MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
        const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size) chunksRef.current.push(e.data);
        };
        mr.start(1e3);
        recRef.current = mr;
        startRef.current = Date.now();
      } catch (e) {
        setNote("Microphone permission needed.");
      }
    })();
    const t = setInterval(() => setElapsed((e) => e + 1), 1e3);
    return () => {
      clearInterval(t);
      try {
        streamRef.current && streamRef.current.getTracks().forEach((x) => x.stop());
      } catch (e) {
      }
    };
  }, []);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  async function stop() {
    const mr = recRef.current;
    recRef.current = null;
    setPhase("processing");
    const dur = Date.now() - startRef.current;
    const finish = async (blob) => {
      try {
        streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {
      }
      const id = crypto.randomUUID ? crypto.randomUUID() : "mt" + Date.now();
      let transcript = "", summary = "", actions = [], decisions = [], questions = [];
      const tr = await PDsvc.transcribe(blob);
      if (tr.ok) {
        transcript = tr.text || "";
        if (transcript.trim()) {
          setNote("Summarising and pulling actions\u2026");
          const sx = await PDsvc.ask("Summarise this call in 2 to 3 sentences. Return only the summary.", transcript);
          if (sx.ok) summary = sx.text;
          const ax = await PDsvc.ask("List the action items, one per line, no other text. If none, return nothing.", transcript);
          if (ax.ok) actions = ax.text.split("\n").map((s) => s.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
          const dx = await PDsvc.ask("List the decisions made, one per line, no other text. If none, return nothing.", transcript);
          if (dx.ok) decisions = dx.text.split("\n").map((s) => s.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
          const qx = await PDsvc.ask("List the open questions, one per line, no other text. If none, return nothing.", transcript);
          if (qx.ok) questions = qx.text.split("\n").map((s) => s.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
        }
      }
      const title = "Meeting \xB7 " + (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      try {
        await PDsvc.putTake({ id, createdAt: Date.now(), durationMs: dur, size: blob.size, source: "meeting", title, blob, transcript, summary, actions, decisions, questions });
      } catch (e) {
      }
      onDone(id);
    };
    if (!mr) {
      onDone(null);
      return;
    }
    mr.onstop = () => finish(new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" }));
    try {
      mr.stop();
    } catch (e) {
      onDone(null);
    }
  }
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "var(--ink-1000, #050506)", zIndex: 30, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: TOP_INSET, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, background: "var(--surface-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "10px 13px" } }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 18, color: "var(--accent-primary)" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.35 } }, "Recording in progress. You are responsible for getting everyone's consent first."))), phase === "recording" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "8px 0 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "pd-rec-dot" }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.02em" } }, fmt(elapsed))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 2, fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", color: "#FF8077" } }, "RECORDING")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 56, margin: "10px 0" } }, Array.from({ length: 38 }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "pd-wave-bar", style: { animationDelay: `${i % 9 * 0.11}s` } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 } }, "Capturing the conversation. When you stop, PromptDrop transcribes it and pulls the summary, decisions and actions.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 40, padding: "14px 0 calc(26px + env(safe-area-inset-bottom, 22px))" } }, /* @__PURE__ */ React.createElement(RoundBtn, { size: 56, bg: "var(--surface-elevated)", style: { borderColor: "var(--border-default)" }, onClick: onExit }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 22, color: "var(--text-secondary)" })), /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: stop, style: { width: 76, height: 76, borderRadius: 999, border: "4px solid rgba(255,255,255,0.2)", background: "var(--recording)", boxShadow: "var(--glow-recording)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 24, height: 24, borderRadius: 6, background: "#fff" } })), /* @__PURE__ */ React.createElement("div", { style: { width: 56 } }))), phase === "processing" && /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 60 } }, /* @__PURE__ */ React.createElement(PromptCharacter, { state: "processing", size: 92 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--text-primary)" } }, "Making sense of the call\u2026"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--text-muted)" } }, note)));
}
function Section({ title, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 26 } }, /* @__PURE__ */ React.createElement(Eyebrow, { style: { marginBottom: 12 } }, title), children);
}
const ASK_SUGGESTIONS = ["What did I commit to?", "Summarise in one line", "What should I say in the follow-up?"];
function MeetingDetailScreen({ app }) {
  const pd = useData();
  const [m, setM] = React.useState(null);
  const [tab, setTab] = React.useState("Summary");
  const [done, setDone] = React.useState({});
  const [chat, setChat] = React.useState([{ role: "ai", t: "Ask me anything about this call, what was decided, what you owe, or what to say next." }]);
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    let live = true;
    (async () => {
      const t = await pd.svc.getTake(app.params.id);
      if (live) setM(t);
    })();
    return () => {
      live = false;
    };
  }, [app.params.id]);
  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setChat((c) => [...c, { role: "me", t: q }]);
    setDraft("");
    setBusy(true);
    const r = await pd.svc.ask(q, m ? m.transcript || m.summary || "" : "");
    setBusy(false);
    setChat((c) => [...c, { role: "ai", t: r.ok ? r.text : r.msg || "Could not answer." }]);
  };
  if (!m) return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(NavHeader, { onBack: app.back }), /* @__PURE__ */ React.createElement("div", { style: { padding: 40, color: "var(--text-muted)" } }, "Loading\u2026"));
  const transcript = m.transcript || "";
  const tLines = transcript.trim() ? [{ s: "Transcript", t: transcript }] : [];
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(NavHeader, { onBack: app.back }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 4px" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, String(pd.svc.rel(m.createdAt)).toUpperCase(), " \xB7 ", pd.svc.clock(m.durationMs).toUpperCase()), /* @__PURE__ */ React.createElement("h1", { style: { margin: "8px 0 14px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.1 } }, m.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "var(--surface-sunken)", borderRadius: 10, padding: 3, gap: 2 } }, ["Summary", "Transcript", "Ask"].map((o) => /* @__PURE__ */ React.createElement("button", { key: o, onClick: () => setTab(o), className: "pd-tap", style: { flex: 1, height: 34, borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, background: tab === o ? "var(--surface-raised)" : "transparent", color: tab === o ? "var(--text-primary)" : "var(--text-muted)", boxShadow: tab === o ? "var(--shadow-subtle)" : "none" } }, o)))), tab !== "Ask" && /* @__PURE__ */ React.createElement(ScrollArea, { padBottom: TAB_H, style: { padding: "0 20px" } }, tab === "Summary" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6 } }, m.summary || "No summary yet. If transcription is switched on, the summary appears here after recording.")), m.actions && m.actions.length > 0 && /* @__PURE__ */ React.createElement(Section, { title: "Action items" }, /* @__PURE__ */ React.createElement("div", null, m.actions.map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, className: "pd-tap", onClick: () => setDone((d) => ({ ...d, [i]: !d[i] })), style: { width: "100%", textAlign: "left", background: "none", border: "none", display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 0", cursor: "pointer", borderBottom: i === m.actions.length - 1 ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: done[i] ? "none" : "1.5px solid var(--border-strong)", background: done[i] ? "var(--accent-primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" } }, done[i] && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, color: "var(--text-primary)", lineHeight: 1.45, textDecoration: done[i] ? "line-through" : "none", opacity: done[i] ? 0.5 : 1 } }, a))))), m.decisions && m.decisions.length > 0 && /* @__PURE__ */ React.createElement(Section, { title: "Decisions" }, /* @__PURE__ */ React.createElement("div", null, m.decisions.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 0", borderBottom: i === m.decisions.length - 1 ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 16, color: "var(--text-muted)", style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, color: "var(--text-primary)", lineHeight: 1.45 } }, d))))), m.questions && m.questions.length > 0 && /* @__PURE__ */ React.createElement(Section, { title: "Open questions" }, /* @__PURE__ */ React.createElement("div", null, m.questions.map((q, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 0", borderBottom: i === m.questions.length - 1 ? "none" : "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", flexShrink: 0, width: 16 } }, "?"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, color: "var(--text-primary)", lineHeight: 1.45 } }, q))))), /* @__PURE__ */ React.createElement("div", { style: { height: 16 } })), tab === "Transcript" && /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 18 } }, transcript.trim() ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" } }, transcript) : /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "var(--text-muted)" } }, "No transcript. Transcription needs to be switched on for your account."), /* @__PURE__ */ React.createElement("div", { style: { height: 16 } }))), tab === "Ask" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pd-scroll", style: { flex: 1, minHeight: 0, overflowY: "auto", padding: "18px 20px 8px", display: "flex", flexDirection: "column", gap: 12 } }, chat.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { alignSelf: c.role === "me" ? "flex-end" : "flex-start", maxWidth: "82%" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "11px 14px", borderRadius: 16, fontSize: 14.5, lineHeight: 1.5, background: c.role === "me" ? "var(--accent-primary)" : "var(--surface-elevated)", color: c.role === "me" ? "#fff" : "var(--text-primary)", border: c.role === "me" ? "none" : "1px solid var(--border-default)", borderBottomRightRadius: c.role === "me" ? 5 : 16, borderBottomLeftRadius: c.role === "me" ? 16 : 5, whiteSpace: "pre-wrap" } }, c.t))), busy && /* @__PURE__ */ React.createElement("div", { style: { alignSelf: "flex-start", fontSize: 13, color: "var(--text-muted)", padding: "4px 6px" } }, "Thinking\u2026")), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 16px 0" } }, /* @__PURE__ */ React.createElement("div", { className: "pd-hscroll", style: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 } }, ASK_SUGGESTIONS.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, className: "pd-tap", onClick: () => ask(s), style: { flexShrink: 0, height: 34, padding: "0 13px", borderRadius: 999, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" } }, s)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 16px calc(14px + env(safe-area-inset-bottom, 22px))", display: "flex", gap: 9, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", background: "var(--surface-elevated)", border: "1px solid var(--border-default)", borderRadius: 999, padding: "0 6px 0 16px", height: 46 } }, /* @__PURE__ */ React.createElement("input", { value: draft, onChange: (e) => setDraft(e.target.value), onKeyDown: (e) => e.key === "Enter" && ask(draft), placeholder: "Ask about this call\u2026", style: { flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 15, fontFamily: "var(--font-sans)" } }), /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => ask(draft), style: { width: 34, height: 34, borderRadius: 999, border: "none", background: draft.trim() ? "var(--accent-primary)" : "var(--surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: "send", size: 16, color: draft.trim() ? "#fff" : "var(--text-muted)" }))))));
}
Object.assign(window, { MeetingsScreen, MeetingLive, MeetingDetailScreen });

;/* app/screens-account.jsx */
const DSa = window.PromptDropDesignSystem_82c6c3;
const ONB = [
  { eyebrow: "PROMPTDROP", title: "Keep your eyes on the lens.", body: "A teleprompter that lives beside your camera, so you read naturally and still look people in the eye.", art: "drop" },
  { eyebrow: "PROMPT ON CAMERA", title: "Read like you mean it.", body: "Your script sits right by the lens. Set the pace, or let it follow your voice. Record a take in a tap.", art: "prompt" },
  { eyebrow: "MEETINGS", title: "Never lose the thread of a call.", body: "Record a conversation and get a clean transcript, a summary, decisions and the actions you owe.", art: "meeting" }
];
function OnbArt({ kind }) {
  if (kind === "prompt") return /* @__PURE__ */ React.createElement("div", { style: { width: 240, height: 200, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 210, height: 150, background: "#000", borderRadius: "0 0 40px 40px", border: "1px solid var(--promptdrop-border)", borderTop: "none", boxShadow: "var(--shadow-promptdrop)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, position: "absolute", top: 14 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 6, height: 6, borderRadius: 9, background: "var(--ink-50)", opacity: 0.9 } }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--tp-far)" } }, "that keeps your eyes"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 19, fontWeight: 600, color: "var(--tp-current)", textAlign: "center" } }, "right next to the lens."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--tp-adjacent)" } }, "No more glancing away.")));
  if (kind === "meeting") return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 200 } }, Array.from({ length: 26 }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "pd-wave-bar", style: { animationDelay: `${i % 9 * 0.12}s` } })));
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 240, height: 200, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, var(--blue-tint), transparent 65%)" } }), /* @__PURE__ */ React.createElement("div", { style: { width: 180, height: 130, background: "#000", borderRadius: 36, border: "1px solid var(--promptdrop-border)", boxShadow: "var(--shadow-promptdrop)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, position: "absolute", top: 16 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: 9, background: "var(--ink-50)" } }))), /* @__PURE__ */ React.createElement(PromptCharacter, { state: "idle", size: 72 })));
}
function OnboardingScreen({ app }) {
  const [i, setI] = React.useState(0);
  const [consent, setConsent] = React.useState(false);
  const last = i === ONB.length - 1;
  if (consent) return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "0 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 72, height: 72, borderRadius: 20, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 32, color: "var(--accent-primary)" })), /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" } }, "Honest by default"), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 320 } }, "PromptDrop needs your camera and microphone to prompt and record. Takes stay on your device until you choose to save or share them. You are always told when recording is on, and you are responsible for getting consent before recording others."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320, marginTop: 6 } }, [["video", "Camera", "For prompting and your takes"], ["mic", "Microphone", "For takes and meeting capture"]].map(([ic, t, d]) => /* @__PURE__ */ React.createElement("div", { key: t, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-elevated)", border: "1px solid var(--border-default)", borderRadius: 14, textAlign: "left" } }, /* @__PURE__ */ React.createElement(Icon, { name: ic, size: 20, color: "var(--text-secondary)" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14.5, fontWeight: 600, color: "var(--text-primary)" } }, t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-muted)" } }, d)))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 0 calc(20px + env(safe-area-inset-bottom, 22px))" } }, /* @__PURE__ */ React.createElement(DSa.Button, { variant: "primary", size: "lg", fullWidth: true, onClick: app.finishOnboarding }, "Allow & continue"), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", margin: "12px 0 0", fontSize: 12, color: "var(--text-muted)" } }, "You can change this anytime in Settings."))));
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "0 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { paddingTop: TOP_INSET + 6, display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => setConsent(true), style: { background: "none", border: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, "Skip")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 22 } }, /* @__PURE__ */ React.createElement(OnbArt, { kind: ONB[i].art }), /* @__PURE__ */ React.createElement(Eyebrow, { color: "var(--accent-primary)" }, ONB[i].eyebrow), /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.1, maxWidth: 320 } }, ONB[i].title), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 330 } }, ONB[i].body)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 7, marginBottom: 20 } }, ONB.map((_, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: { width: j === i ? 22 : 7, height: 7, borderRadius: 9, background: j === i ? "var(--accent-primary)" : "var(--ink-700)", transition: "all .3s" } }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 0 calc(20px + env(safe-area-inset-bottom, 22px))" } }, /* @__PURE__ */ React.createElement(DSa.Button, { variant: "primary", size: "lg", fullWidth: true, onClick: () => last ? setConsent(true) : setI(i + 1) }, last ? "Get started" : "Continue"))));
}
function Group({ header, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22 } }, header && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 8px 8px" } }, /* @__PURE__ */ React.createElement(Eyebrow, null, header)), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface-elevated)", border: "none", borderRadius: 16, overflow: "hidden" } }, children));
}
function Row({ icon, label, value, onClick, last, control }) {
  return /* @__PURE__ */ React.createElement("div", { onClick, className: onClick ? "pd-tap" : "", style: { display: "flex", alignItems: "center", gap: 13, padding: "14px 14px", cursor: onClick ? "pointer" : "default", borderBottom: last ? "none" : "1px solid var(--border-subtle)" } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 19, color: "var(--text-muted)", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 15, color: "var(--text-primary)" } }, label), value && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--text-muted)" } }, value), control, onClick && /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 17, color: "var(--ink-600)" }));
}
const PLAN_NAME = { free: "Free", creator_pro: "Creator Pro", studio_pro: "Studio Pro" };
function AccountScreen({ app }) {
  const pd = useData();
  const user = pd.user || {};
  const email = user.email || "";
  const name = user.user_metadata && user.user_metadata.display_name || (email ? email.split("@")[0] : "You");
  const initials = (name || "Y").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const planName = PLAN_NAME[pd.plan] || "Free";
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(ScrollArea, null, /* @__PURE__ */ React.createElement(LargeTitle, { title: "Account" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 20px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, padding: "16px 16px", background: "var(--surface-elevated)", border: "none", borderRadius: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 52, height: 52, borderRadius: 999, background: "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 600, color: "#fff" } }, initials), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--text-primary)" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, email)), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--text-muted)", border: "1px solid var(--border-default)", borderRadius: 6, padding: "3px 7px" } }, planName.toUpperCase())), pd.plan === "free" && /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => app.nav("upgrade"), style: { width: "100%", textAlign: "left", marginTop: 12, cursor: "pointer", border: "none", borderRadius: 18, padding: 16, background: "var(--surface-elevated)", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 12, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: "zap", size: 20, color: "var(--accent-primary)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)" } }, "Upgrade to Studio Pro"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-muted)" } }, "Unlimited takes, meetings, AI notes")), /* @__PURE__ */ React.createElement(Icon, { name: "chevronR", size: 20, color: "var(--ink-600)" })), /* @__PURE__ */ React.createElement(Group, { header: "Recording" }, /* @__PURE__ */ React.createElement(Row, { icon: "video", label: "Camera", value: "Front" }), /* @__PURE__ */ React.createElement(Row, { icon: "mic", label: "Microphone", value: "Device mic" }), /* @__PURE__ */ React.createElement(Row, { icon: "gauge", label: "Default speed", value: "142 wpm", last: true })), /* @__PURE__ */ React.createElement(Group, { header: "Privacy & trust" }, /* @__PURE__ */ React.createElement(Row, { icon: "shield", label: "Consent & recording", onClick: () => {
    location.href = "/acceptable-use";
  } }), /* @__PURE__ */ React.createElement(Row, { icon: "download", label: "Privacy policy", onClick: () => {
    location.href = "/privacy";
  }, last: true })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: async () => {
    await pd.svc.signOut();
    pd.reload();
  }, style: { width: "100%", padding: "14px", background: "var(--surface-elevated)", border: "none", borderRadius: 14, color: "var(--error)", fontSize: 15, fontWeight: 600, cursor: "pointer" } }, "Sign out")), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", margin: "16px 0 0", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.05em" } }, "PROMPTDROP"))));
}
const PRO_FEATURES = ["Unlimited takes & recordings", "Unlimited meeting capture", "AI transcripts, notes & Ask", "Follow-my-voice prompting", "Desktop overlay for meetings", "Cloud sync across devices"];
function UpgradeScreen({ app }) {
  const pd = useData();
  const [plan, setPlan] = React.useState("year");
  const [busy, setBusy] = React.useState(false);
  async function buy() {
    setBusy(true);
    const r = await pd.svc.checkout("studio_pro", plan === "year" ? "yearly" : "monthly");
    setBusy(false);
    if (!r.ok) app.toast(r.msg || "Payments pending");
  }
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement(NavHeader, { onBack: app.back, title: "Studio Pro" }), /* @__PURE__ */ React.createElement(ScrollArea, { padBottom: 150 }, /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 24px 0", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 18, margin: "0 auto", background: "linear-gradient(135deg, var(--blue-500), var(--violet-500))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-accent)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "zap", size: 30, color: "#fff" })), /* @__PURE__ */ React.createElement("h1", { style: { margin: "16px 0 0", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" } }, "PromptDrop Studio Pro"), /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.5 } }, "Everything you need to look your best on camera, every time.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 24px 0", display: "flex", flexDirection: "column", gap: 12 } }, PRO_FEATURES.map((f) => /* @__PURE__ */ React.createElement("div", { key: f, style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 999, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14, color: "var(--accent-primary)" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, color: "var(--text-primary)" } }, f)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 10 } }, [["year", "Yearly", "$95 / year", "Best value"], ["month", "Monthly", "$9 / month", null]].map(([id, t, price, n]) => /* @__PURE__ */ React.createElement("button", { key: id, className: "pd-tap", onClick: () => setPlan(id), style: { textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: "var(--surface-elevated)", border: `1.5px solid ${plan === id ? "var(--accent-primary)" : "var(--border-default)"}`, boxShadow: plan === id ? "0 0 0 3px var(--blue-tint)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 22, height: 22, borderRadius: 999, border: `2px solid ${plan === id ? "var(--accent-primary)" : "var(--border-strong)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, plan === id && /* @__PURE__ */ React.createElement("span", { style: { width: 11, height: 11, borderRadius: 999, background: "var(--accent-primary)" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15.5, fontWeight: 700, color: "var(--text-primary)" } }, t), n && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--success)" } }, n)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--text-primary)" } }, price))))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 24px calc(14px + env(safe-area-inset-bottom, 22px))", background: "linear-gradient(transparent, var(--bg-primary) 30%)" } }, /* @__PURE__ */ React.createElement(DSa.Button, { variant: "launch", size: "lg", fullWidth: true, onClick: buy }, busy ? "Opening checkout\u2026" : `Upgrade, ${plan === "year" ? "$95/yr" : "$9/mo"}`), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", margin: "10px 0 0", fontSize: 11.5, color: "var(--text-muted)" } }, "Cancel anytime. Renews automatically.")));
}
Object.assign(window, { OnboardingScreen, AccountScreen, UpgradeScreen });

;/* app/app.jsx */
const FULLSCREEN = { script: 1, recordSetup: 1, takeReview: 1, meeting: 1, upgrade: 1 };
const ROOTS = { library: LibraryScreen, meetings: MeetingsScreen, account: AccountScreen };
const PUSHED = { script: ScriptScreen, recordSetup: RecordSetupScreen, takeReview: TakeReviewScreen, meeting: MeetingDetailScreen, upgrade: UpgradeScreen };
const TABS = [
  { id: "library", label: "Library", icon: "library" },
  { id: "record", label: "Record", icon: "record" },
  { id: "meetings", label: "Meetings", icon: "meetings" },
  { id: "account", label: "Account", icon: "account" }
];
function TabBar({ tab, onTab, onRecord }) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 20, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)", paddingTop: 8, background: "rgba(10,10,11,0.82)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", justifyContent: "space-around" } }, TABS.map((t) => {
    const active = tab === t.id;
    if (t.id === "record") return /* @__PURE__ */ React.createElement("button", { key: t.id, className: "pd-tap", onClick: onRecord, style: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1, marginTop: -4 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 50, height: 50, borderRadius: 999, background: "var(--recording)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-recording)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 18, height: 18, borderRadius: 999, background: "#fff" } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)" } }, t.label));
    return /* @__PURE__ */ React.createElement("button", { key: t.id, className: "pd-tap", onClick: () => onTab(t.id), style: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1, paddingTop: 4 } }, /* @__PURE__ */ React.createElement(Icon, { name: t.icon, size: 25, color: active ? "var(--accent-primary)" : "var(--ink-450)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10.5, fontWeight: 600, color: active ? "var(--accent-primary)" : "var(--text-muted)" } }, t.label));
  }));
}
const linesFromBody = (b) => b && b.trim() ? b.split(/\n\n+/).map((l) => l.trim()).filter(Boolean) : [];
function AuthScreen({ onDone }) {
  const [mode, setMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [name, setName] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const inputStyle = { width: "100%", height: 50, borderRadius: 14, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 16, padding: "0 14px", fontFamily: "var(--font-sans)", outline: "none", marginBottom: 10 };
  async function go() {
    if (mode === "signup" && !agree) {
      setMsg("Please agree to the Terms and Privacy Policy.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const r = mode === "signin" ? await PDsvc.signIn(email, pw) : await PDsvc.signUp(email, pw, name || email.split("@")[0]);
    setBusy(false);
    if (!r.ok) {
      setMsg(r.msg || "Something went wrong.");
      return;
    }
    if (mode === "signup" && r.needsConfirm) {
      setMsg("Check your email to confirm, then sign in.");
      setMode("signin");
      return;
    }
    onDone && onDone();
  }
  return /* @__PURE__ */ React.createElement(Screen, null, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "0 26px", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" } }, mode === "signin" ? "Welcome back" : "Create your account"), /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0", fontSize: 15, color: "var(--text-secondary)" } }, "Sync your scripts and plan across devices.")), mode === "signup" && /* @__PURE__ */ React.createElement("input", { style: inputStyle, placeholder: "Your name", value: name, onChange: (e) => setName(e.target.value) }), /* @__PURE__ */ React.createElement("input", { style: inputStyle, type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value) }), /* @__PURE__ */ React.createElement("input", { style: inputStyle, type: "password", placeholder: "Password (6+ characters)", value: pw, onChange: (e) => setPw(e.target.value) }), mode === "signup" && /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.45, margin: "2px 2px 12px" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: agree, onChange: (e) => setAgree(e.target.checked), style: { width: 18, height: 18, marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", null, "I agree to the Terms and Privacy Policy, and I am responsible for getting consent before recording anyone.")), msg && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--accent-primary)", marginBottom: 10, textAlign: "center" } }, msg), /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: go, disabled: busy, style: { height: 52, borderRadius: 14, border: "none", background: "var(--accent-primary)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" } }, busy ? "Working\u2026" : mode === "signin" ? "Sign in" : "Create account"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 16, fontSize: 14, color: "var(--text-secondary)" } }, mode === "signin" ? /* @__PURE__ */ React.createElement("span", null, "New here? ", /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => {
    setMode("signup");
    setMsg(null);
  }, style: { background: "none", border: "none", color: "var(--accent-primary)", fontWeight: 600, cursor: "pointer" } }, "Create an account")) : /* @__PURE__ */ React.createElement("span", null, "Have an account? ", /* @__PURE__ */ React.createElement("button", { className: "pd-tap", onClick: () => {
    setMode("signin");
    setMsg(null);
  }, style: { background: "none", border: "none", color: "var(--accent-primary)", fontWeight: 600, cursor: "pointer" } }, "Sign in")))));
}
function PromptDropApp() {
  const data = useData();
  const [onboarded, setOnboarded] = React.useState(() => {
    try {
      return localStorage.getItem("pd.onboarded") === "1";
    } catch (e) {
      return false;
    }
  });
  const [tab, setTab] = React.useState("library");
  const [stack, setStack] = React.useState([]);
  const [live, setLive] = React.useState(null);
  const [meeting, setMeeting] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const top = stack[stack.length - 1];
  const showTab = !top || !FULLSCREEN[top.screen];
  const showTabBar = showTab && !live && !meeting;
  const app = {
    params: top ? top.params || {} : {},
    nav: (screen, params) => setStack((s) => [...s, { screen, params }]),
    back: () => setStack((s) => s.slice(0, -1)),
    setTab: (t) => {
      setTab(t);
      setStack([]);
    },
    openLive: (cfg) => setLive(cfg),
    closeLive: () => setLive(null),
    openMeeting: () => setMeeting(true),
    finishOnboarding: () => {
      try {
        localStorage.setItem("pd.onboarded", "1");
      } catch (e) {
      }
      setOnboarded(true);
    },
    toast: (t) => {
      setToast(t);
      setTimeout(() => setToast(null), 2200);
    },
    reload: data.reload
  };
  if (!onboarded) return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ React.createElement(OnboardingScreen, { app }));
  if (data.loading) return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "var(--bg-primary)" } });
  if (!data.user) return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ React.createElement(AuthScreen, { onDone: data.reload }));
  const Root = ROOTS[tab] || LibraryScreen;
  const onRecord = () => {
    const s = data.scripts[0];
    app.nav("recordSetup", s ? { id: s.id, title: s.title, lines: linesFromBody(s.body) } : { id: null, title: "Untitled", lines: [] });
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement(Root, { app }), stack.map((entry, i) => {
    const Comp = PUSHED[entry.screen];
    if (!Comp) return null;
    return /* @__PURE__ */ React.createElement("div", { key: i, className: "pd-push", style: { position: "absolute", inset: 0, zIndex: 10 + i } }, /* @__PURE__ */ React.createElement(Comp, { app: { ...app, params: entry.params || {} } }));
  }), showTabBar && /* @__PURE__ */ React.createElement(TabBar, { tab, onTab: app.setTab, onRecord }), live && /* @__PURE__ */ React.createElement(LiveSession, { cfg: live, onExit: () => setLive(null), onComplete: (res) => {
    setLive(null);
    setStack((s) => s.filter((e) => e.screen !== "recordSetup"));
    app.reload();
    if (res && res.id) app.nav("takeReview", { id: res.id });
  } }), meeting && /* @__PURE__ */ React.createElement(MeetingLive, { onExit: () => setMeeting(false), onDone: (id) => {
    setMeeting(false);
    app.reload();
    if (id) app.nav("meeting", { id });
  } }), toast && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 16, right: 16, bottom: showTabBar ? 110 : 40, zIndex: 40, display: "flex", justifyContent: "center", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: 999, boxShadow: "var(--shadow-floating)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "checkCircle", size: 17, color: "var(--success)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)" } }, toast))));
}
window.PromptDropApp = PromptDropApp;
const _mount = document.getElementById("app-root");
if (_mount) {
  ReactDOM.createRoot(_mount).render(/* @__PURE__ */ React.createElement(DataProvider, null, /* @__PURE__ */ React.createElement(PromptDropApp, null)));
}

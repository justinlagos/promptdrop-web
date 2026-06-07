/* @ds-bundle: {"format":3,"namespace":"PromptDropDesignSystem_82c6c3","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"PromptCharacter","sourcePath":"components/promptdrop/PromptCharacter.jsx"},{"name":"PromptDrop","sourcePath":"components/promptdrop/PromptDrop.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"ae26acf1084f","components/buttons/IconButton.jsx":"8b000ffc59f6","components/display/Avatar.jsx":"be9ac650fa92","components/display/Badge.jsx":"44cd3634f4e3","components/display/Card.jsx":"db6d4713148c","components/display/Tag.jsx":"464cc8de2a3a","components/feedback/Alert.jsx":"9fbe914552bb","components/feedback/Spinner.jsx":"fad5ae81fe99","components/feedback/Toast.jsx":"ec6e1631662e","components/forms/Input.jsx":"c250bb6a6111","components/forms/SegmentedControl.jsx":"7b89ad29f84f","components/forms/Select.jsx":"b088a0e068a0","components/forms/Slider.jsx":"0f804c57d61d","components/forms/Switch.jsx":"2fc3978c11da","components/forms/Textarea.jsx":"f1f5ca8c3b9f","components/promptdrop/PromptCharacter.jsx":"091b18a4ef5b","components/promptdrop/PromptDrop.jsx":"47a7a5c289ad","ui_kits/control-app/app.jsx":"5fd0b28f25ff","ui_kits/control-app/icons.jsx":"fac60d8b3e8e","ui_kits/control-app/screens.jsx":"80cb7a59bc71","ui_kits/control-app/shell.jsx":"24072a49f1bc","ui_kits/prompt-drop/drop.jsx":"423553e7e09d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PromptDropDesignSystem_82c6c3 = window.PromptDropDesignSystem_82c6c3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-button-styles";
const css = `
.pd-btn {
  --_bg: var(--accent-primary);
  --_fg: var(--text-on-accent);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); font-weight: var(--weight-semibold);
  font-size: var(--text-button-size); letter-spacing: -0.005em;
  line-height: 1; white-space: nowrap; cursor: pointer;
  border: 1px solid transparent; border-radius: var(--radius-md);
  background: var(--_bg); color: var(--_fg);
  padding: 0 16px; height: 38px;
  transition: var(--transition-fast);
  user-select: none; position: relative;
}
.pd-btn:hover { filter: brightness(1.08); }
.pd-btn:active { transform: translateY(0.5px) scale(0.99); filter: brightness(0.96); }
.pd-btn:focus-visible { outline: none; box-shadow: var(--glow-focus); }
.pd-btn[disabled] { background: var(--disabled-bg); color: var(--disabled-fg); cursor: not-allowed; filter: none; transform: none; border-color: transparent; }

.pd-btn--sm { height: 30px; padding: 0 12px; font-size: var(--fs-13); border-radius: var(--radius-sm); }
.pd-btn--lg { height: 46px; padding: 0 22px; font-size: var(--fs-16); border-radius: var(--radius-lg); }

.pd-btn--secondary { --_bg: var(--surface-raised); --_fg: var(--text-primary); border-color: var(--border-default); }
.pd-btn--secondary:hover { background: var(--ink-700); filter: none; }

.pd-btn--ghost { --_bg: transparent; --_fg: var(--text-secondary); }
.pd-btn--ghost:hover { background: var(--surface-raised); color: var(--text-primary); filter: none; }

.pd-btn--destructive { --_bg: var(--error); --_fg: #fff; }

.pd-btn--recording { --_bg: var(--recording); --_fg: #fff; box-shadow: var(--glow-recording); }
.pd-btn--recording::before { content:""; width:8px; height:8px; border-radius:50%; background:#fff; box-shadow:0 0 6px rgba(255,255,255,.8); animation: pd-rec-pulse var(--pulse-period) infinite; }
@keyframes pd-rec-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

.pd-btn--launch { --_bg: var(--accent-primary); --_fg: #fff; box-shadow: var(--glow-accent); font-weight: var(--weight-bold); }
.pd-btn--launch:hover { box-shadow: 0 0 32px rgba(76,141,255,.45); filter: brightness(1.05); }

.pd-btn--block { width: 100%; }
.pd-btn__spinner { width:14px; height:14px; border:2px solid currentColor; border-right-color:transparent; border-radius:50%; animation: pd-spin .6s linear infinite; }
@keyframes pd-spin { to { transform: rotate(360deg); } }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }
}
function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  as = "button",
  children,
  className = "",
  ...props
}) {
  ensureStyles();
  const Tag = as;
  const classes = ["pd-btn", `pd-btn--${variant}`, size !== "md" ? `pd-btn--${size}` : "", fullWidth ? "pd-btn--block" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: classes,
    disabled: disabled || loading
  }, props), loading && /*#__PURE__*/React.createElement("span", {
    className: "pd-btn__spinner",
    "aria-hidden": "true"
  }), !loading && iconLeft, children, !loading && iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-iconbutton-styles";
const css = `
.pd-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: var(--radius-md);
  background: transparent; color: var(--text-secondary);
  border: 1px solid transparent; cursor: pointer;
  transition: var(--transition-fast);
}
.pd-iconbtn:hover { background: var(--surface-raised); color: var(--text-primary); }
.pd-iconbtn:active { transform: scale(0.94); }
.pd-iconbtn:focus-visible { outline: none; box-shadow: var(--glow-focus); }
.pd-iconbtn[disabled] { color: var(--disabled-fg); cursor: not-allowed; background: transparent; }
.pd-iconbtn--sm { width: 30px; height: 30px; border-radius: var(--radius-sm); }
.pd-iconbtn--lg { width: 46px; height: 46px; border-radius: var(--radius-lg); }
.pd-iconbtn--solid { background: var(--surface-raised); border-color: var(--border-default); }
.pd-iconbtn--solid:hover { background: var(--ink-700); }
.pd-iconbtn--accent { background: var(--accent-primary); color: #fff; }
.pd-iconbtn--accent:hover { filter: brightness(1.08); background: var(--accent-primary); }
.pd-iconbtn--fab { width: 52px; height: 52px; border-radius: var(--radius-pill); background: var(--accent-primary); color:#fff; box-shadow: var(--shadow-floating), var(--glow-accent); }
.pd-iconbtn--fab:hover { filter: brightness(1.06); background: var(--accent-primary); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }
}
function IconButton({
  variant = "ghost",
  size = "md",
  label,
  children,
  className = "",
  ...props
}) {
  ensureStyles();
  const classes = ["pd-iconbtn", variant !== "ghost" ? `pd-iconbtn--${variant}` : "", size !== "md" ? `pd-iconbtn--${size}` : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: classes,
    "aria-label": label,
    title: label
  }, props), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-avatar-styles";
const css = `
.pd-avatar {
  display:inline-flex; align-items:center; justify-content:center;
  width:36px; height:36px; border-radius: var(--radius-pill);
  background: var(--surface-raised); color: var(--text-primary);
  font-size: var(--fs-13); font-weight: var(--weight-semibold);
  border:1px solid var(--border-default); overflow:hidden; flex:none; user-select:none;
}
.pd-avatar img { width:100%; height:100%; object-fit:cover; }
.pd-avatar--sm { width:28px; height:28px; font-size: var(--fs-11); }
.pd-avatar--lg { width:48px; height:48px; font-size: var(--fs-16); }
.pd-avatar--accent { background: var(--blue-tint); color: var(--blue-300); border-color: rgba(76,141,255,.3); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");
}
function Avatar({
  name = "",
  src,
  size = "md",
  accent = false,
  className = "",
  ...props
}) {
  ensureStyles();
  const classes = ["pd-avatar", size !== "md" ? `pd-avatar--${size}` : "", accent ? "pd-avatar--accent" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes,
    title: name
  }, props), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-badge-styles";
const css = `
.pd-badge {
  display:inline-flex; align-items:center; gap:6px;
  font-family: var(--font-mono); font-size: var(--fs-11); font-weight: var(--weight-medium);
  letter-spacing: .04em; text-transform: uppercase;
  padding: 3px 8px; border-radius: var(--radius-sm); white-space:nowrap;
  background: var(--ink-750); color: var(--text-secondary); border:1px solid var(--border-subtle);
}
.pd-badge__dot { width:6px; height:6px; border-radius:50%; background: currentColor; }
.pd-badge--accent { background: var(--blue-tint); color: var(--blue-400); border-color: rgba(76,141,255,.25); }
.pd-badge--success { background: var(--green-tint); color: var(--green-400); border-color: rgba(47,207,143,.25); }
.pd-badge--warning { background: var(--amber-tint); color: var(--amber-400); border-color: rgba(245,165,36,.25); }
.pd-badge--error { background: var(--red-tint); color: var(--red-400); border-color: rgba(240,80,110,.25); }
.pd-badge--recording { background: rgba(255,59,48,.14); color: #FF8077; border-color: rgba(255,59,48,.3); }
.pd-badge--recording .pd-badge__dot { background: var(--recording); animation: pd-badge-pulse var(--pulse-period) infinite; }
@keyframes pd-badge-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Badge({
  variant = "neutral",
  dot = false,
  children,
  className = "",
  ...props
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `pd-badge ${variant !== "neutral" ? `pd-badge--${variant}` : ""} ${className}`
  }, props), (dot || variant === "recording") && /*#__PURE__*/React.createElement("span", {
    className: "pd-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-card-styles";
const css = `
.pd-card {
  background: var(--surface-elevated); border:1px solid var(--border-default);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-surface);
  transition: var(--transition-fast); overflow:hidden;
}
.pd-card--padded { padding: var(--card-padding); }
.pd-card--interactive { cursor:pointer; }
.pd-card--interactive:hover { border-color: var(--border-strong); box-shadow: var(--shadow-elevated); transform: translateY(-1px); }
.pd-card--interactive:active { transform: translateY(0); }
.pd-card--selected { border-color: var(--accent-primary); box-shadow: 0 0 0 1px var(--accent-primary), var(--shadow-elevated); }
.pd-card--accent { border-color: rgba(76,141,255,.35); background: linear-gradient(var(--surface-elevated), var(--surface-elevated)) padding-box, var(--blue-tint); }
.pd-card--ghost { background: transparent; box-shadow:none; border-style: dashed; border-color: var(--border-strong); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Card({
  variant = "default",
  padded = true,
  interactive = false,
  selected = false,
  className = "",
  children,
  ...props
}) {
  ensureStyles();
  const classes = ["pd-card", padded ? "pd-card--padded" : "", interactive ? "pd-card--interactive" : "", selected ? "pd-card--selected" : "", variant !== "default" ? `pd-card--${variant}` : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, props), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-tag-styles";
const css = `
.pd-tag {
  display:inline-flex; align-items:center; gap:6px;
  font-size: var(--fs-12); font-weight: var(--weight-medium); color: var(--text-secondary);
  padding: 4px 10px; border-radius: var(--radius-pill);
  background: var(--surface-raised); border:1px solid var(--border-default);
  transition: var(--transition-fast);
}
.pd-tag--clickable { cursor:pointer; }
.pd-tag--clickable:hover { color: var(--text-primary); border-color: var(--border-strong); }
.pd-tag--active { background: var(--blue-tint); color: var(--blue-300); border-color: rgba(76,141,255,.3); }
.pd-tag__remove { display:inline-flex; cursor:pointer; color: var(--text-muted); margin-right:-2px; border:none; background:none; padding:0; }
.pd-tag__remove:hover { color: var(--text-primary); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Tag({
  active = false,
  onRemove,
  onClick,
  children,
  className = "",
  ...props
}) {
  ensureStyles();
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `pd-tag ${clickable ? "pd-tag--clickable" : ""} ${active ? "pd-tag--active" : ""} ${className}`,
    onClick: onClick
  }, props), children, onRemove && /*#__PURE__*/React.createElement("button", {
    className: "pd-tag__remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-alert-styles";
const css = `
.pd-alert {
  display:flex; gap:12px; align-items:flex-start;
  padding: 12px 14px; border-radius: var(--radius-md);
  background: var(--surface-raised); border:1px solid var(--border-default);
  font-size: var(--text-small-size); color: var(--text-secondary);
}
.pd-alert__icon { flex:none; margin-top:1px; color: var(--text-muted); display:flex; }
.pd-alert__body { flex:1; }
.pd-alert__title { font-weight: var(--weight-semibold); color: var(--text-primary); margin-bottom:2px; }
.pd-alert--info { background: var(--blue-tint); border-color: rgba(76,141,255,.25); }
.pd-alert--info .pd-alert__icon { color: var(--blue-400); }
.pd-alert--success { background: var(--green-tint); border-color: rgba(47,207,143,.25); }
.pd-alert--success .pd-alert__icon { color: var(--green-400); }
.pd-alert--warning { background: var(--amber-tint); border-color: rgba(245,165,36,.25); }
.pd-alert--warning .pd-alert__icon { color: var(--amber-400); }
.pd-alert--error { background: var(--red-tint); border-color: rgba(240,80,110,.25); }
.pd-alert--error .pd-alert__icon { color: var(--red-400); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
const ICONS = {
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  })),
  success: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 4 12 14.01 9 11.01"
  })),
  warning: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  })),
  error: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "9",
    x2: "9",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9",
    x2: "15",
    y2: "15"
  }))
};
function Alert({
  variant = "info",
  title,
  icon,
  children,
  className = "",
  ...props
}) {
  ensureStyles();
  const glyph = icon !== undefined ? icon : /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ICONS[variant]);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `pd-alert pd-alert--${variant} ${className}`,
    role: "status"
  }, props), glyph && /*#__PURE__*/React.createElement("span", {
    className: "pd-alert__icon"
  }, glyph), /*#__PURE__*/React.createElement("div", {
    className: "pd-alert__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "pd-alert__title"
  }, title), children));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-spinner-styles";
const css = `
.pd-spinner { display:inline-block; border-radius:50%; border-style:solid; border-color: var(--ink-700); border-right-color: var(--accent-primary); animation: pd-spinner-spin .7s linear infinite; }
@keyframes pd-spinner-spin { to { transform: rotate(360deg); } }
.pd-spinner-row { display:inline-flex; align-items:center; gap:10px; color: var(--text-secondary); font-size: var(--text-small-size); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
const SIZES = {
  sm: 14,
  md: 18,
  lg: 28
};
function Spinner({
  size = "md",
  label,
  className = "",
  ...props
}) {
  ensureStyles();
  const px = SIZES[size] || size;
  const bw = px <= 16 ? 2 : 3;
  const spinner = /*#__PURE__*/React.createElement("span", {
    className: `pd-spinner ${className}`,
    style: {
      width: px,
      height: px,
      borderWidth: bw
    },
    "aria-hidden": "true"
  });
  if (!label) return spinner;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "pd-spinner-row",
    role: "status"
  }, props), spinner, label);
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-toast-styles";
const css = `
.pd-toast {
  display:flex; align-items:center; gap:12px;
  padding: 12px 14px; min-width: 280px; max-width: 420px;
  background: var(--surface-elevated); border:1px solid var(--border-default);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-floating);
  color: var(--text-primary); font-size: var(--text-small-size);
}
.pd-toast__icon { flex:none; display:flex; width:24px; height:24px; align-items:center; justify-content:center; border-radius: var(--radius-pill); }
.pd-toast__icon--success { background: var(--green-tint); color: var(--green-400); }
.pd-toast__icon--error { background: var(--red-tint); color: var(--red-400); }
.pd-toast__icon--info { background: var(--blue-tint); color: var(--blue-400); }
.pd-toast__body { flex:1; }
.pd-toast__title { font-weight: var(--weight-semibold); }
.pd-toast__desc { color: var(--text-secondary); font-size: var(--fs-12); margin-top:1px; }
.pd-toast__spinner { width:16px; height:16px; border:2px solid var(--ink-600); border-right-color: var(--accent-primary); border-radius:50%; animation: pd-toast-spin .7s linear infinite; }
@keyframes pd-toast-spin { to { transform: rotate(360deg); } }
.pd-toast__close { background:none; border:none; color: var(--text-muted); cursor:pointer; display:flex; padding:2px; }
.pd-toast__close:hover { color: var(--text-primary); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
const GLYPH = {
  success: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 4 12 14.01 9 11.01"
  })),
  error: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "9",
    x2: "9",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9",
    x2: "15",
    y2: "15"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  }))
};
function Toast({
  variant = "info",
  title,
  description,
  loading = false,
  onClose,
  className = "",
  ...props
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `pd-toast ${className}`,
    role: "alert"
  }, props), /*#__PURE__*/React.createElement("span", {
    className: `pd-toast__icon pd-toast__icon--${variant}`
  }, loading ? /*#__PURE__*/React.createElement("span", {
    className: "pd-toast__spinner"
  }) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, GLYPH[variant])), /*#__PURE__*/React.createElement("div", {
    className: "pd-toast__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-toast__title"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "pd-toast__desc"
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "pd-toast__close",
    onClick: onClose,
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-input-styles";
const css = `
.pd-field { display:flex; flex-direction:column; gap:6px; }
.pd-field__label { font-size: var(--text-label-size); font-weight: var(--weight-medium); color: var(--text-secondary); }
.pd-field__hint { font-size: var(--fs-12); color: var(--text-muted); }
.pd-field__hint--error { color: var(--error); }
.pd-input-wrap { position: relative; display:flex; align-items:center; }
.pd-input {
  width: 100%; box-sizing: border-box;
  height: 38px; padding: 0 12px;
  font-family: var(--font-sans); font-size: var(--text-input-size); color: var(--text-primary);
  background: var(--surface-sunken); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); transition: var(--transition-fast);
  outline: none;
}
.pd-input::placeholder { color: var(--text-disabled); }
.pd-input:hover { border-color: var(--border-strong); }
.pd-input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--blue-tint); background: var(--surface-elevated); }
.pd-input--has-icon { padding-left: 38px; }
.pd-input--invalid { border-color: var(--error); }
.pd-input--invalid:focus { box-shadow: 0 0 0 3px var(--red-tint); }
.pd-input:disabled { background: var(--disabled-bg); color: var(--disabled-fg); cursor: not-allowed; }
.pd-input__icon { position:absolute; left:12px; display:flex; color: var(--text-muted); pointer-events:none; }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Input({
  label,
  hint,
  error,
  icon,
  id,
  className = "",
  ...props
}) {
  ensureStyles();
  const inputId = id || (label ? `pd-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "pd-field__label",
    htmlFor: inputId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "pd-input-wrap"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "pd-input__icon"
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: ["pd-input", icon ? "pd-input--has-icon" : "", error ? "pd-input--invalid" : "", className].filter(Boolean).join(" "),
    "aria-invalid": !!error
  }, props))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: `pd-field__hint ${error ? "pd-field__hint--error" : ""}`
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
const STYLE_ID = "pd-segmented-styles";
const css = `
.pd-segmented { display:inline-flex; padding:3px; gap:2px; background: var(--surface-sunken); border:1px solid var(--border-default); border-radius: var(--radius-md); }
.pd-segmented--block { display:flex; width:100%; }
.pd-segmented__opt {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px;
  padding: 6px 14px; font-size: var(--fs-13); font-weight: var(--weight-medium);
  color: var(--text-secondary); background: transparent; border:none; cursor:pointer;
  border-radius: var(--radius-sm); transition: var(--transition-fast); white-space:nowrap;
}
.pd-segmented__opt:hover { color: var(--text-primary); }
.pd-segmented__opt--active { background: var(--surface-raised); color: var(--text-primary); box-shadow: var(--shadow-subtle); }
.pd-segmented__opt:focus-visible { outline:none; box-shadow: var(--glow-focus); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function SegmentedControl({
  options = [],
  value,
  onChange,
  fullWidth = false
}) {
  ensureStyles();
  const [internal, setInternal] = React.useState(value ?? options[0]?.value);
  const current = value ?? internal;
  const pick = v => {
    setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `pd-segmented ${fullWidth ? "pd-segmented--block" : ""}`,
    role: "tablist"
  }, options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const label = typeof o === "string" ? o : o.label;
    const icon = typeof o === "string" ? null : o.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": current === v,
      className: `pd-segmented__opt ${current === v ? "pd-segmented__opt--active" : ""}`,
      onClick: () => pick(v)
    }, icon, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-select-styles";
const css = `
.pd-select-field { display:flex; flex-direction:column; gap:6px; }
.pd-select-field__label { font-size: var(--text-label-size); font-weight: var(--weight-medium); color: var(--text-secondary); }
.pd-select-wrap { position:relative; }
.pd-select {
  width:100%; box-sizing:border-box; height:38px; padding:0 36px 0 12px;
  font-family: var(--font-sans); font-size: var(--text-input-size); color: var(--text-primary);
  background: var(--surface-sunken); border:1px solid var(--border-default); border-radius: var(--radius-md);
  appearance:none; -webkit-appearance:none; cursor:pointer; transition: var(--transition-fast); outline:none;
}
.pd-select:hover { border-color: var(--border-strong); }
.pd-select:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--blue-tint); }
.pd-select__chev { position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; color: var(--text-muted); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Select({
  label,
  options = [],
  id,
  className = "",
  children,
  ...props
}) {
  ensureStyles();
  const selId = id || (label ? `pd-sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-select-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "pd-select-field__label",
    htmlFor: selId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "pd-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    className: `pd-select ${className}`
  }, props), children || options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    className: "pd-select__chev"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-slider-styles";
const css = `
.pd-slider { display:flex; flex-direction:column; gap:8px; }
.pd-slider__head { display:flex; justify-content:space-between; align-items:baseline; }
.pd-slider__label { font-size: var(--text-label-size); font-weight: var(--weight-medium); color: var(--text-secondary); }
.pd-slider__value { font-family: var(--font-mono); font-size: var(--fs-12); color: var(--text-primary); }
.pd-slider input[type=range] {
  -webkit-appearance:none; appearance:none; width:100%; height:4px;
  background: var(--ink-700); border-radius: var(--radius-pill); outline:none; margin:8px 0;
  background-image: linear-gradient(var(--accent-primary), var(--accent-primary));
  background-repeat: no-repeat;
}
.pd-slider input[type=range]::-webkit-slider-thumb {
  -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%;
  background:#fff; border:3px solid var(--accent-primary); cursor:pointer;
  box-shadow: var(--shadow-subtle); transition: transform var(--dur-fast);
}
.pd-slider input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.12); }
.pd-slider input[type=range]::-moz-range-thumb {
  width:16px; height:16px; border-radius:50%; background:#fff; border:3px solid var(--accent-primary); cursor:pointer;
}
.pd-slider input[type=range]:focus-visible { box-shadow: var(--glow-focus); border-radius: var(--radius-pill); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
  onChange,
  formatValue,
  ...props
}) {
  ensureStyles();
  const [val, setVal] = React.useState(value ?? min);
  const current = value ?? val;
  const pct = (current - min) / (max - min) * 100;
  const handle = e => {
    setVal(Number(e.target.value));
    onChange && onChange(e);
  };
  const display = formatValue ? formatValue(current) : `${current}${suffix}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-slider"
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "pd-slider__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pd-slider__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "pd-slider__value"
  }, display)), /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    min: min,
    max: max,
    step: step,
    value: current,
    onChange: handle,
    style: {
      backgroundSize: `${pct}% 100%`
    }
  }, props)));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-switch-styles";
const css = `
.pd-switch { display:inline-flex; align-items:center; gap:10px; cursor:pointer; user-select:none; }
.pd-switch input { position:absolute; opacity:0; width:0; height:0; }
.pd-switch__track {
  width: 40px; height: 24px; border-radius: var(--radius-pill);
  background: var(--ink-700); border:1px solid var(--border-default);
  position: relative; transition: var(--transition-standard); flex:none;
}
.pd-switch__thumb {
  position:absolute; top: 2px; left: 2px; width: 18px; height: 18px;
  border-radius: 50%; background: var(--ink-300);
  transition: transform var(--dur-standard) var(--ease-spring), background var(--dur-fast);
}
.pd-switch input:checked + .pd-switch__track { background: var(--accent-primary); border-color: transparent; }
.pd-switch input:checked + .pd-switch__track .pd-switch__thumb { transform: translateX(16px); background:#fff; }
.pd-switch input:focus-visible + .pd-switch__track { box-shadow: var(--glow-focus); }
.pd-switch input:disabled + .pd-switch__track { opacity:.45; }
.pd-switch__label { font-size: var(--text-label-size); color: var(--text-primary); }
.pd-switch--reverse { justify-content:space-between; width:100%; }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  spread = false,
  ...props
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: `pd-switch ${spread ? "pd-switch--reverse" : ""}`
  }, label && spread && /*#__PURE__*/React.createElement("span", {
    className: "pd-switch__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: "pd-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pd-switch__thumb"
  }))), label && !spread && /*#__PURE__*/React.createElement("span", {
    className: "pd-switch__label"
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-textarea-styles";
const css = `
.pd-textarea-field { display:flex; flex-direction:column; gap:6px; }
.pd-textarea-field__label { font-size: var(--text-label-size); font-weight: var(--weight-medium); color: var(--text-secondary); }
.pd-textarea {
  width:100%; box-sizing:border-box; min-height: 96px; padding: 12px;
  font-family: var(--font-sans); font-size: var(--text-input-size); line-height: var(--lh-normal);
  color: var(--text-primary); background: var(--surface-sunken);
  border:1px solid var(--border-default); border-radius: var(--radius-md);
  resize: vertical; outline:none; transition: var(--transition-fast);
}
.pd-textarea::placeholder { color: var(--text-disabled); }
.pd-textarea:hover { border-color: var(--border-strong); }
.pd-textarea:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--blue-tint); background: var(--surface-elevated); }
.pd-textarea--editor {
  min-height: 220px; font-size: var(--fs-16); line-height: 1.75;
  background: transparent; border:none; padding: 0;
}
.pd-textarea--editor:focus { box-shadow:none; background:transparent; }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
function Textarea({
  label,
  editor = false,
  id,
  className = "",
  ...props
}) {
  ensureStyles();
  const taId = id || (label ? `pd-ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-textarea-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "pd-textarea-field__label",
    htmlFor: taId
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: taId,
    className: `pd-textarea ${editor ? "pd-textarea--editor" : ""} ${className}`
  }, props)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/promptdrop/PromptCharacter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-character-styles";
const css = `
.pd-char { display:inline-block; line-height:0; }
.pd-char svg { overflow: visible; display:block; }

/* Floating idle bob, calm, slow */
.pd-char--idle .pd-char__body,
.pd-char--ready .pd-char__body { animation: pd-char-bob 4.2s var(--ease-standard) infinite; }
@keyframes pd-char-bob { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-3px); } }

/* Blink, eyes scale on Y occasionally */
.pd-char__eye { transform-box: fill-box; transform-origin: center; }
.pd-char--idle .pd-char__eye,
.pd-char--ready .pd-char__eye,
.pd-char--countdown .pd-char__eye { animation: pd-char-blink 5.5s infinite; }
@keyframes pd-char-blink { 0%,92%,100%{ transform: scaleY(1); } 95%{ transform: scaleY(0.1); } }

/* Prompting, eyes settle low/calm, no motion */
.pd-char--prompting .pd-char__body { animation: pd-char-breathe 6s ease-in-out infinite; }
@keyframes pd-char-breathe { 0%,100%{ transform: translateY(0) scale(1); } 50%{ transform: translateY(-1px) scale(1.012); } }

/* Thinking dots (saving / processing) */
.pd-char__think { opacity:0; }
.pd-char--saving .pd-char__think,
.pd-char--processing .pd-char__think { opacity:1; }
.pd-char--saving .pd-char__think circle,
.pd-char--processing .pd-char__think circle { animation: pd-char-think 1.3s ease-in-out infinite; }
.pd-char__think circle:nth-child(2){ animation-delay:.18s; }
.pd-char__think circle:nth-child(3){ animation-delay:.36s; }
@keyframes pd-char-think { 0%,100%{ transform: translateY(0); opacity:.3; } 50%{ transform: translateY(-4px); opacity:1; } }
.pd-char__think circle { transform-box: fill-box; transform-origin:center; }

/* Complete, gentle celebratory bob */
.pd-char--complete .pd-char__body { animation: pd-char-celebrate 1.1s var(--ease-spring) 2; }
@keyframes pd-char-celebrate { 0%,100%{ transform: translateY(0) rotate(0); } 30%{ transform: translateY(-6px) rotate(-3deg); } 60%{ transform: translateY(-2px) rotate(3deg); } }

/* Warning, slow gentle sway */
.pd-char--warning .pd-char__body { animation: pd-char-sway 2.4s ease-in-out infinite; }
@keyframes pd-char-sway { 0%,100%{ transform: rotate(-3deg); } 50%{ transform: rotate(3deg); } }

/* Error, single apologetic tilt */
.pd-char--error .pd-char__body { transform: rotate(4deg) translateY(1px); }

@media (prefers-reduced-motion: reduce) {
  .pd-char *, .pd-char .pd-char__body { animation: none !important; }
}
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}

// Per-state facial geometry. Eyes echo the brand's three-dot motif.
function faceFor(state) {
  switch (state) {
    case "prompting":
      // calm, half-lidded, no mouth
      return {
        eyes: "line",
        brow: null,
        mouth: null,
        lid: true
      };
    case "complete":
      // happy arc eyes + smile
      return {
        eyes: "arc",
        brow: null,
        mouth: "smile"
      };
    case "warning":
      return {
        eyes: "dot",
        brow: "raised",
        mouth: "flat"
      };
    case "error":
      return {
        eyes: "dot",
        brow: "sad",
        mouth: "frown"
      };
    case "saving":
    case "processing":
      return {
        eyes: "up",
        brow: null,
        mouth: null
      };
    case "countdown":
      return {
        eyes: "dot",
        brow: null,
        mouth: "o"
      };
    case "paused":
      return {
        eyes: "dot",
        brow: null,
        mouth: "flat"
      };
    case "ready":
      return {
        eyes: "dot",
        brow: null,
        mouth: "smile"
      };
    default:
      // idle
      return {
        eyes: "dot",
        brow: null,
        mouth: "smile-sm"
      };
  }
}
function PromptCharacter({
  state = "idle",
  size = 96,
  color = "#F4F4F5",
  className = "",
  ...props
}) {
  ensureStyles();
  const f = faceFor(state);
  const stroke = {
    stroke: color,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `pd-char pd-char--${state} ${className}`,
    style: {
      width: size,
      height: size
    },
    role: "img",
    "aria-label": `Assistant ${state}`
  }, props), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 120",
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("g", {
    className: "pd-char__body"
  }, /*#__PURE__*/React.createElement("rect", _extends({
    x: "22",
    y: "26",
    width: "76",
    height: "68",
    rx: "26"
  }, stroke, {
    strokeWidth: "3",
    opacity: "0.9"
  })), f.brow === "raised" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M40 46 q6 -7 14 -3"
  }, stroke)), f.brow === "sad" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({
    d: "M40 50 q6 4 14 1"
  }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
    d: "M66 51 q6 -3 14 1"
  }, stroke))), f.eyes === "dot" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    className: "pd-char__eye",
    cx: "47",
    cy: "58",
    r: "5",
    fill: color
  }), /*#__PURE__*/React.createElement("circle", {
    className: "pd-char__eye",
    cx: "73",
    cy: "58",
    r: "5",
    fill: color
  })), f.eyes === "up" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "47",
    cy: "54",
    r: "5",
    fill: color
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "73",
    cy: "54",
    r: "5",
    fill: color
  })), f.eyes === "line" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", _extends({
    x1: "42",
    y1: "60",
    x2: "52",
    y2: "60"
  }, stroke)), /*#__PURE__*/React.createElement("line", _extends({
    x1: "68",
    y1: "60",
    x2: "78",
    y2: "60"
  }, stroke))), f.eyes === "arc" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({
    d: "M42 60 q5 -8 10 0"
  }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
    d: "M68 60 q5 -8 10 0"
  }, stroke))), f.mouth === "smile" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M50 74 q10 9 20 0"
  }, stroke)), f.mouth === "smile-sm" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M53 74 q7 5 14 0"
  }, stroke)), f.mouth === "flat" && /*#__PURE__*/React.createElement("line", _extends({
    x1: "52",
    y1: "76",
    x2: "68",
    y2: "76"
  }, stroke)), f.mouth === "frown" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M50 78 q10 -8 20 0"
  }, stroke)), f.mouth === "o" && /*#__PURE__*/React.createElement("circle", _extends({
    cx: "60",
    cy: "76",
    r: "5"
  }, stroke)), /*#__PURE__*/React.createElement("g", {
    className: "pd-char__think",
    transform: "translate(0,-2)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "84",
    cy: "22",
    r: "3.2",
    fill: color
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "95",
    cy: "22",
    r: "3.2",
    fill: color
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "22",
    r: "3.2",
    fill: color
  })))));
}
Object.assign(__ds_scope, { PromptCharacter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/promptdrop/PromptCharacter.jsx", error: String((e && e.message) || e) }); }

// components/promptdrop/PromptDrop.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "pd-promptdrop-styles";
const css = `
.pd-drop {
  --_pad: 28px;
  position: relative; box-sizing: border-box;
  background: var(--promptdrop-bg); color: var(--text-primary);
  border: 1px solid var(--promptdrop-border);
  border-radius: var(--radius-promptdrop);
  box-shadow: var(--shadow-promptdrop);
  display:flex; flex-direction:column; align-items:center;
  font-family: var(--font-sans);
  overflow:hidden; isolation:isolate;
}
/* camera dots header */
.pd-drop__dots { display:flex; gap:12px; padding-top: 20px; }
.pd-drop__dots i { width:8px; height:8px; border-radius:50%; background: var(--ink-50); display:block; opacity:.92; }
.pd-drop__body { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding: var(--_pad); text-align:center; }
.pd-drop__title { font-size: var(--fs-15); font-weight: var(--weight-semibold); color: var(--text-primary); }
.pd-drop__status { font-family: var(--font-mono); font-size: var(--fs-11); letter-spacing:.08em; text-transform:uppercase; color: var(--text-muted); display:inline-flex; align-items:center; gap:7px; }
.pd-drop__status--rec { color:#FF8077; }
.pd-drop__status--rec::before { content:""; width:7px; height:7px; border-radius:50%; background: var(--recording); box-shadow: 0 0 8px var(--rec-glow); animation: pd-drop-pulse var(--pulse-period) infinite; }
@keyframes pd-drop-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

/* play button */
.pd-drop__play { width:54px; height:54px; border-radius:50%; border:none; cursor:pointer; background: var(--text-primary); color:#000; display:flex; align-items:center; justify-content:center; transition: var(--transition-fast); }
.pd-drop__play:hover { transform: scale(1.06); }
.pd-drop__play:active { transform: scale(0.97); }

/* countdown */
.pd-drop__count { font-size: clamp(56px, 18vw, 104px); font-weight: var(--weight-bold); letter-spacing:-.02em; line-height:1; color: var(--text-primary); }

/* teleprompter reading */
.pd-drop__reader { display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width: 88%; }
.pd-drop__line { letter-spacing:-.01em; line-height:1.32; transition: opacity var(--dur-standard), font-size var(--dur-standard); }
.pd-drop__line--far { font-size: var(--fs-18); color: var(--tp-far); font-weight:500; }
.pd-drop__line--adj { font-size: var(--fs-24); color: var(--tp-adjacent); font-weight:500; }
.pd-drop__line--cur { font-size: clamp(26px, 4vw, 38px); color: var(--tp-current); font-weight: var(--weight-semibold); }

/* progress */
.pd-drop__progress { position:absolute; bottom:0; left:0; height:3px; background: var(--accent-primary); border-radius: 0 3px 3px 0; transition: width var(--dur-slow) linear; }

/* message + actions */
.pd-drop__msg { font-size: var(--fs-14); color: var(--text-secondary); max-width: 80%; }
.pd-drop__actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
.pd-drop__btn { font-family: var(--font-sans); font-size: var(--fs-13); font-weight: var(--weight-semibold); padding: 8px 16px; border-radius: var(--radius-md); cursor:pointer; border:1px solid transparent; transition: var(--transition-fast); }
.pd-drop__btn--primary { background: var(--accent-primary); color:#fff; }
.pd-drop__btn--primary:hover { filter: brightness(1.08); }
.pd-drop__btn--ghost { background: rgba(255,255,255,.06); color: var(--text-primary); border-color: rgba(255,255,255,.1); }
.pd-drop__btn--ghost:hover { background: rgba(255,255,255,.12); }

.pd-drop__char { margin-bottom: 2px; }
.pd-drop__warn-icon { color: var(--warning); }
.pd-drop__err-icon { color: var(--error); }
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const e = document.createElement("style");
    e.id = STYLE_ID;
    e.textContent = css;
    document.head.appendChild(e);
  }
}
const PlayGlyph = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("polygon", {
  points: "7 4 20 12 7 20 7 4"
}));
function Reader({
  lines = [],
  index = 0
}) {
  const get = i => lines[i];
  const rows = [{
    t: get(index - 2),
    cls: "far"
  }, {
    t: get(index - 1),
    cls: "adj"
  }, {
    t: get(index),
    cls: "cur"
  }, {
    t: get(index + 1),
    cls: "adj"
  }, {
    t: get(index + 2),
    cls: "far"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__reader"
  }, rows.map((r, i) => r.t ? /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `pd-drop__line pd-drop__line--${r.cls}`
  }, r.t) : /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 0
    }
  })));
}
function PromptDrop({
  state = "idle",
  title = "Untitled script",
  lines = [],
  index = 0,
  count = 3,
  message,
  recording = false,
  progress = 0,
  showCharacter = true,
  width = 520,
  height,
  charSize = 84,
  onPlay,
  actions,
  className = "",
  ...props
}) {
  ensureStyles();
  const autoHeight = {
    idle: 220,
    ready: 220,
    countdown: 300,
    prompting: 340,
    paused: 300,
    processing: 280,
    complete: 300,
    warning: 280,
    error: 280
  }[state] || 260;
  const charState = state === "ready" ? "ready" : state;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `pd-drop ${className}`,
    style: {
      width,
      height: height || autoHeight
    },
    "data-state": state
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__body"
  }, (state === "idle" || state === "ready") && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__char"
  }, /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: charState,
    size: charSize
  })), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: `pd-drop__status ${recording ? "pd-drop__status--rec" : ""}`
  }, recording ? "Will record" : "Ready"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__play",
    onClick: onPlay,
    "aria-label": "Start"
  }, PlayGlyph)), state === "countdown" && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "countdown",
    size: charSize - 14
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__count"
  }, count), recording && /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__status pd-drop__status--rec"
  }, "Recording")), state === "prompting" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Reader, {
    lines: lines,
    index: index
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__status"
  }, recording && /*#__PURE__*/React.createElement("span", {
    className: "pd-drop__status--rec",
    style: {
      paddingLeft: 0
    }
  }), showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "prompting",
    size: 26
  }), recording ? "Recording" : "Prompting")), state === "paused" && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "paused",
    size: charSize - 8
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__status"
  }, "Paused"), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__actions"
  }, actions || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--primary"
  }, "Resume"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Restart"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Exit")))), (state === "processing" || state === "saving") && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "processing",
    size: charSize
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__msg"
  }, message || "Working on it…")), state === "complete" && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "complete",
    size: charSize
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__title"
  }, message || "Nice take."), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__actions"
  }, actions || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--primary"
  }, "Review take"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Start again"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Close")))), state === "warning" && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "warning",
    size: charSize - 6
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__msg"
  }, message || "Speed looks a little fast for this script."), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__actions"
  }, actions || /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Adjust"))), state === "error" && /*#__PURE__*/React.createElement(React.Fragment, null, showCharacter && /*#__PURE__*/React.createElement(__ds_scope.PromptCharacter, {
    state: "error",
    size: charSize - 6
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__msg"
  }, message || "Something went wrong."), /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__actions"
  }, actions || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--primary"
  }, "Retry"), /*#__PURE__*/React.createElement("button", {
    className: "pd-drop__btn pd-drop__btn--ghost"
  }, "Exit"))))), state === "prompting" && /*#__PURE__*/React.createElement("div", {
    className: "pd-drop__progress",
    style: {
      width: `${progress}%`
    }
  }));
}
Object.assign(__ds_scope, { PromptDrop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/promptdrop/PromptDrop.jsx", error: String((e && e.message) || e) }); }

// ui_kits/control-app/app.jsx
try { (() => {
// PromptDrop Control App, root + launch experience
const {
  useEffect
} = React;
const I3 = window.PDIcons;
const LINES = ["Hey everyone, welcome back to the channel.", "Today we're looking at something", "I'm genuinely excited about.", "A teleprompter that keeps your eyes", "right next to the lens.", "No more glancing down.", "Just you, talking to your camera."];
function LaunchOverlay({
  onClose
}) {
  const [phase, setPhase] = useState("idle"); // idle, countdown, prompting, complete
  const [count, setCount] = useState(3);
  const [idx, setIdx] = useState(0);
  const start = () => {
    setPhase("countdown");
    setCount(3);
  };
  useEffect(() => {
    if (phase === "countdown") {
      if (count === 0) {
        setPhase("prompting");
        setIdx(0);
        return;
      }
      const t = setTimeout(() => setCount(c => c - 1), 800);
      return () => clearTimeout(t);
    }
    if (phase === "prompting") {
      if (idx >= LINES.length - 1) {
        const t = setTimeout(() => setPhase("complete"), 1600);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setIdx(i => i + 1), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, count, idx]);
  const progress = phase === "prompting" ? Math.round(idx / (LINES.length - 1) * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "launch",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "launch__bezel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "launch__cam"
  })), /*#__PURE__*/React.createElement("div", {
    className: `drop drop--${phase}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "drop__dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), phase === "idle" && /*#__PURE__*/React.createElement("div", {
    className: "drop__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drop__title"
  }, "Morning launch take"), /*#__PURE__*/React.createElement("div", {
    className: "drop__status"
  }, "Ready \xB7 will record"), /*#__PURE__*/React.createElement("button", {
    className: "drop__play",
    onClick: start,
    "aria-label": "Start"
  }, /*#__PURE__*/React.createElement(I3.play, {
    size: 20
  }))), phase === "countdown" && /*#__PURE__*/React.createElement("div", {
    className: "drop__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drop__count"
  }, count === 0 ? "Go" : count), /*#__PURE__*/React.createElement("div", {
    className: "drop__status drop__status--rec"
  }, "Recording")), phase === "prompting" && /*#__PURE__*/React.createElement("div", {
    className: "drop__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drop__reader"
  }, [idx - 2, idx - 1, idx, idx + 1, idx + 2].map((i, k) => {
    const cls = i === idx ? "cur" : Math.abs(i - idx) === 1 ? "adj" : "far";
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      className: `drop__line drop__line--${cls}`
    }, LINES[i] || "");
  })), /*#__PURE__*/React.createElement("div", {
    className: "drop__status drop__status--rec"
  }, "Recording"), /*#__PURE__*/React.createElement("div", {
    className: "drop__progress",
    style: {
      width: `${progress}%`
    }
  })), phase === "complete" && /*#__PURE__*/React.createElement("div", {
    className: "drop__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "drop__title"
  }, "Nice take."), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--sm",
    onClick: onClose
  }, "Review take"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: start
  }, "Start again"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: onClose
  }, "Close")))), /*#__PURE__*/React.createElement("button", {
    className: "launch__exit",
    onClick: onClose
  }, "Exit Prompt Drop"));
}
function App() {
  const [view, setView] = useState("dashboard");
  const [launched, setLaunched] = useState(false);
  const launch = () => setLaunched(true);
  const TITLES = {
    dashboard: ["Dashboard", "Home"],
    studio: ["Script Studio", "Scripts"],
    recordings: ["Recordings", "Library"],
    library: ["Library", "Scripts"],
    settings: ["Prompt Settings", "Configure"],
    review: ["Take review", "Recordings"]
  };
  const [t, crumb] = TITLES[view] || TITLES.dashboard;
  const right = view === "studio" || view === "settings" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm"
  }, "Preview"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--launch",
    onClick: launch
  }, /*#__PURE__*/React.createElement(I3.rocket, {
    size: 16
  }), " Launch Prompt Drop")) : view === "recordings" ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary"
  }, /*#__PURE__*/React.createElement(I3.download, {
    size: 16
  }), " Export") : /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => setView("studio")
  }, /*#__PURE__*/React.createElement(I3.plus, {
    size: 16
  }), " New script");
  let screen;
  if (view === "dashboard") screen = /*#__PURE__*/React.createElement(window.PDDashboard, {
    setView: setView,
    launch: launch
  });else if (view === "studio") screen = /*#__PURE__*/React.createElement(window.PDScriptStudio, null);else if (view === "settings") screen = /*#__PURE__*/React.createElement(window.PDPromptSettings, null);else if (view === "library") screen = /*#__PURE__*/React.createElement(window.PDLibrary, {
    setView: setView
  });else if (view === "recordings" || view === "review") screen = /*#__PURE__*/React.createElement(window.PDTakeReview, null);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(window.PDSidebar, {
    view: view,
    setView: v => setView(v === "recordings" ? "review" : v)
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement(window.PDTopbar, {
    title: view === "review" ? "Take review" : t,
    crumb: crumb,
    right: right
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll"
  }, screen)), launched && /*#__PURE__*/React.createElement(LaunchOverlay, {
    onClose: () => {
      setLaunched(false);
      setView("review");
    }
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/control-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/control-app/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  }))
};
window.PDIcon = Icon;
window.PDIcons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/control-app/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/control-app/screens.jsx
try { (() => {
// PromptDrop Control App, screens
const I2 = window.PDIcons;
const MiniDrop = window.PDMiniDrop;
const SCRIPTS = [{
  t: "Morning launch take",
  m: "Updated 2m ago",
  w: "182 words · 1:12",
  tag: "Product",
  fav: true
}, {
  t: "Newsletter intro",
  m: "Yesterday",
  w: "94 words · 0:38",
  tag: "Marketing"
}, {
  t: "Course module 3",
  m: "2 days ago",
  w: "640 words · 4:05",
  tag: "Education"
}, {
  t: "Investor update",
  m: "Last week",
  w: "310 words · 2:01",
  tag: "Business"
}, {
  t: "TikTok hook test",
  m: "Last week",
  w: "48 words · 0:19",
  tag: "Social"
}, {
  t: "Podcast cold open",
  m: "Mar 3",
  w: "120 words · 0:48",
  tag: "Audio"
}];

// ============ DASHBOARD ============
function Dashboard({
  setView,
  launch
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Good morning, Maya"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: "-.02em",
      marginBottom: 22
    }
  }, "Let's protect your eye-line."), /*#__PURE__*/React.createElement("div", {
    className: "grid-3",
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--pad card--int",
    onClick: () => setView("studio"),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "New script"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 2
    }
  }, "Start from a blank page"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad card--int",
    onClick: () => setView("studio"),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Paste a script"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 2
    }
  }, "Bring text from anywhere"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad card--int",
    onClick: launch,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "iconbtn iconbtn--solid",
    style: {
      background: "var(--green-tint)",
      color: "var(--green-400)",
      borderColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(I2.rocket, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, "Quick launch"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      marginTop: 2
    }
  }, "Open the last script")))), /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "Recent scripts"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: () => setView("library")
  }, "View all ", /*#__PURE__*/React.createElement(I2.chevronRight, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, SCRIPTS.slice(0, 3).map((s, i) => /*#__PURE__*/React.createElement(ScriptCard, {
    key: i,
    s: s,
    onClick: () => setView("studio")
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2",
    style: {
      marginTop: 28,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 14
    }
  }, "Recent recordings"), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 10
    }
  }, [["Morning launch take", "1:12", "142 wpm"], ["Newsletter intro", "0:38", "138 wpm"]].map(([t, d, w], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card card--int",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 76,
      height: 48,
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
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, d, " \xB7 ", w)), /*#__PURE__*/React.createElement("span", {
    className: "iconbtn"
  }, /*#__PURE__*/React.createElement(I2.dots, {
    size: 18
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "Plan usage"), /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, "Free")), /*#__PURE__*/React.createElement(Usage, {
    label: "Recordings this month",
    v: 7,
    max: 10
  }), /*#__PURE__*/React.createElement(Usage, {
    label: "AI rewrites",
    v: 3,
    max: 5
  }), /*#__PURE__*/React.createElement(Usage, {
    label: "Storage",
    v: 1.2,
    max: 2,
    suffix: " GB"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm",
    style: {
      width: "100%",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(I2.bolt, {
    size: 14
  }), " Upgrade for unlimited"))));
}
function Usage({
  label,
  v,
  max,
  suffix = ""
}) {
  const pct = Math.min(100, v / max * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sec",
    style: {
      fontSize: 13
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12,
      fontFamily: "var(--font-mono)"
    }
  }, v, suffix, " / ", max, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 99,
      background: "var(--ink-700)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      borderRadius: 99,
      background: pct > 80 ? "var(--warning)" : "var(--accent-primary)"
    }
  })));
}
function ScriptCard({
  s,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card card--pad card--int",
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: 124
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge--accent"
  }, s.tag), s.fav && /*#__PURE__*/React.createElement(I2.star, {
    size: 15,
    style: {
      color: "var(--amber-400)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      marginTop: "auto"
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    className: "between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, s.w), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, s.m)));
}

// ============ SCRIPT STUDIO ============
const SCRIPT_TEXT = `Hey everyone, welcome back to the channel.

Today we're looking at something I'm genuinely excited about, a teleprompter that finally keeps your eyes where they belong: right next to the lens.

[ pause ]

No more glancing down. No more reading off to the side. Just you, talking to your camera, sounding like a person.

Let's get into it.`;
function ScriptStudio() {
  const [text, setText] = useState(SCRIPT_TEXT);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const secs = Math.round(words / 140 * 60);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "240px minmax(380px,1fr) 300px",
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
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Scripts"), /*#__PURE__*/React.createElement("div", {
    className: "input-icon",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(I2.search, {
    size: 15
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Search\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 2
    }
  }, SCRIPTS.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `navitem ${i === 0 ? "navitem--active" : ""}`,
    style: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 2,
      padding: "9px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, s.t), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, s.w))))), /*#__PURE__*/React.createElement("main", {
    style: {
      overflowY: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "between",
    style: {
      padding: "14px 28px",
      borderBottom: "1px solid var(--divider)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, /*#__PURE__*/React.createElement(I2.type, {
    size: 14
  }), " Heading"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, /*#__PURE__*/React.createElement(I2.pause, {
    size: 14
  }), " Pause marker"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, /*#__PURE__*/React.createElement(I2.bolt, {
    size: 14
  }), " Emphasis")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge--success"
  }, /*#__PURE__*/React.createElement("i", null), " Saved")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      width: "100%",
      margin: "0 auto",
      flex: 1,
      boxSizing: "border-box",
      padding: "32px 28px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    defaultValue: "Morning launch take",
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
  }, words, " words \xB7 ~", Math.floor(secs / 60), ":", String(secs % 60).padStart(2, "0"), " at 140 wpm"), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
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
  }, "AI rewrite")), /*#__PURE__*/React.createElement("p", {
    className: "sec",
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      marginBottom: 12
    }
  }, "Tighten your intro or make it more conversational."), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm"
  }, "Make punchier"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm"
  }, "Shorten"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary btn--sm"
  }, "Casual"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Quick settings"), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, "Scroll speed")), /*#__PURE__*/React.createElement("div", {
    className: "setrow__control"
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, "142 wpm"))), /*#__PURE__*/React.createElement("input", {
    className: "slider",
    style: {
      backgroundSize: "48% 100%",
      margin: "4px 0 12px"
    },
    type: "range",
    defaultValue: "48"
  }), /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, "Drop position")), /*#__PURE__*/React.createElement("div", {
    className: "seg seg--block",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", null, "Left"), /*#__PURE__*/React.createElement("button", {
    className: "on"
  }, "Centre"), /*#__PURE__*/React.createElement("button", null, "Right"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Preview"), /*#__PURE__*/React.createElement(MiniDrop, {
    w: 264
  }))));
}

// ============ PROMPT SETTINGS ============
function PromptSettings() {
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
    v: "56"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Text colour"
  }, /*#__PURE__*/React.createElement(Swatches, null)), /*#__PURE__*/React.createElement(Row, {
    label: "Previous line opacity"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "42"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Reading width"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "70"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Alignment"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Left", "Centre", "Right"],
    on: 1
  }))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Motion",
    icon: I2.bolt
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Scroll speed",
    sub: "142 words per minute"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "48"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Countdown",
    sub: "Before reading starts"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Off", "3s", "5s"],
    on: 1
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Smooth scroll",
    on: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Pause at markers",
    on: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Loop mode"
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Drop",
    icon: I2.move
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Position"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["Top left", "Top centre", "Top right"],
    on: 1
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Drop width"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "60"
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Background opacity"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "100"
  }))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Character",
    icon: I2.sparkles
  }, /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Show character",
    on: true
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Gesture intensity"
  }, /*#__PURE__*/React.createElement(Range, {
    v: "40"
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Reduced motion"
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Recording",
    icon: I2.video
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Camera"
  }, /*#__PURE__*/React.createElement(Sel, {
    opts: ["FaceTime HD Camera", "External webcam"]
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Microphone"
  }, /*#__PURE__*/React.createElement(Sel, {
    opts: ["MacBook Pro Microphone", "Shure MV7"]
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Resolution"
  }, /*#__PURE__*/React.createElement(Seg, {
    opts: ["720p", "1080p", "4K"],
    on: 1
  })), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Auto-record after countdown",
    on: true
  }), /*#__PURE__*/React.createElement(SwitchRow, {
    label: "Save take automatically",
    on: true
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
  }, "Live preview"), /*#__PURE__*/React.createElement(MiniDrop, {
    w: 280
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--launch btn--lg",
    style: {
      width: "100%",
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(I2.rocket, {
    size: 18
  }), " Launch Prompt Drop")));
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
  on
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "setrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "setrow__label"
  }, label), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: on
  }), /*#__PURE__*/React.createElement("span", {
    className: "track"
  })));
}
function Range({
  v
}) {
  return /*#__PURE__*/React.createElement("input", {
    className: "slider",
    style: {
      width: 160,
      backgroundSize: `${v}% 100%`
    },
    type: "range",
    defaultValue: v
  });
}
function Seg({
  opts,
  on
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, opts.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: i === on ? "on" : ""
  }, o)));
}
function Sel({
  opts
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "input",
    style: {
      width: 200,
      appearance: "none",
      paddingRight: 32
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o))));
}
function Swatches() {
  const cols = ["#F4F4F5", "#4C8DFF", "#8B7CFF", "#2FCF8F", "#F5A524"];
  return /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8
    }
  }, cols.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: c,
      boxShadow: i === 0 ? "0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-primary)" : "inset 0 0 0 1px var(--border-subtle)",
      cursor: "pointer"
    }
  })));
}

// ============ LIBRARY ============
function Library({
  setView
}) {
  const [tag, setTag] = useState("All");
  const tags = ["All", "Product", "Marketing", "Education", "Social", "Business"];
  const list = tag === "All" ? SCRIPTS : SCRIPTS.filter(s => s.tag === tag);
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
    placeholder: "Search scripts\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: "on"
  }, "Recent"), /*#__PURE__*/React.createElement("button", null, "Name"), /*#__PURE__*/React.createElement("button", null, "Length")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary"
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }), " New script"))), /*#__PURE__*/React.createElement("div", {
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
  }, list.map((s, i) => /*#__PURE__*/React.createElement(ScriptCard, {
    key: i,
    s: s,
    onClick: () => setView("studio")
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card--ghost card--int",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 124,
      color: "var(--text-muted)",
      gap: 8
    },
    onClick: () => setView("studio")
  }, /*#__PURE__*/React.createElement(I2.plus, {
    size: 16
  }), " New script")));
}

// ============ TAKE REVIEW ============
function TakeReview() {
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
      aspectRatio: "16/9",
      borderRadius: "var(--radius-xl)",
      background: "linear-gradient(135deg,#16161A,#050506)",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-elevated)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge--rec",
    style: {
      position: "absolute",
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement("i", null), " Take 1"), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn iconbtn--solid",
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "rgba(255,255,255,.92)",
      color: "#000"
    }
  }, /*#__PURE__*/React.createElement(I2.play, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, "0:00"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 4,
      borderRadius: 99,
      background: "rgba(255,255,255,.18)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "32%",
      height: "100%",
      borderRadius: 99,
      background: "var(--accent-primary)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, "1:12"))), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, /*#__PURE__*/React.createElement(Stat, {
    k: "Duration",
    v: "1:12"
  }), /*#__PURE__*/React.createElement(Stat, {
    k: "Words / min",
    v: "142"
  }), /*#__PURE__*/React.createElement(Stat, {
    k: "Filler words",
    v: "3",
    tone: "warning"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary"
  }, /*#__PURE__*/React.createElement(I2.download, {
    size: 16
  }), " Download video"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--secondary"
  }, "Export captions"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost"
  }, "Retake"))), /*#__PURE__*/React.createElement("div", {
    className: "card card--pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg seg--block",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "on"
  }, "Comparison"), /*#__PURE__*/React.createElement("button", null, "Transcript")), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Script vs. what you said"), /*#__PURE__*/React.createElement("div", {
    className: "stack",
    style: {
      gap: 12,
      fontSize: 14,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("p", null, "Hey everyone, welcome back to the channel."), /*#__PURE__*/React.createElement("p", null, "Today we're looking at ", /*#__PURE__*/React.createElement("mark", {
    style: {
      background: "var(--green-tint)",
      color: "var(--green-400)",
      padding: "0 3px",
      borderRadius: 4
    }
  }, "something"), " I'm ", /*#__PURE__*/React.createElement("mark", {
    style: {
      background: "var(--amber-tint)",
      color: "var(--amber-400)",
      padding: "0 3px",
      borderRadius: 4
    }
  }, "um,"), " genuinely excited about."), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      textDecoration: "line-through"
    }
  }, "No more glancing down."), /*#__PURE__*/React.createElement("p", null, "Just you, talking to your camera.")), /*#__PURE__*/React.createElement("hr", {
    className: "divider",
    style: {
      margin: "16px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Legend, {
    c: "var(--green-400)",
    t: "Changed word"
  }), /*#__PURE__*/React.createElement(Legend, {
    c: "var(--amber-400)",
    t: "Filler"
  }), /*#__PURE__*/React.createElement(Legend, {
    c: "var(--text-muted)",
    t: "Missed line"
  }))));
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
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: "-.02em",
      marginTop: 4,
      color: tone === "warning" ? "var(--amber-400)" : "var(--text-primary)",
      fontFamily: "var(--font-mono)"
    }
  }, v));
}
function Legend({
  c,
  t
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, t));
}
Object.assign(window, {
  PDDashboard: Dashboard,
  PDScriptStudio: ScriptStudio,
  PDPromptSettings: PromptSettings,
  PDLibrary: Library,
  PDTakeReview: TakeReview
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/control-app/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/control-app/shell.jsx
try { (() => {
// PromptDrop Control App, shell + screens
const {
  useState
} = React;
const I = window.PDIcons;
function Logo() {
  return /*#__PURE__*/React.createElement("div", {
    className: "nav__brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "nav__brandtext"
  }, "prompt", /*#__PURE__*/React.createElement("span", null, "drop")));
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
  id: "recordings",
  label: "Recordings",
  icon: I.video
}, {
  id: "library",
  label: "Library",
  icon: I.library
}, {
  id: "settings",
  label: "Prompt Settings",
  icon: I.settings
}];
function Sidebar({
  view,
  setView
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
    className: "nav__section"
  }, "Workspace"), NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: `navitem ${view === n.id ? "navitem--active" : ""}`,
    onClick: () => setView(n.id)
  }, /*#__PURE__*/React.createElement(n.icon, {
    size: 18
  }), " ", n.label)), /*#__PURE__*/React.createElement("div", {
    className: "nav__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav__upgrade"
  }, /*#__PURE__*/React.createElement("h4", null, "Upgrade to Pro"), /*#__PURE__*/React.createElement("p", null, "Unlimited takes, 4K recording and AI rewrites."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--sm",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(I.bolt, {
    size: 14
  }), " Upgrade")), /*#__PURE__*/React.createElement("hr", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nav__profile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar avatar--accent"
  }, "MO"), /*#__PURE__*/React.createElement("div", {
    className: "stack"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "Maya Okafor"), /*#__PURE__*/React.createElement("span", {
    className: "pl"
  }, "Free plan"))));
}
function Topbar({
  title,
  crumb,
  right
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__left"
  }, crumb && /*#__PURE__*/React.createElement("span", {
    className: "topbar__bc"
  }, crumb), /*#__PURE__*/React.createElement("h1", null, title)), /*#__PURE__*/React.createElement("div", {
    className: "topbar__right"
  }, right));
}

// ---- mini Prompt Drop preview (cosmetic) ----
function MiniDrop({
  state = "idle",
  w = 260
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      margin: "0 auto",
      background: "#000",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: "var(--radius-promptdrop)",
      boxShadow: "var(--shadow-promptdrop)",
      padding: "18px 0 22px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      marginBottom: 16
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#F4F4F5"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--tp-far)",
      fontSize: 15
    }
  }, "keeping your eyes"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--tp-current)",
      fontSize: 22,
      fontWeight: 600,
      margin: "8px 0",
      letterSpacing: "-.01em"
    }
  }, "right beside the lens."), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--tp-far)",
      fontSize: 15
    }
  }, "Speak like a person,"));
}
window.PDLogo = Logo;
window.PDSidebar = Sidebar;
window.PDTopbar = Topbar;
window.PDMiniDrop = MiniDrop;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/control-app/shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/prompt-drop/drop.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// PromptDrop, Prompt Drop experience (self-contained)
const {
  useState,
  useEffect
} = React;
const LINES = ["Hey everyone, welcome back.", "Today I want to show you something", "that changes how you record.", "A teleprompter that keeps your eyes", "right beside the lens.", "So you sound like a person,", "not someone reading a wall of text."];

// ---- minimal line-art character (eyes echo the brand dots) ----
function PChar({
  state = "idle",
  size = 64
}) {
  const c = "#F4F4F5";
  const st = {
    stroke: c,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const face = {
    prompting: {
      eyes: "line",
      mouth: null
    },
    complete: {
      eyes: "arc",
      mouth: "smile"
    },
    warning: {
      eyes: "dot",
      brow: "raised",
      mouth: "flat"
    },
    error: {
      eyes: "dot",
      brow: "sad",
      mouth: "frown"
    },
    processing: {
      eyes: "up",
      mouth: null
    },
    countdown: {
      eyes: "dot",
      mouth: "o"
    },
    paused: {
      eyes: "dot",
      mouth: "flat"
    },
    ready: {
      eyes: "dot",
      mouth: "smile"
    },
    idle: {
      eyes: "dot",
      mouth: "smile-sm"
    }
  }[state] || {
    eyes: "dot",
    mouth: "smile-sm"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `pchar pchar--${state}`,
    style: {
      width: size,
      height: size,
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 120",
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
    x: "22",
    y: "26",
    width: "76",
    height: "68",
    rx: "26"
  }, st, {
    opacity: "0.9"
  })), face.brow === "raised" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M40 46 q6 -7 14 -3"
  }, st)), face.brow === "sad" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({
    d: "M40 50 q6 4 14 1"
  }, st)), /*#__PURE__*/React.createElement("path", _extends({
    d: "M66 51 q6 -3 14 1"
  }, st))), face.eyes === "dot" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "47",
    cy: "58",
    r: "5",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "73",
    cy: "58",
    r: "5",
    fill: c
  })), face.eyes === "up" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "47",
    cy: "54",
    r: "5",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "73",
    cy: "54",
    r: "5",
    fill: c
  })), face.eyes === "line" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", _extends({
    x1: "42",
    y1: "60",
    x2: "52",
    y2: "60"
  }, st)), /*#__PURE__*/React.createElement("line", _extends({
    x1: "68",
    y1: "60",
    x2: "78",
    y2: "60"
  }, st))), face.eyes === "arc" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({
    d: "M42 60 q5 -8 10 0"
  }, st)), /*#__PURE__*/React.createElement("path", _extends({
    d: "M68 60 q5 -8 10 0"
  }, st))), face.mouth === "smile" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M50 74 q10 9 20 0"
  }, st)), face.mouth === "smile-sm" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M53 74 q7 5 14 0"
  }, st)), face.mouth === "flat" && /*#__PURE__*/React.createElement("line", _extends({
    x1: "52",
    y1: "76",
    x2: "68",
    y2: "76"
  }, st)), face.mouth === "frown" && /*#__PURE__*/React.createElement("path", _extends({
    d: "M50 78 q10 -8 20 0"
  }, st)), face.mouth === "o" && /*#__PURE__*/React.createElement("circle", _extends({
    cx: "60",
    cy: "76",
    r: "5"
  }, st)), state === "processing" && /*#__PURE__*/React.createElement("g", {
    className: "cthink"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "84",
    cy: "22",
    r: "3.2",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "95",
    cy: "22",
    r: "3.2",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "22",
    r: "3.2",
    fill: c
  })))));
}
const Play = /*#__PURE__*/React.createElement("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("polygon", {
  points: "6 4 20 12 6 20 6 4"
}));
function DropContent({
  state,
  count,
  idx,
  setState,
  restart
}) {
  const rec = state === "countdown" || state === "prompting";
  if (state === "idle" || state === "ready") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: state,
    size: 64
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__title"
  }, "Morning launch take"), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__status"
  }, "Ready \xB7 will record"), /*#__PURE__*/React.createElement("button", {
    className: "pdrop__play",
    onClick: restart
  }, Play));
  if (state === "countdown") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "countdown",
    size: 52
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__count"
  }, count === 0 ? "Go" : count), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__status pdrop__status--rec"
  }, "Recording"));
  if (state === "prompting") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pdrop__reader"
  }, [idx - 2, idx - 1, idx, idx + 1, idx + 2].map((i, k) => {
    const cls = i === idx ? "cur" : Math.abs(i - idx) === 1 ? "adj" : "far";
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      className: `pdrop__line pdrop__line--${cls}`
    }, LINES[i] || "");
  })), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__status pdrop__status--rec"
  }, /*#__PURE__*/React.createElement(PChar, {
    state: "prompting",
    size: 22
  }), "Recording"));
  if (state === "paused") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "paused",
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__status"
  }, "Paused"), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--primary",
    onClick: () => setState("prompting")
  }, "Resume"), /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--ghost",
    onClick: restart
  }, "Restart"), /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--ghost",
    onClick: () => setState("idle")
  }, "Exit")));
  if (state === "processing") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "processing",
    size: 64
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__msg"
  }, "Saving your take\u2026"));
  if (state === "complete") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "complete",
    size: 60
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__title"
  }, "Nice take."), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--primary"
  }, "Review take"), /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--ghost",
    onClick: restart
  }, "Start again")));
  if (state === "warning") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "warning",
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__msg"
  }, "Speed looks a little fast for this script."), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--ghost"
  }, "Adjust")));
  if (state === "error") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PChar, {
    state: "error",
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__msg"
  }, "Camera permission is missing."), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--primary"
  }, "Retry"), /*#__PURE__*/React.createElement("button", {
    className: "pdbtn pdbtn--ghost",
    onClick: () => setState("idle")
  }, "Exit")));
  return null;
}
const STATES = ["idle", "countdown", "prompting", "paused", "processing", "complete", "warning", "error"];
function App() {
  const [state, setState] = useState("idle");
  const [count, setCount] = useState(3);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const restart = () => {
    setState("countdown");
    setCount(3);
    setIdx(0);
  };
  useEffect(() => {
    if (state === "countdown") {
      if (count === 0) {
        const t = setTimeout(() => setState("prompting"), 500);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setCount(c => c - 1), 850);
      return () => clearTimeout(t);
    }
    if (state === "prompting" && auto) {
      if (idx >= LINES.length - 1) {
        const t = setTimeout(() => setState("complete"), 1500);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setIdx(i => i + 1), 1400);
      return () => clearTimeout(t);
    }
  }, [state, count, idx, auto]);
  const pick = s => {
    setAuto(s === "idle" || s === "countdown");
    if (s === "countdown") restart();else {
      setState(s);
      if (s === "prompting") setIdx(2);
    }
  };
  const progress = state === "prompting" ? Math.round(idx / (LINES.length - 1) * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stage__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stage__eyebrow"
  }, "The Prompt Drop"), /*#__PURE__*/React.createElement("div", {
    className: "stage__title"
  }, "A teleprompter that lives beside your camera."), /*#__PURE__*/React.createElement("div", {
    className: "stage__sub"
  }, "The black drop extends from the notch and becomes your live reading surface.")), /*#__PURE__*/React.createElement("div", {
    className: "mac"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mac__screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mac__subject"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mac__notch"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mac__lens"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdrop",
    "data-state": state
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdrop__dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "pdrop__body"
  }, /*#__PURE__*/React.createElement(DropContent, {
    state: state,
    count: count,
    idx: idx,
    setState: setState,
    restart: restart
  })), state === "prompting" && /*#__PURE__*/React.createElement("div", {
    className: "pdrop__progress",
    style: {
      width: `${progress}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mac__camlabel"
  }, /*#__PURE__*/React.createElement("i", null), " Your camera \xB7 1080p"))), /*#__PURE__*/React.createElement("div", {
    className: "mac__base"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mac__notchcut"
  })), /*#__PURE__*/React.createElement("div", {
    className: "controls"
  }, STATES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `statebtn ${state === s || s === "countdown" && state === "countdown" ? "statebtn--on" : ""}`,
    onClick: () => pick(s)
  }, s))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/prompt-drop/drop.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.PromptCharacter = __ds_scope.PromptCharacter;

__ds_ns.PromptDrop = __ds_scope.PromptDrop;

})();

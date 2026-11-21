import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onScroll, scrollTo, getScroll } from "../motion/smoothScroll.js";
import "./logo.css";

// The PromptDrop mark: a black drop with a camera lens at the top, two eyes and the blue
// script line. "Keep your eyes on the lens" is the product, so at rest the eyes look up at
// the lens.
//
// Interactive behaviours (top nav only):
//   - the eyes follow your pointer, then drift back to the lens when you stop
//   - it blinks, and dozes off if you leave it alone for a while
//   - the blue script line shows how far down the page you are
//   - it stretches a little when you scroll fast and looks the way you are going
//   - it smiles and looks at the main button when you hover one
//   - click at the top of the home page for a speaking tip; click further down to go back up
// With reduced motion on, it stays still and only the progress line updates.

const TIPS = [
  "Eyes on the lens, not on yourself.",
  "Pause after your first line. It reads as confidence.",
  "Short sentences. One breath each.",
  "Smile before you press record.",
  "Slow down a little. You speak faster than you think.",
  "Bad take? Record another. Your settings stay put.",
];
const EYE_X = 13, EYE_Y = 12;      // how far the pupils can move inside the eyes, in logo units
const LOOK_HOME_MS = 2600;         // pointer still for this long: eyes return to the lens
const SLEEP_MS = 25000;            // nothing at all for this long: it dozes off
const MIN_LINE = 24;               // script line length at the top of the page (percent)

export function LogoMark({ markRef, className = "", title }) {
  return (
    <svg ref={markRef} className={"logo__mark " + className} viewBox="0 0 512 512" role="img" aria-label={title || "PromptDrop"}>
      <rect x="8" y="8" width="496" height="496" rx="116" fill="#1C1C21" />
      <g className="logo__drop">
        <rect x="104" y="72" width="304" height="368" rx="100" fill="#000" />
        <circle className="logo__lens-ring" cx="256" cy="122" r="18" fill="none" strokeWidth="5" />
        <circle className="logo__lens" cx="256" cy="122" r="9" />
        <g className="logo__eye logo__eye--l"><circle cx="202" cy="208" r="29" fill="#F4F4F5" /><circle className="logo__pupil" cx="202" cy="208" r="12" /></g>
        <g className="logo__eye logo__eye--r"><circle cx="310" cy="208" r="29" fill="#F4F4F5" /><circle className="logo__pupil" cx="310" cy="208" r="12" /></g>
        <path className="logo__line-track" d="M168 322 H344" fill="none" strokeWidth="26" strokeLinecap="round" />
        <path className="logo__line" d="M168 322 H344" pathLength="100" fill="none" stroke="#4C8DFF" strokeWidth="26" strokeLinecap="round" />
        <path className="logo__smile" d="M190 304 Q256 372 322 304" fill="none" stroke="#4C8DFF" strokeWidth="26" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="brand__txt">prompt<span className="brand__drop" aria-hidden="true">{"drop".split("").map((ch, i) => <i key={i} style={{ "--i": i }}>{ch}</i>)}</span><span className="sr-only">drop</span></span>
  );
}

// Plain, still version for the footer and anywhere else.
export function StaticBrand({ to = "/", style }) {
  return <Link className="brand" to={to} style={style}><LogoMark /><Wordmark /></Link>;
}

export default function Brand() {
  const { pathname } = useLocation();
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const [tip, setTip] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const tipIndex = useRef(0);
  const tipTimer = useRef(null);
  const api = useRef({ wake() {}, talk() {} });

  useEffect(() => {
    const root = rootRef.current, mark = markRef.current;
    if (!root || !mark) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = (k, v) => root.style.setProperty(k, v);

    // The script line is the one thing that always updates: it is information.
    let squashTarget = 1, scrollBias = 0, scrollStamp = 0;
    const offScroll = onScroll((s) => {
      set("--p", String(Math.round(MIN_LINE + (100 - MIN_LINE) * s.progress)));
      setScrolled(s.y > 240);
      if (reduce) return;
      const v = Math.abs(s.velocity);
      if (v > 0.5) {
        squashTarget = 1 + Math.min(0.16, v * 0.004);
        scrollBias = Math.sign(s.velocity) * Math.min(EYE_Y, 2 + v * 0.2);
        scrollStamp = performance.now(); wake(); kick();
      }
    });
    if (reduce) { root.dataset.motion = "off"; return () => offScroll(); }
    root.dataset.motion = "on";

    const cur = { x: 0, y: 0, sq: 1, home: 1 }, target = { x: 0, y: 0 };
    let raf = 0, homeTimer = 0, sleepTimer = 0, blinkTimer = 0, asleep = false, ctaEl = null, destroyed = false;

    const frame = () => {
      raf = 0;
      const now = performance.now();
      if (now - scrollStamp > 160) { squashTarget = 1; scrollBias = 0; }
      let tx = target.x, ty = target.y + scrollBias;
      if (ctaEl) { const p = aim(ctaEl.getBoundingClientRect()); tx = p.x; ty = p.y; }
      ty = Math.max(-EYE_Y, Math.min(EYE_Y, ty));
      cur.x += (tx - cur.x) * 0.2; cur.y += (ty - cur.y) * 0.2; cur.sq += (squashTarget - cur.sq) * 0.22;
      set("--ex", cur.x.toFixed(2)); set("--ey", cur.y.toFixed(2)); set("--sq", cur.sq.toFixed(3));
      const wantHome = !ctaEl && tx === 0 && Math.abs(ty) < 0.01 ? 1 : 0;
      cur.home += (wantHome - cur.home) * 0.16;
      set("--home", cur.home.toFixed(3));
      root.dataset.gaze = cur.home > 0.85 ? "lens" : "away";
      const settled = Math.abs(tx - cur.x) < 0.05 && Math.abs(ty - cur.y) < 0.05 && Math.abs(squashTarget - cur.sq) < 0.002 && Math.abs(wantHome - cur.home) < 0.01;
      if (!settled || now - scrollStamp <= 160) kick();
    };
    const kick = () => { if (!raf && !destroyed) raf = requestAnimationFrame(frame); };

    // Direction from the logo to a point or box on screen, scaled to the eye range.
    const aim = (r) => {
      const m = mark.getBoundingClientRect();
      const dx = (r.left + (r.width || 0) / 2) - (m.left + m.width / 2), dy = (r.top + (r.height || 0) / 2) - (m.top + m.height / 2);
      const dist = Math.hypot(dx, dy) || 1, pull = Math.min(1, dist / 220);
      return { x: (dx / dist) * EYE_X * pull, y: (dy / dist) * EYE_Y * pull };
    };

    const wake = () => {
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => { asleep = true; root.dataset.state = "asleep"; target.x = 0; target.y = 0; kick(); }, SLEEP_MS);
      if (asleep) { asleep = false; root.dataset.state = "waking"; setTimeout(() => { if (root.dataset.state === "waking") root.dataset.state = "awake"; }, 520); }
    };
    const onMove = (e) => {
      wake();
      const p = aim({ left: e.clientX, top: e.clientY, width: 0, height: 0 });
      target.x = p.x; target.y = p.y; kick();
      clearTimeout(homeTimer);
      homeTimer = setTimeout(() => { target.x = 0; target.y = 0; kick(); }, LOOK_HOME_MS);
    };
    const onOver = (e) => { const b = e.target.closest && e.target.closest(".btn--primary"); if (b && !root.contains(b)) { ctaEl = b; root.dataset.mood = "smile"; kick(); } };
    const onOut = (e) => { if (ctaEl && e.target.closest && e.target.closest(".btn--primary") === ctaEl) { ctaEl = null; root.dataset.mood = ""; kick(); } };
    const onKey = () => wake();

    const blink = () => {
      if (!asleep) { root.dataset.blink = "1"; setTimeout(() => { root.dataset.blink = ""; }, 130); }
      blinkTimer = setTimeout(blink, 2600 + Math.random() * 4200);
    };
    blinkTimer = setTimeout(blink, 1800);

    api.current = {
      wake,
      talk() { root.dataset.talk = "1"; root.dataset.wink = "1"; setTimeout(() => { root.dataset.wink = ""; }, 260); setTimeout(() => { root.dataset.talk = ""; }, 1700); },
    };

    root.dataset.state = "awake";
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("keydown", onKey);
    wake();

    return () => {
      destroyed = true; offScroll(); cancelAnimationFrame(raf);
      clearTimeout(homeTimer); clearTimeout(sleepTimer); clearTimeout(blinkTimer);
      window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut); window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => () => clearTimeout(tipTimer.current), []);

  const onHome = pathname === "/";
  const onClick = (e) => {
    if (!onHome || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // other pages: go home as normal
    e.preventDefault();
    api.current.wake();
    if (getScroll().y > 240) { scrollTo(0); return; }
    const text = TIPS[tipIndex.current % TIPS.length]; tipIndex.current += 1;
    setTip(text); api.current.talk();
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTip(""), 3600);
  };
  const label = !onHome ? "PromptDrop home" : scrolled ? "Back to top" : "PromptDrop. Press for a speaking tip";

  return (
    <span className="logo logo--live" ref={rootRef} data-testid="logo" data-gaze="lens" style={{ "--p": MIN_LINE }}>
      <Link className="brand" to="/" onClick={onClick} aria-label={label} title={onHome && scrolled ? "Back to top" : undefined} data-testid="logo-link">
        <span className="logo__wrap">
          <LogoMark markRef={markRef} />
          <span className="logo__zzz" aria-hidden="true">z</span>
        </span>
        <Wordmark />
      </Link>
      <span className={"logo__tip" + (tip ? " is-open" : "")} role="status" aria-live="polite" data-testid="logo-tip">{tip}</span>
    </span>
  );
}

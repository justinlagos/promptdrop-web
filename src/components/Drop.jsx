import React, { useEffect, useRef, useState } from "react";
import "./drop.css";

// The hero PromptDrop: square top (docks to bezel), rounded bottom, with a soft layered
// shadow and a separate blurred shadow underneath so nothing clips it.
//
// Two modes:
//   <Drop scriptLine="..." />        a still picture of the prompter
//   <Drop lines={[...]} live />      a working demo: it reads through the lines at a set
//                                    pace, and the visitor can pause it and change the
//                                    speed and text size, like the real thing.
const SPEEDS = [110, 142, 175, 210];      // words per minute
const SIZES = [20, 26, 32];               // px, current line

export default function Drop({ scriptLine = "Hi, I’m Justin.", lines = null, live = false }) {
  const script = live && lines && lines.length ? lines : null;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1);
  const [inView, setInView] = useState(true);
  const stageRef = useRef(null);

  // Start reading on its own, unless the visitor has asked for less motion.
  useEffect(() => {
    if (!script) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPlaying(!reduce);
    if (!("IntersectionObserver" in window) || !stageRef.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, [!!script]);

  // Advance at reading pace: each line stays up for as long as it takes to say.
  useEffect(() => {
    if (!script || !playing || !inView) return;
    const words = script[idx].split(/\s+/).filter(Boolean).length;
    const ms = Math.max(1100, (words / SPEEDS[speed]) * 60000 + 350);
    const t = setTimeout(() => setIdx((i) => (i + 1) % script.length), ms);
    return () => clearTimeout(t);
  }, [script, playing, inView, idx, speed]);

  const at = (i) => (script ? script[(i + script.length) % script.length] : "");
  const step = (list, v, d) => Math.max(0, Math.min(list.length - 1, v + d));

  return (
    <div className={"drop-stage" + (script ? " drop-stage--live" : "")} ref={stageRef} data-testid={script ? "hero-demo" : undefined} data-line={script ? idx : undefined} data-playing={script ? (playing ? "1" : "0") : undefined}>
      <div className="drop-shadow" aria-hidden="true" />
      <div className="drop">
        <div className="drop__dots"><i /><i /><i /></div>
        <div className="drop__body">
          <Character />
          <div className="drop__eyebrow">A teleprompter that lives beside your camera</div>
          {script ? (
            <div className="drop__reader" aria-live="off" style={{ "--cur": SIZES[size] + "px" }}>
              <div className="drop__line drop__line--far" key={"p" + idx}>{at(idx - 1)}</div>
              <div className="drop__line drop__line--cur drop__line--enter" key={"c" + idx} data-testid="hero-demo-line">{at(idx)}</div>
              <div className="drop__line drop__line--far" key={"n" + idx}>{at(idx + 1)}</div>
            </div>
          ) : (
            <div className="drop__reader">
              <div className="drop__line drop__line--far">Read naturally on camera,</div>
              <div className="drop__line drop__line--cur">{scriptLine}</div>
              <div className="drop__line drop__line--far">and keep your eyes on the lens.</div>
            </div>
          )}
          <div className="drop__status">{script && !playing ? "paused" : "● rec"}</div>
        </div>
      </div>
      {script && (
        <div className="drop-controls" role="group" aria-label="Try the prompter">
          <button type="button" className="drop-ctl drop-ctl--main" onClick={() => setPlaying((p) => !p)} aria-pressed={playing} data-testid="hero-demo-toggle">{playing ? "Pause" : "Play"}</button>
          <span className="drop-ctl__group">
            <span className="drop-ctl__label">Speed</span>
            <button type="button" className="drop-ctl" onClick={() => setSpeed((v) => step(SPEEDS, v, -1))} disabled={speed === 0} aria-label="Slower" data-testid="hero-demo-slower">−</button>
            <span className="drop-ctl__value" data-testid="hero-demo-speed">{SPEEDS[speed]} wpm</span>
            <button type="button" className="drop-ctl" onClick={() => setSpeed((v) => step(SPEEDS, v, 1))} disabled={speed === SPEEDS.length - 1} aria-label="Faster" data-testid="hero-demo-faster">+</button>
          </span>
          <span className="drop-ctl__group">
            <span className="drop-ctl__label">Size</span>
            <button type="button" className="drop-ctl" onClick={() => setSize((v) => step(SIZES, v, -1))} disabled={size === 0} aria-label="Smaller text" data-testid="hero-demo-smaller">A−</button>
            <button type="button" className="drop-ctl" onClick={() => setSize((v) => step(SIZES, v, 1))} disabled={size === SIZES.length - 1} aria-label="Larger text" data-testid="hero-demo-larger">A+</button>
          </span>
        </div>
      )}
    </div>
  );
}

function Character() {
  const c = "#F4F4F5";
  const st = { stroke: c, strokeWidth: 3, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg className="drop__char" viewBox="0 0 120 120" width="52" height="52" aria-hidden="true">
      <rect x="22" y="26" width="76" height="68" rx="26" {...st} opacity="0.9" />
      <g className="drop__char-eyes"><circle cx="47" cy="58" r="5" fill={c} /><circle cx="73" cy="58" r="5" fill={c} /></g>
      <path d="M50 74 q10 8 20 0" {...st} />
    </svg>
  );
}

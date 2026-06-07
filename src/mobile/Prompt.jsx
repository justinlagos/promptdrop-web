import React, { useEffect, useRef, useState } from "react";
import { scriptsService } from "../services/scriptsService.js";
import { useAuth } from "../auth/AuthContext.jsx";

const SAMPLE = "Hi everyone, thanks for joining. Today I want to walk you through three quick things, then leave plenty of time for questions. Take a breath. Look right into the lens. You've got this.";

// Full-screen, touch-first teleprompter. Tap the text to play/pause and reveal controls.
export default function Prompt() {
  const { isSignedIn } = useAuth() || {};
  const [phase, setPhase] = useState("setup");        // setup | run
  const [scripts, setScripts] = useState([]);
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(48);             // px per second
  const [size, setSize] = useState(34);               // font px
  const [mirror, setMirror] = useState(false);

  useEffect(() => { if (isSignedIn) scriptsService.list().then(setScripts).catch(() => {}); }, [isSignedIn]);

  if (phase === "run") {
    return <Runner text={text || SAMPLE} speed={speed} setSpeed={setSpeed} size={size} mirror={mirror} onExit={() => setPhase("setup")} />;
  }

  return (
    <div className="mscreen">
      <header className="mhead"><h1>Teleprompter</h1></header>
      <div className="mbody">
        <label className="mlabel">Your script</label>
        <textarea className="mta" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your script here…  Leave a blank line for a breath." />

        {scripts.length > 0 && (
          <>
            <label className="mlabel" style={{ marginTop: 16 }}>Or pick a saved script</label>
            <div className="mchips">
              {scripts.map((s) => (
                <button key={s.id} className="mchip" onClick={() => setText(s.body || "")}>{s.title || "Untitled"}</button>
              ))}
            </div>
          </>
        )}

        <div className="mrow" style={{ marginTop: 18 }}>
          <span className="mlabel" style={{ margin: 0 }}>Speed</span>
          <input className="mslider" type="range" min="16" max="120" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </div>
        <div className="mrow">
          <span className="mlabel" style={{ margin: 0 }}>Text size</span>
          <input className="mslider" type="range" min="22" max="60" value={size} onChange={(e) => setSize(+e.target.value)} />
        </div>
        <label className="mtoggle">
          <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} />
          <span>Mirror (for glass teleprompters)</span>
        </label>
      </div>
      <div className="mscreen__cta">
        <button className="btn btn--primary btn--lg" style={{ width: "100%", height: 54, borderRadius: 16 }} onClick={() => setPhase("run")} disabled={!(text || "").trim() && false}>
          Start prompting
        </button>
      </div>
    </div>
  );
}

function Runner({ text, speed, setSpeed, size, mirror, onExit }) {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const yRef = useRef(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const hideT = useRef(null);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const lines = text.split(/\n/);

  useEffect(() => {
    function frame(t) {
      if (!lastRef.current) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000; lastRef.current = t;
      if (playing && trackRef.current && wrapRef.current) {
        yRef.current += speedRef.current * dt;
        const max = trackRef.current.scrollHeight - wrapRef.current.clientHeight * 0.25;
        if (yRef.current > max) { yRef.current = max; setPlaying(false); }
        trackRef.current.style.transform = `translateY(${-yRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  function flashUI() {
    setShowUI(true);
    clearTimeout(hideT.current);
    if (playing) hideT.current = setTimeout(() => setShowUI(false), 2600);
  }
  useEffect(() => { flashUI(); return () => clearTimeout(hideT.current); }, [playing]); // eslint-disable-line

  function tapText() { setPlaying((p) => !p); flashUI(); }
  function restart() { yRef.current = 0; lastRef.current = 0; if (trackRef.current) trackRef.current.style.transform = "translateY(0)"; setPlaying(true); flashUI(); }

  return (
    <div className="tp" onClick={flashUI}>
      <div className="tp__reader" ref={wrapRef} onClick={(e) => { e.stopPropagation(); tapText(); }}>
        <div className="tp__band" />
        <div className="tp__track" ref={trackRef} style={{ fontSize: size, transform: `scaleX(${mirror ? -1 : 1})`, transformOrigin: "center" }}>
          {lines.map((ln, i) => <p key={i} className={ln.trim() ? "tp__line" : "tp__gap"} style={mirror ? { transform: "scaleX(-1)" } : undefined}>{ln || " "}</p>)}
        </div>
      </div>

      <div className={"tp__bar" + (showUI ? "" : " tp__bar--hidden")} onClick={(e) => e.stopPropagation()}>
        <button className="tp__btn" onClick={onExit} aria-label="Exit">✕</button>
        <button className="tp__btn" onClick={() => setSpeed(Math.max(16, speed - 8))} aria-label="Slower">−</button>
        <button className="tp__play" onClick={() => { setPlaying((p) => !p); flashUI(); }}>{playing ? "❚❚" : "►"}</button>
        <button className="tp__btn" onClick={() => setSpeed(Math.min(120, speed + 8))} aria-label="Faster">+</button>
        <button className="tp__btn" onClick={restart} aria-label="Restart">↺</button>
      </div>
    </div>
  );
}

import React from "react";
import "./drop.css";

// The premium hero PromptDrop: square top (docks to bezel), rounded bottom,
// with a soft layered shadow + a separate blurred shadow ellipsis underneath so
// nothing clips it. Used on the landing hero.
export default function Drop({ scriptLine = "Hi, I’m Justin." }) {
  return (
    <div className="drop-stage">
      <div className="drop-shadow" aria-hidden="true" />
      <div className="drop">
        <div className="drop__dots"><i /><i /><i /></div>
        <div className="drop__body">
          <Character />
          <div className="drop__eyebrow">A teleprompter that lives beside your camera</div>
          <div className="drop__reader">
            <div className="drop__line drop__line--far">Read naturally on camera,</div>
            <div className="drop__line drop__line--cur">{scriptLine}</div>
            <div className="drop__line drop__line--far">and keep your eyes on the lens.</div>
          </div>
          <div className="drop__status">● rec</div>
        </div>
      </div>
    </div>
  );
}

function Character() {
  const c = "#F4F4F5";
  const st = { stroke: c, strokeWidth: 3, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg className="drop__char" viewBox="0 0 120 120" width="52" height="52" aria-hidden="true">
      <rect x="22" y="26" width="76" height="68" rx="26" {...st} opacity="0.9" />
      <circle cx="47" cy="58" r="5" fill={c} /><circle cx="73" cy="58" r="5" fill={c} />
      <path d="M50 74 q10 8 20 0" {...st} />
    </svg>
  );
}

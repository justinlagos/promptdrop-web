import React, { useEffect, useMemo, useRef, useState } from "react";
import { recordingDB } from "../services/recordingDB.js";
import { ctMerge, ctKept, ctClock, ctDetectSilences, ctPauseDecisions, ctSRT, ctVTT, ctDownloadText } from "../services/cleanTake.js";
import { renderCleanVideo, renderAudioWav, downloadBlob } from "../services/cleanExport.js";

const SEG = (opts, val, on) => (
  <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 10, flexWrap: "wrap" }}>
    {opts.map((o) => (
      <button key={o} className="btn" onClick={() => on(o)} style={{ height: 32, padding: "0 12px", fontSize: 12.5, borderRadius: 7, background: val === o ? "var(--surface-raised)" : "transparent", color: val === o ? "var(--text-primary)" : "var(--text-secondary)" }}>{o}</button>
    ))}
  </div>
);

export default function CleanTake({ id, onBack }) {
  const [take, setTake] = useState(null);
  const [url, setUrl] = useState(null);
  const urlRef = useRef(null);
  const [analysing, setAnalysing] = useState(true);
  const [step, setStep] = useState("Reading the take…");
  const [silences, setSilences] = useState(null);
  const [duration, setDuration] = useState(0);
  const [tab, setTab] = useState("Clean");
  const [view, setView] = useState("clean");
  const [preset, setPreset] = useState("Balanced");
  const [speed, setSpeed] = useState("Normal");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [restored, setRestored] = useState({});
  const [style, setStyle] = useState({ b: 100, c: 100, s: 100 });
  const [saved, setSaved] = useState(false);
  const vref = useRef(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const t = await recordingDB.get(id);
      if (!live) return;
      setTake(t || null);
      if (t && t.blob && t.blob.size > 0) {
        const u = URL.createObjectURL(t.blob); urlRef.current = u; setUrl(u);
        if (t.clean) { setPreset(t.clean.preset || "Balanced"); setSilences(t.clean.silences || null); setDuration(t.clean.duration || t.durationMs / 1000); setRestored(t.clean.restored || {}); setTrimStart(t.clean.trimStart || 0); setTrimEnd(t.clean.trimEnd || 0); setStyle(t.clean.style || { b: 100, c: 100, s: 100 }); setSpeed(t.clean.speed || "Normal"); setAnalysing(false); }
        else {
          setStep("Finding pauses…");
          const res = await ctDetectSilences(t.blob);
          if (!live) return;
          if (res) { setSilences(res.silences); setDuration(res.duration || t.durationMs / 1000); } else setDuration(t.durationMs / 1000);
          setStep("Building your clean cut…"); setTimeout(() => live && setAnalysing(false), 350);
        }
      } else setAnalysing(false);
    })();
    return () => { live = false; if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, [id]);

  const dur = duration || (take ? take.durationMs / 1000 : 0);
  const rate = { Normal: 1, "Slightly faster": 1.1, "Social pace": 1.25 }[speed] || 1;
  const pauseDecisions = useMemo(() => ctPauseDecisions(silences, preset).filter((d) => !restored[d.id]), [silences, preset, restored]);
  const removed = useMemo(() => {
    const r = [...pauseDecisions];
    if (trimStart > 0) r.push({ id: "trimS", type: "trim", start: 0, end: trimStart, label: "Trimmed start" });
    if (trimEnd > 0) r.push({ id: "trimE", type: "trim", start: Math.max(0, dur - trimEnd), end: dur, label: "Trimmed end" });
    return r;
  }, [pauseDecisions, trimStart, trimEnd, dur]);
  const removedSec = ctMerge(removed).reduce((a, s) => a + (s.end - s.start), 0);
  const cleanDur = Math.max(0, dur - removedSec) / rate;
  const filterCss = `brightness(${style.b}%) contrast(${style.c}%) saturate(${style.s}%)`;
  const allPauses = useMemo(() => ctPauseDecisions(silences, preset), [silences, preset]);

  const applyRate = () => { const v = vref.current; if (v) { try { v.playbackRate = view === "clean" ? rate : 1; } catch (e) {} } };
  useEffect(() => { applyRate(); }, [rate, view, url]);
  function onTime() {
    const v = vref.current; if (!v || view !== "clean") return;
    const t = v.currentTime;
    if (trimEnd > 0 && dur && t >= dur - trimEnd - 0.05) { try { v.pause(); } catch (e) {} }
    for (const s of ctMerge(removed)) { if (t >= s.start - 0.02 && t < s.end - 0.05) { try { v.currentTime = s.end + 0.001; } catch (e) {} break; } }
  }
  function onPlay() { applyRate(); const v = vref.current; if (v && view === "clean" && trimStart > 0 && v.currentTime < trimStart) { try { v.currentTime = trimStart + 0.001; } catch (e) {} } }

  async function save() {
    if (!take) return;
    const clean = { preset, speed, trimStart, trimEnd, restored, style, silences, duration: dur, removedPauseCount: pauseDecisions.length, durationBefore: dur, durationAfter: cleanDur, updatedAt: Date.now(), status: "ready" };
    await recordingDB.save({ ...take, clean });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }
  function dl() { if (!url) return; const ext = take && take.type && take.type.indexOf("mp4") >= 0 ? "mp4" : "webm"; const a = document.createElement("a"); a.href = url; a.download = "promptdrop-original." + ext; a.click(); }

  const [exporting, setExporting] = useState(null);
  const [prog, setProg] = useState(0);
  const [exportErr, setExportErr] = useState("");
  async function exportClean(withCaptions) {
    if (!take?.blob) return;
    setExportErr(""); setExporting(withCaptions ? "captioned" : "clean"); setProg(0);
    try {
      const out = await renderCleanVideo(take.blob, { removed, rate, filterCss, trimStart, trimEnd, segments: take.segments || null, withCaptions, onProgress: setProg });
      downloadBlob(out, `promptdrop-clean-take.webm`);
    } catch (e) { setExportErr(e.message || "Export failed."); }
    setExporting(null); setProg(0);
  }
  async function exportAudio() {
    if (!take?.blob) return;
    setExportErr(""); setExporting("audio");
    try { const out = await renderAudioWav(take.blob, { trimStart, trimEnd }); downloadBlob(out, "promptdrop-audio.wav"); }
    catch (e) { setExportErr(e.message || "Export failed."); }
    setExporting(null);
  }

  if (analysing) return (
    <main className="wrap" style={{ padding: "120px 24px", textAlign: "center", maxWidth: 560 }}>
      <button className="btn btn--ghost" onClick={onBack} style={{ position: "absolute", left: 20, top: 70 }}>← Back</button>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Preparing your clean edit…</div>
      <p style={{ color: "var(--text-muted)" }}>{step}</p>
    </main>
  );

  return (
    <main className="wrap" style={{ padding: "24px 24px 60px", maxWidth: 1180 }}>
      <button className="btn btn--ghost" onClick={onBack} style={{ marginBottom: 14 }}>← Back</button>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(320px,1fr)", gap: 22, alignItems: "start" }}>
        {/* left: preview */}
        <div>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "16/10", position: "relative" }}>
            {url ? <video ref={vref} src={url} controls playsInline preload="metadata" onTimeUpdate={onTime} onPlay={onPlay} onLoadedMetadata={applyRate} onRateChange={applyRate} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000", filter: view === "clean" ? filterCss : "none", transition: "filter .12s ease" }} />
              : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", padding: 24, textAlign: "center" }}>No video was captured for this recording.</div>}
          </div>
          <div style={{ display: "flex", background: "var(--surface-sunken)", borderRadius: 10, padding: 3, gap: 2, marginTop: 12, maxWidth: 320 }}>
            {[["original", "Original"], ["clean", "Clean Edit"]].map(([v, l]) => (
              <button key={v} className="btn" onClick={() => setView(v)} style={{ flex: 1, height: 34, borderRadius: 7, fontSize: 13, fontWeight: 600, background: view === v ? "var(--surface-raised)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-muted)" }}>{l}</button>
            ))}
          </div>
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>
            {preset !== "Off" && !silences
              ? <>{preset} pause cleanup selected. Automatic pause detection is not available for this recording.</>
              : preset !== "Off" && pauseDecisions.length
              ? <>{pauseDecisions.length} pause{pauseDecisions.length === 1 ? "" : "s"} suggested · {ctClock(dur)} → {ctClock(cleanDur)}</>
              : (trimStart || trimEnd || rate !== 1)
              ? <>Edits applied · {ctClock(dur)} → {ctClock(cleanDur)}</>
              : <>Clean Take is ready for edits · {ctClock(dur)}</>}
          </p>
          {/* Edit Map */}
          <div style={{ marginTop: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Edit Map · green kept, red removed</div>
            <div style={{ position: "relative", height: 24, borderRadius: 8, overflow: "hidden", background: "var(--success, #34C759)" }}>
              {ctMerge(removed).map((s, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: (s.start / dur * 100) + "%", width: Math.max(0.5, (s.end - s.start) / dur * 100) + "%", background: "var(--recording, #FF3B30)" }} />)}
            </div>
            {allPauses.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                {allPauses.map((p) => { const kept = restored[p.id]; return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: kept ? "var(--success,#34C759)" : "var(--recording,#FF3B30)" }} />
                    <span style={{ flex: 1, fontSize: 13.5 }}>{p.label} <span style={{ color: "var(--text-muted)", fontSize: 12 }}>at {ctClock(p.start)}</span></span>
                    <button className="btn btn--ghost" style={{ height: 30, fontSize: 12.5 }} onClick={() => setRestored((r) => ({ ...r, [p.id]: !r[p.id] }))}>{kept ? "Removed" : "Restore"}</button>
                  </div>
                ); })}
              </div>
            )}
          </div>
        </div>

        {/* right: controls */}
        <div className="card" style={{ padding: 18, position: "sticky", top: 70 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
            {["Clean", "Captions", "Style", "Export"].map((o) => (
              <button key={o} className="btn" onClick={() => setTab(o)} style={{ height: 32, padding: "0 13px", fontSize: 12.5, borderRadius: 999, background: tab === o ? "var(--accent-primary, #6C8CFF)" : "var(--surface-elevated)", color: tab === o ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-default)" }}>{o}</button>
            ))}
          </div>

          {tab === "Clean" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Row label="Clean pauses" hint={silences ? "Trims dead air and long gaps." : "Pause detection unavailable here."}>{SEG(["Off", "Light", "Balanced", "Tight"], preset, setPreset)}</Row>
              <Row label="Remove filler words" hint="Needs transcription (next update)."><span style={{ fontSize: 12.5, color: "var(--text-muted)", background: "var(--surface-sunken)", padding: "6px 10px", borderRadius: 8 }}>Review first · pending</span></Row>
              <Row label="Speed">{SEG(["Normal", "Slightly faster", "Social pace"], speed, setSpeed)}</Row>
              <Row label={`Trim start · ${ctClock(trimStart)}`}><input type="range" min={0} max={Math.max(1, Math.floor(dur / 2))} value={trimStart} onChange={(e) => setTrimStart(+e.target.value)} style={{ width: "100%" }} /></Row>
              <Row label={`Trim end · ${ctClock(trimEnd)}`}><input type="range" min={0} max={Math.max(1, Math.floor(dur / 2))} value={trimEnd} onChange={(e) => setTrimEnd(+e.target.value)} style={{ width: "100%" }} /></Row>
            </div>
          )}
          {tab === "Captions" && (
            take && take.transcript
              ? <div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{take.transcript.slice(0, 500)}{take.transcript.length > 500 ? "…" : ""}</p>
                  {(take.segments && take.segments.length > 0)
                    ? <div style={{ display: "flex", gap: 10, marginTop: 12 }}><button className="btn btn--secondary" onClick={() => ctDownloadText(ctSRT(take.segments), "captions.srt")}>Export SRT</button><button className="btn btn--secondary" onClick={() => ctDownloadText(ctVTT(take.segments), "captions.vtt")}>Export VTT</button></div>
                    : <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 10 }}>This transcript has no timing, so timed captions are not available.</p>}
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>Burned-in captions arrive with video export rendering.</p>
                </div>
              : <div><div style={{ fontSize: 15, fontWeight: 600 }}>Captions need transcription</div><p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>Pause cleanup works now. Captions appear once transcription is switched on.</p></div>
          )}
          {tab === "Style" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0 }}>Previews live; baked in when export rendering is connected.</p>
              <Row label={`Brightness ${style.b}%`}><input type="range" min={70} max={130} value={style.b} onChange={(e) => setStyle((s) => ({ ...s, b: +e.target.value }))} style={{ width: "100%" }} /></Row>
              <Row label={`Contrast ${style.c}%`}><input type="range" min={70} max={130} value={style.c} onChange={(e) => setStyle((s) => ({ ...s, c: +e.target.value }))} style={{ width: "100%" }} /></Row>
              <Row label={`Saturation ${style.s}%`}><input type="range" min={50} max={150} value={style.s} onChange={(e) => setStyle((s) => ({ ...s, s: +e.target.value }))} style={{ width: "100%" }} /></Row>
              <button className="btn btn--ghost" style={{ alignSelf: "flex-start", height: 32, fontSize: 12.5 }} onClick={() => setStyle({ b: 100, c: 100, s: 100 })}>Reset to natural</button>
            </div>
          )}
          {tab === "Export" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {exporting && <div className="note" style={{ marginBottom: 4 }}>Rendering {exporting} export... {prog > 0 ? Math.round(prog * 100) + "%" : ""} This plays the take through once, so it takes about as long as the video.</div>}
              {exportErr && <div className="note note--err" style={{ marginBottom: 4 }}>{exportErr}</div>}
              <Exp label="Original video" sub={ctClock(dur)} ready onClick={dl} />
              <Exp label="Clean Take video" sub={`${ctClock(cleanDur)} · renders in your browser`} ready={!!take?.blob && !exporting} onClick={() => exportClean(false)} />
              <Exp label="Captioned video" sub={take && take.segments && take.segments.length ? "Burns in captions" : "Needs transcription"} ready={!!(take && take.segments && take.segments.length) && !exporting} onClick={() => exportClean(true)} />
              <Exp label="Audio only (WAV)" sub="Extracts the audio" ready={!!take?.blob && !exporting} onClick={exportAudio} />
              <Exp label="Transcript" sub={take && take.transcript ? "Ready" : "Needs transcription"} ready={!!(take && take.transcript)} onClick={() => { if (take && take.transcript) ctDownloadText(take.transcript, "transcript.txt"); }} />
              <Exp label="Captions (SRT)" sub={take && take.segments && take.segments.length ? "Ready" : "Needs word timing"} ready={!!(take && take.segments && take.segments.length)} onClick={() => ctDownloadText(ctSRT(take.segments), "captions.srt")} />
              <Exp label="Captions (VTT)" sub={take && take.segments && take.segments.length ? "Ready" : "Needs word timing"} ready={!!(take && take.segments && take.segments.length)} onClick={() => ctDownloadText(ctVTT(take.segments), "captions.vtt")} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn btn--primary" style={{ flex: 1 }} onClick={save}>{saved ? "Saved ✓" : "Save Clean Take"}</button>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>Your original recording is always kept untouched.</p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, hint, children }) {
  return (<div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}><span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>{hint && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{hint}</span>}</div>{children}</div>);
}
function Exp({ label, sub, note, ready, onClick }) {
  return (
    <button className="card" onClick={ready ? onClick : undefined} style={{ textAlign: "left", padding: 12, border: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 10, cursor: ready ? "pointer" : "default", opacity: ready ? 1 : 0.7 }}>
      <span style={{ flex: 1 }}><span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>{label}</span><span style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{note || sub}</span></span>
      <span style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)", color: ready ? "var(--accent-primary,#6C8CFF)" : "var(--text-muted)" }}>{ready ? "GET" : "SOON"}</span>
    </button>
  );
}

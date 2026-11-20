// cleantake.jsx - Clean Take: non-destructive AI-assisted clean-up for a recorded take.
// The original blob is never modified. All edits live in an edit decision list (EDL).
const DSc = window.PromptDropDesignSystem_82c6c3;

// ---- pure helpers (shared logic) -----------------------------------------
function ctMerge(segs) {
  const s = segs.filter(Boolean).map((x) => ({ start: Math.max(0, x.start), end: x.end })).filter((x) => x.end > x.start).sort((a, b) => a.start - b.start);
  const out = [];
  for (const seg of s) { const last = out[out.length - 1]; if (last && seg.start <= last.end + 0.001) last.end = Math.max(last.end, seg.end); else out.push({ ...seg }); }
  return out;
}
// kept intervals = [0,duration] minus the active removed segments
function ctKept(duration, removed) {
  const rm = ctMerge(removed); const kept = []; let cur = 0;
  for (const r of rm) { if (r.start > cur) kept.push({ start: cur, end: Math.min(r.start, duration) }); cur = Math.max(cur, r.end); }
  if (cur < duration) kept.push({ start: cur, end: duration });
  return kept.filter((k) => k.end - k.start > 0.05);
}
const ctClock = (s) => { s = Math.max(0, Math.round(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

// captions from timed segments
function ctStamp(t, comma) { t = Math.max(0, t || 0); const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60), ms = Math.floor((t - Math.floor(t)) * 1000); const p = (n, l) => String(n).padStart(l, "0"); return p(h, 2) + ":" + p(m, 2) + ":" + p(s, 2) + (comma ? "," : ".") + p(ms, 3); }
function ctSRT(segs) { return (segs || []).map((s, i) => `${i + 1}\n${ctStamp(s.start, true)} --> ${ctStamp(s.end, true)}\n${(s.text || "").trim()}\n`).join("\n"); }
function ctVTT(segs) { return "WEBVTT\n\n" + (segs || []).map((s) => `${ctStamp(s.start, false)} --> ${ctStamp(s.end, false)}\n${(s.text || "").trim()}\n`).join("\n"); }
function ctDownloadText(text, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = name; a.click(); }
function ctDownloadBlob(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); setTimeout(() => { try { URL.revokeObjectURL(u); } catch (e) {} }, 4000); }
const _ctSeek = (v, t) => new Promise((res) => { const f = () => { v.removeEventListener("seeked", f); res(); }; v.addEventListener("seeked", f); try { v.currentTime = t; } catch (e) { res(); } });
function _ctCaption(ctx, segments, t, w, h) { const seg = (segments || []).find((s) => t >= s.start && t <= s.end); if (!seg || !seg.text) return; const fs = Math.round(h * 0.045); ctx.font = `600 ${fs}px sans-serif`; ctx.textAlign = "center"; const text = seg.text.trim().slice(0, 90); const y = h - Math.round(h * 0.08); const mw = ctx.measureText(text).width; ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(w / 2 - mw / 2 - 16, y - fs, mw + 32, fs + 18); ctx.fillStyle = "#fff"; ctx.fillText(text, w / 2, y); }
// Real in-browser Clean Take render (canvas capture + WebAudio). No server.
// Recordings made in the browser often have no length in the file, so the video element
// reports Infinity. Work the real length out instead of treating it as zero: seeking far
// past the end makes the browser scan the file and report the true duration.
async function _ctResolveDuration(video, hint) {
  if (isFinite(video.duration) && video.duration > 0) return video.duration;
  try {
    await new Promise((res) => {
      let done = false; const end = () => { if (done) return; done = true; video.removeEventListener("durationchange", chk); video.removeEventListener("timeupdate", chk); res(); };
      const chk = () => { if (isFinite(video.duration) && video.duration > 0) end(); };
      video.addEventListener("durationchange", chk); video.addEventListener("timeupdate", chk);
      setTimeout(end, 4000);
      try { video.currentTime = 1e101; } catch (e) { end(); }
    });
  } catch (e) {}
  if (isFinite(video.duration) && video.duration > 0) return video.duration;
  return hint > 0 ? hint : 0;
}

async function ctRenderCleanVideo(blob, opts = {}) {
  const { removed = [], rate = 1, filterCss = "none", trimStart = 0, trimEnd = 0, segments = null, withCaptions = false, onProgress, duration = 0 } = opts;
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) throw new Error("This browser cannot render video here.");
  const url = URL.createObjectURL(blob); const video = document.createElement("video"); video.src = url; video.playsInline = true;
  await new Promise((res, rej) => { video.onloadedmetadata = res; video.onerror = () => rej(new Error("Could not read the recording.")); });
  const dur = await _ctResolveDuration(video, duration);
  if (!(dur > 0)) { try { URL.revokeObjectURL(url); } catch (e) {} throw new Error("Could not work out the length of this recording, so it cannot be exported here."); }
  const w = video.videoWidth || 720, h = video.videoHeight || 1280;
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; const ctx = canvas.getContext("2d");
  const cStream = canvas.captureStream(30); let combined = cStream, ac;
  try { const AC = window.AudioContext || window.webkitAudioContext; ac = new AC(); const s = ac.createMediaElementSource(video); const d = ac.createMediaStreamDestination(); s.connect(d); combined = new MediaStream([...cStream.getVideoTracks(), ...d.stream.getAudioTracks()]); } catch (e) {}
  const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || "";
  const rec = mime ? new MediaRecorder(combined, { mimeType: mime }) : new MediaRecorder(combined); const chunks = []; rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  const segs = ctMerge(removed); const startAt = trimStart > 0 ? trimStart : 0; const endAt = trimEnd > 0 ? Math.max(startAt + 0.1, dur - trimEnd) : dur;
  try { video.playbackRate = rate || 1; } catch (e) {} await _ctSeek(video, startAt);
  let finished = false, raf = 0; const finish = () => { if (finished) return; finished = true; cancelAnimationFrame(raf); try { video.pause(); } catch (e) {} try { rec.stop(); } catch (e) {} };
  function draw() { try { ctx.filter = filterCss || "none"; ctx.drawImage(video, 0, 0, w, h); ctx.filter = "none"; if (withCaptions && segments) _ctCaption(ctx, segments, video.currentTime, w, h); } catch (e) {} raf = requestAnimationFrame(draw); }
  function onTime() { const t = video.currentTime; if (t >= endAt - 0.03) { finish(); return; } for (const s of segs) { if (t >= s.start - 0.02 && t < s.end - 0.05) { try { video.currentTime = s.end + 0.001; } catch (e) {} break; } } if (onProgress) onProgress(Math.max(0, Math.min(1, (t - startAt) / Math.max(0.1, endAt - startAt)))); }
  video.addEventListener("timeupdate", onTime); video.addEventListener("ended", finish); rec.start(); draw();
  try { await video.play(); } catch (e) { finish(); throw new Error("Tap the video once, then export."); }
  const out = await new Promise((res) => { rec.onstop = () => res(new Blob(chunks, { type: mime || "video/webm" })); setTimeout(() => { if (!finished) finish(); }, (Math.max(1, (endAt - startAt) / (rate || 1)) * 1000) + 4000); });
  try { URL.revokeObjectURL(url); } catch (e) {} try { ac && ac.close(); } catch (e) {}
  return out;
}
async function ctRenderAudioWav(blob, opts = {}) {
  const { trimStart = 0, trimEnd = 0 } = opts; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw new Error("Audio export not supported here.");
  const buf = await blob.arrayBuffer(); const ac = new AC(); const audio = await ac.decodeAudioData(buf.slice(0)).catch(() => null); if (!audio) { try { ac.close(); } catch (e) {} throw new Error("Could not read audio."); }
  const sr = audio.sampleRate; const start = Math.floor((trimStart || 0) * sr); const end = trimEnd > 0 ? Math.floor((audio.duration - trimEnd) * sr) : audio.length; const len = Math.max(0, end - start); const ch = Math.min(2, audio.numberOfChannels);
  const out = new ArrayBuffer(44 + len * ch * 2); const view = new DataView(out); const ws = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); view.setUint32(4, 36 + len * ch * 2, true); ws(8, "WAVE"); ws(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, ch, true); view.setUint32(24, sr, true); view.setUint32(28, sr * ch * 2, true); view.setUint16(32, ch * 2, true); view.setUint16(34, 16, true); ws(36, "data"); view.setUint32(40, len * ch * 2, true);
  let off = 44; const cs = []; for (let c = 0; c < ch; c++) cs.push(audio.getChannelData(c));
  for (let i = start; i < end; i++) for (let c = 0; c < ch; c++) { let v = Math.max(-1, Math.min(1, cs[c][i] || 0)); view.setInt16(off, v < 0 ? v * 0x8000 : v * 0x7FFF, true); off += 2; }
  try { ac.close(); } catch (e) {} return new Blob([out], { type: "audio/wav" });
}

// Detect silent stretches in the recording's audio, entirely on-device (no upload).
async function ctDetectSilences(blob) {
  try {
    const buf = await blob.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    const ctx = new AC();
    const audio = await new Promise((res, rej) => ctx.decodeAudioData(buf.slice(0), res, rej)).catch(() => null);
    if (!audio) { try { ctx.close(); } catch (e) {} return null; }
    const data = audio.getChannelData(0); const sr = audio.sampleRate; const win = Math.floor(sr * 0.02);
    const energies = []; for (let i = 0; i < data.length; i += win) { let sum = 0; for (let j = i; j < i + win && j < data.length; j++) sum += data[j] * data[j]; energies.push(Math.sqrt(sum / win)); }
    const sorted = [...energies].sort((a, b) => a - b);
    const peak = sorted[Math.floor(sorted.length * 0.95)] || 0;
    // No usable audio at all: report no pauses instead of calling the whole take a pause.
    if (peak < 0.003) { try { ctx.close(); } catch (e) {} return { silences: [], duration: audio.duration }; }
    // Silence threshold. Built from the quietest tenth of the take (the room noise) and a
    // fraction of the loud parts, and never more than about a third of the loud level.
    // The old rule used the median, so steady speech or any even sound sat below its own
    // threshold and the whole take was marked as one long pause.
    const quiet = sorted[Math.floor(sorted.length * 0.1)] || 0;
    const floor = Math.min(Math.max(quiet * 2.5, peak * 0.08, 0.004), peak * 0.35);
    const sil = []; let runStart = -1;
    for (let k = 0; k < energies.length; k++) {
      const t = k * 0.02;
      if (energies[k] < floor) { if (runStart < 0) runStart = t; }
      else { if (runStart >= 0) { sil.push({ start: runStart, end: t }); runStart = -1; } }
    }
    if (runStart >= 0) sil.push({ start: runStart, end: audio.duration });
    try { ctx.close(); } catch (e) {}
    return { silences: sil, duration: audio.duration };
  } catch (e) { return null; }
}

const CT_PRESETS = { Off: null, Light: { min: 1.2, keep: 0.45 }, Balanced: { min: 0.7, keep: 0.28 }, Tight: { min: 0.4, keep: 0.15 } };
// Turn detected silences into pause-removal decisions, leaving a natural gap behind.
function ctPauseDecisions(silences, preset) {
  const cfg = CT_PRESETS[preset]; if (!cfg || !silences) return [];
  const out = [];
  for (const s of silences) {
    const len = s.end - s.start; if (len < cfg.min) continue;
    const start = s.start + cfg.keep / 2, end = s.end - cfg.keep / 2;
    if (end - start > 0.12) out.push({ id: "p" + Math.round(s.start * 1000), type: "pause", start, end, active: true, source: "auto", label: "Pause " + len.toFixed(1) + "s" });
  }
  return out;
}

// ---- clean-preview player: plays the original, skipping removed segments ----
// Speed (playbackRate), Style (CSS filter) and Trim (start/end) all visibly affect
// this preview. Browsers reset playbackRate on load/play, so we re-apply it.
function CleanPreview({ url, removed, rate, filterCss, active, trimStart, trimEnd, duration, vref }) {
  const ref = vref || React.useRef(null);
  const applyRate = React.useCallback(() => { const v = ref.current; if (v) { try { v.playbackRate = active ? (rate || 1) : 1; } catch (e) {} } }, [rate, active]);
  React.useEffect(() => { applyRate(); }, [applyRate, url]);
  function onTime() {
    const v = ref.current; if (!v) return;
    if (!active) return;
    const t = v.currentTime;
    // respect trim end
    if (trimEnd > 0 && duration && t >= duration - trimEnd - 0.05) { try { v.pause(); } catch (e) {} }
    // skip removed segments
    const segs = ctMerge(removed);
    for (const s of segs) { if (t >= s.start - 0.02 && t < s.end - 0.05) { try { v.currentTime = s.end + 0.001; } catch (e) {} break; } }
  }
  function onPlay() { applyRate(); const v = ref.current; if (v && active && trimStart > 0 && v.currentTime < trimStart) { try { v.currentTime = trimStart + 0.001; } catch (e) {} } }
  return <video ref={ref} src={url} playsInline controls preload="metadata" onLoadedMetadata={applyRate} onPlay={onPlay} onRateChange={applyRate} onTimeUpdate={onTime} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000", filter: filterCss || "none", transition: "filter .12s ease" }} />;
}

// One comparable string for the current edit decisions. Used to tell saved from unsaved.
function ctEditKey(e) {
  const restored = Object.keys(e.restored || {}).filter((k) => e.restored[k]).sort();
  const st = e.style || {};
  return JSON.stringify([e.preset, e.speed, Number(e.trimStart) || 0, Number(e.trimEnd) || 0, restored, Number(st.b), Number(st.c), Number(st.s)]);
}

// Desktop edit map: the whole take as one bar. Green is kept, red is removed. Click the
// bar to move the playhead. Click a removed pause to keep it, click again to remove it.
function CtTimeline({ vref, dur, removed, pauses, restored, onToggle, trimStart, trimEnd, cleanDur }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => { const v = vref.current; if (v) setT(v.currentTime || 0); }, 120);
    return () => clearInterval(id);
  }, [vref]);
  const pct = (x) => (dur > 0 ? Math.max(0, Math.min(100, (x / dur) * 100)) : 0);
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect(); const v = vref.current;
    if (v && dur > 0) { v.currentTime = Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur)); setT(v.currentTime); }
  };
  const trims = (removed || []).filter((s) => s.type === "trim");
  return (
    <div data-testid="ct-timeline" style={{ flexShrink: 0, background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "12px 14px 14px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Edit map</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--text-muted)" }}>{ctClock(t)} / {ctClock(dur)} · clean {ctClock(cleanDur)}</span>
      </div>
      <div data-testid="ct-timeline-bar" onClick={seek} role="slider" aria-label="Playhead" aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(t)} style={{ position: "relative", height: 34, borderRadius: 9, overflow: "hidden", background: "var(--success, #34C759)", cursor: "pointer" }}>
        {trims.map((s) => (<div key={s.id} title={s.label} style={{ position: "absolute", top: 0, bottom: 0, left: pct(s.start) + "%", width: Math.max(0.4, pct(s.end) - pct(s.start)) + "%", background: "var(--recording, #FF3B30)", opacity: 0.9 }} />))}
        {(pauses || []).map((p) => {
          const kept = !!restored[p.id];
          return (<button key={p.id} data-testid="ct-timeline-pause" data-kept={kept ? "1" : "0"} title={(kept ? "Kept: " : "Removed: ") + p.label + " at " + ctClock(p.start) + ". Click to " + (kept ? "remove" : "keep")} aria-label={(kept ? "Kept pause at " : "Removed pause at ") + ctClock(p.start)} onClick={(e) => { e.stopPropagation(); onToggle(p.id); }}
            style={{ position: "absolute", top: 0, bottom: 0, left: pct(p.start) + "%", width: Math.max(0.6, pct(p.end) - pct(p.start)) + "%", minWidth: 6, padding: 0, border: kept ? "2px dashed rgba(255,255,255,0.75)" : "none", background: kept ? "transparent" : "var(--recording, #FF3B30)", cursor: "pointer" }} />);
        })}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: pct(t) + "%", width: 2, marginLeft: -1, background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.35)", pointerEvents: "none" }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>Green is kept, red is removed. Click the bar to move the playhead. Click a red pause to keep it. Space plays, arrow keys step one second.</div>
    </div>
  );
}

// ---- the Clean Take screen (replaces the old Take review) -----------------
function CleanTakeScreen({ app }) {
  const pd = useData();
  const [take, setTake] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [url, setUrl] = React.useState(null);
  const urlRef = React.useRef(null);
  const [tab, setTab] = React.useState("Clean");           // Review | Clean | Captions | Style | Export
  const [view, setView] = React.useState("clean");          // clean | original
  const [analysing, setAnalysing] = React.useState(true);
  const [step, setStep] = React.useState("Reading the take…");
  const [silences, setSilences] = React.useState(null);
  const [duration, setDuration] = React.useState(0);

  // edit state
  const [preset, setPreset] = React.useState("Balanced");
  const [speed, setSpeed] = React.useState("Normal");
  const [trimStart, setTrimStart] = React.useState(0);
  const [trimEnd, setTrimEnd] = React.useState(0);
  const [restored, setRestored] = React.useState({});       // pause id -> true means user kept it
  const [style, setStyle] = React.useState({ b: 100, c: 100, s: 100 });
  const [editMap, setEditMap] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const [exporting, setExporting] = React.useState(null);
  const [prog, setProg] = React.useState(0);
  const [exportErr, setExportErr] = React.useState("");
  const vref = React.useRef(null);
  const segs = (take && take.segments) || [];
  const wide = usePdWide();
  // What was last saved, as a comparable key. Drives the honest Saved / Unsaved status.
  const savedRef = React.useRef(ctEditKey({ preset: "Balanced", speed: "Normal", trimStart: 0, trimEnd: 0, restored: {}, style: { b: 100, c: 100, s: 100 } }));
  const [savedTick, setSavedTick] = React.useState(0);

  React.useEffect(() => {
    let live = true;
    (async () => {
      const t = await pd.svc.getTake(app.params.id);
      if (!live) return;
      setTake(t || null); setLoaded(true);
      if (t && t.blob && t.blob.size > 0) {
        const u = URL.createObjectURL(t.blob); urlRef.current = u; setUrl(u);
        if (t.clean) {
          // Reopen with every saved decision, not just the pause preset.
          const cl = t.clean;
          setPreset(cl.preset || "Balanced"); setSpeed(cl.speed || "Normal");
          setTrimStart(Number(cl.trimStart) || 0); setTrimEnd(Number(cl.trimEnd) || 0);
          setRestored(cl.restored && typeof cl.restored === "object" ? cl.restored : {});
          setStyle({ b: 100, c: 100, s: 100, ...(cl.style || {}) });
          savedRef.current = ctEditKey({ preset: cl.preset || "Balanced", speed: cl.speed || "Normal", trimStart: Number(cl.trimStart) || 0, trimEnd: Number(cl.trimEnd) || 0, restored: cl.restored || {}, style: { b: 100, c: 100, s: 100, ...(cl.style || {}) } });
          setSilences(cl.silences || null); setDuration(cl.duration || (t.durationMs / 1000)); setAnalysing(false);
        }
        else {
          setStep("Finding pauses…");
          const res = await ctDetectSilences(t.blob);
          if (!live) return;
          if (res) { setSilences(res.silences); setDuration(res.duration || t.durationMs / 1000); }
          else { setDuration(t.durationMs / 1000); }
          setStep("Building your clean cut…");
          setTimeout(() => live && setAnalysing(false), 350);
        }
      } else { setAnalysing(false); }
    })();
    return () => { live = false; if (urlRef.current) URL.revokeObjectURL(urlRef.current); };
  }, [app.params.id]);

  const hasVideo = !!url;
  const dur = duration || (take ? take.durationMs / 1000 : 0);
  const rate = { Normal: 1, "Slightly faster": 1.1, "Social pace": 1.25 }[speed] || 1;

  // active removed segments = pauses (minus restored) + trims
  const pauseDecisions = React.useMemo(() => ctPauseDecisions(silences, preset).filter((d) => !restored[d.id]), [silences, preset, restored]);
  const removed = React.useMemo(() => {
    const r = [...pauseDecisions];
    if (trimStart > 0) r.push({ id: "trimS", type: "trim", start: 0, end: trimStart, active: true, label: "Trimmed start" });
    if (trimEnd > 0) r.push({ id: "trimE", type: "trim", start: Math.max(0, dur - trimEnd), end: dur, active: true, label: "Trimmed end" });
    return r;
  }, [pauseDecisions, trimStart, trimEnd, dur]);

  const removedSec = ctMerge(removed).reduce((a, s) => a + (s.end - s.start), 0);
  const keptSec = Math.max(0, dur - removedSec);
  const cleanDur = keptSec / rate;
  const filterCss = `brightness(${style.b}%) contrast(${style.c}%) saturate(${style.s}%)`;

  async function save() {
    if (!take) return;
    const clean = { preset, speed, trimStart, trimEnd, restored, style, silences, duration: dur, removedPauseCount: pauseDecisions.length, durationBefore: dur, durationAfter: cleanDur, updatedAt: Date.now(), status: "ready" };
    try { await pd.svc.putTake({ ...take, clean }); } catch (e) { app.toast("Could not save. Storage may be full."); return; }
    setTake({ ...take, clean });
    savedRef.current = ctEditKey({ preset, speed, trimStart, trimEnd, restored, style }); setSavedTick((n) => n + 1);
    app.toast("Clean Take saved");
  }
  async function del() { if (take) { await pd.svc.delTake(take.id); pd.reload(); } app.back(); }
  async function transcribeTake() {
    if (!take || !take.blob || transcribing) return;
    setTranscribing(true);
    const tr = await pd.svc.transcribe(take.blob);
    setTranscribing(false);
    if (tr.ok) { const updated = { ...take, transcript: tr.text, segments: tr.segments || [] }; await pd.svc.putTake(updated); setTake(updated); app.toast("Transcribed"); }
    else app.toast(tr.msg || "Transcription is not switched on yet");
  }
  function download() { if (!url) return; const ext = take && take.type && take.type.indexOf("mp4") >= 0 ? "mp4" : "webm"; const a = document.createElement("a"); a.href = url; a.download = "promptdrop-original." + ext; a.click(); }
  function setStartFromPlayhead() { const t = Math.floor((vref.current && vref.current.currentTime) || 0); setTrimStart(Math.max(0, Math.min(t, Math.floor(dur / 2)))); }
  function setEndFromPlayhead() { const t = (vref.current && vref.current.currentTime) || 0; setTrimEnd(Math.max(0, Math.min(Math.floor(dur - t), Math.floor(dur / 2)))); }
  async function exportClean(withCaptions) {
    if (!take || !take.blob || exporting) return;
    setExportErr(""); setExporting(withCaptions ? "captioned" : "clean"); setProg(0);
    try { const out = await ctRenderCleanVideo(take.blob, { removed, rate, filterCss, trimStart, trimEnd, duration: dur, segments: take.segments || null, withCaptions, onProgress: setProg }); ctDownloadBlob(out, "promptdrop-clean-take.webm"); }
    catch (e) { setExportErr(e.message || "Export failed."); }
    setExporting(null); setProg(0);
  }
  async function exportAudio() {
    if (!take || !take.blob || exporting) return;
    setExportErr(""); setExporting("audio");
    try { const out = await ctRenderAudioWav(take.blob, { trimStart, trimEnd }); ctDownloadBlob(out, "promptdrop-audio.wav"); }
    catch (e) { setExportErr(e.message || "Export failed."); }
    setExporting(null);
  }

  const TABS = ["Review", "Clean", "Captions", "Style", "Export"];
  const dirty = ctEditKey({ preset, speed, trimStart, trimEnd, restored, style }) !== savedRef.current;
  const allPauses = React.useMemo(() => ctPauseDecisions(silences, preset), [silences, preset]);
  const toggleRestore = (id) => setRestored((r) => ({ ...r, [id]: !r[id] }));

  // Desktop keyboard: Space plays or pauses, arrows step one second. Ignored while typing.
  React.useEffect(() => {
    if (!wide) return;
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || e.metaKey || e.ctrlKey || e.altKey) return;
      const v = vref.current; if (!v) return;
      if (e.key === " ") { e.preventDefault(); v.paused ? v.play().catch(() => {}) : v.pause(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); v.currentTime = Math.max(0, v.currentTime - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); v.currentTime = Math.min(v.duration || dur, v.currentTime + 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wide, dur]);

  if (analysing) return (
    <Screen>
      <NavHeader onBack={app.back} title="Clean Take" />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 30 }}>
        <PromptCharacter state="processing" size={92} />
        <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)" }}>Preparing your clean edit…</div>
        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{step}</div>
      </div>
    </Screen>
  );

  const previewBlock = (<>
      {/* Sticky compact video that stays visible while controls scroll underneath */}
      <div style={wide ? { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" } : { flexShrink: 0, padding: "0 14px" }}>
        <div data-testid="ct-preview" style={wide ? { borderRadius: 18, overflow: "hidden", position: "relative", flex: 1, minHeight: 220, background: "#000" } : { borderRadius: 18, overflow: "hidden", position: "relative", height: "clamp(120px, calc(50dvh - 160px), 320px)", background: "#000" }}>
          {hasVideo ? <CleanPreview vref={vref} url={url} removed={view === "clean" ? removed : []} rate={view === "clean" ? rate : 1} filterCss={view === "clean" ? filterCss : "none"} active={view === "clean"} trimStart={view === "clean" ? trimStart : 0} trimEnd={view === "clean" ? trimEnd : 0} duration={dur} />
            : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 26, textAlign: "center", gap: 8 }}>
                <PromptCharacter state={loaded ? "idle" : "processing"} size={56} />
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{loaded ? "No video was captured" : "Loading…"}</div>
                {loaded && <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 260 }}>This browser may not support in-app recording. Allow camera and microphone, or record from the desktop app.</div>}
              </div>}
        </div>
        {hasVideo && (
          <div style={{ display: "flex", background: "var(--surface-sunken)", borderRadius: 10, padding: 3, gap: 2, marginTop: 10 }}>
            {[["original", "Original"], ["clean", "Clean Edit"]].map(([v, l]) => (
              <button key={v} className="pd-tap" onClick={() => setView(v)} style={{ flex: 1, height: 34, borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, background: view === v ? "var(--surface-raised)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-muted)" }}>{l}</button>
            ))}
          </div>
        )}
        {hasVideo && (
          <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.45 }}>
            {preset !== "Off" && !silences
              ? <>{preset} pause cleanup selected. Automatic pause detection is not available for this recording.</>
              : preset !== "Off" && pauseDecisions.length
              ? <>{pauseDecisions.length} pause{pauseDecisions.length === 1 ? "" : "s"} suggested · {ctClock(dur)} → {ctClock(cleanDur)}</>
              : (trimStart || trimEnd || rate !== 1)
              ? <>Edits applied · {ctClock(dur)} → {ctClock(cleanDur)}</>
              : <>Clean Take is ready for edits · {ctClock(dur)}</>}
          </div>
        )}
      </div>

  </>);
  const tabsBar = (<>
      {/* tabs: a real segmented bar in a sunken track, obvious active state */}
      <div style={{ flexShrink: 0, padding: wide ? "14px 16px 4px" : "12px 14px 4px" }}>
        <div className="pd-hscroll" data-testid="ct-tabs" style={{ display: "flex", gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 3, overflowX: "auto" }}>
          {TABS.map((o) => (
            <button key={o} className="pd-tap" data-testid={"ct-tab-" + o} aria-pressed={tab === o} onClick={() => setTab(o)} style={{ flex: wide ? "1 1 0" : "1 0 auto", minWidth: wide ? 0 : 72, height: 38, borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, fontFamily: "var(--font-sans)", background: tab === o ? "var(--surface-raised)" : "transparent", color: tab === o ? "var(--text-primary)" : "var(--text-muted)", boxShadow: tab === o ? "var(--shadow-surface)" : "none" }}>{o}</button>
          ))}
        </div>
      </div>

  </>);
  const panel = (<>
      {/* controls scroll, generous bottom padding so the sticky bar + browser bar never cover them */}
      {/* Longhand padding only: a `padding` shorthand here would override padBottom. */}
      <ScrollArea testid="ct-panel" padBottom={20} style={{ paddingTop: 10, paddingLeft: 16, paddingRight: 16 }}>
        {tab === "Review" && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ background: "var(--surface-elevated)", borderRadius: 16, overflow: "hidden" }}>
              {[["clock", "Original length", ctClock(dur)], ["clock", "Clean Take length", ctClock(cleanDur)], ["video", "Source", take && take.source === "meeting" ? "Meeting" : "Camera + mic"], ["download", "Size", take ? (take.size > 1e6 ? (take.size / 1e6).toFixed(1) + " MB" : Math.round((take.size || 0) / 1e3) + " KB") : "0 KB"]].map((row, n, arr) => (
                <div key={row[1]} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderBottom: n === arr.length - 1 ? "none" : "1px solid var(--border-subtle)" }}>
                  <Icon name={row[0]} size={18} color="var(--text-muted)" /><span style={{ flex: 1, fontSize: 14.5, color: "var(--text-secondary)" }}>{row[1]}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-primary)" }}>{row[2]}</span>
                </div>
              ))}
            </div>
            <button className="pd-tap" onClick={() => setEditMap(true)} style={{ marginTop: 14, width: "100%", height: 48, borderRadius: 14, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>Open Edit Map</button>
            <p style={{ marginTop: 14, fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Your original recording is always kept untouched. Clean Take only changes what you see and export.</p>
          </div>
        )}

        {tab === "Clean" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CtCard title="Clean pauses" hint={silences ? "Trims dead air and long gaps, detected on this device." : "Automatic pause detection is not available for this recording."}>
              <DSc.SegmentedControl options={["Off", "Light", "Balanced", "Tight"]} value={preset} onChange={setPreset} />
            </CtCard>
            <CtCard title="Speed" hint={`Playing at ${rate.toFixed(2)}x`}>
              <DSc.SegmentedControl options={["Normal", "Slightly faster", "Social pace"]} value={speed} onChange={setSpeed} />
            </CtCard>
            <CtCard title="Trim" hint={(trimStart || trimEnd) ? `${ctClock(trimStart)} off the start · ${ctClock(trimEnd)} off the end` : "Cut the start or the end"}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button className="pd-tap" onClick={setStartFromPlayhead} style={ctMiniBtn}>Set start to playhead</button>
                <button className="pd-tap" onClick={setEndFromPlayhead} style={ctMiniBtn}>Set end to playhead</button>
              </div>
              <DSc.Slider label="Start" min={0} max={Math.max(1, Math.floor(dur / 2))} value={trimStart} onChange={(e) => setTrimStart(+e.target.value)} suffix="s" />
              <div style={{ height: 10 }} />
              <DSc.Slider label="End" min={0} max={Math.max(1, Math.floor(dur / 2))} value={trimEnd} onChange={(e) => setTrimEnd(+e.target.value)} suffix="s" />
            </CtCard>
            <CtCard title="Remove filler words" hint="Needs transcription.">
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", background: "var(--surface-sunken)", padding: "9px 12px", borderRadius: 10 }}>Available after this take is transcribed. Use the Captions tab.</div>
            </CtCard>
            <button className="pd-tap" onClick={() => setEditMap(true)} style={{ width: "100%", height: 48, borderRadius: 14, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 14.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Icon name="redo" size={16} color="var(--text-secondary)" />Review removed sections</button>
          </div>
        )}

        {tab === "Captions" && (
          <div style={{ paddingTop: 10 }}>
            {take && take.transcript ? (
              <>
                <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{take.transcript.slice(0, 400)}{take.transcript.length > 400 ? "…" : ""}</p>
                {segs.length > 0 ? (
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <DSc.Button variant="secondary" size="md" onClick={() => ctDownloadText(ctSRT(segs), "captions.srt")}>Export SRT</DSc.Button>
                    <DSc.Button variant="secondary" size="md" onClick={() => ctDownloadText(ctVTT(segs), "captions.vtt")}>Export VTT</DSc.Button>
                  </div>
                ) : <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>This transcript has no timing, so timed captions are not available. Re-transcribe to get SRT/VTT.</p>}
                <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-muted)" }}>To burn captions into the video, use Captioned video in Export.</p>
              </>
            ) : (
              <div style={{ background: "var(--surface-elevated)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Captions need transcription</div>
                <button className="pd-tap" onClick={transcribeTake} disabled={transcribing} style={{ marginTop: 10, height: 44, padding: "0 18px", borderRadius: 12, border: "none", background: "var(--accent-primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{transcribing ? "Transcribing…" : "Transcribe this take"}</button>
                <p style={{ marginTop: 10, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Pause cleanup works now. Transcribe this take to generate captions. Transcription needs AI to be switched on for this site.</p>
              </div>
            )}
          </div>
        )}

        {tab === "Style" && (
          <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Adjustments show in the preview straight away and are applied to the exported video.</p>
            <Field label="Brightness"><DSc.Slider min={70} max={130} value={style.b} onChange={(e) => setStyle((s) => ({ ...s, b: +e.target.value }))} suffix="%" /></Field>
            <Field label="Contrast"><DSc.Slider min={70} max={130} value={style.c} onChange={(e) => setStyle((s) => ({ ...s, c: +e.target.value }))} suffix="%" /></Field>
            <Field label="Saturation"><DSc.Slider min={50} max={150} value={style.s} onChange={(e) => setStyle((s) => ({ ...s, s: +e.target.value }))} suffix="%" /></Field>
            <button className="pd-tap" onClick={() => setStyle({ b: 100, c: 100, s: 100 })} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "var(--accent-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reset to natural</button>
          </div>
        )}

        {tab === "Export" && (
          <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {exporting && <div style={{ fontSize: 12.5, color: "var(--text-secondary)", background: "var(--surface-sunken)", borderRadius: 10, padding: "10px 12px" }}>Rendering {exporting} export{prog > 0 ? " · " + Math.round(prog * 100) + "%" : "…"}. This plays the take through once, so it takes about as long as the video.</div>}
            {exportErr && <div style={{ fontSize: 12.5, color: "var(--recording)", background: "var(--surface-sunken)", borderRadius: 10, padding: "10px 12px" }}>{exportErr}</div>}
            <ExportRow label="Original video" sub={ctClock(dur)} ready onClick={download} />
            <ExportRow label="Clean Take video" sub={ctClock(cleanDur) + " · renders on your phone"} ready={!!take?.blob && !exporting} onClick={() => exportClean(false)} />
            <ExportRow label="Captioned video" sub={segs.length ? "Burns in captions" : "Needs transcription"} ready={segs.length > 0 && !exporting} onClick={() => exportClean(true)} />
            <ExportRow label="Audio only (WAV)" sub="Extracts the audio" ready={!!take?.blob && !exporting} onClick={exportAudio} />
            <ExportRow label="Transcript" sub={take && take.transcript ? "Ready" : "Needs transcription"} ready={!!(take && take.transcript)} onClick={() => { if (take && take.transcript) ctDownloadText(take.transcript, "transcript.txt"); }} />
            <ExportRow label="Captions (SRT)" sub={segs.length ? "Ready" : "Needs word timing"} ready={segs.length > 0} onClick={() => ctDownloadText(ctSRT(segs), "captions.srt")} />
            <ExportRow label="Captions (VTT)" sub={segs.length ? "Ready" : "Needs word timing"} ready={segs.length > 0} onClick={() => ctDownloadText(ctVTT(segs), "captions.vtt")} />
          </div>
        )}
      </ScrollArea>

  </>);
  const actions = (<>
      {/* Action bar: one primary Save; destructive + secondary actions live behind More.
          It is a normal flex row under the controls panel, not an overlay, so it can
          never sit on top of an editing control. */}
      <div data-testid="ct-actions" style={{ flexShrink: 0, padding: "10px 16px calc(10px + env(safe-area-inset-bottom, 12px))", background: "var(--bg-primary)", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, alignItems: "center" }}>
        <button className="pd-tap" onClick={() => setMoreOpen(true)} aria-label="More actions" style={{ width: 52, height: 52, borderRadius: 14, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 24, lineHeight: 1, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 8 }}>...</button>
        <DSc.Button variant="primary" size="lg" fullWidth onClick={save} iconLeft={<Icon name="check" size={18} color="#fff" />}>Save Clean Take</DSc.Button>
      </div>

  </>);
  const overlays = (<>
      {editMap && <EditMapSheet dur={dur} removed={removed} restored={restored} onToggle={(id) => setRestored((r) => ({ ...r, [id]: !r[id] }))} pauses={ctPauseDecisions(silences, preset)} onClose={() => setEditMap(false)} wide={wide} />}
      {moreOpen && <CtMoreSheet
        wide={wide}
        onClose={() => setMoreOpen(false)}
        onReset={() => { setPreset("Balanced"); setSpeed("Normal"); setTrimStart(0); setTrimEnd(0); setRestored({}); setStyle({ b: 100, c: 100, s: 100 }); setMoreOpen(false); app.toast("Clean Take reset"); }}
        onDownload={url ? () => { download(); setMoreOpen(false); } : null}
        onDelete={async () => { setMoreOpen(false); await del(); }}
      />}
  </>);

  // Desktop editor: large preview and edit map on the left, tools in a panel on the right.
  // Same state, same controls and same export code as the phone layout below.
  if (wide) return (
    <Screen>
      <div data-testid="ct-desktop" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0, height: 60, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <button onClick={app.back} className="pd-tap" aria-label="Back" data-testid="nav-back" style={iconBtn}><Icon name="back" size={22} color="var(--text-primary)" /></button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(take && take.title) || "Take"}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--text-muted)" }}>CLEAN TAKE</div>
          </div>
          <div style={{ flex: 1 }} />
          <span data-testid="ct-save-status" data-dirty={dirty ? "1" : "0"} style={{ fontSize: 12.5, color: dirty ? "var(--text-secondary)" : "var(--text-muted)" }}>{dirty ? "Unsaved changes" : (take && take.clean ? "Saved on this device" : "No edits yet")}</span>
          <button className="pd-tap" data-testid="ct-save" onClick={save} disabled={!dirty} style={{ height: 38, padding: "0 16px", borderRadius: 11, border: "1px solid var(--border-default)", background: "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 13.5, fontWeight: 600, cursor: dirty ? "pointer" : "default", opacity: dirty ? 1 : 0.5, fontFamily: "var(--font-sans)" }}>Save</button>
          <button className="pd-tap" data-testid="ct-export" onClick={() => setTab("Export")} style={{ height: 38, padding: "0 18px", borderRadius: 11, border: "none", background: "var(--accent-primary)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Export</button>
          <button className="pd-tap" onClick={() => setMoreOpen(true)} aria-label="More actions" style={iconBtn}><Icon name="more" size={22} color="var(--text-secondary)" /></button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
          <div data-testid="ct-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "18px 20px 16px", gap: 14 }}>
            {previewBlock}
            {hasVideo && <CtTimeline vref={vref} dur={dur} removed={removed} pauses={allPauses} restored={restored} onToggle={toggleRestore} trimStart={trimStart} trimEnd={trimEnd} cleanDur={cleanDur} />}
          </div>
          <div data-testid="ct-side" style={{ flexShrink: 0, width: "clamp(340px, 30vw, 420px)", borderLeft: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-primary)" }}>
            {tabsBar}
            {panel}
          </div>
        </div>
      </div>
      {overlays}
    </Screen>
  );

  return (
    <Screen>
      <NavHeader onBack={app.back} title="Clean Take" action={hasVideo ? <button className="pd-tap" style={iconBtn} onClick={download}><Icon name="download" size={19} color="var(--text-secondary)" /></button> : null} />

      {previewBlock}
      {tabsBar}
      {panel}
      {actions}
      {overlays}
    </Screen>
  );
}

// A grouped control card: title + helper text + the control itself.
function CtCard({ title, hint, children }) {
  return (
    <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
      {hint && <div style={{ marginTop: 2, marginBottom: 12, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{hint}</div>}
      {!hint && <div style={{ height: 12 }} />}
      {children}
    </div>
  );
}
const ctMiniBtn = { flex: 1, height: 40, borderRadius: 11, border: "1px solid var(--border-default)", background: "var(--surface-sunken)", color: "var(--text-primary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" };

// Bottom sheet for secondary + destructive actions, so Delete is not glued next to Save.
function CtMoreSheet({ onClose, onReset, onDownload, onDelete, wide }) {
  const row = (label, onClick, danger) => (
    <button className="pd-tap" onClick={onClick} style={{ width: "100%", textAlign: "left", height: 54, padding: "0 16px", borderRadius: 14, border: "none", background: "var(--surface-elevated)", color: danger ? "var(--recording)" : "var(--text-primary)", fontSize: 15.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
      <Icon name={danger ? "trash" : label === "Reset Clean Take" ? "redo" : "download"} size={18} color={danger ? "var(--recording)" : "var(--text-secondary)"} />{label}
    </button>
  );
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 55, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: wide ? "center" : "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More actions" className="pd-push" style={{ width: "100%", maxWidth: wide ? 440 : undefined, background: "var(--bg-secondary)", borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: wide ? 22 : 0, borderBottomRightRadius: wide ? 22 : 0, border: "1px solid var(--border-default)", borderBottom: wide ? "1px solid var(--border-default)" : "none", padding: "14px 16px calc(18px + env(safe-area-inset-bottom, 22px))" }}>
        <div style={{ width: 40, height: 5, borderRadius: 9, background: "var(--ink-600)", margin: "0 auto 16px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {onDownload && row("Download original", onDownload)}
          {row("Reset Clean Take", onReset)}
          {row("Delete take", onDelete, true)}
        </div>
        <button className="pd-tap" onClick={onClose} style={{ marginTop: 14, width: "100%", height: 50, borderRadius: 14, border: "1px solid var(--border-default)", background: "transparent", color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (<div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>{hint && <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{hint}</span>}</div>{children}</div>);
}
function ExportRow({ label, sub, ready, pending, note, onClick }) {
  return (
    <button className="pd-tap" onClick={ready ? onClick : undefined} style={{ width: "100%", textAlign: "left", background: "var(--surface-elevated)", border: "1px solid var(--border-default)", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: ready ? "pointer" : "default", opacity: pending ? 0.7 : 1 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        <div style={{ marginTop: 2, fontSize: 12.5, color: "var(--text-muted)" }}>{note || sub}</div>
      </div>
      {ready ? <Icon name="download" size={18} color="var(--accent-primary)" /> : <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: ".06em" }}>SOON</span>}
    </button>
  );
}

function EditMapSheet({ dur, removed, restored, onToggle, pauses, onClose, wide }) {
  const segs = ctMerge(removed);
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: wide ? "center" : "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Edit Map" className="pd-push" style={{ width: "100%", maxWidth: wide ? 560 : undefined, background: "var(--bg-secondary)", borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: wide ? 22 : 0, borderBottomRightRadius: wide ? 22 : 0, border: "1px solid var(--border-default)", borderBottom: wide ? "1px solid var(--border-default)" : "none", padding: "14px 20px calc(20px + env(safe-area-inset-bottom, 22px))", maxHeight: "70%", overflowY: "auto" }} >
        <div style={{ width: 40, height: 5, borderRadius: 9, background: "var(--ink-600)", margin: "0 auto 14px" }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Edit Map</div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 14px" }}>Green is kept, red is removed. Tap a removed part to restore it.</p>
        {/* timeline bar */}
        <div style={{ position: "relative", height: 26, borderRadius: 8, overflow: "hidden", background: "var(--success, #34C759)", marginBottom: 16 }}>
          {segs.map((s, i) => (<div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: (s.start / dur * 100) + "%", width: Math.max(0.6, (s.end - s.start) / dur * 100) + "%", background: "var(--recording, #FF3B30)" }} />))}
        </div>
        {pauses.length === 0 && <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>No pauses detected to remove. Trims still apply.</p>}
        {pauses.map((p) => {
          const kept = restored[p.id];
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: kept ? "var(--success, #34C759)" : "var(--recording, #FF3B30)", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 14.5, color: "var(--text-primary)" }}>{p.label} <span style={{ color: "var(--text-muted)", fontSize: 12 }}>at {ctClock(p.start)}</span></span>
              <button className="pd-tap" onClick={() => onToggle(p.id)} style={{ height: 32, padding: "0 12px", borderRadius: 999, border: "1px solid var(--border-default)", background: kept ? "var(--surface-raised)" : "var(--surface-elevated)", color: "var(--text-primary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{kept ? "Removed" : "Restore"}</button>
            </div>
          );
        })}
        <button className="pd-tap" onClick={onClose} style={{ marginTop: 16, width: "100%", height: 46, borderRadius: 14, border: "none", background: "var(--accent-primary)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Done</button>
      </div>
    </div>
  );
}

Object.assign(window, { CleanTakeScreen, ctDetectSilences, ctPauseDecisions, ctKept, ctMerge });

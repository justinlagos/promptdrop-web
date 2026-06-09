// Clean Take engine (desktop). Pure, non-destructive: the original blob is never modified.
// All edits are an edit decision list; previews are produced by skipping removed segments.

export function ctMerge(segs) {
  const s = (segs || []).filter(Boolean).map((x) => ({ start: Math.max(0, x.start), end: x.end })).filter((x) => x.end > x.start).sort((a, b) => a.start - b.start);
  const out = [];
  for (const seg of s) { const last = out[out.length - 1]; if (last && seg.start <= last.end + 0.001) last.end = Math.max(last.end, seg.end); else out.push({ ...seg }); }
  return out;
}
export function ctKept(duration, removed) {
  const rm = ctMerge(removed); const kept = []; let cur = 0;
  for (const r of rm) { if (r.start > cur) kept.push({ start: cur, end: Math.min(r.start, duration) }); cur = Math.max(cur, r.end); }
  if (cur < duration) kept.push({ start: cur, end: duration });
  return kept.filter((k) => k.end - k.start > 0.05);
}
export const ctClock = (s) => { s = Math.max(0, Math.round(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

function ctStamp(t, comma) { t = Math.max(0, t || 0); const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60), ms = Math.floor((t - Math.floor(t)) * 1000); const p = (n, l) => String(n).padStart(l, "0"); return p(h, 2) + ":" + p(m, 2) + ":" + p(s, 2) + (comma ? "," : ".") + p(ms, 3); }
export function ctSRT(segs) { return (segs || []).map((s, i) => `${i + 1}\n${ctStamp(s.start, true)} --> ${ctStamp(s.end, true)}\n${(s.text || "").trim()}\n`).join("\n"); }
export function ctVTT(segs) { return "WEBVTT\n\n" + (segs || []).map((s) => `${ctStamp(s.start, false)} --> ${ctStamp(s.end, false)}\n${(s.text || "").trim()}\n`).join("\n"); }
export function ctDownloadText(text, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = name; a.click(); }

export async function ctDetectSilences(blob) {
  try {
    const buf = await blob.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    const ctx = new AC();
    const audio = await new Promise((res, rej) => ctx.decodeAudioData(buf.slice(0), res, rej)).catch(() => null);
    if (!audio) { try { ctx.close(); } catch (e) {} return null; }
    const data = audio.getChannelData(0), sr = audio.sampleRate, win = Math.floor(sr * 0.02);
    const energies = []; for (let i = 0; i < data.length; i += win) { let sum = 0; for (let j = i; j < i + win && j < data.length; j++) sum += data[j] * data[j]; energies.push(Math.sqrt(sum / win)); }
    const sorted = [...energies].sort((a, b) => a - b); const median = sorted[Math.floor(sorted.length / 2)] || 0; const peak = sorted[Math.floor(sorted.length * 0.95)] || 0.01;
    const floor = Math.max(median * 1.8, peak * 0.06, 0.004);
    const sil = []; let runStart = -1;
    for (let k = 0; k < energies.length; k++) { const t = k * 0.02; if (energies[k] < floor) { if (runStart < 0) runStart = t; } else { if (runStart >= 0) { sil.push({ start: runStart, end: t }); runStart = -1; } } }
    if (runStart >= 0) sil.push({ start: runStart, end: audio.duration });
    try { ctx.close(); } catch (e) {}
    return { silences: sil, duration: audio.duration };
  } catch (e) { return null; }
}

export const CT_PRESETS = { Off: null, Light: { min: 1.2, keep: 0.45 }, Balanced: { min: 0.7, keep: 0.28 }, Tight: { min: 0.4, keep: 0.15 } };
export function ctPauseDecisions(silences, preset) {
  const cfg = CT_PRESETS[preset]; if (!cfg || !silences) return [];
  const out = [];
  for (const s of silences) { const len = s.end - s.start; if (len < cfg.min) continue; const start = s.start + cfg.keep / 2, end = s.end - cfg.keep / 2; if (end - start > 0.12) out.push({ id: "p" + Math.round(s.start * 1000), type: "pause", start, end, active: true, source: "auto", label: "Pause " + len.toFixed(1) + "s" }); }
  return out;
}

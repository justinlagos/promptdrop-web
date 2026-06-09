// Real client-side Clean Take export. No server: renders the edited preview to a
// canvas + captures audio via WebAudio, records with MediaRecorder. Produces a true
// downloadable file with speed, style (CSS filter), trim and cuts baked in.
import { ctMerge } from "./cleanTake.js";

function pickVideoMime() {
  const k = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  if (!window.MediaRecorder) return "";
  return k.find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || "";
}
const seek = (v, t) => new Promise((res) => { const f = () => { v.removeEventListener("seeked", f); res(); }; v.addEventListener("seeked", f); try { v.currentTime = t; } catch (e) { res(); } });

function drawCaption(ctx, segments, t, w, h) {
  const seg = (segments || []).find((s) => t >= s.start && t <= s.end);
  if (!seg || !seg.text) return;
  const fs = Math.round(h * 0.045);
  ctx.font = `600 ${fs}px sans-serif`;
  ctx.textAlign = "center";
  const text = seg.text.trim().slice(0, 90);
  const y = h - Math.round(h * 0.08);
  const mw = ctx.measureText(text).width;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(w / 2 - mw / 2 - 16, y - fs, mw + 32, fs + 18);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, w / 2, y);
}

// Render a clean video. Returns a Blob (webm).
export async function renderCleanVideo(blob, opts = {}) {
  const { removed = [], rate = 1, filterCss = "none", trimStart = 0, trimEnd = 0, segments = null, withCaptions = false, onProgress } = opts;
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) throw new Error("This browser cannot render video here. Try Chrome or Edge on desktop.");
  const url = URL.createObjectURL(blob);
  const video = document.createElement("video");
  video.src = url; video.playsInline = true; video.crossOrigin = "anonymous";
  await new Promise((res, rej) => { video.onloadedmetadata = res; video.onerror = () => rej(new Error("Could not read the recording.")); });
  const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
  const w = video.videoWidth || 720, h = video.videoHeight || 1280;
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  const cStream = canvas.captureStream(30);

  // capture audio without sending it to the speakers
  let combined = cStream;
  let ac;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ac = new AC();
    const srcNode = ac.createMediaElementSource(video);
    const dest = ac.createMediaStreamDestination();
    srcNode.connect(dest);
    combined = new MediaStream([...cStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
  } catch (e) {}

  const mime = pickVideoMime();
  const rec = mime ? new MediaRecorder(combined, { mimeType: mime }) : new MediaRecorder(combined);
  const chunks = []; rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

  const segs = ctMerge(removed);
  const startAt = trimStart > 0 ? trimStart : 0;
  const endAt = trimEnd > 0 ? Math.max(startAt + 0.1, dur - trimEnd) : dur;
  try { video.playbackRate = rate || 1; } catch (e) {}
  await seek(video, startAt);

  let finished = false, raf = 0;
  const finish = () => { if (finished) return; finished = true; cancelAnimationFrame(raf); try { video.pause(); } catch (e) {} try { rec.stop(); } catch (e) {} };
  function draw() {
    try { ctx.filter = filterCss || "none"; ctx.drawImage(video, 0, 0, w, h); ctx.filter = "none"; if (withCaptions && segments) drawCaption(ctx, segments, video.currentTime, w, h); } catch (e) {}
    raf = requestAnimationFrame(draw);
  }
  function onTime() {
    const t = video.currentTime;
    if (t >= endAt - 0.03) { finish(); return; }
    for (const s of segs) { if (t >= s.start - 0.02 && t < s.end - 0.05) { try { video.currentTime = s.end + 0.001; } catch (e) {} break; } }
    if (onProgress) { const p = (t - startAt) / Math.max(0.1, endAt - startAt); onProgress(Math.max(0, Math.min(1, p))); }
  }
  video.addEventListener("timeupdate", onTime);
  video.addEventListener("ended", finish);
  rec.start();
  draw();
  try { await video.play(); } catch (e) { finish(); throw new Error("Playback was blocked. Tap the video once, then export."); }

  const out = await new Promise((res) => { rec.onstop = () => res(new Blob(chunks, { type: mime || "video/webm" })); setTimeout(() => { if (!finished) finish(); }, (Math.max(1, (endAt - startAt) / (rate || 1)) * 1000) + 4000); });
  try { URL.revokeObjectURL(url); } catch (e) {}
  try { ac && ac.close(); } catch (e) {}
  return out;
}

// Extract audio as a WAV file (honest, real). Optionally trims to [start,end).
export async function renderAudioWav(blob, opts = {}) {
  const { trimStart = 0, trimEnd = 0 } = opts;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) throw new Error("Audio export is not supported in this browser.");
  const buf = await blob.arrayBuffer();
  const ac = new AC();
  const audio = await ac.decodeAudioData(buf.slice(0)).catch(() => null);
  if (!audio) { try { ac.close(); } catch (e) {} throw new Error("Could not read audio from this recording."); }
  const sr = audio.sampleRate;
  const start = Math.floor((trimStart || 0) * sr);
  const end = trimEnd > 0 ? Math.floor((audio.duration - trimEnd) * sr) : audio.length;
  const len = Math.max(0, end - start);
  const chCount = Math.min(2, audio.numberOfChannels);
  const out = new ArrayBuffer(44 + len * chCount * 2);
  const view = new DataView(out);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); view.setUint32(4, 36 + len * chCount * 2, true); ws(8, "WAVE"); ws(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, chCount, true);
  view.setUint32(24, sr, true); view.setUint32(28, sr * chCount * 2, true); view.setUint16(32, chCount * 2, true); view.setUint16(34, 16, true);
  ws(36, "data"); view.setUint32(40, len * chCount * 2, true);
  let off = 44;
  const chans = []; for (let c = 0; c < chCount; c++) chans.push(audio.getChannelData(c));
  for (let i = start; i < end; i++) for (let c = 0; c < chCount; c++) { let v = Math.max(-1, Math.min(1, chans[c][i] || 0)); view.setInt16(off, v < 0 ? v * 0x8000 : v * 0x7FFF, true); off += 2; }
  try { ac.close(); } catch (e) {}
  return new Blob([out], { type: "audio/wav" });
}

export function downloadBlob(blob, name) {
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = u; a.download = name; a.click();
  setTimeout(() => { try { URL.revokeObjectURL(u); } catch (e) {} }, 4000);
}

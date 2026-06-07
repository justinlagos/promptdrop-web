import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { recordingDB } from "../services/recordingDB.js";
import { meetingRecordingService, transcriptionService, meetingAssistantService, featureGateService } from "../services/index.js";

function pickMime() {
  const c = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return c.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || "";
}
const fmtDur = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const fmtSize = (b) => b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`;

export default function Studio() {
  const { isSignedIn, openAuth, plan } = useAuth() || {};
  const [supported] = useState(meetingRecordingService.configured());
  const [source, setSource] = useState("camera");          // camera | screen
  const [state, setState] = useState("idle");              // idle | recording
  const [elapsed, setElapsed] = useState(0);
  const [recs, setRecs] = useState([]);
  const [err, setErr] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const startedRef = useRef(0);
  const tickRef = useRef(null);

  const refresh = async () => { try { setRecs(await recordingDB.list()); } catch {} };
  useEffect(() => { refresh(); return () => stopTracks(); }, []);

  function stopTracks() {
    if (tickRef.current) clearInterval(tickRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function start() {
    setErr("");
    try {
      const mime = pickMime();
      let stream;
      if (source === "screen") {
        const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        let mic = null;
        try { mic = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {}
        const tracks = [...display.getVideoTracks(), ...(mic ? mic.getAudioTracks() : display.getAudioTracks())];
        stream = new MediaStream(tracks);
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      }
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mr.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = onStop;
      mr.start(1000);
      recRef.current = mr;
      startedRef.current = Date.now();
      setElapsed(0);
      tickRef.current = setInterval(() => setElapsed(Date.now() - startedRef.current), 250);
      setState("recording");
    } catch (e) {
      setErr(e?.name === "NotAllowedError" ? "Permission denied. Allow camera/mic (or screen) and try again." : String(e?.message || e));
    }
  }

  async function onStop() {
    const mime = recRef.current?.mimeType || "video/webm";
    const blob = new Blob(chunksRef.current, { type: mime });
    const rec = { id: crypto.randomUUID(), createdAt: Date.now(), durationMs: Date.now() - startedRef.current, size: blob.size, source, mime, blob, transcript: null };
    try { await recordingDB.save(rec); } catch (e) { setErr("Could not save the recording."); }
    stopTracks();
    setState("idle");
    refresh();
  }

  function stop() { try { recRef.current?.stop(); } catch {} }

  if (!isSignedIn) {
    return (
      <main className="wrap" style={{ padding: "64px 24px", maxWidth: 560 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Studio</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Sign in to record.</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Recordings stay on your device. An account keeps your plan and (soon) syncs your scripts.</p>
        <button className="btn btn--primary btn--lg" onClick={openAuth}>Sign in</button>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ padding: "40px 24px 96px", maxWidth: 880 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Studio · recording</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 16 }}>Record a take</h1>

      {!supported && <div className="note note--warn" style={{ marginBottom: 16 }}>This browser doesn't support in-page recording. Use the desktop app or a recent Chrome/Edge/Safari.</div>}
      {err && <div className="note note--err" style={{ marginBottom: 16 }}>{err}</div>}

      <div className="card" style={{ padding: 16, marginBottom: 22 }}>
        <div style={{ position: "relative", background: "#000", borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", marginBottom: 14 }}>
          <video ref={videoRef} playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {state === "recording" && (
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,.5)", padding: "6px 10px", borderRadius: 999 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--recording, #FF3B30)", boxShadow: "0 0 0 0 rgba(255,59,48,.6)", animation: "pdpulse 1.4s infinite" }} />
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, color: "#fff" }}>{fmtDur(elapsed)}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 10 }}>
            {[["camera", "Camera + mic"], ["screen", "Screen + mic"]].map(([v, l]) => (
              <button key={v} className="btn" disabled={state === "recording"} onClick={() => setSource(v)}
                style={{ height: 34, padding: "0 14px", fontSize: 13, borderRadius: 7, background: source === v ? "var(--surface-raised)" : "transparent", color: source === v ? "var(--text-primary)" : "var(--text-secondary)" }}>{l}</button>
            ))}
          </div>
          {state === "idle"
            ? <button className="btn btn--primary" disabled={!supported} onClick={start}>Start recording</button>
            : <button className="btn" style={{ background: "var(--recording, #FF3B30)", color: "#fff" }} onClick={stop}>Stop</button>}
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Your recordings</h2>
      {recs.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No recordings yet. Your takes appear here and stay on this device.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recs.map((r) => <RecordingRow key={r.id} meta={r} plan={plan} onChange={refresh} />)}
        </div>
      )}
    </main>
  );
}

function RecordingRow({ meta, plan, onChange }) {
  const [url, setUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState(meta.transcript || null);
  const [notes, setNotes] = useState(meta.notes || null);
  const [msg, setMsg] = useState(null);
  const canTranscribe = featureGateService.can("meetingTranscription");
  const canNotes = featureGateService.can("askMode");

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function play() {
    const full = await recordingDB.get(meta.id);
    if (full?.blob) setUrl(URL.createObjectURL(full.blob));
  }
  async function download() {
    const full = await recordingDB.get(meta.id);
    if (!full?.blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(full.blob);
    a.download = `promptdrop-${new Date(meta.createdAt).toISOString().slice(0, 19)}.webm`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function remove() { await recordingDB.remove(meta.id); onChange(); }
  async function transcribe() {
    setMsg(null);
    if (!canTranscribe) { setMsg({ type: "warn", text: "Transcription is a Studio Pro feature." }); return; }
    setBusy(true);
    const full = await recordingDB.get(meta.id);
    const r = await transcriptionService.transcribeRecording(full.blob);
    setBusy(false);
    if (!r.ok) { setMsg({ type: r.reason === "not-connected" ? "warn" : "err", text: r.message }); return; }
    setTranscript(r.text);
    const updated = { ...full, transcript: r.text }; await recordingDB.save(updated);
  }
  async function makeNotes() {
    setMsg(null);
    if (!transcript) { setMsg({ type: "warn", text: "Transcribe the recording first, then turn it into notes." }); return; }
    if (!canNotes) { setMsg({ type: "warn", text: "Notes are a Studio Pro feature." }); return; }
    setBusy(true);
    const r = await meetingAssistantService.ask(
      "Summarise this call into concise notes: a 2-3 sentence summary, then bullet key points, then action items with owners if mentioned.",
      transcript
    );
    setBusy(false);
    if (!r.ok) { setMsg({ type: r.reason === "not-connected" ? "warn" : "err", text: r.message }); return; }
    setNotes(r.answer);
    const full = await recordingDB.get(meta.id);
    await recordingDB.save({ ...full, notes: r.answer });
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{meta.source === "screen" ? "Screen recording" : "Camera take"}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {new Date(meta.createdAt).toLocaleString("en-GB")} · {fmtDur(meta.durationMs)} · {fmtSize(meta.size)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn--secondary" style={{ height: 34, fontSize: 13 }} onClick={play}>Play</button>
          <button className="btn btn--ghost" style={{ height: 34, fontSize: 13 }} onClick={download}>Download</button>
          <button className="btn btn--ghost" style={{ height: 34, fontSize: 13 }} onClick={transcribe} disabled={busy}>{busy ? "Working…" : "Transcribe"}</button>
          <button className="btn btn--ghost" style={{ height: 34, fontSize: 13 }} onClick={makeNotes} disabled={busy}>Make notes</button>
          <button className="btn btn--ghost" style={{ height: 34, fontSize: 13, color: "var(--recording,#FF3B30)" }} onClick={remove}>Delete</button>
        </div>
      </div>
      {url && <video src={url} controls style={{ width: "100%", marginTop: 12, borderRadius: 10, background: "#000" }} />}
      {msg && <div className={`note note--${msg.type}`} style={{ marginTop: 12 }}>
        {msg.text} {msg.type === "warn" && !canTranscribe && <Link to="/pricing" className="link">See Studio Pro</Link>}
      </div>}
      {notes && (
        <div style={{ marginTop: 12, padding: 14, borderRadius: 12, background: "var(--surface-sunken)", border: "1px solid var(--border-default)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Notes</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-primary)", whiteSpace: "pre-wrap", margin: 0 }}>{notes}</p>
        </div>
      )}
      {transcript && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Transcript</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", whiteSpace: "pre-wrap", margin: 0 }}>{transcript}</p>
          <AskBox context={transcript} plan={plan} />
        </div>
      )}
    </div>
  );
}

function AskBox({ context, plan }) {
  const [q, setQ] = useState("");
  const [a, setA] = useState(null);
  const [busy, setBusy] = useState(false);
  const canAsk = featureGateService.can("askMode");

  async function ask() {
    if (!q.trim()) return;
    if (!canAsk) { setA({ type: "warn", text: "Ask Mode is a Studio Pro feature." }); return; }
    setBusy(true); setA(null);
    const r = await meetingAssistantService.ask(q, context);
    setBusy(false);
    setA(r.ok ? { type: "ok", text: r.answer } : { type: r.reason === "not-connected" ? "warn" : "err", text: r.message });
  }
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="ask-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about this recording…" onKeyDown={(e) => e.key === "Enter" && ask()} />
        <button className="btn btn--secondary" style={{ height: 40 }} onClick={ask} disabled={busy}>{busy ? "…" : "Ask"}</button>
      </div>
      {a && <div className={`note note--${a.type}`}>{a.text} {a.type === "warn" && !canAsk && <Link to="/pricing" className="link">See Studio Pro</Link>}</div>}
    </div>
  );
}

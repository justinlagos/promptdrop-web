import React, { useEffect, useRef, useState } from "react";
import { recordingDB } from "../services/recordingDB.js";
import { ENV } from "../services/env.js";
import CleanTake from "./CleanTake.jsx";
import SyncStatus from "../components/SyncStatus.jsx";

// Same backend the mobile app uses: the Supabase edge functions, called with the publishable key.
const FN = ENV.supabaseUrl ? ENV.supabaseUrl + "/functions/v1" : "";
const ANON = ENV.supabaseAnonKey || "";
async function aiTranscribe(blob) {
  if (!FN) return { ok: false, msg: "AI is not switched on yet." };
  try {
    const fd = new FormData(); fd.append("file", blob, "rec.webm");
    const r = await fetch(FN + "/transcribe", { method: "POST", headers: { Authorization: "Bearer " + ANON, apikey: ANON }, body: fd });
    const d = await r.json().catch(() => ({}));
    if (r.status === 503) return { ok: false, msg: "AI is not switched on yet on the server." };
    if (!r.ok || d.error) return { ok: false, msg: d.message || "Transcription failed." };
    return { ok: true, text: d.text || "", segments: d.segments || [], words: d.words || [] };
  } catch (e) { return { ok: false, msg: String(e.message || e) }; }
}
async function aiAsk(question, context, mode) {
  if (!FN) return { ok: false, msg: "AI is not switched on yet." };
  try {
    const r = await fetch(FN + "/assistant", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + ANON, apikey: ANON }, body: JSON.stringify({ question, context, mode: mode || "task" }) });
    const d = await r.json().catch(() => ({}));
    if (r.status === 503) return { ok: false, msg: "AI is not switched on yet on the server." };
    if (!r.ok || d.error) return { ok: false, msg: d.message || "Request failed." };
    return { ok: true, text: d.answer || d.text || "" };
  } catch (e) { return { ok: false, msg: String(e.message || e) }; }
}

function pickMime() {
  const c = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (!window.MediaRecorder) return null;
  return c.find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || "";
}
const fmtDur = (ms) => { const s = Math.round((ms || 0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const toLines = (t) => (t || "").split("\n").map((s) => s.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);

export default function Meetings() {
  const [view, setView] = useState("list");   // list | live | <id>
  const [meetings, setMeetings] = useState([]);
  const refresh = async () => { try { const all = await recordingDB.list(); setMeetings(all.filter((r) => r.source === "meeting")); } catch (e) {} };
  useEffect(() => { refresh(); }, []);

  if (view === "live") return <MeetingLive onExit={() => setView("list")} onDone={(id) => { refresh(); setView(id || "list"); }} />;
  if (view.startsWith("clean:")) { const cid = view.slice(6); return <CleanTake id={cid} onBack={() => setView(cid)} />; }
  if (view !== "list") return <MeetingDetail id={view} onBack={() => { refresh(); setView("list"); }} onClean={() => setView("clean:" + view)} />;

  return (
    <main className="wrap" style={{ padding: "40px 24px 96px", maxWidth: 880 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Meetings</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 16 }}>Record your calls, get notes and answers.</h1>

      <button className="card" onClick={() => setView("live")} style={{ width: "100%", textAlign: "left", cursor: "pointer", border: "1px solid var(--border-default)", padding: 18, marginBottom: 26, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 50, height: 50, borderRadius: 999, background: "var(--recording, #FF3B30)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, background: "#fff" }} />
        </span>
        <span>
          <span style={{ display: "block", fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>Record a meeting</span>
          <span style={{ display: "block", marginTop: 3, fontSize: 13.5, color: "var(--text-muted)" }}>Live transcript, summary, action items, and Ask, the same as mobile.</span>
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Recent</h2>
        <SyncStatus status="local" />
      </div>
      {meetings.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No meetings yet. Record one and it appears here with a transcript and notes.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {meetings.map((m) => (
            <button key={m.id} className="card" onClick={() => setView(m.id)} style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--border-default)", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span>
                <span style={{ display: "block", fontWeight: 600, fontSize: 15 }}>{m.title || "Meeting"}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{new Date(m.createdAt).toLocaleString("en-GB")} · {fmtDur(m.durationMs)}</span>
              </span>
              <span style={{ color: "var(--text-muted)" }}>›</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

function MeetingLive({ onExit, onDone }) {
  const [phase, setPhase] = useState("recording");   // recording | processing
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState("Transcribing the recording…");
  const [live, setLive] = useState("");
  const [interim, setInterim] = useState("");
  const [captionsOn, setCaptionsOn] = useState(false);
  const [ask, setAsk] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [err, setErr] = useState("");
  const streamRef = useRef(null); const recRef = useRef(null); const chunksRef = useRef([]); const startRef = useRef(0);
  const srRef = useRef(null); const liveRef = useRef(""); const tickRef = useRef(null); const scrollRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!alive) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream; chunksRef.current = [];
        const mime = pickMime();
        let mr; try { mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); } catch (e) { try { mr = new MediaRecorder(stream); } catch (e2) { mr = null; } }
        if (mr) { mr.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); }; try { mr.start(1000); } catch (e) { try { mr.start(); } catch (_) {} } recRef.current = mr; startRef.current = Date.now(); }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) { try {
          const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = "en-US";
          r.onresult = (ev) => { let fin = "", itr = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const seg = ev.results[i][0].transcript; if (ev.results[i].isFinal) fin += seg + " "; else itr += seg; } if (fin) { liveRef.current = (liveRef.current + " " + fin).trim(); setLive(liveRef.current); } setInterim(itr); if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };
          r.onerror = () => {}; r.onend = () => { if (srRef.current) { try { r.start(); } catch (e) {} } };
          r.start(); srRef.current = r; setCaptionsOn(true);
        } catch (e) {} }
      } catch (e) { setErr("Microphone permission is needed to record a meeting."); }
    })();
    tickRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); try { const r = srRef.current; srRef.current = null; r && r.stop(); } catch (e) {} try { streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {} };
  }, []);

  async function doAsk(q) { if (!q.trim() || asking) return; setAsking(true); setAnswer(null); const r = await aiAsk(q, (liveRef.current || "").trim() || "(nothing captured yet)", "ask"); setAsking(false); setAnswer(r.ok ? r.text : (r.msg || "Could not answer.")); setAsk(""); }

  async function stop() {
    const mr = recRef.current; recRef.current = null; setPhase("processing");
    try { const r = srRef.current; srRef.current = null; r && r.stop(); } catch (e) {}
    if (tickRef.current) clearInterval(tickRef.current);
    const dur = Date.now() - startRef.current;
    const finish = async (blob) => {
      try { streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
      let transcript = (liveRef.current || "").trim(), summary = "", actions = [], decisions = [], questions = [], segments = [];
      if (!transcript && blob) { setNote("Transcribing the recording…"); const tr = await aiTranscribe(blob); if (tr.ok) { transcript = tr.text || ""; segments = tr.segments || []; } }
      if (transcript.trim()) {
        setNote("Summarising and pulling actions…");
        const sx = await aiAsk("Summarise this call in 2 to 3 sentences. Return only the summary.", transcript); if (sx.ok) summary = sx.text;
        const ax = await aiAsk("List the action items, one per line, no other text. If none, return nothing.", transcript); if (ax.ok) actions = toLines(ax.text);
        const dx = await aiAsk("List the decisions made, one per line, no other text. If none, return nothing.", transcript); if (dx.ok) decisions = toLines(dx.text);
        const qx = await aiAsk("List the open questions, one per line, no other text. If none, return nothing.", transcript); if (qx.ok) questions = toLines(qx.text);
      }
      const id = crypto.randomUUID ? crypto.randomUUID() : "mt" + Date.now();
      const title = "Meeting · " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      try { await recordingDB.save({ id, createdAt: Date.now(), durationMs: dur, size: blob ? blob.size : 0, source: "meeting", title, blob: blob || null, transcript, segments, summary, actions, decisions, questions }); } catch (e) {}
      onDone(id);
    };
    if (!mr) { finish(null); return; }
    let done = false; const finalize = () => { if (done) return; done = true; finish(new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" })); };
    mr.onstop = finalize;
    try { if (mr.state !== "inactive") { try { mr.requestData(); } catch (e) {} mr.stop(); } else finalize(); } catch (e) { finalize(); }
    setTimeout(finalize, 1500);
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "processing") return (
    <main className="wrap" style={{ padding: "120px 24px", maxWidth: 560, textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Making sense of the call…</div>
      <p style={{ color: "var(--text-muted)" }}>{note}</p>
    </main>
  );

  return (
    <main className="wrap" style={{ padding: "32px 24px 40px", maxWidth: 760, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
      <div className="note" style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Recording. You are responsible for getting everyone's consent first.</span>
      </div>
      {err && <div className="note note--err" style={{ marginBottom: 16 }}>{err}</div>}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--recording, #FF3B30)", animation: "pdpulse 1.4s infinite" }} />
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 28, fontWeight: 500 }}>{fmt(elapsed)}</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: ".14em", color: "#FF8077" }}>RECORDING</div>
      </div>

      <div ref={scrollRef} className="card" style={{ flex: 1, minHeight: 160, overflowY: "auto", padding: 18, marginBottom: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Live transcript</div>
        {(live || interim)
          ? <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>{live} <span style={{ color: "var(--text-muted)" }}>{interim}</span></p>
          : <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>{captionsOn ? "Listening…" : "Live captions are not supported in this browser. The full transcript is ready when you stop."}</p>}
      </div>

      {answer && <div className="card" style={{ padding: 14, marginBottom: 12, whiteSpace: "pre-wrap", fontSize: 14.5, lineHeight: 1.55 }}>{answer}</div>}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input className="ask-input" style={{ flex: 1 }} value={ask} onChange={(e) => setAsk(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doAsk(ask)} placeholder="Ask mid-call, e.g. what should I say next?" />
        <button className="btn btn--secondary" style={{ height: 44 }} onClick={() => doAsk(ask)} disabled={asking}>{asking ? "…" : "Ask"}</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <button className="btn btn--ghost" onClick={onExit}>Cancel</button>
        <button onClick={stop} title="Stop and process" style={{ width: 72, height: 72, borderRadius: 999, border: "4px solid rgba(255,255,255,0.2)", background: "var(--recording, #FF3B30)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: "#fff" }} />
        </button>
        <span style={{ width: 64 }} />
      </div>
    </main>
  );
}

function MeetingDetail({ id, onBack, onClean }) {
  const [m, setM] = useState(null);
  const [tab, setTab] = useState("Summary");
  const [done, setDone] = useState({});
  const [chat, setChat] = useState([{ role: "ai", t: "Ask me anything about this call, what was decided, what you owe, or what to say next." }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; (async () => { const t = await recordingDB.get(id); if (live) setM(t); })(); return () => { live = false; }; }, [id]);

  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setChat((c) => [...c, { role: "me", t: q }]); setDraft(""); setBusy(true);
    const r = await aiAsk(q, m ? (m.transcript || m.summary || "") : "", "ask");
    setBusy(false);
    setChat((c) => [...c, { role: "ai", t: r.ok ? r.text : (r.msg || "Could not answer.") }]);
  };
  async function remove() { await recordingDB.remove(id); onBack(); }

  if (!m) return <main className="wrap" style={{ padding: "60px 24px" }}><button className="btn btn--ghost" onClick={onBack}>← Back</button><p style={{ color: "var(--text-muted)", marginTop: 20 }}>Loading…</p></main>;
  const transcript = m.transcript || "";

  return (
    <main className="wrap" style={{ padding: "32px 24px 96px", maxWidth: 820 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button className="btn btn--ghost" onClick={onBack}>← Back to meetings</button>
        {m.blob && m.blob.size > 0 && <button className="btn btn--secondary" onClick={onClean}>Clean up recording</button>}
      </div>
      <div className="eyebrow">{new Date(m.createdAt).toLocaleString("en-GB")} · {fmtDur(m.durationMs)}</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", margin: "8px 0 16px" }}>{m.title}</h1>

      <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 10, marginBottom: 18 }}>
        {["Summary", "Transcript", "Ask"].map((o) => (
          <button key={o} className="btn" onClick={() => setTab(o)} style={{ height: 34, padding: "0 16px", fontSize: 13, borderRadius: 7, background: tab === o ? "var(--surface-raised)" : "transparent", color: tab === o ? "var(--text-primary)" : "var(--text-secondary)" }}>{o}</button>
        ))}
      </div>

      {tab === "Summary" && (
        <div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)" }}>{m.summary || "No summary yet. If AI is switched on for your account, the summary appears here after recording."}</p>
          {m.actions && m.actions.length > 0 && (
            <Section title="Action items">{m.actions.map((a, i) => (
              <button key={i} className="meet-row" onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))} style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%", textAlign: "left", background: "none", border: "none", padding: "11px 0", cursor: "pointer", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: done[i] ? "none" : "1.5px solid var(--border-strong, #555)", background: done[i] ? "var(--accent-primary, #6C8CFF)" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{done[i] ? "✓" : ""}</span>
                <span style={{ fontSize: 15, lineHeight: 1.45, textDecoration: done[i] ? "line-through" : "none", opacity: done[i] ? 0.5 : 1 }}>{a}</span>
              </button>
            ))}</Section>
          )}
          {m.decisions && m.decisions.length > 0 && <Section title="Decisions">{m.decisions.map((d, i) => <p key={i} style={{ fontSize: 15, margin: "10px 0", lineHeight: 1.45 }}>• {d}</p>)}</Section>}
          {m.questions && m.questions.length > 0 && <Section title="Open questions">{m.questions.map((q, i) => <p key={i} style={{ fontSize: 15, margin: "10px 0", lineHeight: 1.45 }}>? {q}</p>)}</Section>}
          <div style={{ marginTop: 24 }}><button className="btn btn--ghost" style={{ color: "var(--recording,#FF3B30)" }} onClick={remove}>Delete meeting</button></div>
        </div>
      )}

      {tab === "Transcript" && (
        transcript.trim()
          ? <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{transcript}</p>
          : <p style={{ fontSize: 15, color: "var(--text-muted)" }}>No transcript was captured for this recording.</p>
      )}

      {tab === "Ask" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {chat.map((c, i) => (
              <div key={i} style={{ alignSelf: c.role === "me" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{ padding: "11px 14px", borderRadius: 14, fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap", background: c.role === "me" ? "var(--accent-primary, #6C8CFF)" : "var(--surface-raised)", color: c.role === "me" ? "#fff" : "var(--text-primary)", border: c.role === "me" ? "none" : "1px solid var(--border-default)" }}>{c.t}</div>
              </div>
            ))}
            {busy && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Thinking…</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="ask-input" style={{ flex: 1 }} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(draft)} placeholder="Ask about this call…" />
            <button className="btn btn--secondary" style={{ height: 44 }} onClick={() => ask(draft)} disabled={busy}>{busy ? "…" : "Ask"}</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Section({ title, children }) {
  return (<div style={{ marginTop: 24 }}><div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>{children}</div>);
}

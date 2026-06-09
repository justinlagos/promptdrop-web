import React, { useEffect, useState } from "react";
import { recordingDB } from "../services/recordingDB.js";
import CleanTake from "./CleanTake.jsx";
import SyncStatus from "../components/SyncStatus.jsx";

const fmtDur = (ms) => { const s = Math.round((ms || 0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const fmtSize = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round((b || 0) / 1e3)} KB`);

// Desktop Takes: list every recording, open the full Clean Take editor on select.
export default function Takes() {
  const [takes, setTakes] = useState(null);
  const [openId, setOpenId] = useState(null);

  const refresh = async () => { try { setTakes(await recordingDB.list()); } catch (e) { setTakes([]); } };
  useEffect(() => { refresh(); }, []);

  if (openId) return <CleanTake id={openId} onBack={() => { refresh(); setOpenId(null); }} />;

  return (
    <main className="wrap" style={{ padding: "32px 24px 80px", maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Takes</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", margin: 0 }}>Your recordings</h1>
        </div>
        <SyncStatus status="local" />
      </div>

      {takes === null ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : takes.length === 0 ? (
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No takes yet</div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, maxWidth: 420, margin: "0 auto" }}>Record with the teleprompter or a meeting, and your takes appear here. Select one to open the Clean Take editor: trim, clean pauses, adjust speed and style, and export.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {takes.map((t) => (
            <button key={t.id} className="card" onClick={() => setOpenId(t.id)} style={{ textAlign: "left", padding: 0, overflow: "hidden", cursor: "pointer", border: "1px solid var(--border-default)" }}>
              <div style={{ aspectRatio: "16/10", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
                {t.blob && t.blob.size > 0 ? "Clean Take" : "No video"}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title || (t.source === "meeting" ? "Meeting" : "Take")}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{new Date(t.createdAt).toLocaleDateString("en-GB")} · {fmtDur(t.durationMs)} · {fmtSize(t.size)}</div>
                <div style={{ marginTop: 8 }}><SyncStatus status="local" /></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

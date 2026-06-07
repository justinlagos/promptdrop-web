import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { scriptsService } from "../services/scriptsService.js";

// Cloud-synced script studio: list + editor, autosaves to Supabase (cross-device).
export default function Scripts() {
  const { isSignedIn, openAuth } = useAuth() || {};
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);   // {id,title,body}
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const saveT = useRef(null);

  async function refresh(selectId) {
    const rows = await scriptsService.list();
    setList(rows);
    if (selectId) { const f = rows.find((r) => r.id === selectId); if (f) setActive(f); }
    else if (!active && rows.length) setActive(rows[0]);
    setLoading(false);
  }
  useEffect(() => { if (isSignedIn) refresh(); else setLoading(false); }, [isSignedIn]);

  function edit(field, v) {
    setActive((a) => ({ ...a, [field]: v }));
    setStatus("Saving…");
    clearTimeout(saveT.current);
    const id = active.id, patch = { [field]: v };
    saveT.current = setTimeout(async () => {
      const ok = await scriptsService.update(id, patch);
      setStatus(ok ? "Saved to cloud" : "Save failed");
      setList((l) => l.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    }, 600);
  }
  async function add() {
    const row = await scriptsService.create("Untitled", "");
    if (row) { setList((l) => [row, ...l]); setActive(row); }
  }
  async function del(id) {
    await scriptsService.remove(id);
    const rest = list.filter((s) => s.id !== id);
    setList(rest); if (active?.id === id) setActive(rest[0] || null);
  }

  if (!isSignedIn) return (
    <main className="wrap" style={{ padding: "64px 24px", maxWidth: 520 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Scripts</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Sign in to sync your scripts.</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Your scripts are stored in your account and follow you to every device.</p>
      <button className="btn btn--primary btn--lg" onClick={openAuth}>Sign in</button>
    </main>
  );
  if (loading) return <main className="wrap" style={{ padding: "64px 24px" }}><p style={{ color: "var(--text-muted)" }}>Loading…</p></main>;

  return (
    <main className="wrap scripts" style={{ padding: "32px 24px 96px", maxWidth: 1040 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.03em" }}>Your scripts</h1>
        <button className="btn btn--primary" onClick={add}>New script</button>
      </div>
      <div className="scripts__grid">
        <aside className="scripts__list">
          {list.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No scripts yet. Create one, it syncs to your account.</p>}
          {list.map((s) => (
            <button key={s.id} className={"scripts__item" + (active?.id === s.id ? " on" : "")} onClick={() => setActive(s)}>
              <span className="scripts__title">{s.title || "Untitled"}</span>
              <span className="scripts__meta">{(s.body || "").trim().split(/\s+/).filter(Boolean).length} words</span>
            </button>
          ))}
        </aside>
        <section className="scripts__editor card" style={{ padding: 20 }}>
          {active ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <input value={active.title} onChange={(e) => edit("title", e.target.value)} placeholder="Script title"
                  style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", width: "100%" }} />
                <button className="btn btn--ghost" style={{ height: 32, fontSize: 13, color: "var(--recording,#FF3B30)" }} onClick={() => del(active.id)}>Delete</button>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", margin: "4px 0 14px" }}>{status || "Synced"}</div>
              <textarea value={active.body} onChange={(e) => edit("body", e.target.value)}
                placeholder="Write or paste your script. Leave a blank line for a breath."
                style={{ width: "100%", minHeight: 380, background: "none", border: "none", outline: "none", resize: "vertical", color: "var(--text-primary)", fontSize: 16, lineHeight: 1.7, fontFamily: "var(--font-sans)" }} />
            </>
          ) : <p style={{ color: "var(--text-muted)" }}>Select a script or create a new one.</p>}
        </section>
      </div>
    </main>
  );
}

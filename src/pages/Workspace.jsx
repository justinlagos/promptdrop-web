import React, { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { supabase } from "../services/supabaseClient.js";
import { PLANS } from "../services/planService.js";

export default function Workspace() {
  const ws = useWorkspace() || {};
  const [members, setMembers] = useState([]);
  useEffect(() => {
    (async () => {
      if (!supabase || !ws.currentWorkspace?.id) return;
      const { data } = await supabase.from("workspace_members").select("user_id, role, status").eq("workspace_id", ws.currentWorkspace.id);
      setMembers(data || []);
    })();
  }, [ws.currentWorkspace?.id]);

  if (ws.isLoading) return <main className="wrap" style={{ padding: "64px 24px" }}><p style={{ color: "var(--text-muted)" }}>Loading workspace…</p></main>;
  const w = ws.currentWorkspace;
  const planName = (PLANS[ws.currentPlan] && PLANS[ws.currentPlan].name) || "Free";

  return (
    <main className="wrap" style={{ padding: "40px 24px 96px", maxWidth: 720 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Workspace</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 6 }}>{w?.name || "Personal"}</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{w?.type === "personal" ? "Your personal workspace." : "Shared workspace."} Plan: {planName}. Your role: {ws.currentRole || "owner"}.</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Members</h2>
        {members.length === 0
          ? <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Just you for now.</p>
          : members.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: 14, fontFamily: "var(--font-mono, monospace)" }}>{m.user_id.slice(0, 8)}…</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.role} · {m.status}</span>
            </div>
          ))}
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Invite teammates</h2>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Team workspaces with shared scripts, takes, and meetings are coming. The roles and permissions are already in place, so invites will switch on without changing how your data is stored.</p>
      </section>
    </main>
  );
}

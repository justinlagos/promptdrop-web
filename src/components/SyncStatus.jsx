import React from "react";

// Honest sync indicator. status: saved | saving | synced | waiting | failed | local
const MAP = {
  saved:   { label: "Saved",            dot: "var(--success, #2FCF8F)" },
  saving:  { label: "Saving...",        dot: "var(--amber-400, #FBC04E)" },
  synced:  { label: "Synced",           dot: "var(--success, #2FCF8F)" },
  waiting: { label: "Waiting to sync",  dot: "var(--amber-400, #FBC04E)" },
  failed:  { label: "Upload failed",    dot: "var(--recording, #FF3B30)" },
  local:   { label: "Local on this device", dot: "var(--text-muted)" },
};

export default function SyncStatus({ status = "synced", onRetry }) {
  const s = MAP[status] || MAP.synced;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 500 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.dot, flexShrink: 0 }} />
      {s.label}
      {status === "failed" && onRetry && (
        <button onClick={onRetry} style={{ marginLeft: 4, background: "none", border: "none", color: "var(--accent-primary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Retry</button>
      )}
    </span>
  );
}

import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

// Compact Light / Dark / System switch. Uses tokens so it themes itself.
export default function ThemeToggle({ compact }) {
  const t = useTheme();
  if (!t) return null;
  const opts = [["light", "Light"], ["dark", "Dark"], ["system", "Auto"]];
  return (
    <div role="group" aria-label="Theme" style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 10 }}>
      {opts.map(([v, label]) => (
        <button key={v} onClick={() => t.setTheme(v)} aria-pressed={t.theme === v}
          style={{ height: compact ? 28 : 32, padding: compact ? "0 9px" : "0 12px", fontSize: compact ? 12 : 12.5, fontWeight: 600, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: t.theme === v ? "var(--surface-raised)" : "transparent",
            color: t.theme === v ? "var(--text-primary)" : "var(--text-muted)",
            boxShadow: t.theme === v ? "var(--shadow-surface)" : "none" }}>{label}</button>
      ))}
    </div>
  );
}

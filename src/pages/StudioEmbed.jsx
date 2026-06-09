import React from "react";

// Mounts the EXACT desktop studio (same React renderer the Mac app ships) full-screen.
// Lives in /public/studio. Floating-overlay (OS-only) features stay hidden in the browser.
export default function StudioEmbed() {
  return (
    <iframe
      title="PromptDrop Studio"
      src="/studio/index.html"
      allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
      style={{ width: "100%", height: "100%", border: "none", background: "#07080b", display: "block" }}
    />
  );
}

import React from "react";

// Mounts the EXACT desktop studio (same React renderer the Mac app ships) full-screen.
// Lives in /public/studio. Floating-overlay (OS-only) features stay hidden in the browser.
export default function StudioEmbed() {
  return (
    <iframe
      title="PromptDrop Studio"
      src="/studio/index.html"
      allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: "none", background: "#07080b" }}
    />
  );
}

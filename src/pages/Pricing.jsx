import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PLANS, PLAN_BENEFITS } from "../services/planService.js";
import { billingService } from "../services/index.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Pricing() {
  const { isSignedIn, openAuth, plan: currentPlan } = useAuth() || {};
  const [cycle, setCycle] = useState("monthly");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const order = ["free", "creator_pro", "studio_pro"];

  const onCta = async (id) => {
    setNote("");
    if (id === "free") { isSignedIn ? window.location.assign("/account") : openAuth(); return; }
    if (!isSignedIn) { openAuth(); return; }                 // must have an account to subscribe
    setBusy(id);
    const r = await billingService.startCheckout(id, cycle); // redirects on success
    setBusy("");
    if (!r.ok) setNote(r.reason === "stripe-pending"
      ? "Payments aren't switched on yet. The plan is ready, Stripe keys are pending on the server."
      : (r.message || "Couldn't start checkout."));
  };

  return (
    <main className="wrap" style={{ padding: "56px 24px 24px", maxWidth: 1120 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Plans &amp; pricing</div>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: "-.03em" }}>Choose how you want to prompt.</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, maxWidth: "60ch", margin: "12px auto 0", lineHeight: 1.55 }}>
          Start free with the camera-level teleprompter. Upgrade when you need AI, voice-follow, take review, cloud sync, desktop overlay, meeting mode and recording.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 28px" }}>
        <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: 10 }}>
          {["monthly", "yearly"].map((c) => (
            <button key={c} onClick={() => setCycle(c)} className="btn" style={{ height: 34, padding: "0 16px", fontSize: 13, borderRadius: 7, background: cycle === c ? "var(--surface-raised)" : "transparent", color: cycle === c ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {c === "monthly" ? "Monthly" : "Yearly · save"}
            </button>
          ))}
        </div>
      </div>

      {note && <div className="card" style={{ padding: "12px 16px", marginBottom: 18, borderColor: "rgba(245,165,36,.35)", color: "var(--amber-400)", fontSize: 14, textAlign: "center" }}>{note}</div>}

      {/* stacked cards on mobile, row on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {order.map((id) => {
          const p = PLANS[id]; const feat = PLAN_BENEFITS[id];
          const price = id === "creator_pro" ? (cycle === "yearly" ? "$56" : "$5") : id === "studio_pro" ? (cycle === "yearly" ? "$95" : "$9") : p.price;
          const sub = (id === "creator_pro" || id === "studio_pro") ? (cycle === "yearly" ? "/year" : "/month") : p.cycle;
          return (
            <div key={id} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, position: "relative", borderColor: p.badge ? "var(--accent-primary)" : undefined }}>
              {p.badge && <span className="badge badge--accent" style={{ position: "absolute", top: -11, left: 20 }}>{p.badge}</span>}
              <div><div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div><div className="muted" style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.blurb}</div></div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em" }}>{price}</span>
                <span className="muted" style={{ fontSize: 14, color: "var(--text-muted)" }}>{sub}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: "4px 0 8px", flex: 1 }}>
                {feat.map((t, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ flex: "none", marginTop: 1 }}><polyline points="20 6 9 17 4 12" /></svg>{t}
                  </li>
                ))}
              </ul>
              {currentPlan === id && id !== "free"
                ? <Link to="/account" className="btn btn--secondary" style={{ width: "100%" }}>Current plan · manage</Link>
                : <button className={"btn " + (p.badge ? "btn--primary" : "btn--secondary")} style={{ width: "100%" }} onClick={() => onCta(id)} disabled={busy === id}>{busy === id ? "Opening checkout…" : p.cta}</button>}
              {id === "studio_pro" && <Link to="/download" className="btn btn--ghost" style={{ width: "100%", fontSize: 13, height: 38 }}>Download desktop overlay</Link>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 16 }}>
        <div className="card" style={{ padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div><div style={{ fontWeight: 600 }}>Team <span className="badge" style={{ marginLeft: 6 }}>Coming soon</span></div><div className="muted" style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Shared library, brand kits, roles.</div></div>
          <button className="btn btn--ghost" disabled style={{ height: 38 }}>Join waitlist</button>
        </div>
        <div className="card" style={{ padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div><div style={{ fontWeight: 600 }}>Enterprise</div><div className="muted" style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>SSO, admin, custom retention.</div></div>
          <button className="btn btn--ghost" style={{ height: 38 }}>Contact sales</button>
        </div>
      </div>

      <p className="muted" style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", marginTop: 24 }}>
        Got a tester or friend code? {isSignedIn ? <Link className="link" to="/account">Redeem it on your account</Link> : <button className="link" onClick={openAuth}>Sign in to redeem it</button>}, no card needed.
      </p>
      <p className="muted" style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>
        Secure checkout by Stripe. You can also enter a promo code at checkout.
      </p>
    </main>
  );
}

// Smooth scrolling for the marketing pages, using Lenis (github.com/darkroomengineering/lenis).
// One Lenis instance per page view. Everything else reads scroll state through
// onScroll() so it works the same whether Lenis is running or not.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const NAV_OFFSET = -76; // sticky nav height plus a little air
let lenis = null;
const listeners = new Set();
let last = { y: 0, progress: 0, velocity: 0, direction: 0 };

function read(fromLenis) {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = window.scrollY || doc.scrollTop || 0;
  const velocity = fromLenis ? fromLenis.velocity || 0 : y - last.y;
  last = { y, progress: Math.min(1, Math.max(0, y / max)), velocity, direction: velocity > 0 ? 1 : velocity < 0 ? -1 : 0 };
  listeners.forEach((fn) => { try { fn(last); } catch (e) {} });
}

// Subscribe to scroll position. Calls back straight away with the current state.
export function onScroll(fn) {
  listeners.add(fn);
  fn(last);
  return () => listeners.delete(fn);
}
export function getScroll() { return last; }
export function getLenis() { return lenis; }

// Scroll to a pixel position, a selector or an element. Falls back to the browser.
export function scrollTo(target, opts = {}) {
  if (lenis) { lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : NAV_OFFSET, ...opts }); return; }
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduce || opts.immediate ? "auto" : "smooth";
  if (typeof target === "number") { window.scrollTo({ top: target, behavior }); return; }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET, behavior });
}

// Mount once inside the marketing shell.
export function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, anchors: false });
    document.documentElement.dataset.smooth = "lenis";
    const onLenis = (l) => read(l);
    lenis.on("scroll", onLenis);
    const onNative = () => read(lenis);
    window.addEventListener("resize", onNative);
    read(lenis);

    // Same-page links such as /#how glide to their section instead of jumping.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      let url; try { url = new URL(a.getAttribute("href"), window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash || url.hash === "#") return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollTo(target);
      try { window.history.pushState(null, "", url.hash); } catch (err) {}
      // Move keyboard focus with the scroll so the next Tab continues from the section.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onNative);
      lenis.destroy(); lenis = null;
      delete document.documentElement.dataset.smooth;
    };
  }, []);

  // New page: start at the top, or at the section named in the address.
  useEffect(() => {
    if (!lenis) return;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) { requestAnimationFrame(() => scrollTo(target, { immediate: true })); return; }
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}

// Fades content in as it enters the screen. Content is only hidden once this runs, so
// a page without JavaScript, or with reduced motion on, shows everything straight away.
export function useReveal(deps = []) {
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window) || !nodes.length) return;
    const root = document.documentElement;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    // Anything already on screen is shown before the hidden state is switched on.
    for (const n of nodes) { const r = n.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) n.classList.add("is-in"); }
    root.classList.add("js-reveal");
    nodes.forEach((n) => { if (!n.classList.contains("is-in")) io.observe(n); });
    // Safety net: never leave content hidden if the observer does not fire.
    const failsafe = setTimeout(() => nodes.forEach((n) => { const r = n.getBoundingClientRect(); if (r.top < window.innerHeight) n.classList.add("is-in"); }), 1500);
    return () => { clearTimeout(failsafe); io.disconnect(); root.classList.remove("js-reveal"); nodes.forEach((n) => n.classList.remove("is-in")); };
  }, deps);
}

// Gentle parallax: elements with data-parallax drift a little against the scroll.
export function useParallax(deps = []) {
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia && window.matchMedia("(max-width: 860px)").matches;
    const nodes = Array.from(document.querySelectorAll("[data-parallax]"));
    if (reduce || small || !nodes.length) return;
    const off = onScroll(() => {
      const mid = window.innerHeight / 2;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
        const k = Number(n.dataset.parallax) || 0.06;
        const shift = Math.max(-40, Math.min(40, (r.top + r.height / 2 - mid) * k));
        n.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      }
    });
    return () => { off(); nodes.forEach((n) => { n.style.transform = ""; }); };
  }, deps);
}

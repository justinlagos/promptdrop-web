// PromptDrop service worker.
// NETWORK-FIRST for everything we serve, so a new deploy is always picked up immediately.
// The cache is only an offline fallback. Old caches are purged on every version bump.
const CACHE = "promptdrop-v4";

self.addEventListener("install", () => { self.skipWaiting(); });

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); });

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // never touch Supabase / Stripe / other origins

  // Always try the network first; fall back to cache only when offline.
  e.respondWith(
    fetch(req)
      .then((r) => {
        if (r && r.ok && r.type === "basic") {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return r;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/index.html") : Response.error()))
      )
  );
});

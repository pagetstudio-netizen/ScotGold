const CACHE_NAME = "scotgold-v2";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/scotgold-logo.png",
  "/scotgold-home-hero.jpg",
  "/scotgold-gold-bars-closeup.jpg",
  "/scotgold-gold-bars-stack.jpg",
  "/scotgold-gold-bars-coins.jpg",
  "/scotgold-og.jpg",
  "/scotgold-icon-192.png",
  "/scotgold-icon-512.png",
  "/scotgold-apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

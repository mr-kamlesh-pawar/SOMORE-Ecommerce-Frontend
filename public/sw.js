const CACHE_NAME = "offline-cache-v2";

const OFFLINE_URL = "/offline";

// files that MUST be cached
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  "/",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);

      // try cached request
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;

      // fallback to offline page
      return cache.match(OFFLINE_URL);
    })
  );
});

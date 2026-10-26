const CACHE_VERSION = "honeymoon-v39";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./enhancements.css",
  "./booking-apps.css",
  "./personalization.css",
  "./schedule-route.css",
  "./travel-now.css",
  "./trip-operations-v36.css",
  "./pwa.css",
  "./travel-extras.css",
  "./flight-wallet.css",
  "./booking-wallet-v24.css",
  "./booking-layout-v32.css",
  "./more-hub-v25.css",
  "./entry-guide-v37.css",
  "./app-ux-v25.css",
  "./itinerary.js",
  "./app.js",
  "./schedule-map-v32.js",
  "./time-context.js",
  "./schedule-fixes.js",
  "./booking-data.js",
  "./reservation-data-v32.js",
  "./reservation-data-v33.js",
  "./enhancements.js",
  "./booking-apps.js",
  "./travel-now.js",
  "./pwa.js",
  "./travel-extras.js",
  "./flight-wallet.js",
  "./booking-wallet-v24.js",
  "./booking-layout-v32.js",
  "./more-hub-v25.js",
  "./entry-guide-v37.js",
  "./app-ux-v26.js",
  "./flight-stack-v35.js",
  "./trip-operations-v36.js",
  "./manifest.webmanifest",
  "./app-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("honeymoon-") && key !== CACHE_VERSION && key !== `${CACHE_VERSION}-runtime`)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

const cachedAppResponse = async (request) => {
  const cache = await caches.open(CACHE_VERSION);
  return cache.match(request, { ignoreSearch: true });
};

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_VERSION);
        cache.put("./index.html", response.clone());
        return response;
      } catch (error) {
        return (await caches.match("./index.html")) || (await caches.match("./"));
      }
    })());
    return;
  }

  if (sameOrigin) {
    event.respondWith((async () => {
      const cached = await cachedAppResponse(request);
      const networkPromise = fetch(request)
        .then(async (response) => {
          if (response && response.ok) {
            const cache = await caches.open(CACHE_VERSION);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(networkPromise);
        return cached;
      }

      return (await networkPromise) || new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === "opaque")) {
        const cache = await caches.open(`${CACHE_VERSION}-runtime`);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const runtime = await caches.open(`${CACHE_VERSION}-runtime`);
      return (await runtime.match(request)) || new Response("", { status: 503 });
    }
  })());
});

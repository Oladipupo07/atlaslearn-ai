const CACHE_NAME = "atlaslearn-offline-v2";

const APP_ROUTES = [
  "/",
  "/dashboard",
  "/budget",
  "/roadmap",
  "/report",
  "/chatbot",
  "/quiz",
  "/scam-checker",
  "/profile",
  "/login",
  "/signup",
  "/manifest.json",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

// Install: pre-cache core shell & routes individually so one failure doesn't block others
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        APP_ROUTES.map(async (route) => {
          try {
            const response = await fetch(route, { credentials: "same-origin" });
            if (response && response.ok) {
              await cache.put(route, response.clone());
            }
          } catch {
            // Ignore individual route errors during install
          }
        })
      );
    })
  );
});

// Activate: clean up older cache versions and claim all open tabs/PWA windows immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper: fetch with timeout so "lie-fi" / dead connections don't hang
function fetchWithTimeout(request, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Network timeout")), timeoutMs);
    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignore Firebase / external cross-origin API calls (except fonts/images)
  if (url.origin !== self.location.origin) {
    if (
      url.hostname.includes("fonts.googleapis.com") ||
      url.hostname.includes("fonts.gstatic.com")
    ) {
      event.respondWith(
        caches.match(request).then(
          (cached) =>
            cached ||
            fetch(request)
              .then((res) => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(request, clone));
                return res;
              })
              .catch(() => new Response("", { status: 200 }))
        )
      );
    }
    return;
  }

  // Ignore Next.js HMR / webpack-hmr in dev mode
  if (url.pathname.startsWith("/_next/webpack-hmr")) {
    return;
  }

  // 1. Static assets (/_next/static/, icons, svg, css, js, woff2): Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((res) => {
            if (res && res.ok) {
              cache.put(request, res.clone());
            }
            return res;
          })
          .catch(() => null);

        return cached || (await networkPromise) || new Response("", { status: 200 });
      })
    );
    return;
  }

  // 2. Next.js RSC (React Server Components) flight requests during client-side navigation
  const isRSC =
    request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  if (isRSC) {
    const rscKey = url.pathname + "?__rsc_cache=1";
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const res = await fetchWithTimeout(request, 2500);
          if (res && res.ok) {
            cache.put(request, res.clone());
            cache.put(rscKey, res.clone());
            return res;
          }
        } catch {
          // Offline fallback for RSC
        }
        const exactMatch = await cache.match(request);
        if (exactMatch) return exactMatch;
        const pathMatch = await cache.match(rscKey);
        if (pathMatch) return pathMatch;
        return new Response("", { status: 200 });
      })
    );
    return;
  }

  // 3. Full Page Navigation Requests (Reloading or Launching Installed PWA)
  if (
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkRes = await fetchWithTimeout(request, 2500);
          if (networkRes && networkRes.ok) {
            cache.put(url.pathname, networkRes.clone());
            cache.put(request, networkRes.clone());
            return networkRes;
          }
        } catch {
          // Network unavailable — serve from offline cache below
        }

        // Try exact pathname first
        const cachedPage =
          (await cache.match(url.pathname)) ||
          (await cache.match(request)) ||
          (await cache.match("/dashboard")) ||
          (await cache.match("/"));

        if (cachedPage) {
          return cachedPage;
        }

        // Ultimate self-contained fallback if SW was just installed
        return new Response(
          `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AtlasLearn AI — Offline Workspace</title>
  <style>
    body { background: #070b12; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
    .card { max-width: 420px; background: #0d131f; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px; }
    button { background: #10b981; color: #042f2e; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>AtlasLearn AI Offline Mode</h1>
    <p>Loading your local financial workspace...</p>
    <button onclick="window.location.href='/dashboard'">Open Dashboard</button>
  </div>
</body>
</html>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
      })
    );
    return;
  }

  // 4. All other same-origin GET requests: Network first, fallback to cache
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const res = await fetchWithTimeout(request, 3000);
        if (res && res.ok) {
          cache.put(request, res.clone());
          return res;
        }
      } catch {}
      return (await cache.match(request)) || new Response("{}", { status: 200 });
    })
  );
});


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CORE_ROUTES = [
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
];

export function OfflineServiceWorker() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let isCancelled = false;

    const registerAndWarmCache = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        await navigator.serviceWorker.ready;
        if (isCancelled) return;

        // Pre-warm Next.js router prefetches and HTML document cache when online
        if (navigator.onLine) {
          CORE_ROUTES.forEach((route) => {
            try {
              router.prefetch(route);
            } catch {}
          });

          const cache = await caches.open("atlaslearn-offline-v2");
          for (const route of CORE_ROUTES) {
            if (isCancelled) break;
            try {
              const res = await fetch(route, {
                credentials: "same-origin",
                headers: { Accept: "text/html" },
              });
              if (res && res.ok) {
                await cache.put(route, res.clone());
              }
            } catch {
              // Ignore network hiccups during background pre-warm
            }
          }
        }

        // Check for SW updates when coming back online
        window.addEventListener("online", () => {
          registration.update().catch(() => {});
        });
      } catch (err) {
        console.warn("Service worker registration skipped:", err);
      }
    };

    registerAndWarmCache();

    return () => {
      isCancelled = true;
    };
  }, [router]);

  return null;
}


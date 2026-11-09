// Active Network-First Service Worker for RIZ-PRO LOG PWA Installation (Android WebAPK, iOS & Desktop Apps)
// Clears legacy Cache Storage on activation so mobile & desktop always load live data without stale bundles.

const SW_VERSION = 'riz-prolog-pwa-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Required fetch handler for Android Chrome WebAPK & Desktop PWA installability (Network-First)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'UNREGISTER_LEGACY') {
    self.registration.unregister();
  }
});

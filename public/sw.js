// Self-cleaning Service Worker for RIZ-PROLOG
// Automatically clears all cache storage and unregisters legacy service workers

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => caches.delete(name)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first live strategy: ensures mobile devices always fetch fresh code from Vercel / localhost
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

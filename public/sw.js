// Service Worker for RIZ-PROLOG Progressive Web App (PWA)
// Cache Name with versioning
const CACHE_NAME = 'riz-prolog-v1.0.1';

// Essential assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico'
];

// 1. Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Precache warning (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First with Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests, chrome-extension, and Firebase / Google APIs
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Allow external API calls (Firestore, Google Script, Cloud Run) to bypass cache
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('google.com')
  ) {
    return;
  }

  // Navigation (HTML document requests): Network First, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Static Assets (JS, CSS, Images, Fonts): Cache First with Network Revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

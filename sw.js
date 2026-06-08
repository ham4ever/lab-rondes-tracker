const CACHE_NAME = 'lab-rondes-v4';
const urlsToCache = ['/manifest.webmanifest', '/icon-180.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Network-first voor HTML: altijd vers ophalen
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/lab-rondes-tracker/' || url.pathname === '/lab-rondes-tracker') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  // Cache-first voor overige assets
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

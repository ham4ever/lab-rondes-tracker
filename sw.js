// Self-destruct: unregister SW and clear all caches so the app loads fresh
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    .then(() => self.clients.matchAll({type:'window'}).then(clients => {
      clients.forEach(client => client.navigate(client.url));
    }))
  );
  self.registration.unregister();
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => fetch(event.request)));
});

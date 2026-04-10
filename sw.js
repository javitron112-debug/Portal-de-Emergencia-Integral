const CACHE_NAME = 'emergencias-cache-v2'; // Cambiamos a v2 para forzar la actualización
const urlsToCache = [
  './INDEX.HTML',
  './mochila.jpg',
  './rcp-adultos.jpg',
  './rcp-ninos.jpg',
  './rcp-bebes.jpg',
  './atragantamiento-adultos-ninos.jpg',
  './atragantamiento-bebes.jpg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

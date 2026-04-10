const CACHE_NAME = 'emergencias-cache-v3'; 
const urlsToCache = [
  './index.html',
  './manifest.json',
  './mochila.jpg',
  './rcp-adultos.jpg',
  './rcp-ninos.jpg',
  './rcp-bebes.jpg',
  './atragantamiento-adultos-ninos.jpg',
  './atragantamiento-bebes.jpg'
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

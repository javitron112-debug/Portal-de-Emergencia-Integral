const CACHE_NAME = 'emergencias-cache-v1';
const urlsToCache = [
  './INDEX.HTML',
  './mochila.jpg',
  './rcp adultos.jpg',
  './rcp niños.jpg',
  './rcp bebes.jpg',
  './atragantamiento adultos y niños.jpg',
  './atragantamiento bebes.jpg'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar las peticiones de red y servir desde la caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la caché si existe, si no, lo busca en la red
        return response || fetch(event.request);
      })
  );
});

const CACHE_NAME = 'emergencias-cache-v5'; 
const urlsToCache = [
  './INDEX.HTML',
  './manifest.json',
  './image_81972a.png',
  './mochila.jpg',
  './rcp-adultos.jpg',
  './rcp-ninos.jpg',
  './rcp-bebes.jpg',
  './atragantamiento-adultos-ninos.jpg',
  './atragantamiento-bebes.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Iniciando caché de archivos...');
      for (let url of urlsToCache) {
        try {
          const request = new Request(url, { cache: 'reload' });
          const response = await fetch(request);
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          await cache.put(request, response);
          console.log(`✅ Guardado en caché: ${url}`);
        } catch (error) {
          console.error(`❌ FALLO FATAL AL CACHEAR: ${url} - Revisa que este archivo exista en GitHub y esté bien escrito.`);
        }
      }
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

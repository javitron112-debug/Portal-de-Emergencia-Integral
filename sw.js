const CACHE_NAME = 'emergencia-cache-v4';

// Fáctico: Lista estricta de dependencias actuales.
// Se usa 'index.html' como punto de entrada de la aplicación.
const urlsToCache = [
  './', // Ruta raíz genérica
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'mochila.jpg',
  'rcp-adultos.jpg',
  'rcp-ninos.jpg',
  'rcp-bebes.jpg',
  'atragantamiento-adultos-ninos.jpg',
  'atragantamiento-bebes.jpg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// Instalación: Descarga y guarda todos los archivos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Archivos almacenados en caché profunda.');
        return cache.addAll(urlsToCache);
      })
  );
  // Fuerza al Service Worker a activarse inmediatamente
  self.skipWaiting();
});

// Interceptación de red: Prioridad Offline (Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la caché si existe, si no, lo busca en la red
        return response || fetch(event.request);
      })
  );
});

// Activación: Limpieza de cachés antiguas para no ocupar memoria innecesaria
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Reclama el control de las páginas abiertas inmediatamente
  return self.clients.claim();
});

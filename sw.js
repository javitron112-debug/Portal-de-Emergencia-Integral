const CACHE_NAME = 'emergencia-cache-v8';

// Fáctico: Lista estricta solo con archivos locales.
// Incluye TODAS las imágenes referenciadas en el index.html más reciente.
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'mochila.jpg',
  'plan333.jpg',
  'evaluacion.jpg',
  'hemorragia.jpg',
  'rcp-adultos.jpg',
  'rcp-ninos.jpg',
  'rcp-bebes.jpg',
  'atragantamiento-adultos-ninos.jpg',
  'atragantamiento-bebes.jpg'
];

// Instalación: Descarga y guarda archivos críticos uno a uno (Anti-fallos)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Instalando caché profunda...');
        // Al usar Promise.all con un catch individual, si falta una imagen
        // el Service Worker ignorará el error y continuará la instalación de la app.
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`[Service Worker] Ignorando archivo no encontrado (no bloqueará instalación): ${url}`);
            });
          })
        );
      })
  );
  // Fuerza al Service Worker a activarse sin esperar a que se cierren pestañas
  self.skipWaiting();
});

// Interceptación de red y Caché Dinámico
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET (necesario por seguridad)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Si el archivo ya está guardado offline, lo devuelve inmediatamente
        if (response) {
          return response;
        }

        // 2. Si no está en caché (ej. las librerías Tailwind o Lucide), lo descarga y lo guarda dinámicamente
        return fetch(event.request).then(networkResponse => {
          // Comprueba si la respuesta es válida o es un recurso externo seguro (CORS / Opaco)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque' || networkResponse.type === 'cors')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(err => {
          console.error('[Service Worker] Red caída. No se pudo obtener:', event.request.url);
        });
      })
  );
});

// Activación: Limpieza de cachés antiguas para purgar memoria
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('[Service Worker] Purgando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Reclama el control de las páginas abiertas inmediatamente
  return self.clients.claim();
});

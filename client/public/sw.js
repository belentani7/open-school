/* ===================================================================
   SERVICE WORKER — que "funciona sin conexión" sea verdad.

   Estrategia por tipo de peticion:
     navegacion  -> red primero, cache de respaldo (app shell)
     estaticos   -> cache primero (los assets llevan hash: son inmutables)
     resto       -> red, sin cachear

   Red primero en navegacion evita el fallo clasico del cache-first:
   servir para siempre una version vieja del HTML tras un despliegue.
   =================================================================== */

const VERSION = 'os-v1';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;

const PRECACHE = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      // addAll es atomico: si un recurso falla, no se instala nada.
      // Se toleran fallos individuales para no dejar la app sin SW.
      .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL && k !== ASSETS)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Solo se gestiona lo propio: las fuentes de Google van directas.
  if (url.origin !== self.location.origin) return;

  // --- Navegacion: red primero ---
  if (request.mode === 'navigate') {
    const response = fetch(request);
    const cacheUpdate = response
      .then((res) => {
        // La copia offline forma parte de la vida del evento fetch.
        // Si la caché falla, la respuesta de red sigue siendo válida.
        if (!res.ok) return undefined;
        return caches.open(SHELL).then((cache) => cache.put('/index.html', res.clone()));
      })
      .catch(() => undefined);

    event.waitUntil(cacheUpdate);
    event.respondWith(
      response.catch(() => caches.match('/index.html').then((cached) => cached || Response.error()))
    );
    return;
  }

  // --- Estaticos con hash: cache primero ---
  if (url.pathname.startsWith('/assets/')) {
    const cached = caches.match(request);
    const response = cached.then((hit) => hit || fetch(request));
    const cacheUpdate = cached
      .then((hit) => {
        if (hit) return undefined;
        return response.then((res) => {
          if (!res.ok) return undefined;
          return caches.open(ASSETS).then((cache) => cache.put(request, res.clone()));
        });
      })
      .catch(() => undefined);

    event.waitUntil(cacheUpdate);
    event.respondWith(response);
  }
});

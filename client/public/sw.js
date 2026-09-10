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
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put('/index.html', copy));
          return res;
        })
        // SPA: cualquier ruta se resuelve contra el mismo shell.
        .catch(() => caches.match('/index.html').then((r) => r || Response.error()))
    );
    return;
  }

  // --- Estaticos con hash: cache primero ---
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
  }
});

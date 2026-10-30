// OPEN SCHOOL / CAMPUS — safe offline cache (scoped to this campus).
// Cache Storage is origin-wide: do not delete other applications' caches.
const CACHE = 'open-school-campus-v2';
const OLD_CACHES = new Set(['campus-v1']);
const CORE = ['./', './index.html', './tokens.css', './app.js',
  './cursos/ciberseguridad-5-anios/quiz.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(CORE))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key !== CACHE &&
        (key.startsWith('open-school-campus-') || OLD_CACHES.has(key)))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' ||
      new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      // Never cache HTTP errors, opaque replies or 206 byte-range audio.
      if (response.status === 200 && response.type === 'basic' &&
          !request.headers.has('range')) {
        try {
          const cache = await caches.open(CACHE);
          await cache.put(request, response.clone());
        } catch (_) {
          // Storage quota failures must not block a successful response.
        }
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request);
      if (cached) return cached;
      // An unavailable lesson, MP3 or JSON must not be replaced by index.html.
      return new Response(
        request.mode === 'navigate'
          ? 'Esta página todavía no está disponible sin conexión.'
          : 'Recurso no disponible sin conexión.',
        { status: 503, statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }
  })());
});

/* ===================================================================
   Tests del service worker (client/public/sw.js).

   El SW se ejecuta en el navegador, asi que aqui se carga su fuente y
   se evalua con self/caches/fetch falsos para poder disparar su
   manejador 'fetch' y comprobar que no cachea basura como shell.
   =================================================================== */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type Listener = (event: unknown) => void;

interface Harness {
  listeners: Record<string, Listener>;
  puts: string[];
  setFetch: (fn: FetchFn) => void;
  dispatch: (event: Record<string, unknown>) => { responded: boolean; result: Promise<Response> | undefined };
}

function loadServiceWorker(): Harness {
  const source = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
  const listeners: Record<string, Listener> = {};
  const puts: string[] = [];
  let currentFetch: FetchFn = async () => new Response('ok', { status: 200 });

  const cache = {
    put: async (key: unknown) => {
      puts.push(String(key));
    },
    add: async () => undefined,
    match: async () => undefined,
  };

  const cachesApi = {
    open: async () => cache,
    keys: async () => [] as string[],
    match: async () => undefined,
    delete: async () => true,
  };

  const fakeSelf = {
    addEventListener: (type: string, fn: Listener) => {
      listeners[type] = fn;
    },
    skipWaiting: () => undefined,
    clients: { claim: () => undefined },
    location: new URL('https://example.test/sw.js'),
  };

  const proxyFetch: FetchFn = (input, init) => currentFetch(input, init);

  new Function('self', 'caches', 'fetch', source)(fakeSelf, cachesApi, proxyFetch);

  return {
    listeners,
    puts,
    setFetch: (fn) => {
      currentFetch = fn;
    },
    dispatch: (event) => {
      let responded = false;
      let result: Promise<Response> | undefined;
      const evt = {
        ...event,
        respondWith: (p: Promise<Response>) => {
          responded = true;
          result = p;
        },
      };
      listeners.fetch(evt);
      return { responded, result };
    },
  };
}

describe('service worker', () => {
  it('cachea el shell solo cuando la respuesta de navegacion es valida', async () => {
    const sw = loadServiceWorker();
    sw.setFetch(async () => new Response('<!doctype html>ok', { status: 200 }));

    const { responded, result } = sw.dispatch({
      request: { method: 'GET', url: 'https://example.test/cursos', mode: 'navigate' },
    });

    expect(responded).toBe(true);
    await result;
    // el put es asincrono: dar un tick a la cola de microtareas
    await Promise.resolve();
    expect(sw.puts).toEqual(['/index.html']);
  });

  it('NO cachea respuestas de error (404/500) como si fueran la app', async () => {
    const sw = loadServiceWorker();
    sw.setFetch(async () => new Response('Internal Server Error', { status: 500 }));

    const { responded, result } = sw.dispatch({
      request: { method: 'GET', url: 'https://example.test/cursos', mode: 'navigate' },
    });

    expect(responded).toBe(true);
    const res = await result;
    expect(res?.status).toBe(500);
    await Promise.resolve();
    expect(sw.puts).toEqual([]);
  });

  it('no intercepta peticiones que no sean GET', () => {
    const sw = loadServiceWorker();
    const { responded } = sw.dispatch({
      request: { method: 'POST', url: 'https://example.test/api', mode: 'navigate' },
    });
    expect(responded).toBe(false);
  });

  it('ignora peticiones a otros origenes (no roba ni cachea contenido ajeno)', () => {
    const sw = loadServiceWorker();
    const { responded } = sw.dispatch({
      request: { method: 'GET', url: 'https://tercero.ejemplo/pixel', mode: 'no-cors' },
    });
    expect(responded).toBe(false);
  });
});

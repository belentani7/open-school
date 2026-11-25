/**
 * tests/shell.dom.test.mjs — integración DOM de shell.js con jsdom:
 * tema, barra de progreso y paleta de búsqueda (camino feliz).
 * Ejecutar: node --test tests/shell.dom.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM } from 'jsdom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shellSrc = readFileSync(join(root, 'assets/js/shell.js'), 'utf8');

const FIXTURE_INDEX = [
  { title: 'Null safety en Kotlin', description: 'Tipos nulables', section: 'Lecciones', href: 'lecciones/null-safety.html' },
  { title: 'Gestión de memoria', description: 'GC y heap', section: 'Módulos', href: 'modulos/memoria.html' },
  { title: 'Rutas de aprendizaje', description: 'Itinerarios', section: 'Rutas', href: 'rutas/index.html' },
];

function pageHtml() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Prueba · Open School</title></head><body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="site-header"><div class="container">
  <div class="header-tools">
    <button class="icon-button" type="button" data-search-open aria-label="Buscar en la plataforma">Buscar</button>
    <button class="icon-button" type="button" data-theme-toggle aria-label="Cambiar tema">Tema</button>
  </div>
</div></header>
<main id="contenido"><p>Contenido</p></main>
<script src="./assets/js/shell.js"></script>
</body></html>`;
}

async function boot() {
  const dom = new JSDOM(pageHtml(), {
    url: 'https://campus.test/sobre.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  // jsdom no implementa fetch ni matchMedia: los sustituimos.
  let fetchCalls = [];
  window.fetch = (url) => {
    fetchCalls.push(String(url));
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(FIXTURE_INDEX),
    });
  };
  window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });

  await new Promise((resolve) => {
    if (window.document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  window.eval(shellSrc);
  return { dom, window, fetchCalls };
}

test('shell.js añade la barra de progreso de lectura', async () => {
  const { window } = await boot();
  const bar = window.document.querySelector('.reading-progress');
  assert.ok(bar, 'barra ausente');
  assert.equal(bar.getAttribute('aria-hidden'), 'true');
  assert.ok(bar.hasAttribute('data-progress'));
});

test('el botón de tema alterna y persiste en localStorage', async () => {
  const { window } = await boot();
  const doc = window.document;
  const btn = doc.querySelector('[data-theme-toggle]');

  // arranque: tema oscuro (matchMedia dice no-light)
  assert.equal(doc.documentElement.dataset.theme, 'dark');
  assert.equal(btn.getAttribute('aria-label'), 'Activar tema claro');

  btn.click();
  assert.equal(doc.documentElement.dataset.theme, 'light');
  assert.equal(window.localStorage.getItem('platform-theme'), 'light');
  assert.equal(btn.getAttribute('aria-label'), 'Activar tema oscuro');

  btn.click();
  assert.equal(doc.documentElement.dataset.theme, 'dark');
  assert.equal(window.localStorage.getItem('platform-theme'), 'dark');
});

test('Ctrl+K abre la paleta, busca y navega (camino feliz)', async () => {
  const { window, fetchCalls } = await boot();
  const doc = window.document;

  doc.dispatchEvent(new window.KeyboardEvent('keydown', {
    key: 'k', ctrlKey: true, bubbles: true, cancelable: true,
  }));

  // la apertura es asíncrona (fetch del índice)
  await new Promise((r) => setTimeout(r, 10));
  const dialog = doc.getElementById('os-palette');
  assert.ok(dialog, 'diálogo no creado');
  assert.ok(dialog.hasAttribute('open'), 'diálogo no abierto');
  assert.equal(fetchCalls.length, 1);
  assert.match(fetchCalls[0], /search-index\.json$/);

  const input = dialog.querySelector('input');
  assert.equal(doc.activeElement, input, 'el foco debe ir al input');

  // resultados iniciales (sin consulta → 12 máx.; hay 3)
  let results = dialog.querySelectorAll('.palette-results a');
  assert.equal(results.length, 3);

  // escribir consulta filtra sin distinguir acentos
  input.value = 'gestion';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 5));
  results = dialog.querySelectorAll('.palette-results a');
  assert.equal(results.length, 1, 'debe quedar "Gestión de memoria"');
  assert.match(results[0].getAttribute('href'), /modulos\/memoria\.html$/);
  assert.equal(results[0].querySelector('strong').textContent, 'Gestión de memoria');
  assert.equal(results[0].querySelector('.palette-section').textContent, 'Módulos');

  // navegación con teclado
  input.dispatchEvent(new window.KeyboardEvent('keydown', {
    key: 'ArrowDown', bubbles: true, cancelable: true,
  }));
  assert.equal(
    dialog.querySelector('.palette-results a').getAttribute('aria-current'),
    'true',
  );

  // sin coincidencias → mensaje
  input.value = 'zzz-no-existe';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 5));
  assert.ok(dialog.querySelector('.palette-empty'));

  // botón de cierre
  dialog.querySelector('.palette-close').click();
  assert.ok(!dialog.hasAttribute('open'));
});

test('el botón [data-search-open] abre la paleta', async () => {
  const { window } = await boot();
  const doc = window.document;
  doc.querySelector('[data-search-open]').click();
  await new Promise((r) => setTimeout(r, 10));
  assert.ok(doc.getElementById('os-palette').hasAttribute('open'));
});

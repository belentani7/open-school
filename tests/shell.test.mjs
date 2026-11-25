/**
 * tests/shell.test.mjs — pruebas unitarias del núcleo puro de shell.js
 * (normalize, filterItems, siteRootFromSrc) con el runner nativo de Node.
 * Ejecutar: node --test tests/
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'assets/js/shell.js'), 'utf8');

// shell.js expone el núcleo sin tocar el DOM.
globalThis.document = undefined;
(0, eval)(src);
const shell = globalThis.__osShell;

test('shell.js expone globalThis.__osShell', () => {
  assert.ok(shell, 'núcleo no expuesto');
  assert.equal(typeof shell.normalize, 'function');
  assert.equal(typeof shell.filterItems, 'function');
  assert.equal(typeof shell.siteRootFromSrc, 'function');
});

test('normalize elimina acentos y diacríticos', () => {
  assert.equal(shell.normalize('móvil'), 'movil');
  assert.equal(shell.normalize('Niño'), 'nino');
  assert.equal(shell.normalize('café'), 'cafe');
  assert.equal(shell.normalize('ÁÉÍÓÚ Ü'), 'aeiou u');
  assert.equal(shell.normalize('MÓVIL'), 'movil');
});

test('normalize conserva dígitos, espacios y signos', () => {
  assert.equal(shell.normalize('123'), '123');
  assert.equal(shell.normalize('a-b c'), 'a-b c');
  assert.equal(shell.normalize(''), '');
  assert.equal(shell.normalize(null), '');
  assert.equal(shell.normalize(undefined), '');
});

test('filterItems sin consulta devuelve los primeros 12', () => {
  const items = Array.from({ length: 30 }, (_, i) => ({
    title: `Item ${i}`, description: '', section: 'Sección', href: `p${i}.html`,
  }));
  const got = shell.filterItems(items, '');
  assert.equal(got.length, 12);
  assert.equal(got[0].title, 'Item 0');
});

test('filterItems con consulta limita a 20 resultados', () => {
  const items = Array.from({ length: 40 }, (_, i) => ({
    title: `android ${i}`, description: '', section: '', href: `a${i}.html`,
  }));
  const got = shell.filterItems(items, 'android');
  assert.equal(got.length, 20);
});

test('filterItems busca sin distinguir acentos', () => {
  const items = [
    { title: 'Gestión de memoria', description: 'Malloc y free', section: 'Módulos', href: 'a.html' },
    { title: 'Arquitectura', description: 'Componentes', section: 'Rutas', href: 'b.html' },
  ];
  assert.equal(shell.filterItems(items, 'gestion').length, 1);
  assert.equal(shell.filterItems(items, 'GESTIÓN')[0].href, 'a.html');
  assert.equal(shell.filterItems(items, 'memoria')[0].href, 'a.html');
});

test('filterItems busca también en sección y href', () => {
  const items = [
    { title: 'Otro', description: '', section: 'Lecciones', href: 'lecciones/x.html' },
    { title: 'Otro2', description: '', section: 'Rutas', href: 'rutas/y.html' },
  ];
  assert.equal(shell.filterItems(items, 'lecciones').length, 1);
  assert.equal(shell.filterItems(items, 'rutas/y')[0].href, 'rutas/y.html');
});

test('filterItems sin coincidencias devuelve [] y tolera basura', () => {
  assert.deepEqual(shell.filterItems([], 'x'), []);
  assert.deepEqual(shell.filterItems(null, 'x'), []);
  assert.deepEqual(
    shell.filterItems([{ title: 'Solo' }], 'zzz-no-existe'),
    [],
  );
});

test('siteRootFromSrc deriva la raíz del sitio', () => {
  assert.equal(
    shell.siteRootFromSrc('https://x.test/assets/js/shell.js'),
    'https://x.test/',
  );
  assert.equal(
    shell.siteRootFromSrc('https://x.test/lecciones/assets/js/shell.js?v=3'),
    'https://x.test/lecciones/',
  );
  assert.equal(
    shell.siteRootFromSrc('./assets/js/shell.js'),
    './',
  );
  assert.equal(
    shell.siteRootFromSrc('../assets/js/shell.js#x'),
    '../',
  );
});

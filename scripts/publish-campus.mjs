// Publish only reviewed, public campus resources into the Vite output.
// The React application remains the primary entrypoint; /campus/index.html
// is a separate static learning area, not a replacement for the SPA.
import { copyFileSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'campus');
const destination = join(root, 'dist', 'client', 'campus');

const files = [
  'index.html',
  'tokens.css',
  'app.js',
  'sw.js',
  'manifest.webmanifest',
  'cursos/ciberseguridad-5-anios/syllabus.md',
  'cursos/ciberseguridad-5-anios/recursos.md',
  'cursos/ciberseguridad-5-anios/semana-01.md',
  'cursos/ciberseguridad-5-anios/semana-02.md',
  'cursos/ciberseguridad-5-anios/semana-03.md',
  'cursos/ciberseguridad-5-anios/quiz.json',
  'voces/bienvenida-pt.mp3',
  'voces/bienvenida-es.mp3',
  'voces/bienvenida-en.mp3',
  'voces/bienvenida-ca.mp3',
];

if (!existsSync(join(root, 'dist', 'client', 'index.html'))) {
  throw new Error('Vite must finish building the React app before publishing the campus');
}

for (const relative of files) {
  const origin = join(source, relative);
  if (!existsSync(origin) || !lstatSync(origin).isFile()) {
    throw new Error('Required public campus asset not found: ' + relative);
  }
  const target = join(destination, relative);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(origin, target);
}

console.log('Campus HTML published: ' + files.length + ' reviewed resources');

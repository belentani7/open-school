#!/usr/bin/env node
/* ===================================================================
   build-biblia.mjs — regenera client/src/lib/biblia.ts.

   Entrada: docs/BIBLIA_TERMINOS_DESARROLLO.md (fuente unica).
   Salida:  client/src/lib/biblia.ts.

   No editar biblia.ts a mano: el siguiente build lo pisaria. Las
   definiciones se corrigen en el markdown y se vuelve a lanzar esto.

   El mapa CURSO se valida ANTES de escribir nada: una ruta o un termino
   que no exista aborta el script en vez de producir un enlace roto.

   Uso:  node client/scripts/build-biblia.mjs
     o:  npm run build:biblia
   =================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const MD = path.join(RAIZ, 'docs', 'BIBLIA_TERMINOS_DESARROLLO.md');
const OUT = path.join(RAIZ, 'client', 'src', 'lib', 'biblia.ts');

const ROUTES = new Set([
  'lingua-aberta',
  'secure-t',
  'ux-academy',
  'manos-abiertas',
  'creative-tech',
  'agent-systems',
]);

const CURSO = {
  'ux-academy': [
    'UX', 'UI', 'IxD', 'IA', 'Design', 'Wireframe', 'Mockup', 'Prototype',
    'User Story', 'Epic', 'Feature', 'Backlog', 'Roadmap', 'POC', 'KPI', 'OKR',
  ],
  'secure-t': [
    'SAST', 'DAST', 'IAST', 'SCA', 'SBOM', 'SDLC', 'SSDF', 'SLSA',
    'ZTA', 'CSPM', 'SIEM', 'SOAR', 'WAF', 'VPN', 'SSL', 'TLS',
    'HTTPS', 'NAT', 'FMEA', 'DevSecOps', 'TDD',
    'Unit Test', 'Integration Test', 'E2E', 'UAT', 'SIT', 'PenTest',
    'Load Test', 'Stress Test',
  ],
  'lingua-aberta': ['PWA', 'HTML', 'CSS', 'SPA'],
  'creative-tech': ['Code Splitting', 'Tree Shaking', 'Lazy Loading', 'HMR'],
  'agent-systems': [
    'API', 'REST', 'GraphQL', 'gRPC', 'JSON', 'YAML',
    'WebSocket', 'SSE', 'CLI', 'SDK', 'AIOps', 'MLOps', 'DevOps', 'SRE',
  ],
  'manos-abiertas': [
    'SQL', 'NoSQL', 'RDBMS', 'ORM', 'ACID', 'CRUD', 'ERD',
    'IaC', 'Terraform', 'Docker', 'CI/CD', 'Agile', 'Scrum', 'Kanban',
  ],
};

const CAT_META = {
  'T\u00c9RMINOS FUNDAMENTALES': ['Los acr\u00f3nimos que ordenan un proyecto de software. Si dos personas discuten y no comparten estas siglas, la discusi\u00f3n no es t\u00e9cnica: es de vocabulario.', '\u25c6'],
  'DOCUMENTOS DE PRODUCTO': ['Qu\u00e9 se escribe antes de programar: qu\u00e9 se construye, para qui\u00e9n, y c\u00f3mo se sabe que est\u00e1 terminado.', '\u25a4'],
  'DOCUMENTOS T\u00c9CNICOS': ['Los artefactos que explican c\u00f3mo se va a construir el sistema, con detalle suficiente para que otro lo mantenga.', '\u25eb'],
  'ARQUITECTURA': ['Los estilos de organizar un sistema. Elegir arquitectura es decidir qu\u00e9 duele cambiar m\u00e1s adelante.', '\u25a6'],
  'TESTING': ['Las capas de prueba y qu\u00e9 encuentra cada una. Probar no es lo mismo que comprobar.', '\u25ce'],
  'SEGURIDAD': ['Las pr\u00e1cticas que evitan que el software sea la puerta de entrada de alguien.', '\u2b21'],
  'INFRAESTRUCTURA': ['La parte que no es c\u00f3digo pero de la que depende todo: contenedores, redes, despliegue.', '\u2b22'],
  'PROTOCOLOS': ['C\u00f3mo viajan los datos. Un protocolo es un acuerdo, y un acuerdo mal entendido rompe sistemas.', '\u21c4'],
  'BASES DE DATOS': ['C\u00f3mo se guardan y se recuperan los datos, y qu\u00e9 garantiza cada modelo al hacerlo.', '\u25a9'],
  'DESARROLLO WEB': ['El vocabulario del navegador: del documento a la aplicaci\u00f3n, y las decisiones de rendimiento que las separan.', '\u25c8'],
  'CALIDAD Y PROCESO': ['M\u00e9todos para medir y mejorar. Sin medida, \u00abmejorar\u00bb es una opini\u00f3n.', '\u2696'],
  'METODOLOG\u00cdAS': ['Formas de organizar el trabajo. Todas funcionan si el equipo las aplica de verdad.', '\u25c9'],
  'T\u00c9RMINOS DE C\u00d3DIGO': ['El d\u00eda a d\u00eda: el editor, el control de versiones y los principios que gu\u00edan decisiones.', '\u25d0'],
  'PATRONES DE DISE\u00d1O': ['Soluciones reutilizables a problemas de dise\u00f1o que ya se resolvieron mil veces antes que t\u00fa.', '\u25c6'],
  'DATOS Y ANAL\u00cdTICA': ['C\u00f3mo se mueven y se explotan los datos: del origen al an\u00e1lisis que decide.', '\u25a4'],
  'LENGUAJES Y ECOSISTEMA': ['Las herramientas que rodean al c\u00f3digo: empaquetadores, compiladores y gesti\u00f3n de dependencias.', '\u25c8'],
  'CONCURRENCIA Y ASINCRON\u00cdA': ['Hacer varias cosas a la vez sin corromper el estado. Aqu\u00ed viven los errores m\u00e1s caros de depurar.', '\u21bb'],
  'INTELIGENCIA ARTIFICIAL': ['El vocabulario de los modelos, los datos y los agentes. Si se usa sin precisi\u00f3n, enga\u00f1a.', '\u2b21'],
  'PRODUCTO Y NEGOCIO': ['Las m\u00e9tricas y roles que traducen ingenier\u00eda en valor medible.', '\u25a9'],
  'PRIVACIDAD Y LEGAL': ['Lo que te pueden reclamar: datos personales, licencias y cumplimiento.', '\u2696'],
  'ACCESIBILIDAD E INTERNACIONALIZACI\u00d3N': ['Que el producto lo use todo el mundo, incluida la persona que no puede o\u00edr o no lee tu idioma.', '\u25ce'],
  'RENDIMIENTO Y OBSERVABILIDAD': ['Medir para poder mejorar: latencia, estabilidad y qu\u00e9 pasa dentro del sistema.', '\u25d0'],
  'RELEASE Y DESPLIEGUE': ['C\u00f3mo llega el c\u00f3digo a producci\u00f3n sin romper nada, y c\u00f3mo se vuelve atr\u00e1s si lo rompe.', '\u2b22'],
};

// --- 1. Parsear el markdown ---------------------------------------
const raw = fs.readFileSync(MD, 'utf8');
const categorias = [];
let cur = null;

for (const line of raw.split(/\r?\n/)) {
  const h = line.match(/^##\s+(.+?)\s*$/);
  if (h) {
    cur = { categoria: h[1].trim(), terminos: [] };
    categorias.push(cur);
    continue;
  }
  if (!cur) continue;
  const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/);
  if (m) {
    cur.terminos.push({
      abrev: m[1].trim(),
      nombre: m[2].trim(),
      significado: m[3].trim(),
    });
  }
}

const totalTerminos = categorias.reduce((n, c) => n + c.terminos.length, 0);

// --- 2. Validar el mapa de cursos --------------------------------
const idx = new Map();
for (const c of categorias) {
  for (const t of c.terminos) {
    if (!idx.has(t.abrev)) idx.set(t.abrev, []);
    idx.get(t.abrev).push([c.categoria, t]);
  }
}

const errores = [];
const mapa = {};
for (const [ruta, claves] of Object.entries(CURSO)) {
  if (!ROUTES.has(ruta)) errores.push(`ruta inexistente: ${ruta}`);
  for (const k of claves) {
    if (!idx.has(k)) errores.push(`termino inexistente: '${k}' -> ${ruta}`);
    else if (k in mapa) errores.push(`termino duplicado: '${k}' (${mapa[k]} y ${ruta})`);
    else mapa[k] = ruta;
  }
}

if (errores.length) {
  console.error('MAPA RECHAZADO:');
  for (const e of errores) console.error('   -', e);
  process.exit(1);
}

// --- 3. Emitir el modulo ------------------------------------------
const J = (s) => JSON.stringify(s);
const L = [];
const A = (s = '') => L.push(s);

A('/* ===================================================================');
A('   BIBLIA \u2014 ' + totalTerminos + ' t\u00e9rminos de desarrollo, navegables y buscables.');
A('');
A('   Origen \u00fanico: BIBLIA_TERMINOS_DESARROLLO.md (2026-09-28). Este');
A('   m\u00f3dulo es una proyecci\u00f3n de ese documento, no una copia divergente:');
A('   los t\u00e9rminos salen de ah\u00ed y las definiciones se corrigen ah\u00ed.');
A('   Para regenerarlo: client/scripts/build-biblia.mjs (ver docs/BIBLIA.md).');
A('');
A('   Lo que a\u00f1ade el formato de datos, y el markdown no puede:');
A('     \u00b7 buscar por sigla, nombre o texto de la definici\u00f3n');
A('     \u00b7 filtrar por categor\u00eda sin recargar la p\u00e1gina');
A('     \u00b7 enlazar un t\u00e9rmino con el curso donde se usa de verdad');
A('     \u00b7 distinguir siglas que el original usa en dos sentidos');
A('   =================================================================== */');
A('');
A('export type Termino = {');
A('  /** Sigla o clave, tal como aparece en la tabla original. */');
A('  abrev: string;');
A('  nombre: string;');
A('  significado: string;');
A('  /** Id de ruta del cat\u00e1logo donde el t\u00e9rmino se usa de forma real. */');
A('  curso?: string;');
A('};');
A('');
A('export type Categoria = {');
A('  /** Nombre exacto de la secci\u00f3n en el documento original. */');
A('  id: string;');
A('  /** Una l\u00ednea de contexto: para qu\u00e9 sirve esta categor\u00eda. */');
A('  glosa: string;');
A('  glifo: string;');
A('  terminos: Termino[];');
A('};');
A('');
A('export type TerminoIndexado = Termino & { categoria: string };');
A('');
A('/**');
A(' * T\u00e9rminos enlazados a un curso (ids de client/src/lib/catalog.ts).');
A(' *');
A(' * Solo cursos reales: una entrada aqui que no exista en ROUTES se');
A(' * convierte en un enlace roto en pantalla.');
A(' */');
A('export const CURSO: Record<string, string> = ' + JSON.stringify(sortObj(mapa), null, 2) + ';');
A('');
A('export const CATEGORIAS: Categoria[] = [');

let n_enlazados = 0;
for (const c of categorias) {
  const [glosa, glifo] = CAT_META[c.categoria];
  A('  {');
  A('    id: ' + J(c.categoria) + ',');
  A('    glosa: ' + J(glosa) + ',');
  A('    glifo: ' + J(glifo) + ',');
  A('    terminos: [');
  for (const t of c.terminos) {
    A('      {');
    A('        abrev: ' + J(t.abrev) + ',');
    if (t.abrev in mapa) {
      A('        curso: ' + J(mapa[t.abrev]) + ',');
      n_enlazados += 1;
    }
    A('        nombre: ' + J(t.nombre) + ',');
    A('        significado: ' + J(t.significado) + ',');
    A('      },');
  }
  A('    ],');
  A('  },');
}
A('];');
A('');
A('/* --- \u00cdndices: se calculan una vez al cargar el m\u00f3dulo. --- */');
A('');
A('/** Todos los t\u00e9rminos, aplanados, con el nombre de su categor\u00eda. */');
A('export const TODOS: TerminoIndexado[] = CATEGORIAS.flatMap((c) =>');
A('  c.terminos.map((t) => ({ ...t, categoria: c.id })),');
A(');');
A('');
A('/**');
A(' * Siglas que el documento original usa en m\u00e1s de un sentido.');
A(' *');
A(' * TDD es el caso real: en T\u00c9RMINOS FUNDAMENTALES es *Test-Driven');
A(' * Development* y en DOCUMENTOS T\u00c9CNICOS es *Technical Design Document*.');
A(' * Sin este aviso, getTermino(\'TDD\') devolver\u00eda uno de los dos en');
A(' * silencio y la p\u00e1gina ense\u00f1ar\u00eda la definici\u00f3n equivocada.');
A(' */');

const ambiguos = {};
for (const k of [...idx.keys()].sort()) {
  if (idx.get(k).length > 1) ambiguos[k] = idx.get(k).map(([cat]) => cat);
}
A('export const AMBIGUOS: Record<string, string[]> = ' + JSON.stringify(ambiguos, null, 2) + ';');
A('');
A('/* Normalizar para buscar: min\u00fasculas y sin diacr\u00edticos.');
A('');
A('   No es una precauci\u00f3n te\u00f3rica. Las siglas y los nombres son ingl\u00e9s, pero');
A('   las definiciones est\u00e1n en espa\u00f1ol y muchos de los ' + totalTerminos + ' t\u00e9rminos llevan');
A('   tilde: sin esto, escribir "diseno" no encuentra "dise\u00f1o", que es');
A('   justo lo que se escribe en un teclado sin tilde. Exportado para poder');
A('   probarlo sin inventar t\u00e9rminos. */');
A('export const normalizar = (s: string): string =>');
A('  s.toLowerCase().normalize(\'NFD\').replace(/[\\u0300-\\u036f]/g, \'\');');
A('');
A('export const BIBLIA_TOTAL = TODOS.length;');
A('export const CATEGORIA_TOTAL = CATEGORIAS.length;');
A('');
A('/**');
A(' * Busca por sigla, nombre o definici\u00f3n. Los tokens se comparan todos:');
A(' * \'api rest\' encuentra t\u00e9rminos que mencionen ambos.');
A(' *');
A(' * Ordena por relevancia, no por orden del documento: quien busca una');
A(' * sigla la quiere arriba. Sin esto, \'api\' devolver\u00eda API perdida entre');
A(' * treinta resultados que solo la mencionan de pasada.');
A(' */');
A('export function buscar(texto: string, categoria?: string): TerminoIndexado[] {');
A('  const ambito = categoria');
A('    ? CATEGORIAS.filter((c) => c.id === categoria)');
A('    : CATEGORIAS;');
A('  const tokens = normalizar(texto).split(/\\s+/).filter(Boolean);');
A('');
A('  if (tokens.length === 0) {');
A('    return ambito.flatMap((c) => c.terminos.map((t) => ({ ...t, categoria: c.id })));');
A('  }');
A('');
A('  const puntuados: { t: TerminoIndexado; r: number }[] = [];');
A('  for (const c of ambito) {');
A('    for (const t of c.terminos) {');
A('      const sigla = normalizar(t.abrev);');
A('      const cuerpo = normalizar(`${t.nombre} ${t.significado}`);');
A('      const enSigla = tokens.every((tk) => sigla.includes(tk));');
A('      const enCuerpo = tokens.every((tk) => cuerpo.includes(tk));');
A('      if (!enSigla && !enCuerpo) continue;');
A('');
A('      // Menor rango = m\u00e1s arriba. La sigla exacta gana a la que solo');
A('      // empieza igual, y esa gana a la que la contiene en medio.');
A('      let r = 3;');
A('      if (enSigla) {');
A('        const consulta = tokens.join(\' \');');
A('        r = sigla === consulta ? 0 : sigla.startsWith(tokens[0]) ? 1 : 2;');
A('      }');
A('      puntuados.push({ t: { ...t, categoria: c.id }, r });');
A('    }');
A('  }');
A('');
A('  // `sort` es estable: dentro del mismo rango se respeta el orden del');
A('  // documento, as\u00ed que dos siglas igual de buenas salen alfab\u00e9ticas.');
A('  puntuados.sort((a, b) => a.r - b.r);');
A('  return puntuados.map((p) => p.t);');
A('}');
A('');
A('/**');
A(' * Un t\u00e9rmino por sigla. Si la sigla es ambigua hay que pasar');
A(' * `categoria`: sin ella devuelve el primero y el orden decide, no t\u00fa.');
A(' */');
A('export function getTermino(abrev: string, categoria?: string): TerminoIndexado | undefined {');
A('  return TODOS.find(');
A('    (t) => normalizar(t.abrev) === normalizar(abrev) && (!categoria || t.categoria === categoria),');
A('  );');
A('}');
A('');
A('/** Todas las entradas de una sigla, para cuando hay que mostrar la ambig\u00fcedad. */');
A('export function getTerminos(abrev: string): TerminoIndexado[] {');
A('  return TODOS.filter((t) => normalizar(t.abrev) === normalizar(abrev));');
A('}');
A('');
A('/** Qu\u00e9 va justo antes y justo despu\u00e9s en la lista. */');
A('export function vecinos(abrev: string): { anterior?: TerminoIndexado; siguiente?: TerminoIndexado } {');
A('  const i = TODOS.findIndex((t) => normalizar(t.abrev) === normalizar(abrev));');
A('  if (i < 0) return {};');
A('  return {');
A('    anterior: i > 0 ? TODOS[i - 1] : undefined,');
A('    siguiente: i < TODOS.length - 1 ? TODOS[i + 1] : undefined,');
A('  };');
A('}');
A('');
A('/** Conteo por categor\u00eda, para las pestanas del filtro. */');
A('export const RECUENTO = new Map<string, number>(');
A('  CATEGORIAS.map((c) => [c.id, c.terminos.length]),');
A(');');

// Python json.dumps(..., sort_keys=True) ordena por clave; JSON.stringify
// respeta el orden de insercion, asi que hay que ordenar a mano.
function sortObj(obj) {
  const out = {};
  for (const k of Object.keys(obj).sort()) out[k] = obj[k];
  return out;
}

fs.writeFileSync(OUT, L.join('\n') + '\n', 'utf8');

console.log('escrito:', OUT);
console.log('categorias:', categorias.length);
console.log('terminos:', categorias.reduce((n, c) => n + c.terminos.length, 0));
console.log('enlazados a un curso:', n_enlazados);
console.log('siglas ambiguas:', [...idx.keys()].filter((k) => idx.get(k).length > 1));

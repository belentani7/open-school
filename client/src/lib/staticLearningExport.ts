import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { PUBLISHED_UNITS } from './courseUnits';
import { PLAZA_TRACKS } from './plazaContent';

type LearningPage = {
  file: string;
  title: string;
  body: string;
};

const COURSE_PAGE_LABELS = {
  start: 'Orientación',
  practice: 'Práctica',
  check: 'Evaluación',
  review: 'Revisión',
} as const;
const PLAZA_PAGE_LABELS = {
  overview: 'Objetivo',
  concept: 'Concepto',
  example: 'Caso',
  practice: 'Práctica',
  check: 'Evaluación',
  review: 'Revisión',
} as const;

export function escapeLearningHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeSegment(value: string): string {
  assert.match(value, /^[a-z0-9-]+$/, 'Path segments must be lowercase slugs: ' + value);
  return value;
}

function renderList(items: readonly string[]): string {
  return '<ul>' + items.map((item) => '<li>' + escapeLearningHtml(item) + '</li>').join('') + '</ul>';
}

function renderQuiz(quiz: {
  question: string;
  choices: readonly string[];
  correctIndex: number;
  explanation: string;
}): string {
  assert.ok(quiz.choices.length >= 2);
  assert.ok(quiz.correctIndex >= 0 && quiz.correctIndex < quiz.choices.length);
  return '<section class="assessment"><h2>Pregunta de comprobación</h2><p>' +
    escapeLearningHtml(quiz.question) + '</p><ol>' +
    quiz.choices.map((choice) => '<li>' + escapeLearningHtml(choice) + '</li>').join('') +
    '</ol></section>';
}

function coursePages(unit: (typeof PUBLISHED_UNITS)[number]): LearningPage[] {
  assert.ok(unit.title && unit.objective && unit.steps.length > 0, 'Incomplete published unit: ' + unit.title);
  for (const step of unit.steps) assert.ok(step.title && step.explanation && step.practice);
  const pages: LearningPage[] = [
    {
      file: '00-orientacion.html',
      title: COURSE_PAGE_LABELS.start,
      body: '<p class="lead">' + escapeLearningHtml(unit.objective) + '</p>' +
        '<p>Tiempo estimado: ' + escapeLearningHtml(unit.estimatedMinutes) + ' minutos.</p>',
    },
  ];
  unit.steps.forEach((step, index) => {
    pages.push({
      file: 'paso-' + String(index + 1).padStart(2, '0') + '.html',
      title: step.title,
      body: '<p>' + escapeLearningHtml(step.explanation) + '</p>',
    });
  });
  pages.push({
    file: 'practica.html',
    title: COURSE_PAGE_LABELS.practice,
    body: '<h2>Actividades transferibles</h2>' +
      renderList(unit.steps.map((step) => step.practice)) +
      '<p>Usa únicamente ejemplos ficticios; no incluyas documentos ni datos personales reales.</p>',
  });
  pages.push({
    file: 'evaluacion.html',
    title: COURSE_PAGE_LABELS.check,
    body: renderQuiz(unit.quiz),
  });
  pages.push({
    file: 'revision.html',
    title: COURSE_PAGE_LABELS.review,
    body: '<h2>Por qué importa</h2><p>' + escapeLearningHtml(unit.quiz.explanation) +
      '</p><h2>Traslada el aprendizaje</h2><p>Escribe qué comprobarías primero y qué harías si la información no fuera suficiente.</p>',
  });
  return pages;
}

function plazaPages(trackName: string, trackMinutes: number, lesson: (typeof PLAZA_TRACKS)[number]['lessons'][number]): LearningPage[] {
  assert.ok(lesson.title && lesson.objective && lesson.concept && lesson.example && lesson.practice);
  return [
    {
      file: '00-objetivo.html',
      title: PLAZA_PAGE_LABELS.overview,
      body: '<p class="lead">' + escapeLearningHtml(lesson.objective) + '</p><p>Itinerario: ' +
        escapeLearningHtml(trackName) + ' · ' + escapeLearningHtml(trackMinutes) + ' minutos.</p>',
    },
    { file: 'concepto.html', title: PLAZA_PAGE_LABELS.concept, body: '<p>' + escapeLearningHtml(lesson.concept) + '</p>' },
    { file: 'caso.html', title: PLAZA_PAGE_LABELS.example, body: '<blockquote>' + escapeLearningHtml(lesson.example) + '</blockquote>' },
    { file: 'practica.html', title: PLAZA_PAGE_LABELS.practice, body: '<p>' + escapeLearningHtml(lesson.practice) + '</p>' },
    { file: 'evaluacion.html', title: PLAZA_PAGE_LABELS.check, body: renderQuiz(lesson.quiz) },
    {
      file: 'revision.html',
      title: PLAZA_PAGE_LABELS.review,
      body: '<h2>Explicación</h2><p>' + escapeLearningHtml(lesson.quiz.explanation) +
        '</p><h2>Reflexión</h2><p>¿Qué parte de esta actividad puedes aplicar con información ficticia, sin compartir datos personales?</p>',
    },
  ];
}

function pageDocument({
  title,
  track,
  unit,
  pages,
  current,
  appHref,
}: {
  title: string;
  track: string;
  unit: string;
  pages: LearningPage[];
  current: LearningPage;
  appHref: string;
}): string {
  const nav = pages.map((page) =>
    '<li><a href="' + escapeLearningHtml(page.file) + '"' +
      (page.file === current.file ? ' aria-current="page"' : '') + '>' +
      escapeLearningHtml(page.title) + '</a></li>',
  ).join('');
  return [
    '<!doctype html>',
    '<html lang="es">',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="dark"><meta name="theme-color" content="#000000">',
    '<meta name="description" content="' + escapeLearningHtml(title + ' · ' + track) + '">',
    '<title>' + escapeLearningHtml(title + ' · ' + current.title + ' · Open School') + '</title>',
    '<link rel="stylesheet" href="../../../learning-library.css"></head>',
    '<body><a class="skip" href="#main">Saltar al contenido</a>',
    '<header class="topbar"><a class="brand" href="../../../index.html">Open School<small>Biblioteca de aprendizaje</small></a>',
    '<a href="' + escapeLearningHtml(appHref) + '">Abrir experiencia interactiva</a></header>',
    '<main id="main" class="layout"><p class="eyebrow">' + escapeLearningHtml(track) + ' · ' + escapeLearningHtml(unit) + '</p>',
    '<h1>' + escapeLearningHtml(title) + '</h1>',
    '<nav class="step-nav" aria-label="Pasos de la lección"><ol>' + nav + '</ol></nav>',
    '<article class="glass"><h2>' + escapeLearningHtml(current.title) + '</h2>' + current.body + '</article>',
    '<div class="actions"><a class="button primary" href="' + escapeLearningHtml(appHref) + '">Continuar en Open School</a>',
    '<a class="button" href="../../../index.html">Volver a la biblioteca</a></div></main>',
    '<footer class="site-footer">Open School · Material educativo abierto · Progreso local</footer></body></html>',
  ].join('\n');
}

const CSS = [
  ':root{color-scheme:dark;--obsidian:#000;--rock:#030328;--rock2:#06062e;--helio:#9e86ff;--helioHi:#c3b3ff;--aula:#6be7f3;--ink:#fff;--muted:#a8a8b8;--line:rgba(255,255,255,.16);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}',
  '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;background:radial-gradient(70rem 38rem at 12% -10%,rgba(158,134,255,.12),transparent 60%),linear-gradient(145deg,var(--obsidian),var(--rock));color:var(--ink);font-size:1rem;line-height:1.7}',
  'a{color:var(--helioHi);text-underline-offset:.2em}a:hover{color:var(--aula)}:focus-visible{outline:3px solid var(--aula);outline-offset:4px}',
  '.skip{position:absolute;z-index:10;top:-8rem;left:1rem;padding:.75rem 1rem;border-radius:1rem;background:var(--ink);color:var(--obsidian)}.skip:focus{top:1rem}',
  '.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1rem,5vw,4rem);border-bottom:1px solid var(--line);background:rgba(0,0,0,.82)}.brand{color:var(--ink);font-weight:800;letter-spacing:.08em;text-decoration:none}.brand small{display:block;color:var(--muted);font-size:.72rem;font-weight:500;letter-spacing:0}',
  '.layout{width:min(100% - 2rem,58rem);margin:clamp(2rem,6vw,5rem) auto}.eyebrow{color:var(--aula);font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}h1{max-width:22ch;font-size:clamp(2rem,5vw,3.6rem);line-height:1.08;letter-spacing:-.04em}h2{font-size:1.3rem;line-height:1.25}',
  '.glass,.summary{padding:clamp(1.1rem,4vw,2rem);border:1px solid var(--line);border-radius:1.5rem;background:rgba(10,10,24,.82);box-shadow:0 20px 60px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.025)}.glass p,.glass li{max-width:72ch}.glass li{margin:.55rem 0}.lead,.summary{color:#ecebfa;font-size:1.08rem}',
  '.glass blockquote{margin:0;padding:1rem 1.2rem;border-left:3px solid var(--aula);background:rgba(107,231,243,.06)}.assessment{margin-top:1rem;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(255,255,255,.025)}',
  '.step-nav{margin:1.25rem 0}.step-nav ol{display:flex;flex-wrap:wrap;gap:.5rem;padding:0;list-style:none}.step-nav a,.button{display:inline-flex;padding:.55rem .8rem;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.035);text-decoration:none}.step-nav a[aria-current=page]{border-color:var(--helio);color:var(--ink)}.actions{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.3rem 0}.button.primary{border-color:var(--helio);background:var(--helio);color:var(--obsidian);font-weight:800}',
  '.catalogue{display:grid;gap:.75rem;margin:0;padding:0;list-style:none}.catalogue li{padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(10,10,24,.82)}.catalogue p{margin:.35rem 0;color:var(--muted)}',
  '.site-footer{padding:1.2rem clamp(1rem,5vw,4rem);border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}',
  '@media(max-width:38rem){.topbar{align-items:flex-start;flex-direction:column}.layout{margin-top:1.4rem}.step-nav ol{display:grid;grid-template-columns:1fr 1fr}}',
  '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media(prefers-contrast:more){:root{--line:rgba(255,255,255,.55);--muted:#d1d1df}.glass,.catalogue li{background:#000}}',
  '@media print{body{background:#fff;color:#111}.topbar,.step-nav,.actions,.site-footer,.skip{display:none}.layout{width:100%;margin:0}.glass{border:0;padding:0;background:#fff;box-shadow:none}a{color:inherit}}',
].join('\n');

function writeLearningPage(root: string, relativePath: string, pages: LearningPage[], page: LearningPage, appHref: string, title: string, track: string, unit: string) {
  const target = resolve(root, relativePath);
  assert.ok(target.startsWith(root + sep), 'Generated page escaped the output root');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, pageDocument({ title, track, unit, pages, current: page, appHref }));
  return relativePath;
}

export function generateLearningLibrary(outputDirectory: string) {
  const root = resolve(outputDirectory);
  mkdirSync(root, { recursive: true });
  const manifestPath = join(root, 'manifest.json');
  if (existsSync(manifestPath)) {
    const old = JSON.parse(readFileSync(manifestPath, 'utf8')) as { files?: string[] };
    for (const file of old.files ?? []) {
      const target = resolve(root, file);
      if (target.startsWith(root + sep) && existsSync(target)) rmSync(target, { force: true });
    }
  }

  const generatedFiles = ['learning-library.css'];
  writeFileSync(join(root, 'learning-library.css'), CSS);

  const courseEntries: string[] = [];
  const courseGroups = new Map<string, typeof PUBLISHED_UNITS[number][]>();
  for (const unit of PUBLISHED_UNITS) {
    const routeId = safeSegment(unit.routeId);
    courseGroups.set(routeId, [...(courseGroups.get(routeId) ?? []), unit]);
  }

  let coursePageCount = 0;
  for (const [routeId, units] of courseGroups) {
    units.forEach((unit, unitIndex) => {
      const unitDir = 'courses/' + routeId + '/unit-' + String(unitIndex + 1).padStart(2, '0');
      const pages = coursePages(unit);
      const appHref = '../../../../courses/' + routeId;
      courseEntries.push('<li><a href="' + escapeLearningHtml(unitDir + '/' + pages[0].file) + '">' +
        escapeLearningHtml(unit.title) + '</a><p>' + escapeLearningHtml(unit.objective) + '</p><span>' +
        escapeLearningHtml(unit.estimatedMinutes) + ' min · ' + routeId + '</span></li>');
      pages.forEach((page) => {
        generatedFiles.push(writeLearningPage(root, unitDir + '/' + page.file, pages, page, appHref, unit.title, routeId, 'Unidad ' + (unitIndex + 1)));
        coursePageCount += 1;
      });
    });
  }

  const plazaEntries: string[] = [];
  let plazaPageCount = 0;
  for (const track of PLAZA_TRACKS) {
    const trackId = safeSegment(track.id);
    for (const lesson of track.lessons) {
      const lessonId = safeSegment(lesson.id);
      const unitDir = 'plaza/' + trackId + '/' + lessonId;
      const pages = plazaPages(track.name, track.minutes, lesson);
      const appHref = '../../../../plaza';
      plazaEntries.push('<li><a href="' + escapeLearningHtml(unitDir + '/' + pages[0].file) + '">' +
        escapeLearningHtml(lesson.title) + '</a><p>' + escapeLearningHtml(lesson.objective) + '</p><span>' +
        escapeLearningHtml(track.name) + ' · ' + escapeLearningHtml(track.level) + '</span></li>');
      pages.forEach((page) => {
        generatedFiles.push(writeLearningPage(root, unitDir + '/' + page.file, pages, page, appHref, lesson.title, track.name, 'Unidad ' + lesson.id));
        plazaPageCount += 1;
      });
    }
  }

  const pageCount = coursePageCount + plazaPageCount;
  assert.ok(pageCount >= 200, 'Open School HTML publication below platform minimum: ' + pageCount + '/200');
  assert.equal(new Set(generatedFiles).size, generatedFiles.length, 'Generated paths must be unique');
  const index = [
    '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="dark"><title>Biblioteca de aprendizaje · Open School</title>',
    '<link rel="stylesheet" href="learning-library.css"></head><body>',
    '<a class="skip" href="#main">Saltar al contenido</a>',
    '<header class="topbar"><a class="brand" href="../">Open School<small>Aprender sin dar un solo dato</small></a></header>',
    '<main id="main" class="layout"><p class="eyebrow">Contenido original publicado</p><h1>Biblioteca de aprendizaje</h1>',
    '<p class="summary">Accede a los materiales ya disponibles por páginas independientes: objetivo, estudio, práctica y evaluación. No incluyas datos personales en los ejercicios.</p>',
    '<section><h2>Unidades evaluables</h2><ol class="catalogue">' + courseEntries.join('') + '</ol></section>',
    '<section><h2>Plaza educativa</h2><ol class="catalogue">' + plazaEntries.join('') + '</ol></section>',
    '</main><footer class="site-footer">Open School · material educativo abierto · sin cuenta obligatoria</footer></body></html>',
  ].join('\n');
  writeFileSync(join(root, 'index.html'), index);
  generatedFiles.push('index.html');
  const manifest = { courseUnits: PUBLISHED_UNITS.length, plazaUnits: PLAZA_TRACKS.reduce((sum, track) => sum + track.lessons.length, 0), coursePageCount, plazaPageCount, pageCount, files: generatedFiles };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

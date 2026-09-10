/* ===================================================================
   CATALOGO — datos de las rutas de aprendizaje.

   NOTA DE INTEGRIDAD: la version anterior mostraba "18.5K estudiantes"
   y "4.7 estrellas" en un repositorio publico sin ninguna plataforma en
   produccion detras. Prueba social inventada en un repo que sirve de
   portafolio: si alguien lo verifica, cuesta mas de lo que aporta.

   Aqui solo hay metricas estructurales — modulos, horas, nivel, idiomas,
   licencia — que se comprueban leyendo el propio contenido del curso.
   Cuando haya matriculas reales, se añaden desde la API, no a mano.
   =================================================================== */

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type Route = {
  id: string;
  /** Una palabra. La que define la ruta (P1). */
  word: string;
  title: string;
  claim: string;
  desc: string;
  level: Level;
  modules: number;
  hours: number;
  langs: string[];
  stack: string[];
  /** Funciona sin conexion una vez cacheada. */
  offline: boolean;
  /** Emite certificado verificable. */
  certified: boolean;
  status: 'produccion' | 'beta' | 'construccion';
};

export const ROUTES: Route[] = [
  {
    id: 'lingua-aberta',
    word: 'FONÉTICA',
    title: 'Lingua Aberta',
    claim: 'El idioma como puerta, no como examen',
    desc: 'Adquisición de lengua para quien acaba de llegar. Fonética contrastiva PT/ES/CA, escucha activa y producción oral desde la primera sesión. El motor de voz corre en el navegador: sin cuenta, sin subir audio a ningún servidor.',
    level: 'A1',
    modules: 24,
    hours: 96,
    langs: ['PT', 'ES', 'EN', 'CA'],
    stack: ['Web Speech API', 'IndexedDB', 'Ollama local'],
    offline: true,
    certified: true,
    status: 'produccion',
  },
  {
    id: 'secure-t',
    word: 'AUTONOMÍA',
    title: 'Secure-T',
    claim: 'Privacidad para quien más la necesita',
    desc: 'Seguridad digital aplicada a la vida real de una persona migrante: documentación, dispositivos compartidos, banca, fronteras. Universidad anónima — identificador UUID de 365 días, cero datos personales, cero rastreo.',
    level: 'A2',
    modules: 69,
    hours: 210,
    langs: ['ES', 'PT', 'EN'],
    stack: ['Labs en navegador', 'MITRE ATT&CK', 'UUID anónimo'],
    offline: true,
    certified: true,
    status: 'beta',
  },
  {
    id: 'ux-academy',
    word: 'DISEÑAR',
    title: 'UX Academy',
    claim: 'Del boceto al portafolio defendible',
    desc: 'Investigación, arquitectura de información y accesibilidad con evaluación formativa continua. Termina en un capstone trilingüe revisado por pares y un certificado verificable por QR.',
    level: 'B1',
    modules: 12,
    hours: 84,
    langs: ['ES', 'PT', 'EN'],
    stack: ['Figma', 'WCAG 2.2', 'Revisión por pares'],
    offline: false,
    certified: true,
    status: 'produccion',
  },
  {
    id: 'manos-abiertas',
    word: 'PUENTE',
    title: 'Manos Abiertas',
    claim: 'Acompañar el aterrizaje',
    desc: 'Trámites, derechos, sanidad, vivienda y empleo en Cataluña, explicados en lengua sencilla y con las plantillas ya rellenables. Pensado para leerse en un móvil prestado, con prisa y con datos limitados.',
    level: 'A1',
    modules: 18,
    hours: 40,
    langs: ['ES', 'CA', 'PT', 'EN'],
    stack: ['Lectura fácil', 'PWA offline', 'Plantillas PDF'],
    offline: true,
    certified: false,
    status: 'produccion',
  },
  {
    id: 'creative-tech',
    word: 'TIMBRE',
    title: 'Creative Tech',
    claim: 'El código también es un instrumento',
    desc: 'Síntesis de audio, gráfica generativa y shaders. Se entra por el oído y por el ojo, y se sale sabiendo leer una señal, un bucle de render y un presupuesto de milisegundos por frame.',
    level: 'A2',
    modules: 16,
    hours: 72,
    langs: ['ES', 'PT'],
    stack: ['Web Audio', 'Canvas 2D', 'GLSL'],
    offline: true,
    certified: false,
    status: 'construccion',
  },
  {
    id: 'agent-systems',
    word: 'ORQUESTA',
    title: 'Sistemas de Agentes',
    claim: 'Automatizar sin delegar el criterio',
    desc: 'Cómo se construye un agente que usa herramientas, cuándo conviene y — sobre todo — cuándo no. Incluye el coste real por token, los modos de fallo y por qué la revisión humana sigue siendo parte del sistema.',
    level: 'B2',
    modules: 20,
    hours: 110,
    langs: ['ES', 'EN'],
    stack: ['MCP', 'Tool use', 'Evaluación'],
    offline: false,
    certified: true,
    status: 'construccion',
  },
];

/* --- Metricas derivadas: se calculan, no se escriben a mano. --- */
export const TOTALS = {
  routes: ROUTES.length,
  modules: ROUTES.reduce((n, r) => n + r.modules, 0),
  hours: ROUTES.reduce((n, r) => n + r.hours, 0),
  langs: [...new Set(ROUTES.flatMap((r) => r.langs))].length,
  offline: ROUTES.filter((r) => r.offline).length,
  certified: ROUTES.filter((r) => r.certified).length,
};

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const STATUS_LABEL: Record<Route['status'], string> = {
  produccion: 'En producción',
  beta: 'Beta abierta',
  construccion: 'En construcción',
};

export const getRoute = (id: string): Route | undefined =>
  ROUTES.find((r) => r.id === id);

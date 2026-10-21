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

import { PUBLISHED_UNITS } from './courseUnits';

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
  /** La ruta contempla certificación en su diseño; aquí todavía no se emiten certificados. */
  certified: boolean;
  status: 'produccion' | 'beta' | 'construccion';
};

export const ROUTES: Route[] = [
  {
    id: 'lingua-aberta',
    word: 'FONÉTICA',
    title: 'Lingua Aberta',
    claim: 'El idioma como puerta, no como examen',
    desc: 'Ruta prevista de adquisición de lengua para quien acaba de llegar: fonética contrastiva PT/ES/CA, escucha activa y producción oral. Aquí se ofrece una unidad evaluable introductoria; los módulos y el motor de voz completo siguen pendientes. No se exige cuenta para leer las unidades publicadas.',
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
    desc: 'Ruta prevista de seguridad digital para la vida real: documentación, dispositivos compartidos, banca y fronteras. Puedes estudiar las unidades introductorias publicadas con progreso local sin cuenta; el programa completo sigue en desarrollo.',
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
    desc: 'Unidades introductorias publicadas sobre investigación, arquitectura de información y accesibilidad. El capstone trilingüe, la revisión por pares y la certificación verificable por QR son objetivos del programa futuro; aquí todavía no se ofrecen.',
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
    desc: 'Unidades introductorias de trámites, derechos, sanidad, vivienda y empleo en Cataluña, explicadas en lengua sencilla. Las plantillas avanzadas y el itinerario completo están previstos, no disponibles en esta edición. La lectura está pensada para móvil y datos limitados.',
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
    desc: 'Introducción publicada a la tecnología creativa y al audio web. El itinerario previsto amplía síntesis, gráfica generativa y shaders hasta analizar señales, bucles de render y presupuestos por fotograma.',
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
    desc: 'Unidad introductoria evaluable sobre automatización segura e idempotencia. El itinerario previsto profundizará en agentes con herramientas, costes por token, modos de fallo y revisión humana; esas unidades avanzadas aún no están publicadas.',
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
  availableUnits: PUBLISHED_UNITS.length,
  modules: ROUTES.reduce((n, r) => n + r.modules, 0),
  hours: ROUTES.reduce((n, r) => n + r.hours, 0),
  langs: [...new Set(ROUTES.flatMap((r) => r.langs))].length,
  offline: ROUTES.filter((r) => r.offline).length,
  certified: ROUTES.filter((r) => r.certified).length,
};

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const STATUS_LABEL: Record<Route['status'], string> = {
  produccion: 'Ruta presentada',
  beta: 'Unidad piloto disponible',
  construccion: 'Programa en desarrollo',
};

export const getRoute = (id: string): Route | undefined =>
  ROUTES.find((r) => r.id === id);

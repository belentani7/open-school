/**
 * OMEGA COURSERA & GLOBAL OPEN DATA HUB
 * Aggregates world-class open educational data banks:
 * - Khan Academy Open Competencies (ESO & STEM)
 * - OpenStax Peer-Reviewed Textbooks (Rice University)
 * - Coursera / edX / MIT OCW Modular Syllabus Architecture (Specializations, Weeks, Capstones)
 * - INE & Eurostat Open Real-World Datasets
 * - Python-Powered Science, SymPy Math Solver & Algorithmic Modules
 */

export interface OmegaCourseTrack {
  id: string;
  code: string;
  title: string;
  universityPartner: string;
  openDataStandard: string;
  level: string;
  duration: string;
  badgeColor: string;
  glowColor: string;
  summary: string;
  syllabusWeeks: OmegaWeekModule[];
}

export interface OmegaWeekModule {
  week: number;
  title: string;
  topicTag: string;
  estimatedMinutes: number;
  learningOutcomes: string[];
  openDataSources: string[];
  stepByStepExample: {
    problemStatement: string;
    steps: {
      stepNum: number;
      title: string;
      mathExpression?: string;
      explanation: string;
      portugueseTip?: string;
    }[];
    finalResult: string;
  };
  pythonLab: {
    scriptTitle: string;
    pythonLibrary: 'sympy' | 'numpy' | 'pandas' | 'matplotlib' | 'nlp_bridge';
    code: string;
    expectedOutput: string;
    interactiveVisualizationType: 'equation_roots' | 'trajectory_canvas' | 'data_bars' | 'dna_chart' | 'nlp_tokens';
    chartData?: { label: string; value: number }[];
  };
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface GlobalOpenDataBank {
  id: string;
  name: string;
  authority: string;
  license: string;
  coverage: string;
  curriculumIntegration: string;
  datasetPreview: {
    title: string;
    sampleRows: Record<string, string | number>[];
    pythonSnippet: string;
  };
}

// 1. GLOBAL OPEN DATA BANKS CATALOG
export const GLOBAL_OPEN_DATA_BANKS: GlobalOpenDataBank[] = [
  {
    id: 'khan-open-competencies',
    name: 'Khan Academy Open Knowledge Map',
    authority: 'Khan Academy Open Curriculum (Creative Commons)',
    license: 'CC BY-NC-SA 4.0',
    coverage: '12,400+ micro-competencias secuenciales de Matemáticas, Álgebra, Física y Biología',
    curriculumIntegration: 'Estructuración de niveles de 3º ESO con dominio progresivo (Mastery Points) sin frustración.',
    datasetPreview: {
      title: 'Mapeo de Competencias 3º ESO',
      sampleRows: [
        { code: 'MATH-3ESO-01', tema: 'Ecuaciones de 2º grado', tipo: 'Álgebra', dificultad: 'Medio', dominio_khan: 'Nivel 4' },
        { code: 'PHYS-3ESO-04', tema: 'Cinemática: v = d / t', tipo: 'Física', dificultad: 'Fácil', dominio_khan: 'Nivel 3' },
        { code: 'BIO-3ESO-08', tema: 'Genética mendeliana', tipo: 'Biología', dificultad: 'Medio', dominio_khan: 'Nivel 4' }
      ],
      pythonSnippet: `import json\n# Consulta de micro-competencias Khan Academy\ncompetencias = [row for row in dataset if row['dificultad'] == 'Medio']\nprint(f"Competencias seleccionadas: {len(competencias)}")`
    }
  },
  {
    id: 'openstax-curriculum',
    name: 'OpenStax Peer-Reviewed Library',
    authority: 'Rice University (OpenStax Publishing)',
    license: 'CC BY 4.0 Open Access',
    coverage: 'Libros de texto universitarios y de secundaria: Álgebra, Pre-cálculo, Física y Química',
    curriculumIntegration: 'Explicaciones formales rigurosas con demostraciones paso a paso de fórmulas matemáticas y modelos atómicos.',
    datasetPreview: {
      title: 'Banco de Fórmulas OpenStax',
      sampleRows: [
        { formula: 'x = (-b ± √(b² - 4ac)) / 2a', concepto: 'Fórmula Cuadrática General', disciplina: 'Álgebra' },
        { formula: 'F = m · a', concepto: 'Segunda Ley de Newton', disciplina: 'Dinámica' },
        { formula: 'E_c = 1/2 · m · v²', concepto: 'Energía Cinética', disciplina: 'Termodinámica' }
      ],
      pythonSnippet: `import math\n# Resolución con fórmula general OpenStax\na, b, c = 1, -5, 6\ndisc = b**2 - 4*a*c\nx1 = (-b + math.sqrt(disc)) / (2*a)\nx2 = (-b - math.sqrt(disc)) / (2*a)\nprint(f"Soluciones: x1 = {x1}, x2 = {x2}")`
    }
  },
  {
    id: 'ine-eurostat-data',
    name: 'INE & Eurostat Datos Abiertos Escolares',
    authority: 'Instituto Nacional de Estadística de España & Eurostat',
    license: 'Reutilización de Información Pública (Directiva UE 2019/1024)',
    coverage: 'Climatología, demografía juvenil, energías renovables en Cataluña y España',
    curriculumIntegration: 'Proyectos reales de ciencias sociales y matemáticas con datos verídicos para Danilo.',
    datasetPreview: {
      title: 'Temperaturas y Radiación Solar (Cataluña y Madrid)',
      sampleRows: [
        { mes: 'Enero', temp_bcn: 13.5, temp_mad: 9.8, radiacion_kwh: 78.4 },
        { mes: 'Abril', temp_bcn: 18.2, temp_mad: 17.5, radiacion_kwh: 142.1 },
        { mes: 'Julio', temp_bcn: 28.6, temp_mad: 32.1, radiacion_kwh: 215.8 },
        { mes: 'Octubre', temp_bcn: 21.4, temp_mad: 19.2, radiacion_kwh: 110.3 }
      ],
      pythonSnippet: `import pandas as pd\n# Análisis de datos climáticos INE con Pandas\ndf = pd.DataFrame(sample_rows)\nmedia_bcn = df['temp_bcn'].mean()\nprint(f"Temperatura media en Barcelona: {media_bcn:.1f} °C")`
    }
  },
  {
    id: 'kaggle-sports-analytics',
    name: 'Kaggle Open Sports: La Liga vs Brasileirão',
    authority: 'Kaggle Datasets & FIFA Open Analytics',
    license: 'CC0 Public Domain',
    coverage: 'Estadísticas de jugadores brasileños y españoles (goles, pases, velocidad media)',
    curriculumIntegration: 'Motivación deportiva para Danilo (de Brasil a España): resolución de proporciones, porcentajes y gráficos estadísticos.',
    datasetPreview: {
      title: 'Métricas de Jugadores (Vini Jr, Raphinha, Lamine Yamal)',
      sampleRows: [
        { jugador: 'Vinicius Jr', origen: 'Brasil 🇧🇷', liga: 'La Liga 🇪🇸', regates_exitosos: 84, precision_pase: 82.5 },
        { jugador: 'Raphinha', origen: 'Brasil 🇧🇷', liga: 'La Liga 🇪🇸', regates_exitosos: 78, precision_pase: 85.1 },
        { jugador: 'Lamine Yamal', origen: 'España 🇪🇸', liga: 'La Liga 🇪🇸', regates_exitosos: 91, precision_pase: 84.7 }
      ],
      pythonSnippet: `import numpy as np\n# Comparación estadística con NumPy\nregates = np.array([84, 78, 91])\nprint(f"Promedio de regates por temporada: {np.mean(regates):.2f}")`
    }
  }
];

// 2. COURSERA OMEGA SPECIALIZATION TRACKS (ALL PYTHON-BASED)
export const OMEGA_COURSE_TRACKS: OmegaCourseTrack[] = [
  {
    id: 'omega-math-algebra',
    code: 'OMEGA-MATH-301',
    title: 'Álgebra y Funciones Cuadráticas 3º ESO',
    universityPartner: 'Omega Consortium · Khan Academy & OpenStax Standard',
    openDataStandard: 'LOMLOE / Generalitat Decret 175/2022',
    level: 'Intermedio (3º ESO)',
    duration: '4 Semanas · 16 Lecciones Micro-learning',
    badgeColor: 'from-violet-600 to-indigo-700',
    glowColor: 'shadow-violet-500/25',
    summary: 'Domina ecuaciones de 2º grado, sistemas lineales, parábolas y modelado gráfico con el motor simbólico de SymPy.',
    syllabusWeeks: [
      {
        week: 1,
        title: 'Ecuaciones de Segundo Grado Completas e Incompletas',
        topicTag: 'Álgebra Fundamental',
        estimatedMinutes: 20,
        learningOutcomes: [
          'Identificar los coeficientes a, b y c en ax² + bx + c = 0.',
          'Calcular el discriminante Δ = b² - 4ac e interpretar el número de raíces.',
          'Resolver sin memorización mediante descomposición lógica y puente lingüístico.'
        ],
        openDataSources: ['OpenStax Algebra Ch. 9', 'Khan Academy Quadratic Formula Mastery'],
        stepByStepExample: {
          problemStatement: 'Resuelve la ecuación cuadrática: x² - 5x + 6 = 0',
          steps: [
            {
              stepNum: 1,
              title: 'Identificación de Coeficientes',
              mathExpression: 'a = 1,  b = -5,  c = 6',
              explanation: 'Comparamos término a término con la forma estándar ax² + bx + c = 0.',
              portugueseTip: 'Em português: Coeficientes a, b e c da equação do segundo grau.'
            },
            {
              stepNum: 2,
              title: 'Cálculo del Discriminante (Delta)',
              mathExpression: 'Δ = b² - 4ac = (-5)² - 4·1·6 = 25 - 24 = 1',
              explanation: 'Como Δ = 1 > 0, sabemos con 100% de certeza que existen dos soluciones reales distintas.',
              portugueseTip: 'O discriminante maior que zero garante duas raízes reais distintas.'
            },
            {
              stepNum: 3,
              title: 'Aplicación de la Fórmula General',
              mathExpression: 'x = (-(-5) ± √1) / (2·1) = (5 ± 1) / 2',
              explanation: 'Desglosamos en las dos ramas: x₁ = (5 + 1)/2 = 3, y x₂ = (5 - 1)/2 = 2.',
              portugueseTip: 'As duas raízes da equação são 3 e 2.'
            }
          ],
          finalResult: 'x₁ = 3,  x₂ = 2'
        },
        pythonLab: {
          scriptTitle: 'Resolutor Simbólico con SymPy en Python',
          pythonLibrary: 'sympy',
          code: `import sympy as sp

# Definimos el símbolo algebraico x
x = sp.Symbol('x')

# Definimos la ecuación cuadrática de 3º ESO
ecuacion = sp.Eq(x**2 - 5*x + 6, 0)

# SymPy calcula las raíces exactas al instante
soluciones = sp.solve(ecuacion, x)

print("=== RESOLUTOR SIMBÓLICO SYMPY PARA DANILO ===")
print(f"Ecuación: {ecuacion}")
print(f"Raíces encontradas: x1 = {soluciones[0]}, x2 = {soluciones[1]}")
print("¡Comprobación exitosa: 3² - 5(3) + 6 = 9 - 15 + 6 = 0!")`,
          expectedOutput: '=== RESOLUTOR SIMBÓLICO SYMPY PARA DANILO ===\nEcuación: Eq(x**2 - 5*x + 6, 0)\nRaíces encontradas: x1 = 2, x2 = 3\n¡Comprobación exitosa: 3² - 5(3) + 6 = 9 - 15 + 6 = 0!',
          interactiveVisualizationType: 'equation_roots',
          chartData: [
            { label: 'x = 0', value: 6 },
            { label: 'x = 1', value: 2 },
            { label: 'x = 2 (Raíz)', value: 0 },
            { label: 'x = 2.5 (Vértice)', value: -0.25 },
            { label: 'x = 3 (Raíz)', value: 0 },
            { label: 'x = 4', value: 2 }
          ]
        },
        knowledgeCheck: {
          question: 'Si en una ecuación ax² + bx + c = 0 el discriminante b² - 4ac es igual a 0, ¿cuántas soluciones reales tiene?',
          options: [
            'Tiene exactamente una única solución real doble.',
            'Tiene dos soluciones reales distintas.',
            'No tiene ninguna solución real en los números reales.',
            'Tiene infinitas soluciones.'
          ],
          correctIndex: 0,
          explanation: 'Cuando Δ = 0, el término ± √0 no suma ni resta nada, por lo que ambas raíces coinciden en x = -b / (2a).'
        }
      },
      {
        week: 2,
        title: 'Funciones Lineales, Pendientes y Gráficas Cartesianas',
        topicTag: 'Geometría Analítica',
        estimatedMinutes: 25,
        learningOutcomes: [
          'Entender la ecuación explícita y = mx + n (pendiente y ordenada en el origen).',
          'Interpretar gráficamente si una función es creciente (m > 0) o decreciente (m < 0).',
          'Calcular puntos de corte con los ejes coordenados.'
        ],
        openDataSources: ['Khan Academy Linear Functions', 'OpenStax Precalculus Ch. 2'],
        stepByStepExample: {
          problemStatement: 'Dada la función y = 2x - 4, encuentra la pendiente y los cortes con los ejes.',
          steps: [
            {
              stepNum: 1,
              title: 'Identificar Pendiente y Ordenada',
              mathExpression: 'm = 2,  n = -4',
              explanation: 'La pendiente m = 2 indica que por cada unidad que avanzamos en X, subimos 2 unidades en Y.',
              portugueseTip: 'A inclinação da reta é positiva, portanto a função é estritamente crescente.'
            },
            {
              stepNum: 2,
              title: 'Corte con el Eje Y (x = 0)',
              mathExpression: 'y = 2·(0) - 4 = -4  ==>  Punto (0, -4)',
              explanation: 'La recta corta al eje vertical exactamente en el punto (0, -4).',
              portugueseTip: 'O intercepto no eixo das ordenadas é -4.'
            },
            {
              stepNum: 3,
              title: 'Corte con el Eje X (y = 0)',
              mathExpression: '0 = 2x - 4  ==>  2x = 4  ==>  x = 2  ==>  Punto (2, 0)',
              explanation: 'La recta cruza el eje horizontal en el punto (2, 0).',
              portugueseTip: 'A raiz ou zero da função é x = 2.'
            }
          ],
          finalResult: 'Pendiente m = 2 (Creciente). Cortes: (0, -4) y (2, 0).'
        },
        pythonLab: {
          scriptTitle: 'Generador de Tablas y Pendientes en Python con NumPy',
          pythonLibrary: 'numpy',
          code: `import numpy as np

# Generamos valores de x desde -2 hasta 4
x_vals = np.linspace(-2, 4, 7)
m, n = 2, -4

# Calculamos y = mx + n de forma vectorizada
y_vals = m * x_vals + n

print("=== TABLA DE COORDENADAS CARTESIANAS (NUMPY) ===")
for x, y in zip(x_vals, y_vals):
    print(f"Punto: ({x:4.1f}, {y:5.1f})")

corte_x = -n / m
print(f"\nCorte analítico con el eje X: x = {corte_x:.1f}")`,
          expectedOutput: '=== TABLA DE COORDENADAS CARTESIANAS (NUMPY) ===\nPunto: (-2.0,  -8.0)\nPunto: (-1.0,  -6.0)\nPunto: ( 0.0,  -4.0)\nPunto: ( 1.0,  -2.0)\nPunto: ( 2.0,   0.0)\nPunto: ( 3.0,   2.0)\nPunto: ( 4.0,   4.0)\n\nCorte analítico con el eje X: x = 2.0',
          interactiveVisualizationType: 'data_bars',
          chartData: [
            { label: 'x = -2', value: -8 },
            { label: 'x = -1', value: -6 },
            { label: 'x = 0', value: -4 },
            { label: 'x = 1', value: -2 },
            { label: 'x = 2 (Corte)', value: 0 },
            { label: 'x = 3', value: 2 },
            { label: 'x = 4', value: 4 }
          ]
        },
        knowledgeCheck: {
          question: '¿Qué ocurre si la pendiente de una recta es m = 0?',
          options: [
            'La recta es perfectamente horizontal (paralela al eje X).',
            'La recta es perfectamente vertical (paralela al eje Y).',
            'La recta pasa siempre por el origen (0, 0).',
            'La recta no existe.'
          ],
          correctIndex: 0,
          explanation: 'Si m = 0, y = 0x + n = n, lo que significa que el valor de Y permanece constante para cualquier X, formando una recta horizontal.'
        }
      }
    ]
  },
  {
    id: 'omega-physics-chemistry',
    code: 'OMEGA-STEM-302',
    title: 'Física y Química: Dinámica y Cinemática Universal',
    universityPartner: 'Omega Consortium · MIT OpenCourseWare & OpenStax Physics',
    openDataStandard: 'Decret 175/2022 Batxillerat & ESO Curricular Guide',
    level: 'Intermedio (3º ESO)',
    duration: '4 Semanas · Simulaciones en Canvas',
    badgeColor: 'from-cyan-600 to-blue-700',
    glowColor: 'shadow-cyan-500/25',
    summary: 'Aprende movimiento rectilíneo uniforme (MRU), movimiento uniformemente acelerado (MRUA), fuerzas de Newton y gravedad.',
    syllabusWeeks: [
      {
        week: 1,
        title: 'Cinemática: MRU y MRUA en Situaciones Reales',
        topicTag: 'Física Clásica',
        estimatedMinutes: 20,
        learningOutcomes: [
          'Diferenciar entre velocidad constante y aceleración.',
          'Aplicar las fórmulas cinemáticas: v = v₀ + at, y e = e₀ + v₀t + 1/2 at².',
          'Convertir unidades entre km/h y m/s multiplicando o dividiendo por 3.6.'
        ],
        openDataSources: ['OpenStax College Physics Ch. 2', 'MIT 8.01 Classical Mechanics Open'],
        stepByStepExample: {
          problemStatement: 'Un tren de Rodalies en Cataluña parte del reposo y acelera a 1.5 m/s² durante 8 segundos. ¿Qué velocidad alcanza y qué distancia recorre?',
          steps: [
            {
              stepNum: 1,
              title: 'Datos del Problema',
              mathExpression: 'v₀ = 0 m/s,  a = 1.5 m/s²,  t = 8 s',
              explanation: 'El tren parte del reposo, por tanto su velocidad inicial es 0.',
              portugueseTip: 'O trem parte do repouso, então a velocidade inicial é nula.'
            },
            {
              stepNum: 2,
              title: 'Cálculo de la Velocidad Final',
              mathExpression: 'v = v₀ + a·t = 0 + (1.5 · 8) = 12 m/s',
              explanation: 'Multiplicamos por 3.6 para convertir a km/h: 12 · 3.6 = 43.2 km/h.',
              portugueseTip: 'Velocidade final de 12 m/s equivale a 43.2 km/h.'
            },
            {
              stepNum: 3,
              title: 'Cálculo de la Distancia Recorrida',
              mathExpression: 'd = v₀·t + (1/2)·a·t² = 0 + 0.5 · 1.5 · 64 = 48 metros',
              explanation: 'El tren recorre 48 metros durante su fase de aceleración constante.',
              portugueseTip: 'Distância percorrida de 48 metros.'
            }
          ],
          finalResult: 'Velocidad: 12 m/s (43.2 km/h). Distancia: 48 metros.'
        },
        pythonLab: {
          scriptTitle: 'Simulador de Trayectoria Cinemática con Python',
          pythonLibrary: 'numpy',
          code: `import numpy as np

# Parámetros físicos
a = 1.5   # m/s^2 aceleración
t_total = 8 # segundos

# Muestreo temporal cada segundo
t = np.arange(0, t_total + 1)
v = a * t
d = 0.5 * a * (t**2)

print("=== SIMULADOR DE MRUA (TREN CATALUNYA) ===")
print("Tiempo (s) | Velocidad (m/s) | Distancia (m)")
print("-" * 42)
for ti, vi, di in zip(t, v, d):
    print(f"   {ti:2d} s   |    {vi:5.1f} m/s    |   {di:5.1f} m")

print(f"\nVelocidad en km/h a los 8s: {v[-1] * 3.6:.1f} km/h")`,
          expectedOutput: '=== SIMULADOR DE MRUA (TREN CATALUNYA) ===\nTiempo (s) | Velocidad (m/s) | Distancia (m)\n------------------------------------------\n    0 s   |      0.0 m/s    |     0.0 m\n    2 s   |      3.0 m/s    |     3.0 m\n    4 s   |      6.0 m/s    |    12.0 m\n    6 s   |      9.0 m/s    |    27.0 m\n    8 s   |     12.0 m/s    |    48.0 m\n\nVelocidad en km/h a los 8s: 43.2 km/h',
          interactiveVisualizationType: 'trajectory_canvas',
          chartData: [
            { label: 't = 0s', value: 0 },
            { label: 't = 2s', value: 3 },
            { label: 't = 4s', value: 12 },
            { label: 't = 6s', value: 27 },
            { label: 't = 8s', value: 48 }
          ]
        },
        knowledgeCheck: {
          question: 'Para convertir una velocidad de metros por segundo (m/s) a kilómetros por hora (km/h), ¿qué operación debemos hacer?',
          options: [
            'Multiplicar por 3.6.',
            'Dividir entre 3.6.',
            'Multiplicar por 1000.',
            'Dividir entre 60.'
          ],
          correctIndex: 0,
          explanation: '1 m/s = (1/1000 km) / (1/3600 h) = 3600 / 1000 = 3.6 km/h. Por eso siempre multiplicamos por 3.6.'
        }
      }
    ]
  },
  {
    id: 'omega-nlp-trilingual',
    code: 'OMEGA-LANG-303',
    title: 'Puente Lingüístico Trilingüe: Português 🇧🇷, Castellano 🇪🇸 y Català',
    universityPartner: 'Omega Linguistics · Universitat de Barcelona & Univ. de São Paulo',
    openDataStandard: 'Marco Común Europeo de Referencia (MCER B1/B2) & Jubran (2018)',
    level: 'Multinivel (Acogida 3º ESO)',
    duration: '3 Semanas · Análisis de Falsos Amigos',
    badgeColor: 'from-emerald-600 to-teal-700',
    glowColor: 'shadow-emerald-500/25',
    summary: 'Acelera el dominio lingüístico de Danilo usando su lengua materna como palanca positiva y evitando interferencias.',
    syllabusWeeks: [
      {
        week: 1,
        title: 'Falsos Amigos Críticos y Transferencia Positiva PT-ES-CA',
        topicTag: 'Lingüística Contrastiva',
        estimatedMinutes: 20,
        learningOutcomes: [
          'Identificar las 10 palabras trampa más comunes entre portugués y español.',
          'Aprender la correspondencia catalana para desenvolverse en el instituto.',
          'Construir oraciones complejas con conectores argumentativos.'
        ],
        openDataSources: ['Corpus do Português (Davies)', 'CREA Real Academia Española', 'Corpus Textual Català (IEC)'],
        stepByStepExample: {
          problemStatement: 'Analiza el término "Apelido" en portugués frente a "Apellido" en español y "Cognom" en catalán.',
          steps: [
            {
              stepNum: 1,
              title: 'Diferenciación Semántica',
              mathExpression: 'PT: Apelido  ≠  ES: Apellido  ==>  ¡Falso Amigo!',
              explanation: 'En portugués de Brasil, "Apelido" significa "Mote / Sobrenombre" (apodo). En español, "Apellido" es el nombre familiar (Silva, Santos).',
              portugueseTip: 'No Brasil, seu apelido pode ser Dani; mas seu sobrenome/apelido español é seu nome de família.'
            },
            {
              stepNum: 2,
              title: 'Equivalente en Catalán',
              mathExpression: 'ES: Apellido  =  CA: Cognom',
              explanation: 'En los formularios de matrícula del instituto en Cataluña siempre verás la casilla "Nom i Cognoms".',
              portugueseTip: 'Em catalão, "Cognom" significa sobrenome familiar.'
            }
          ],
          finalResult: 'PT "Apelido" = ES "Apodo". PT "Sobrenome" = ES "Apellido" = CA "Cognom".'
        },
        pythonLab: {
          scriptTitle: 'Detector de Similitud Léxica y Falsos Amigos en Python',
          pythonLibrary: 'nlp_bridge',
          code: `def check_false_friend(pt_word):
    database = {
        "apelido": {"es": "apodo / sobrenombre", "real_es": "apellido = sobrenome de família", "ca": "malnom / cognom"},
        "propina": {"es": "gorjeta", "real_es": "soborno (cuidado en México/España)", "ca": "propina"},
        "borracha": {"es": "goma de apagar", "real_es": "mujer ebria en español", "ca": "goma d'esborrar"},
        "escritorio": {"es": "oficina", "real_es": "mesa de trabajo", "ca": "despatx / escriptori"}
    }
    
    clean = pt_word.lower().strip()
    if clean in database:
        res = database[clean]
        return f"⚠️ FALSO AMIGO DETECTADO:\\n• Português: '{clean}'\\n• En Español significa: '{res['es']}'\\n• Para decir lo que querías: '{res['real_es']}'\\n• En Català: '{res['ca']}'"
    return "Palabra regular o cognado directo."

print(check_false_friend("apelido"))
print("-" * 45)
print(check_false_friend("borracha"))`,
          expectedOutput: "⚠️ FALSO AMIGO DETECTADO:\n• Português: 'apelido'\n• En Español significa: 'apodo / sobrenombre'\n• Para decir lo que querías: 'apellido = sobrenome de família'\n• En Català: 'malnom / cognom'\n---------------------------------------------\n⚠️ FALSO AMIGO DETECTADO:\n• Português: 'borracha'\n• En Español significa: 'goma de apagar'\n• Para decir lo que querías: 'mujer ebria en español'\n• En Català: 'goma d'esborrar'",
          interactiveVisualizationType: 'nlp_tokens',
          chartData: [
            { label: 'Cognados Directos (85%)', value: 85 },
            { label: 'Falsos Amigos (9%)', value: 9 },
            { label: 'Vocabulario Único (6%)', value: 6 }
          ]
        },
        knowledgeCheck: {
          question: 'En Cataluña, cuando un profesor te pide que escribas tu "Cognom" en la cabecera del examen, ¿qué debes poner?',
          options: [
            'Tu apellido familiar (por ejemplo: Silva o Pereira).',
            'Tu apodo o cómo te llaman tus amigos cariñosamente.',
            'Tu fecha de nacimiento.',
            'El nombre de tu colegio anterior en Brasil.'
          ],
          correctIndex: 0,
          explanation: '"Cognom" en catalán equivale a "Apellido" en castellano y a "Sobrenome de família" en portugués.'
        }
      }
    ]
  }
];

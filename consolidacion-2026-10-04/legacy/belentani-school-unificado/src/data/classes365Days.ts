/**
 * Belentani School OS - 365 Días de Clases de 4 Horas
 * Plan curricular anual LOMLOE para 3º de ESO adaptado a William Danilo (14 años, Brasil).
 * Estructurado en 4 Horas lectivas diarias + descanso recreo 20-20-20.
 */

export interface DailyHourBlock {
  hourNumber: 1 | 2 | 3 | 4;
  timeRange: string;
  subject: string;
  category: 'matematicas' | 'lengua' | 'catalan' | 'ciencias' | 'tecnologia' | 'cultura';
  title: string;
  teacherScript: string;
  keyConcepts: string[];
  interactiveTask: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  resourceCodeOrFormula?: string;
  bridgePtEsCa?: {
    pt: string;
    es: string;
    ca: string;
    tip: string;
  };
}

export interface DayClass365 {
  dayNumber: number;
  dateSimulation: string;
  trimester: 1 | 2 | 3 | 4;
  trimesterLabel: string;
  week: number;
  title: string;
  motto: string;
  breakGuideline: {
    rule202020: string;
    socialTip: string;
  };
  hours: [DailyHourBlock, DailyHourBlock, DailyHourBlock, DailyHourBlock];
  dailyValidationQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Materias recurrentes en la rotación de 3º ESO
const ROTATION_H1_MATES = [
  { topic: 'Números racionales y fracciones equivalentes', formula: 'a/b ± c/d = (ad ± bc)/bd', code: 'from sympy import Rational\nprint(Rational(3, 4) + Rational(2, 5))' },
  { topic: 'Potencias de exponente entero y notación científica', formula: 'a^n · a^m = a^(n+m) ; N · 10^k', code: 'x = 3.5e6\nprint(f"{x:e}")' },
  { topic: 'Polinomios: suma, resta y productos notables', formula: '(a + b)^2 = a^2 + 2ab + b^2', code: 'from sympy import symbols, expand\nx = symbols("x")\nprint(expand((x + 3)**2))' },
  { topic: 'Ecuaciones de 1º grado con denominadores y paréntesis', formula: 'm.c.m. de denominadores', code: 'from sympy import symbols, Eq, solve\nx = symbols("x")\nprint(solve(Eq(2*x/3 - 1, 5), x))' },
  { topic: 'Ecuaciones de 2º grado completas e incompletas', formula: 'x = (-b ± √(b^2 - 4ac)) / 2a', code: 'from sympy import symbols, Eq, solve\nx = symbols("x")\nprint(solve(Eq(x**2 - 5*x + 6, 0), x))' },
  { topic: 'Sistemas lineales de dos ecuaciones (sustitución y reducción)', formula: 'ax + by = c ; dx + ey = f', code: 'from sympy import symbols, Eq, solve\nx, y = symbols("x y")\nprint(solve([Eq(x + y, 10), Eq(2*x - y, 5)], [x, y]))' },
  { topic: 'Proporcionalidad directa, inversa y porcentajes aplicados', formula: 'a/b = c/d ; Total · (1 ± %/100)', code: 'precio = 45 * 1.21\nprint(f"Total con IVA: {precio:.2f}€")' },
  { topic: 'Geometría plana: Teorema de Pitágoras y Tales', formula: 'h^2 = c1^2 + c2^2 ; AB/A\'B\' = BC/B\'C\'', code: 'import math\nh = math.sqrt(3**2 + 4**2)\nprint("Hipotenusa:", h)' },
  { topic: 'Áreas y volúmenes de cuerpos geométricos (prismas y cilindros)', formula: 'V = Ab · h ; V_cil = π · r^2 · h', code: 'import math\nr, h = 4, 10\nprint("Volumen cilindro:", math.pi * r**2 * h)' },
  { topic: 'Funciones lineales y afines: pendiente y ordenada en el origen', formula: 'y = mx + n ; m = (y2 - y1)/(x2 - x1)', code: 'import sympy as sp\nx = sp.Symbol("x")\nf = 2*x - 3\nprint("Corte eje Y:", f.subs(x, 0))' },
  { topic: 'Estadística descriptiva: media, mediana, moda y tablas de frecuencias', formula: 'x̄ = ∑(xi · fi) / N', code: 'datos = [7, 8, 9, 6, 8, 10]\nprint("Media:", sum(datos)/len(datos))' },
  { topic: 'Probabilidad elemental y regla de Laplace', formula: 'P(A) = Casos Favorables / Casos Posibles', code: 'fav, pos = 3, 6\nprint("Probabilidad:", fav/pos)' }
];

const ROTATION_H2_LENGUAS = [
  { 
    subject: 'Llengua Catalana 3º ESO',
    topic: 'La vida a l\'institut: el pati, les classes i demanar la paraula',
    pt: 'pedir a palavra / recreio', es: 'pedir el turno / recreo', ca: 'demanar la paraula / l\'esbarjo',
    tip: 'En Cataluña el recreo escolar se llama "l\'esbarjo" o "el pati". No tengas miedo a decir "Si us plau, puc anar al lavabo?".'
  },
  { 
    subject: 'Lengua Castellana 3º ESO',
    topic: 'Morfosintaxis: Sujeto, predicado y complementos directos/indirectos',
    pt: 'objeto direto / indireto', es: 'complemento directo / indirecto', ca: 'complement directe / indirecte',
    tip: 'Para identificar el CD en castellano, sustitúyelo por lo, la, los, las o pasa la frase a voz pasiva.'
  },
  { 
    subject: 'Llengua Catalana 3º ESO',
    topic: 'Falsos amigos Portugués-Catalán y sonidos vocálicos neutros',
    pt: 'esquisito (raro)', es: 'raro/extraño', ca: 'estrany / rar (esquisit = delicioso)',
    tip: 'En catalán "exquisit" significa delicioso o excelente, ¡igual que en castellano!'
  },
  { 
    subject: 'Lengua Castellana 3º ESO',
    topic: 'Tipología textual: El texto argumentativo y el debate formal',
    pt: 'tese e argumentos', es: 'tesis y argumentos de apoyo', ca: 'tesi i arguments de suport',
    tip: 'En un debate escolar en España, rebate con respeto diciendo: "Entiendo tu postura, pero los datos demuestran que..."'
  },
  { 
    subject: 'Llengua Catalana 3º ESO',
    topic: 'El passat perifràstic amb el verb anar (vaig cantar, vas fer)',
    pt: 'passado com auxiliar', es: 'pretérito perfecto simple', ca: 'passat perifràstic (vaig, vas, va, vam, vau, van)',
    tip: 'El catalán usa "vaig menjar" para decir "comí". No significa "voy a comer" (eso es "vaig a menjar").'
  },
  { 
    subject: 'Lengua Castellana 3º ESO',
    topic: 'Ortografía rigurosa: Acentuación de agudas, llanas, esdrújulas y diptongos',
    pt: 'oxítonas e paroxítonas', es: 'agudas, llanas y esdrújulas', ca: 'agudes, planes i esdrúixoles',
    tip: 'Las esdrújulas en castellano se acentúan SIEMPRE. Ej: brújula, cómputo, pirámide.'
  },
  { 
    subject: 'Llengua Catalana 3º ESO',
    topic: 'Lèxic quotidià de Barcelona i Catalunya: transport i convivència',
    pt: 'metrô, ônibus, rua', es: 'metro, autobús, calle', ca: 'metro, autobús, carrer',
    tip: 'En el metro de Barcelona escucharás "Pròxima parada" y para billete dirás "el bitllet".'
  },
  { 
    subject: 'Lengua Castellana 3º ESO',
    topic: 'Figuras retóricas y análisis literario: metáfora, hipérbole y anáfora',
    pt: 'metáfora e hipérbole', es: 'metáfora e hipérbole', ca: 'metàfora i hipèrbole',
    tip: 'La hipérbole es una exageración deliberada: "Te lo he dicho mil veces".'
  }
];

const ROTATION_H3_CIENCIAS = [
  { subject: 'Física y Química', topic: 'El método científico, magnitudes y cambios de unidades (SI)', concept: 'Factores de conversión y Sistema Internacional (m, kg, s)' },
  { subject: 'Biología y Geología', topic: 'Organización del cuerpo humano: de la célula a los sistemas', concept: 'Célula eucariota, membrana, citoplasma, ADN y mitocondrias' },
  { subject: 'Física y Química', topic: 'Estados de agregación de la materia y teoría cinético-molecular', concept: 'Sólido, líquido, gas y cambios de estado exotérmicos/endotérmicos' },
  { subject: 'Biología y Geología', topic: 'Aparatos de nutrición humana: digestivo, respiratorio, circulatorio y excretor', concept: 'Absorción intestinal de nutrientes y hematosis en alvéolos' },
  { subject: 'Física y Química', topic: 'Sustancias puras y mezclas: disoluciones y métodos de separación', concept: 'Soluto, disolvente, concentración en g/L y % en masa' },
  { subject: 'Biología y Geología', topic: 'Sistema nervioso y endocrino: estímulo, procesamiento y respuesta', concept: 'Neuronas, sinapsis, neurotransmisores y glándulas hormonales' },
  { subject: 'Física y Química', topic: 'Estructura atómica: protones, neutrones, electrones y tabla periódica', concept: 'Número atómico (Z), masa atómica (A) e isótopos' },
  { subject: 'Biología y Geología', topic: 'Salud, inmunidad y enfermedades infecciosas vs no infecciosas', concept: 'Vacunas, anticuerpos, bacterias, virus y prevención' },
  { subject: 'Física y Química', topic: 'Enlace químico: iónico, covalente y metálico', concept: 'Regla del octeto y compartición o cesión de electrones' },
  { subject: 'Biología y Geología', topic: 'Relieve terrestre y agentes geológicos externos (agua, viento, hielo)', concept: 'Meteorización, erosión, transporte y sedimentación' },
  { subject: 'Física y Química', topic: 'Reacciones químicas y ley de conservación de la masa (Lavoisier)', concept: 'Ajuste de ecuaciones químicas: Reactivos ➔ Productos' },
  { subject: 'Biología y Geología', topic: 'Ecosistemas, cadenas tróficas y equilibrio medioambiental', concept: 'Productores, consumidores primarios, descomponedores y bioma' }
];

const ROTATION_H4_LAB = [
  {
    subject: 'Laboratorio Python & SymPy',
    topic: 'Cálculo simbólico exacto y resolución de problemas algebraicos',
    script: 'from sympy import Symbol, solve\nx = Symbol("x")\nprint(solve(x**2 - 9, x))'
  },
  {
    subject: 'Google Sheets & Estadística',
    topic: 'Fórmulas =SUMA(), =PROMEDIO() y tablas de notas LOMLOE',
    script: '=PROMEDIO(B2:D2)  # Calcula la nota final con examen y prácticas'
  },
  {
    subject: 'Aterrizaje Cultural & Supervivencia Escolar',
    topic: 'Dinámica de notas en España (1 a 10) y relación con profesores y compañeros',
    script: 'Claves: El 5 es aprobado, el 9-10 es sobresaliente. Tratar de "tú" al profesor con respeto es normal.'
  },
  {
    subject: 'Laboratorio Python & Física',
    topic: 'Simulación de cinemática: velocidad media v = d / t y conversión a km/h',
    script: 'd_metros = 1500\nt_segundos = 180\nv_ms = d_metros / t_segundos\nprint(f"Velocidad: {v_ms*3.6:.1f} km/h")'
  },
  {
    subject: 'Google Sheets & Presupuestos',
    topic: 'Gestión de recursos y gastos escolares en hojas de cálculo compartidas',
    script: '=SUMA(D2:D10)  # Totaliza los costes de material escolar en euros'
  },
  {
    subject: 'Laboratorio Python & Geometría',
    topic: 'Comprobación de ternas pitagóricas y cálculo de diagonales espaciales',
    script: 'import math\ndef es_pitagorico(a, b, c):\n    return a**2 + b**2 == c**2\nprint(es_pitagorico(3, 4, 5))'
  }
];

// Generador integral de los 365 días estructurados
export function generate365SchoolClasses(): DayClass365[] {
  const classes: DayClass365[] = [];

  for (let day = 1; day <= 365; day++) {
    // Determinación del trimestre y semana
    let trimester: 1 | 2 | 3 | 4 = 1;
    let trimesterLabel = '1er Trimestre · Fundamentos y Aterrizaje Escolar';
    if (day > 90 && day <= 180) {
      trimester = 2;
      trimesterLabel = '2º Trimestre · Consolidación y Desarrollo Intermedio';
    } else if (day > 180 && day <= 270) {
      trimester = 3;
      trimesterLabel = '3er Trimestre · Dominio Curricular y Exámenes Finales';
    } else if (day > 270) {
      trimester = 4;
      trimesterLabel = '4º Bloque · Refuerzo Integral, Proyección a 4º ESO y Olimpiadas';
    }

    const week = Math.ceil(day / 7);

    // Selección rotacional enriquecida
    const m1 = ROTATION_H1_MATES[(day - 1) % ROTATION_H1_MATES.length];
    const m2 = ROTATION_H2_LENGUAS[(day - 1) % ROTATION_H2_LENGUAS.length];
    const m3 = ROTATION_H3_CIENCIAS[(day - 1) % ROTATION_H3_CIENCIAS.length];
    const m4 = ROTATION_H4_LAB[(day - 1) % ROTATION_H4_LAB.length];

    // Formulación de fecha simulada (del 15 de septiembre al 14 de septiembre siguiente)
    const baseDate = new Date(2026, 8, 15); // 15 sept 2026
    baseDate.setDate(baseDate.getDate() + (day - 1));
    const dateFormatted = baseDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const dayClass: DayClass365 = {
      dayNumber: day,
      dateSimulation: dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1),
      trimester,
      trimesterLabel,
      week,
      title: `Día ${day}: ${m1.topic.split(':')[0]} · ${m2.topic.split(':')[0]}`,
      motto: `Constancia diaria: cada día de 4 horas consolida tu éxito en 3º de la ESO.`,
      breakGuideline: {
        rule202020: 'Tras las 2 primeras horas: 20 minutos de descanso. Mira a 6 metros por la ventana durante 20 segundos y bebe agua fresca.',
        socialTip: 'Pauta para el recreo: comparte un momento con tus compañeros en el patio. Puedes decir: "¿Queréis que echemos una canasta o nos sentamos en el banco?"'
      },
      hours: [
        // HORA 1: MATEMÁTICAS
        {
          hourNumber: 1,
          timeRange: '08:30 - 09:20 (50 min)',
          subject: 'Matemáticas 3º ESO',
          category: 'matematicas',
          title: m1.topic,
          teacherScript: `¡Buenos días William Danilo! Iniciamos la primera hora de clase dedicada a las Matemáticas. Hoy abordamos: ${m1.topic}. Recuerda que las matemáticas no consisten en memorizar trucos sin sentido, sino en comprender el equilibrio lógico. La fórmula o principio directriz es: ${m1.formula}. Trabajaremos paso a paso despejando con calma cada término.`,
          keyConcepts: [m1.topic, 'Propiedad distributiva', 'Equivalencia algebraica', 'Verificación de soluciones'],
          resourceCodeOrFormula: m1.formula,
          interactiveTask: {
            question: `Para aplicar el concepto de ${m1.topic.toLowerCase()}, si tenemos una expresión matemática básica con esta regla, ¿cuál es el primer paso correcto?`,
            options: [
              'Operar respetando la jerarquía de paréntesis y potencias antes de sumar',
              'Eliminar todos los signos negativos sin comprobar',
              'Multiplicar directamente por cero todos los miembros',
              'Ignorar el denominador común'
            ],
            correctIndex: 0,
            explanation: 'La jerarquía de operaciones y el respeto a la equivalencia algebraica garantizan llegar al resultado exacto.'
          }
        },
        // HORA 2: LENGUAS Y COMUNICACIÓN
        {
          hourNumber: 2,
          timeRange: '09:25 - 10:15 (50 min)',
          subject: m2.subject,
          category: m2.subject.includes('Catalana') ? 'catalan' : 'lengua',
          title: m2.topic,
          teacherScript: `Continuamos con la segunda hora formativa: ${m2.subject}. Tu dominio del portugués de Brasil es una ventaja enorme para aprender castellano y catalán porque las tres son lenguas romances hermanas. Hoy nos concentramos en: ${m2.topic}. Pon mucha atención a la correspondencia lingüística: en portugués "${m2.pt}", en castellano "${m2.es}" y en catalán "${m2.ca}". ${m2.tip}`,
          keyConcepts: [m2.topic, 'Puente romance PT-ES-CA', 'Expresión oral en el aula', 'Vocabulario contextual'],
          bridgePtEsCa: {
            pt: m2.pt,
            es: m2.es,
            ca: m2.ca,
            tip: m2.tip
          },
          interactiveTask: {
            question: `En relación con ${m2.topic.toLowerCase()}, ¿cuál es la forma correcta y natural de expresarlo en clase?`,
            options: [
              `Utilizar el término adaptado: "${m2.ca}" en catalán o "${m2.es}" en castellano`,
              'Mezclar palabras sin concordancia de género',
              'No intervenir por vergüenza a pronunciar diferente',
              'Traducir palabra por palabra del inglés'
            ],
            correctIndex: 0,
            explanation: `Exacto. El puente trilingüe te permite usar con total seguridad "${m2.es}" o "${m2.ca}".`
          }
        },
        // HORA 3: CIENCIAS Y NATURALEZA
        {
          hourNumber: 3,
          timeRange: '10:35 - 11:25 (50 min)',
          subject: m3.subject,
          category: 'ciencias',
          title: m3.topic,
          teacherScript: `Llegamos a la tercera hora tras el descanso del patio: ${m3.subject}. Nuestro foco de hoy es: ${m3.topic}. En la ciencia examinamos las pruebas objetivas de la naturaleza. Concepto clave: ${m3.concept}. Observaremos cómo interactúan los elementos y sacaremos conclusiones respaldadas por la evidencia empírica.`,
          keyConcepts: [m3.topic, m3.concept, 'Observación empírica', 'Leyes naturales LOMLOE'],
          resourceCodeOrFormula: m3.concept,
          interactiveTask: {
            question: `En el estudio de ${m3.topic.toLowerCase()}, ¿qué afirmación científica es verídica?`,
            options: [
              `El principio fundamental radica en: ${m3.concept}`,
              'La materia desaparece en las reacciones químicas según la ciencia moderna',
              'El método científico no requiere contrastar hipótesis',
              'Las células procariotas tienen membrana nuclear definida'
            ],
            correctIndex: 0,
            explanation: `Correcto. ${m3.concept} es la base probada del tema.`
          }
        },
        // HORA 4: LABORATORIO PRÁCTICO & HERRAMIENTAS
        {
          hourNumber: 4,
          timeRange: '11:30 - 12:20 (50 min)',
          subject: m4.subject,
          category: 'tecnologia',
          title: m4.topic,
          teacherScript: `Última hora del día escolar: ${m4.subject}. En este bloque ponemos la teoría en acción en el ordenador. Hoy exploramos: ${m4.topic}. Utilizaremos herramientas reales como SymPy, hojas de cálculo de Google o modelos de análisis. Este código o fórmula nos permite comprobar los cálculos de forma instantánea: "${m4.script}".`,
          keyConcepts: [m4.topic, 'Automatización y verificación', 'Pensamiento computacional', 'Competencia digital LOMLOE'],
          resourceCodeOrFormula: m4.script,
          interactiveTask: {
            question: `Al trabajar con ${m4.topic.toLowerCase()}, ¿para qué nos sirve utilizar esta herramienta computacional?`,
            options: [
              'Para contrastar resultados numéricos exactos y agilizar el análisis crítico',
              'Para copiar resultados sin comprender el procedimiento',
              'Para sustituir el razonamiento humano por completo',
              'Para borrar los datos sin guardarlos en la nube'
            ],
            correctIndex: 0,
            explanation: 'La tecnología y el cálculo simbólico verifican tus hipótesis y potencian tu comprensión.'
          }
        }
      ],
      dailyValidationQuiz: [
        {
          question: `[Mates 3º ESO] En la sesión de hoy (${m1.topic}), ¿qué elemento es fundamental?`,
          options: [
            `El manejo correcto de la propiedad: ${m1.formula}`,
            'Ignorar las propiedades de los signos',
            'Sumar denominadores distintos directamente',
            'Redondear sin justificación'
          ],
          correctIndex: 0,
          explanation: `En ${m1.topic}, la fórmula o regla clave es ${m1.formula}.`
        },
        {
          question: `[Lengua y Comunicación] Respecto al vocabulario de hoy, ¿cuál es el equivalente en catalán de "${m2.es}"?`,
          options: [
            m2.ca,
            'Una palabra sin relación romance',
            'Exactamente idéntico al inglés británico',
            'Un término no reconocido en el diccionario'
          ],
          correctIndex: 0,
          explanation: `El puente léxico señala que "${m2.es}" equivale a "${m2.ca}" en catalán.`
        },
        {
          question: `[Ciencias y Práctica] En ${m3.subject} y el laboratorio de hoy, ¿cuál es la conclusión central?`,
          options: [
            `Comprobamos que ${m3.concept}`,
            'No es necesario contrastar con datos objetivos',
            'Las unidades del Sistema Internacional no se aplican',
            'La informática no ayuda a las ciencias experimentales'
          ],
          correctIndex: 0,
          explanation: `La evidencia empírica confirma que ${m3.concept}.`
        }
      ]
    };

    classes.push(dayClass);
  }

  return classes;
}

// Instancia única precargada de las 365 clases anuales
export const ALL_365_CLASSES: DayClass365[] = generate365SchoolClasses();

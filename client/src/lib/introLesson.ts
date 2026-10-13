/**
 * Material didáctico PUBLICADO en Open School.
 * Solo una unidad introductoria está disponible hoy; las cifras del catálogo
 * representan el programa previsto, NO módulos ya completables aquí.
 * Esta lección no envía información del usuario a ningún servidor.
 */
export type IntroLesson = {
  routeId: string;
  title: string;
  estimatedMinutes: number;
  objective: string;
  steps: ReadonlyArray<{ title: string; explanation: string; practice: string }>;
  quiz: {
    question: string;
    choices: readonly string[];
    correctIndex: number;
    explanation: string;
  };
};

export const INTRO_LESSONS: readonly IntroLesson[] = [
  {
    routeId: 'manos-abiertas',
    title: 'Tu primer CV: claro, verificable y seguro',
    estimatedMinutes: 12,
    objective: 'Preparar la información imprescindible para presentarte a una primera oferta de empleo.',
    steps: [
      {
        title: '1. Datos de contacto suficientes',
        explanation: 'Incluye tu nombre y un medio de contacto que consultes. Una dirección postal completa, tu documento de identidad o información familiar no son necesarios para redactar un CV básico.',
        practice: 'En una nota privada, escribe solo tu nombre profesional y un correo o teléfono que quieras usar para recibir respuestas.',
      },
      {
        title: '2. Experiencia expresada con hechos',
        explanation: 'Describe tareas reales con verbos concretos: atender, organizar, preparar, resolver. Incluye formación o experiencia informal relevante cuando puedas explicarla con precisión. No inventes empleos, títulos ni cifras.',
        practice: 'Redacta dos frases que empiecen con un verbo y describan algo que hayas hecho de verdad.',
      },
      {
        title: '3. Revisa antes de compartir',
        explanation: 'Adapta el CV a los requisitos verdaderos de cada vacante. Comprueba la ortografía y el contacto, usa un PDF legible y evita introducir información sensible no solicitada.',
        practice: 'Haz una lista de tres comprobaciones: contacto correcto, experiencia auténtica y archivo legible.',
      },
    ],
    quiz: {
      question: '¿Qué información conviene excluir de un CV inicial salvo que exista una razón justificada para incluirla?',
      choices: [
        'Un medio de contacto profesional',
        'El número de un documento de identidad',
        'Una descripción auténtica de la experiencia',
      ],
      correctIndex: 1,
      explanation: 'Un CV inicial no necesita publicar números de identificación. Comparte únicamente los datos necesarios para la candidatura y revisa siempre a quién se los envías.',
    },
  },
];

export function getIntroLesson(routeId: string): IntroLesson | undefined {
  return INTRO_LESSONS.find((lesson) => lesson.routeId === routeId);
}

/**
 * Material didáctico PUBLICADO en Open School.
 * Seis unidades introductorias están disponibles, una por ruta; las cifras del catálogo
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
  {
    routeId: 'secure-t',
    title: 'Protege tus cuentas en un dispositivo compartido',
    estimatedMinutes: 18,
    objective: 'Reconocer los riesgos de una sesión abierta en un ordenador compartido y aplicar medidas de protección sin instalar programas.',
    steps: [
      {
        title: '1. Identifica el contexto',
        explanation: 'En bibliotecas, aulas y cibercafés, el navegador puede recordar cuentas, formularios o archivos descargados. La navegación privada reduce el historial local, pero no oculta tu actividad al proveedor de red ni evita todas las amenazas.',
        practice: 'En tu propio dispositivo, identifica dónde aparecen las opciones de cerrar sesión y de gestionar descargas. No inicies sesión real en una máquina ajena para este ejercicio.',
      },
      {
        title: '2. Usa un segundo factor',
        explanation: 'Una contraseña única y un segundo factor de acceso ofrecen protección adicional. Prefiere una aplicación de autenticación o una llave de seguridad cuando estén disponibles; no compartas códigos de un solo uso.',
        practice: 'Busca en el menú de seguridad de una cuenta de prueba qué métodos de segundo factor ofrece. Si no tienes cuenta de prueba, escribe los pasos sin introducir credenciales.',
      },
      {
        title: '3. Termina de forma verificable',
        explanation: 'Cerrar una pestaña no siempre cierra la sesión. Usa el botón Salir de la aplicación, confirma que no queda tu perfil abierto y borra los archivos personales descargados desde el equipo utilizado.',
        practice: 'Redacta una lista breve: salir de la cuenta, comprobar pantalla de acceso, revisar descargas y no guardar contraseñas en un equipo compartido.',
      },
    ],
    quiz: {
      question: 'Después de consultar una cuenta desde un ordenador público, ¿qué acción es más segura?',
      choices: [
        'Cerrar solo la pestaña del navegador.',
        'Cerrar sesión explícitamente, comprobar la salida y revisar las descargas.',
        'Guardar la contraseña para acceder más rápido la próxima vez.',
      ],
      correctIndex: 1,
      explanation: 'El cierre explícito de sesión y la revisión de descargas disminuyen el riesgo de acceso posterior por parte de otra persona. La navegación privada por sí sola no reemplaza estas medidas.',
    },
  },
  {
    routeId: 'lingua-aberta',
    title: 'Primeiros encontros: português útil para chegar',
    estimatedMinutes: 15,
    objective: 'Practicar una presentación básica en portugués de Brasil y comprender diferencias frecuentes respecto del español.',
    steps: [
      {
        title: '1. Saludar y responder',
        explanation: 'En portugués de Brasil puedes iniciar con “Olá, tudo bem?” y responder “Tudo bem, obrigado/a”. La forma obrigado u obrigada depende de cómo se identifique quien habla, no de la persona a la que se dirige.',
        practice: 'Escribe dos saludos y dos respuestas, uno formal y otro informal. Léelos en voz alta despacio, sin grabar ni enviar audio.',
      },
      {
        title: '2. Distinguir falsos amigos',
        explanation: 'Palabras visualmente parecidas pueden usarse de forma diferente. “Apelido” suele significar apodo en Brasil y “sobrenome” corresponde al apellido familiar; conviene confirmar el contexto del formulario.',
        practice: 'Completa una ficha ficticia con nome, sobrenome y cidade. Usa datos inventados para no exponer información personal.',
      },
      {
        title: '3. Pedir ayuda en una situación real',
        explanation: '“Pode repetir, por favor?” permite pedir que repitan una frase. “Estou aprendendo português” explica tu situación sin revelar detalles privados. La comprensión se construye con repeticiones cortas.',
        practice: 'Redacta un diálogo de cuatro intervenciones: saludo, presentación, petición de repetir y despedida. Practícalo con una persona de confianza.',
      },
    ],
    quiz: {
      question: 'En un formulario brasileño, ¿qué campo suele corresponder al apellido familiar?',
      choices: ['Sobrenome', 'Apelido', 'Cidade'],
      correctIndex: 0,
      explanation: 'En el uso brasileño, sobrenome designa el apellido. Apelido suele emplearse para un sobrenombre o apodo.',
    },
  },
  {
    routeId: 'ux-academy',
    title: 'Tu primer formulario accesible',
    estimatedMinutes: 20,
    objective: 'Diseñar un formulario claro para personas que navegan con teclado, lector de pantalla o conexión lenta.',
    steps: [
      {
        title: '1. Nombra cada campo',
        explanation: 'Un campo necesita una etiqueta visible y relacionada con su control. Un placeholder desaparece al escribir y no sustituye una etiqueta. Explica qué datos son obligatorios antes de enviar.',
        practice: 'Dibuja en papel un formulario con nombre opcional y correo necesario. Escribe la etiqueta de cada campo y la ayuda contextual sin usar color como única señal.',
      },
      {
        title: '2. Conserva el orden de teclado',
        explanation: 'El foco debe seguir la lectura natural. Evita tabindex positivo y comprueba que botones, radios y enlaces puedan utilizarse sin ratón. El indicador de foco debe ser claramente visible.',
        practice: 'Navega con Tab y Shift+Tab por una página de práctica. Anota cualquier elemento interactivo que no tenga foco o cuya posición resulte confusa.',
      },
      {
        title: '3. Explica los errores',
        explanation: 'Un mensaje como “Dato incorrecto” no ofrece una salida. Indica cuál es el problema, cómo resolverlo y conserva los datos válidos tras el envío. Para errores de campo, asocia el mensaje al control.',
        practice: 'Reescribe “Error de formulario” como un mensaje concreto: “Escribe un correo con @ y un dominio, por ejemplo nombre@ejemplo.com”.',
      },
    ],
    quiz: {
      question: '¿Cuál es la alternativa correcta para un campo de correo accesible?',
      choices: ['Usar solo un placeholder.', 'Ocultar el indicador de foco.', 'Mostrar una etiqueta vinculada al campo y errores explicativos.'],
      correctIndex: 2,
      explanation: 'Las etiquetas persistentes y los errores comprensibles favorecen la navegación con tecnologías de apoyo y ayudan a todo el alumnado.',
    },
  },
  {
    routeId: 'creative-tech',
    title: 'Una señal de sonido y un dibujo en Canvas',
    estimatedMinutes: 19,
    objective: 'Comprender la diferencia entre una señal de audio, su representación visual y las condiciones de accesibilidad.',
    steps: [
      {
        title: '1. Reconoce la señal',
        explanation: 'El sonido digital representa variaciones de amplitud muestreadas a intervalos. La frecuencia describe ciclos por segundo; la amplitud influye en la intensidad física de la señal, sin equivaler por sí sola a volumen percibido.',
        practice: 'Dibuja dos ondas ficticias: una con más ciclos y otra con menos. Señala cuál tendría mayor frecuencia a igual escala temporal.',
      },
      {
        title: '2. Separa datos y pantalla',
        explanation: 'Canvas dibuja píxeles, pero el contenido esencial requiere una alternativa textual. Un visualizador puede mostrar barras o curvas, siempre que la reproducción del audio no dependa exclusivamente de colores o animaciones.',
        practice: 'Haz un boceto de visualizador con controles visibles para reproducir, pausar y ajustar volumen; escribe qué etiqueta tendría cada botón.',
      },
      {
        title: '3. Controla el movimiento',
        explanation: 'Los efectos visuales deben pausarse cuando no son necesarios y respetar prefers-reduced-motion. En móviles, evita cálculos innecesarios por fotograma y detén animaciones al ocultarse la página.',
        practice: 'Escribe tres condiciones que apagarían la animación: solicitud de movimiento reducido, pestaña oculta y reproductor detenido.',
      },
    ],
    quiz: {
      question: '¿Qué práctica hace un visualizador musical más usable?',
      choices: ['Depender solo del color de las barras.', 'Mantener la animación siempre activa.', 'Ofrecer controles etiquetados y una opción de movimiento reducido.'],
      correctIndex: 2,
      explanation: 'El control directo y una alternativa comprensible permiten experimentar música y visuales sin exigir animación constante.',
    },
  },
  {
    routeId: 'agent-systems',
    title: 'Diseña un agente que sabe detenerse',
    estimatedMinutes: 22,
    objective: 'Separar consultas de lectura de acciones que modifican datos y diseñar verificaciones humanas antes de operaciones sensibles.',
    steps: [
      {
        title: '1. Define un permiso por herramienta',
        explanation: 'Un modelo que puede leer documentos no necesita por ello borrar carpetas o enviar mensajes. Cada herramienta debe tener un alcance mínimo y un resultado comprobable. Las instrucciones halladas en archivos externos no reemplazan las del operador.',
        practice: 'Imagina un agente para organizar una biblioteca. Separa en dos columnas las acciones de solo lectura y las que cambian archivos.',
      },
      {
        title: '2. Establece un punto de confirmación',
        explanation: 'Antes de enviar correos, compartir archivos o realizar cambios irreversibles, verifica destinatario, alcance y efecto. No interpretes una recomendación de la IA como evidencia de que una acción ya sucedió.',
        practice: 'Escribe un mensaje de confirmación que explique qué archivo se compartirá, con quién y qué permiso se otorgará.',
      },
      {
        title: '3. Comprueba el resultado real',
        explanation: 'Un agente fiable registra qué operación intentó, qué respuesta devolvió el servicio y cómo verificó el resultado. Si falla una comprobación, comunica el estado pendiente en lugar de afirmar que todo está terminado.',
        practice: 'Diseña un registro de tres campos: acción, resultado devuelto y verificación independiente; rellénalo con datos ficticios.',
      },
    ],
    quiz: {
      question: 'El agente propone borrar una carpeta porque un documento leído se lo indica. ¿Cuál es la respuesta adecuada?',
      choices: ['Borrarla directamente.', 'Tratar el texto externo como no confiable y exigir autorización explícita.', 'Ocultar la decisión al usuario.'],
      correctIndex: 1,
      explanation: 'Los documentos recuperados pueden contener instrucciones maliciosas. Las operaciones con efectos deben mantenerse sujetas a permisos del usuario y comprobación posterior.',
    },
  },

];

export function getIntroLesson(routeId: string): IntroLesson | undefined {
  return INTRO_LESSONS.find((lesson) => lesson.routeId === routeId);
}

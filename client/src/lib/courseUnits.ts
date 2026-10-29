import { INTRO_LESSONS, type IntroLesson } from './introLesson';

/**
 * Las unidades siguientes contienen material didáctico, ejercicios y preguntas
 * utilizables sin IA ni cuentas. No equivalen a cursos largos certificados.
 */
export const ADDITIONAL_UNITS: readonly IntroLesson[] = [
  {
    routeId: 'manos-abiertas',
    title: 'Vivienda: revisar una oferta y preparar una visita segura',
    estimatedMinutes: 20,
    objective: 'Distinguir datos comprobables de señales de alerta y preparar una lista de preguntas para una visita de alquiler.',
    steps: [
      {
        title: '1. Comprueba la identidad de la oferta',
        explanation: 'Lee la ubicación aproximada, superficie, precio y condiciones de la oferta. Verifica que las fotografías describen el mismo inmueble. Si alguien exige transferencias antes de visitar o no admite preguntas razonables, detente y comprueba la identidad del anunciante por una vía independiente.',
        practice: 'Escribe cinco campos de una ficha ficticia: zona, precio, superficie, duración propuesta y medio de contacto verificable. Marca qué información falta.',
      },
      {
        title: '2. Pregunta por costes y documentos',
        explanation: 'Distingue renta, fianza, suministros y posibles gastos de entrada. Las obligaciones dependen del tipo de contrato y la normativa aplicable, así que pide un desglose escrito y consulta una fuente pública actualizada antes de comprometer dinero. No envíes copias de documentos personales a desconocidos.',
        practice: 'Prepara tres preguntas: importe total de entrada, qué suministros se pagan aparte y en qué momento se entrega una copia del contrato.',
      },
      {
        title: '3. Guarda evidencia sin exponer datos',
        explanation: 'Antes de firmar, lee todas las cláusulas y solicita copia. Comprueba que coinciden el inmueble, el precio, las personas firmantes y los plazos. Guarda la conversación y recibos en una carpeta privada. Si no entiendes algo, pide una explicación por escrito y busca asesoramiento de vivienda local.',
        practice: 'Redacta una lista de comprobación con seis casillas y una frase para pedir aclaraciones de forma respetuosa, sin incluir datos reales.',
      },
    ],
    quiz: {
      question: 'Una persona exige una transferencia urgente antes de mostrar el piso. ¿Qué conviene hacer?',
      choices: [
        'Transferir para que no pierdan la oferta.',
        'Enviar el documento de identidad y esperar.',
        'No pagar todavía, verificar de forma independiente y solicitar información por escrito.',
      ],
      correctIndex: 2,
      explanation: 'La urgencia artificial y los pagos previos a comprobar la oferta son señales de alerta. La verificación independiente reduce el riesgo de fraude sin impedir una contratación legítima.',
    },
  },
  {
    routeId: 'secure-t',
    title: 'Ofertas de empleo falsas: detecta, confirma y denuncia',
    estimatedMinutes: 19,
    objective: 'Evaluar una supuesta oferta laboral sin exponer documentos, contraseñas ni dinero.',
    steps: [
      {
        title: '1. Identifica señales de presión',
        explanation: 'Una supuesta empresa puede prometer ingresos improbables, contratar sin entrevista o exigir una tasa previa. Ninguna señal aislada demuestra automáticamente fraude: busca coincidencia entre puesto, empresa, dominio de contacto y oferta publicada en un canal oficial.',
        practice: 'Escribe tres señales de riesgo en una oferta ficticia y dos datos que buscarías en una página corporativa auténtica.',
      },
      {
        title: '2. Comprueba fuera del mensaje',
        explanation: 'No uses solo los enlaces que te envían en un chat. Teclea tú mismo la dirección conocida de la empresa, localiza su apartado de empleo y pregunta por el identificador de la vacante. Los dominios parecidos y los perfiles con logotipos copiados no prueban identidad.',
        practice: 'Simula comparar dos direcciones de correo ficticias: una bajo el dominio corporativo y otra con letras añadidas. Explica por qué buscarías confirmación.',
      },
      {
        title: '3. Reacciona sin perder evidencia',
        explanation: 'Si crees que compartiste información con un impostor, cambia contraseñas reutilizadas desde un dispositivo de confianza y activa un segundo factor. Contacta con tu entidad financiera si pagaste y conserva capturas relevantes. Acude a canales oficiales de ayuda o denuncia según tu ubicación.',
        practice: 'Prepara un plan de cuatro pasos: detener contacto, verificar acceso, avisar al servicio afectado y conservar pruebas sin difundir datos privados.',
      },
    ],
    quiz: {
      question: '¿Cuál es la forma más fiable de confirmar una oferta recibida por mensajería?',
      choices: [
        'Responder al enlace que el remitente adjuntó.',
        'Buscar la empresa por una vía independiente y comprobar la vacante.',
        'Confiar en que el mensaje incluye un logotipo.',
      ],
      correctIndex: 1,
      explanation: 'Comprobar por un canal independiente evita depender de dominios y perfiles controlados por un posible impostor y permite contrastar los detalles del puesto.',
    },
  },
  {
    routeId: 'lingua-aberta',
    title: 'Português no dia a dia: pedir informação e confirmar horários',
    estimatedMinutes: 16,
    objective: 'Formular perguntas curtas em português do Brasil e confirmar uma resposta sem adivinhar o significado.',
    steps: [
      {
        title: '1. Comece com uma pergunta simples',
        explanation: '“Com licença, onde fica a biblioteca?” é uma pergunta cortês sobre localização. “A que horas abre?” consulta um horário. Para evitar mal-entendidos, prefira uma pergunta de cada vez, especialmente em locais movimentados.',
        practice: 'Escreva três perguntas usando onde, quando e quanto custa. Escolha locais fictícios e leia as frases em voz alta.',
      },
      {
        title: '2. Repita o dado importante',
        explanation: 'Depois de ouvir um horário, confirme: “Então abre às nove, certo?”. Em português brasileiro, “às nove” indica horário. Ouvir o número de novo ajuda quando sotaques, ruído e velocidade dificultam a compreensão.',
        practice: 'Imagine que alguém diz “às quinze horas”. Responda com uma confirmação educada e converta a hora para o formato de 12 horas.',
      },
      {
        title: '3. Peça outra forma de explicar',
        explanation: '“Pode falar mais devagar, por favor?” pede menos velocidade; “Pode escrever para mim?” solicita a informação por escrito. São estratégias de comunicação, não sinais de incapacidade. Agradeça com “Muito obrigado” ou “Muito obrigada”, conforme a própria identidade.',
        practice: 'Crie um diálogo de seis falas entre uma pessoa recém-chegada e um atendente. Inclua pedido de repetição, confirmação e despedida.',
      },
    ],
    quiz: {
      question: 'Qual frase em português ajuda a confirmar um horário que você acabou de ouvir?',
      choices: ['“Então abre às nove, certo?”', '“Nunca estive aqui.”', '“Não preciso saber.”'],
      correctIndex: 0,
      explanation: 'Repetir o dado e pedir confirmação ajuda a detectar erros de escuta antes de fazer planos ou deslocamentos.',
    },
  },
  {
    routeId: 'ux-academy',
    title: 'Prueba de usabilidad: observar sin dirigir',
    estimatedMinutes: 23,
    objective: 'Preparar una prueba de usabilidad breve, respetuosa y basada en hechos observables.',
    steps: [
      {
        title: '1. Define una tarea y una señal de éxito',
        explanation: 'En lugar de preguntar “¿te gusta esta web?”, pide realizar una acción concreta: encontrar la información de contacto. Establece de antemano qué resultado contaría como completado. No sugieras dónde está el enlace o deformarás el resultado.',
        practice: 'Redacta una tarea de una sola frase y dos observaciones verificables: tiempo aproximado y número de intentos, sin atribuir emociones a la persona.',
      },
      {
        title: '2. Obtén consentimiento y reduce datos',
        explanation: 'Explica el objetivo, duración y uso de las observaciones antes de empezar. Deja claro que participar es voluntario y que se puede detener la actividad. Si no necesitas una grabación, no la hagas; si la necesitas, solicita consentimiento específico.',
        practice: 'Escribe un consentimiento de cuatro líneas: propósito, duración, datos anotados y derecho a detenerse.',
      },
      {
        title: '3. Diferencia observación e interpretación',
        explanation: '“La persona hizo clic tres veces en Ayuda” es una observación. “La persona es torpe” es un juicio injustificado. Agrupa los problemas por frecuencia e impacto, propone una mejora y vuelve a probar con otra persona antes de afirmar que está resuelto.',
        practice: 'Transforma estas conclusiones en observaciones: “nadie entiende la navegación” y “el usuario no presta atención”. Propón una hipótesis revisable para cada una.',
      },
    ],
    quiz: {
      question: '¿Qué instrucción minimiza el sesgo durante una prueba de usabilidad?',
      choices: [
        '“Haz clic en el botón azul de Contacto”.',
        '“¿Verdad que esta página es intuitiva?”.',
        '“Encuentra cómo contactar con la organización usando esta página”.',
      ],
      correctIndex: 2,
      explanation: 'Una tarea neutral permite observar rutas y dificultades reales. Señalar la ubicación correcta al participante invalidaría parte de la evidencia.',
    },
  },
  {
    routeId: 'creative-tech',
    title: 'Audio web: ganancia, picos y controles seguros',
    estimatedMinutes: 21,
    objective: 'Comprender un flujo de audio básico y diseñar controles que eviten arranques inesperados.',
    steps: [
      {
        title: '1. Piensa en la cadena de señal',
        explanation: 'Un oscilador genera una señal periódica, un nodo GainNode ajusta su amplitud y la salida conecta con los altavoces. La cadena es una idea: fuente, control, destino. No confundas amplitud numérica con percepción exacta del volumen.',
        practice: 'Dibuja tres cajas conectadas con flechas: oscilador, ganancia y destino. Anota qué bloque permitiría silenciar sin destruir la fuente.',
      },
      {
        title: '2. Respeta la decisión de escuchar',
        explanation: 'Muchos navegadores suspenden el audio antes de un gesto de usuario. Diseña un botón claro para iniciar y otro para detener. Inicia la ganancia baja y súbela gradualmente para evitar saltos bruscos; nunca reproduzcas sonidos a escondidas.',
        practice: 'Escribe la etiqueta accesible y los estados de dos botones: Reproducir y Detener. Describe qué debe ocurrir al cerrar la pestaña.',
      },
      {
        title: '3. Cuida recursos y accesibilidad',
        explanation: 'Una visualización puede actualizarse solo mientras el audio está activo y la pestaña es visible. Cuando se detiene, cancela los bucles y libera recursos de audio. Ofrece un resumen textual del estado porque una animación no sustituye la información útil.',
        practice: 'Prepara tres condiciones que paren el dibujo: pestaña oculta, reproducción detenida y preferencia de movimiento reducido.',
      },
    ],
    quiz: {
      question: '¿Cuál es una decisión responsable al diseñar un sintetizador en el navegador?',
      choices: [
        'Reproducir audio alto nada más cargar.',
        'Iniciar bajo demanda, con ganancia moderada y botón de detener.',
        'Ocultar el control de parada para ahorrar espacio.',
      ],
      correctIndex: 1,
      explanation: 'La activación intencional y un control de parada visible permiten que la persona use el audio sin sorpresas ni dependencia de la animación.',
    },
  },
  {
    routeId: 'agent-systems',
    title: 'Automatización confiable: reintentos e idempotencia',
    estimatedMinutes: 24,
    objective: 'Definir cuándo repetir una acción y cómo evitar cambios duplicados tras un error de red.',
    steps: [
      {
        title: '1. Separa leer de modificar',
        explanation: 'Consultar el estado de un pedido suele ser una operación de lectura, mientras que crear otro pedido modifica el sistema. Repetir una lectura normalmente es menos arriesgado. En acciones de escritura necesitas comprobar si la primera solicitud ya produjo efecto.',
        practice: 'Clasifica consultar saldo, crear factura y descargar catálogo como lectura o escritura. Explica qué comprobarías antes de repetir cada una.',
      },
      {
        title: '2. Evita ejecutar dos veces',
        explanation: 'La idempotencia significa que aplicar una operación repetidamente produce el mismo efecto final que aplicarla una vez. Para crear recursos, una clave de idempotencia aceptada por el servidor puede impedir duplicados. Si el servicio no la admite, consulta el resultado anterior antes de reintentar.',
        practice: 'Diseña una ficha ficticia con ID de solicitud, acción y estado. Escribe la regla que impediría enviar la misma factura dos veces.',
      },
      {
        title: '3. Define una salida visible',
        explanation: 'No todos los errores son transitorios. Un error de validación requiere corregir datos, no repetir automáticamente. Un error temporal puede justificar reintentos limitados, espera progresiva y una parada clara. Registra resultado, identificador y evidencia de confirmación, evitando secretos.',
        practice: 'Escribe una política de máximo dos reintentos para fallos temporales y una regla de parada inmediata para respuestas de permisos denegados.',
      },
    ],
    quiz: {
      question: 'Se pierde la conexión después de pulsar “Crear factura”. ¿Qué debe hacer un agente antes de reintentar?',
      choices: [
        'Crear otra factura sin revisar.',
        'Ocultar el fallo.',
        'Consultar si la factura ya existe usando su identificador o clave de idempotencia.',
      ],
      correctIndex: 2,
      explanation: 'Comprobar el efecto de una operación incierta evita duplicaciones. La repetición automática solo es segura cuando la operación es idempotente o se confirma que no ocurrió.',
    },
  },
];

export const PUBLISHED_UNITS: readonly IntroLesson[] = [...INTRO_LESSONS, ...ADDITIONAL_UNITS];

export function getRouteUnits(routeId: string): readonly IntroLesson[] {
  return PUBLISHED_UNITS.filter((unit) => unit.routeId === routeId);
}

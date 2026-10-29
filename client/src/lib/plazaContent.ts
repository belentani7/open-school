/** Plaza educativa: material original de alfabetización. Sin modelos, cuentas ni rastreo. */
export type PlazaQuiz = { question: string; choices: readonly string[]; correctIndex: number; explanation: string };
export type PlazaLesson = { id: string; title: string; objective: string; concept: string; example: string; practice: string; quiz: PlazaQuiz };
export type PlazaTrack = { id: string; name: string; tag: string; level: string; minutes: number; description: string; outcome: string; capstone: string; rubric: readonly string[]; lessons: readonly PlazaLesson[] };
export const PLAZA_TRACKS: readonly PlazaTrack[] = [
  {
    "id": "autonomia-digital",
    "name": "Autonomía digital",
    "tag": "EMPEZAR",
    "level": "Inicial",
    "minutes": 72,
    "description": "Aprende a manejar archivos, formularios, comunicaciones y seguridad sin depender de otra persona.",
    "outcome": "Completar una gestión digital simulada sin compartir datos reales.",
    "capstone": "Prepara una carpeta ficticia de empleo con nombres claros, un documento accesible, una lista de verificación de un formulario y una estrategia para detectar mensajes falsos.",
    "rubric": [
      "La carpeta permite encontrar cada archivo en menos de un minuto.",
      "El documento contiene título, fecha, contenido legible y nombre neutro.",
      "La lista distingue información necesaria, consentimiento y señales de fraude."
    ],
    "lessons": [
      {
        "id": "archivos",
        "title": "Archivos que puedes encontrar",
        "objective": "Organizar documentos sin perder versiones.",
        "concept": "Una carpeta agrupa archivos con una finalidad. Un nombre útil incluye tema y fecha, por ejemplo carta-presentacion-2026-10.pdf. Evita nombres ambiguos como final-final2 y no incluyas números de identificación en el nombre.",
        "example": "Tienes tres archivos ficticios: cv.pdf, cv2.pdf y CV-final.pdf. No sabes cuál es actual. Compara sus fechas y contenido, elige uno y renómbralo cv-postulacion-2026-10.pdf.",
        "practice": "Dibuja una estructura con carpetas Empleo, Formación y Personal. Coloca cinco documentos inventados y explica cómo localizarías el último.",
        "quiz": {
          "question": "¿Qué nombre facilita encontrar un documento sin revelar datos sensibles?",
          "choices": [
            "documento_final_definitivo2.pdf",
            "cv-postulacion-2026-10.pdf",
            "pasaporte-123456789.pdf"
          ],
          "correctIndex": 1,
          "explanation": "El nombre describe el uso y la fecha sin exponer identificadores."
        }
      },
      {
        "id": "correo",
        "title": "Correo profesional y adjuntos",
        "objective": "Enviar información verificable y respetuosa.",
        "concept": "Un correo de solicitud debe decir quién escribe, qué solicita y qué acción espera. Antes de adjuntar archivos, revisa destinatario, asunto y permisos. Un enlace de nube puede revelar información o dejar de funcionar.",
        "example": "Asunto: Solicitud de información sobre curso de informática. Cuerpo: Buenos días, quisiera saber horarios y requisitos. Gracias. Adjunta solamente la documentación que te hayan pedido por un canal confiable.",
        "practice": "Escribe un correo ficticio de cuatro frases y una lista previa al envío con destinatario, asunto, adjunto y privacidad.",
        "quiz": {
          "question": "¿Qué deberías revisar antes de enviar un CV?",
          "choices": [
            "Enviar a todos los contactos a la vez",
            "Destinatario, archivo correcto y datos mínimos",
            "Publicar el CV en un chat abierto"
          ],
          "correctIndex": 1,
          "explanation": "La minimización de datos y la revisión del adjunto reducen errores."
        }
      },
      {
        "id": "formularios",
        "title": "Formularios sin trampas",
        "objective": "Distinguir campos obligatorios, opcionales y permisos.",
        "concept": "Lee la finalidad del formulario antes de escribir. Un asterisco suele indicar un campo obligatorio, pero no garantiza que la petición sea legítima. Revisa el dominio de la web y pregunta por qué necesitan información que parece ajena al trámite.",
        "example": "Un formulario para apuntarte a una charla pide nombre y correo, pero también contraseña de banca. Ese dato no guarda relación con la inscripción: deja el formulario y verifica con la entidad organizadora.",
        "practice": "Crea un formulario ficticio de inscripción con cuatro campos y explica qué datos no recogerías y cómo ofrecerías una alternativa presencial.",
        "quiz": {
          "question": "¿Qué haces si una inscripción solicita tu contraseña bancaria?",
          "choices": [
            "La facilitas porque hay un asterisco",
            "La compartes por correo más tarde",
            "No la facilitas y verificas el servicio"
          ],
          "correctIndex": 2,
          "explanation": "Un servicio de inscripción no necesita contraseñas de banca."
        }
      },
      {
        "id": "seguridad",
        "title": "Señales de fraude digital",
        "objective": "Verificar mensajes sin actuar por presión.",
        "concept": "Urgencia, premios improbables y enlaces parecidos a los oficiales son señales de alerta, no pruebas absolutas. No abras enlaces de un mensaje inesperado para confirmar su autenticidad: visita el sitio escribiendo la dirección conocida o usa un contacto independiente.",
        "example": "Recibes un SMS que dice que tu cuenta se cerrará en cinco minutos. En lugar de tocar el enlace, abres la aplicación oficial del servicio y verificas si existe alguna alerta.",
        "practice": "Clasifica tres mensajes ficticios en verificar, ignorar o consultar con soporte. Anota por qué, sin compartir códigos de acceso.",
        "quiz": {
          "question": "¿Cuál es la verificación más segura?",
          "choices": [
            "Abrir el enlace enviado",
            "Pedir al remitente una captura",
            "Entrar por el sitio o aplicación oficial"
          ],
          "correctIndex": 2,
          "explanation": "La verificación independiente evita enlaces controlados por impostores."
        }
      }
    ]
  },
  {
    "id": "lengua-cotidiana",
    "name": "Lengua para la vida",
    "tag": "COMUNICAR",
    "level": "A1",
    "minutes": 64,
    "description": "Practica situaciones reales en español y portugués: presentarte, preguntar, entender horarios y pedir aclaraciones.",
    "outcome": "Resolver una conversación cotidiana con preguntas y confirmación de datos.",
    "capstone": "Redacta un diálogo de ocho turnos para pedir información sobre un curso y confirmar lugar, hora, coste y documentos; ensáyalo en voz alta.",
    "rubric": [
      "Utiliza saludos y peticiones respetuosas.",
      "Confirma al menos dos datos en vez de suponerlos.",
      "Incluye una frase para pedir repetición y otra para despedirse."
    ],
    "lessons": [
      {
        "id": "presentacion",
        "title": "Presentarte sin memorizar un discurso",
        "objective": "Utilizar frases breves en dos idiomas.",
        "concept": "En español puedes decir «Hola, soy Ana. Busco información sobre el curso». En portugués: «Olá, sou Ana. Procuro informações sobre o curso». El verbo cambia, pero la estructura de saludo, nombre y motivo se mantiene.",
        "example": "En una biblioteca dices: «Buenos días. Soy nuevo en el barrio. ¿Puedo preguntar por los horarios?». No necesitas explicar datos privados para obtener información pública.",
        "practice": "Crea dos presentaciones inventadas, una en ES y otra en PT, de tres frases: saludo, motivo y agradecimiento.",
        "quiz": {
          "question": "¿Qué información es imprescindible al pedir un horario?",
          "choices": [
            "Tus contraseñas",
            "Tu motivo y la pregunta",
            "Tu historial médico"
          ],
          "correctIndex": 1,
          "explanation": "Una petición clara solicita el dato necesario sin exponer información sensible."
        }
      },
      {
        "id": "horarios",
        "title": "Confirmar fechas y horas",
        "objective": "Evitar errores de interpretación.",
        "concept": "En español «las tres de la tarde» corresponde a 15:00. En portugués brasileño «às quinze horas» también. Si hay ruido o dudas, repite la información y pide confirmación. Es especialmente importante cuando una cita tiene fecha y lugar.",
        "example": "Recepción: «Su cita es el martes a las 15:00». Respondes: «¿Martes quince a las tres de la tarde, correcto?». Comprobarás también la fecha completa.",
        "practice": "Escribe una conversación inventada que confirme día, mes, hora y lugar. Después conviértela al portugués.",
        "quiz": {
          "question": "¿Qué respuesta comprueba mejor una hora?",
          "choices": [
            "Vale, supongo que mañana",
            "¿Entonces a las quince horas del martes?",
            "No hace falta repetir"
          ],
          "correctIndex": 1,
          "explanation": "Repetir de forma precisa crea una oportunidad de corregir errores."
        }
      },
      {
        "id": "preguntas",
        "title": "Preguntar con cortesía",
        "objective": "Formular dudas usando dónde, cuándo y cuánto.",
        "concept": "«¿Dónde queda la oficina?» pregunta por lugar. «¿Cuándo abre?» pregunta por tiempo. «¿Cuánto cuesta?» pregunta por importe. En portugués: onde, quando y quanto custa. La entonación y un por favor ayudan, pero es más importante la claridad.",
        "example": "Un centro ofrece un taller. Preguntas dónde se realiza, si tiene coste y qué día empieza. Anotas las tres respuestas para no depender de la memoria.",
        "practice": "Escribe seis preguntas sobre un taller imaginario, tres en español y tres en portugués.",
        "quiz": {
          "question": "¿Cuál pregunta sirve para conocer el precio?",
          "choices": [
            "¿Cuánto cuesta?",
            "¿Dónde está?",
            "¿Quién llega?"
          ],
          "correctIndex": 0,
          "explanation": "«Cuánto cuesta» pregunta específicamente por un importe."
        }
      },
      {
        "id": "aclaraciones",
        "title": "Pedir que repitan",
        "objective": "Resolver malentendidos sin vergüenza.",
        "concept": "Decir «¿Puede hablar más despacio, por favor?» o «Pode falar mais devagar, por favor?» da tiempo para entender. También puedes pedir la información por escrito. No finjas haber comprendido una cifra o un requisito importante.",
        "example": "No distingues si te dijeron quince o cincuenta euros. Respondes: «No escuché bien la cantidad. ¿Puede escribirla?». Así evitas una decisión basada en un error.",
        "practice": "Ensaya un diálogo de seis turnos con una cifra confusa, una petición de repetición, una confirmación y una despedida.",
        "quiz": {
          "question": "¿Qué es mejor cuando no entendiste un dato importante?",
          "choices": [
            "Adivinarlo",
            "Pedir aclaración o verlo por escrito",
            "Ignorar el dato"
          ],
          "correctIndex": 1,
          "explanation": "Confirmar datos es una habilidad comunicativa, no una debilidad."
        }
      }
    ]
  },
  {
    "id": "empleo-y-derechos",
    "name": "Empleo y derechos básicos",
    "tag": "AVANZAR",
    "level": "Inicial",
    "minutes": 80,
    "description": "Prácticas para localizar ofertas, presentar candidaturas, leer condiciones y buscar ayuda fiable.",
    "outcome": "Preparar una candidatura simulada y una hoja de preguntas antes de firmar.",
    "capstone": "Elabora una candidatura ficticia con CV sin datos privados reales, correo de presentación y lista de ocho preguntas de una entrevista; revisa también las condiciones escritas.",
    "rubric": [
      "El CV explica capacidades mediante ejemplos concretos.",
      "La candidatura coincide con los requisitos del anuncio.",
      "Las condiciones se revisan con fuentes oficiales o asesoramiento especializado."
    ],
    "lessons": [
      {
        "id": "ofertas",
        "title": "Leer una oferta de trabajo",
        "objective": "Identificar tareas, requisitos y condiciones.",
        "concept": "Separa en una oferta las tareas diarias, habilidades necesarias, jornada, lugar y forma de solicitar. No confundas «se valorará» con «obligatorio». Si faltan sueldo o condiciones, anótalo como pregunta y verifica la empresa por un medio independiente.",
        "example": "Un anuncio ficticio pide trato con público, manejo básico de hojas de cálculo y disponibilidad de tardes. Prepara tres ejemplos concretos que muestren esas capacidades.",
        "practice": "Haz una tabla con tres columnas: lo que piden, lo que sé hacer, lo que tengo que preguntar. Llénala con una oferta inventada.",
        "quiz": {
          "question": "¿Qué debes hacer si la oferta no explica la jornada?",
          "choices": [
            "Inventarla",
            "Preguntar antes de aceptar",
            "Suponer que es jornada completa"
          ],
          "correctIndex": 1,
          "explanation": "Solicitar las condiciones es parte de evaluar una oferta."
        }
      },
      {
        "id": "cv",
        "title": "CV basado en evidencias",
        "objective": "Describir experiencia sin inventar títulos ni resultados.",
        "concept": "Un CV tiene contacto profesional, habilidades relevantes, formación y experiencia verificable. Si careces de experiencia remunerada, puedes incluir proyectos propios, voluntariado o tareas demostrables. Evita cifras infladas y nunca añadas un certificado que no tienes.",
        "example": "En lugar de «experto absoluto», escribe «organicé turnos de un evento comunitario de diez personas» solo si realmente ocurrió. La acción concreta ayuda a quien lee.",
        "practice": "Crea un CV ficticio de una página con tres habilidades y un ejemplo comprobable por cada una. Elimina números de documento y otros datos sensibles.",
        "quiz": {
          "question": "¿Qué mejora la credibilidad de un CV?",
          "choices": [
            "Resultados inventados",
            "Descripción concreta y verdadera",
            "Adjetivos grandiosos sin ejemplos"
          ],
          "correctIndex": 1,
          "explanation": "Los hechos comprobables son más útiles que la exageración."
        }
      },
      {
        "id": "entrevista",
        "title": "Entrevista como conversación",
        "objective": "Preparar preguntas y respuestas breves.",
        "concept": "Una respuesta útil puede seguir situación, acción y resultado. También tienes derecho a preguntar por horario, funciones, formación y próximos pasos. No es necesario revelar información privada irrelevante para demostrar capacidad.",
        "example": "Te preguntan cómo resuelves desacuerdos. Respondes con una situación real, lo que hiciste y qué aprendiste, evitando culpar o divulgar datos de compañeros.",
        "practice": "Escribe dos respuestas ficticias sobre colaboración y organización. Añade tres preguntas que harías al entrevistador.",
        "quiz": {
          "question": "¿Qué respuesta comunica mejor una habilidad?",
          "choices": [
            "Soy genial en todo",
            "Explico una acción concreta y su resultado",
            "Nunca he cometido errores"
          ],
          "correctIndex": 1,
          "explanation": "Describir procesos y aprendizaje permite evaluar competencias."
        }
      },
      {
        "id": "contrato",
        "title": "Leer condiciones antes de aceptar",
        "objective": "Reconocer los datos que conviene comprobar.",
        "concept": "Antes de aceptar una oferta, identifica empleador, puesto, jornada, salario, duración, período de prueba y documentos que te entregarán. Las normas varían según país y tipo de contrato: compara con fuentes laborales oficiales locales y solicita asesoramiento si algo no se entiende.",
        "example": "Recibes una oferta verbal distinta del documento escrito. No firmes por presión: pide una explicación y una versión corregida o confirmada por el canal formal.",
        "practice": "Construye una lista de ocho preguntas para una oferta ficticia y clasifica qué respuestas deben constar por escrito.",
        "quiz": {
          "question": "¿Qué hacer con una cláusula que no comprendes?",
          "choices": [
            "Firmar rápidamente",
            "Pedir aclaración y comprobar la normativa aplicable",
            "Eliminarla tú sin avisar"
          ],
          "correctIndex": 1,
          "explanation": "Comprender las condiciones y contar con información fiable permite decidir con más criterio."
        }
      }
    ]
  },
  {
    "id": "ia-responsable",
    "name": "Inteligencia artificial con criterio",
    "tag": "CREAR",
    "level": "Inicial",
    "minutes": 76,
    "description": "Aprende a preguntar mejor, detectar respuestas erróneas y proteger la privacidad cuando usas asistentes.",
    "outcome": "Usar IA para aprender y producir un borrador verificable, no para inventar evidencia.",
    "capstone": "Crea con ayuda de IA un plan de estudio ficticio; comprueba tres afirmaciones con fuentes confiables y registra qué corregiste antes de usarlo.",
    "rubric": [
      "Se diferencia el borrador de la versión verificada.",
      "Se citan las fuentes externas realmente consultadas.",
      "No se introducen datos sensibles y se mantiene la decisión humana."
    ],
    "lessons": [
      {
        "id": "preguntar",
        "title": "Prompts con contexto y límites",
        "objective": "Pedir ayuda sin ceder tus decisiones.",
        "concept": "Una solicitud útil explica objetivo, público y formato. También indica qué debe hacer el sistema si no tiene una respuesta fiable: reconocer incertidumbre y pedir fuentes. Evita introducir nombres, documentos o datos médicos identificables.",
        "example": "Prompt de ejemplo: «Explica qué es una hoja de cálculo a una persona principiante, con un ejemplo de presupuesto ficticio y tres ejercicios sin datos reales».",
        "practice": "Reescribe «hazme esto» como una solicitud con objetivo, nivel, restricciones y criterio de verificación.",
        "quiz": {
          "question": "¿Qué mejora una petición a la IA?",
          "choices": [
            "Dar contraseñas para personalizar",
            "Explicar tarea, límites y público",
            "Decir solo «haz algo»"
          ],
          "correctIndex": 1,
          "explanation": "El contexto y los límites hacen las respuestas más útiles sin sacrificar privacidad."
        }
      },
      {
        "id": "comprobar",
        "title": "No confundir fluidez con verdad",
        "objective": "Verificar afirmaciones críticas.",
        "concept": "Un asistente puede redactar con seguridad una información falsa o desactualizada. Pídele que distinga hechos y suposiciones; después contrasta los hechos importantes con organismos oficiales, documentos originales o varias fuentes independientes. Una cita inventada no es una fuente.",
        "example": "La IA asegura un plazo para realizar un trámite. En vez de fiarte, consultas la administración competente y compruebas la fecha de actualización y el ámbito territorial.",
        "practice": "Selecciona tres afirmaciones ficticias de una respuesta IA. Escribe dónde y cómo las comprobarías.",
        "quiz": {
          "question": "¿Qué haces si una IA cita una norma que no encuentras?",
          "choices": [
            "Asumir que existe",
            "Comprobar la fuente original antes de utilizarla",
            "Difundirla de inmediato"
          ],
          "correctIndex": 1,
          "explanation": "La comprobación independiente es necesaria cuando importa la exactitud."
        }
      },
      {
        "id": "privacidad",
        "title": "Datos que no debes compartir",
        "objective": "Reconocer información sensible y reducir riesgos.",
        "concept": "Antes de usar un asistente externo revisa si la tarea requiere realmente datos personales. Puedes usar personajes y números inventados para practicar. No incluyas contraseñas, identificadores, información bancaria, expedientes clínicos ni detalles íntimos de terceras personas.",
        "example": "Para practicar una entrevista no hace falta pegar un CV completo con teléfono, dirección y fecha de nacimiento: sustituye los datos por etiquetas como [correo de ejemplo].",
        "practice": "Convierte un documento ficticio con diez campos en una versión apta para un ejercicio con IA, eliminando los identificadores.",
        "quiz": {
          "question": "¿Cuál entrada es adecuada para practicar?",
          "choices": [
            "Mi contraseña real es…",
            "Un caso ficticio sin identificadores",
            "La historia clínica de un tercero"
          ],
          "correctIndex": 1,
          "explanation": "Los datos ficticios permiten aprender sin exponer a nadie."
        }
      },
      {
        "id": "evaluar",
        "title": "Prueba tu propio agente",
        "objective": "Medir utilidad, fallos y decisión humana.",
        "concept": "No llames inteligente a un sistema solo porque responde. Define al menos cinco preguntas de prueba, una pregunta adversarial, resultados esperados y condiciones de parada. Evalúa exactitud, claridad, accesibilidad, tiempo y privacidad. Documenta las respuestas fallidas y las correcciones.",
        "example": "Un tutor acierta cinco ejercicios fáciles pero inventa un enlace. Debe reconocer que no puede verificarlo, no volver a mostrar el enlace como confirmado.",
        "practice": "Diseña una tabla de cinco pruebas para un tutor educativo: pregunta, respuesta esperada, evidencia y resultado. Añade qué tareas no debe ejecutar automáticamente.",
        "quiz": {
          "question": "¿Qué demuestra que un asistente funciona de forma fiable?",
          "choices": [
            "Una respuesta vistosa",
            "Pruebas repetibles, límites y evidencias",
            "Que nunca diga «no sé»"
          ],
          "correctIndex": 1,
          "explanation": "Las pruebas y la transparencia permiten mejorar sistemas reales."
        }
      }
    ]
  },
  {
    "id": "salud-ciudadana",
    "name": "Salud y orientación segura",
    "tag": "CUIDAR",
    "level": "Inicial",
    "minutes": 68,
    "description": "Alfabetización sanitaria: buscar información contrastada, preparar una consulta y reconocer cuándo pedir asistencia profesional. No diagnostica.",
    "outcome": "Preparar preguntas para un profesional sanitario y contrastar información pública de salud.",
    "capstone": "Crea una ficha completamente ficticia para preparar una consulta: motivo en lenguaje cotidiano, tres preguntas y fuentes oficiales que revisarías. No introduzcas síntomas ni expedientes reales.",
    "rubric": [
      "No intenta diagnosticar ni recomendar tratamientos individuales.",
      "Incluye un plan para contactar servicios sanitarios cualificados.",
      "Utiliza fuentes institucionales actuales y respeta la confidencialidad."
    ],
    "lessons": [
      {
        "id": "fuentes",
        "title": "Fuentes fiables de salud",
        "objective": "Distinguir información general de consejo individual.",
        "concept": "Una recomendación de salud depende del contexto clínico y puede cambiar con nueva evidencia. Busca organismos sanitarios públicos, revisiones científicas y profesionales habilitados. Comprueba fecha y ámbito geográfico. Un vídeo viral o una respuesta automática no sustituye una valoración clínica.",
        "example": "Un sitio promete curar todas las enfermedades con un solo producto. Buscas el organismo regulador competente y verificas si existen pruebas y advertencias. No compras por presión.",
        "practice": "Compara dos textos ficticios y señala autor, fecha, evidencia, intereses comerciales y afirmaciones demasiado absolutas.",
        "quiz": {
          "question": "¿Qué fuente merece una comprobación prioritaria?",
          "choices": [
            "Anuncio que promete una cura universal",
            "Portal de autoridad sanitaria con fecha y referencias",
            "Mensaje reenviado sin autor"
          ],
          "correctIndex": 1,
          "explanation": "La procedencia y la evidencia importan más que una promesa espectacular."
        }
      },
      {
        "id": "consulta",
        "title": "Preparar una consulta",
        "objective": "Comunicar preguntas relevantes sin autodiagnosticar.",
        "concept": "Antes de una consulta puedes anotar, para uso privado, qué quieres preguntar y qué información te solicitará el profesional. No es necesario introducir detalles de salud en una plataforma educativa. Si alguien presenta síntomas graves o una urgencia, debe contactar los servicios de emergencia de su localidad.",
        "example": "Una persona quiere entender un informe médico. Prepara preguntas como «¿Qué significa este término?», «¿Qué alternativas debo discutir?» y «¿A quién contacto si empeoro?». No adopta una decisión por una explicación automática.",
        "practice": "Escribe cinco preguntas generales para una cita simulada usando un caso inventado; identifica cuáles requieren respuesta profesional.",
        "quiz": {
          "question": "¿Para qué sirve esta plataforma en una consulta?",
          "choices": [
            "Diagnosticar por un cuestionario",
            "Preparar preguntas y reconocer límites",
            "Cambiar la medicación sin supervisión"
          ],
          "correctIndex": 1,
          "explanation": "El aprendizaje ayuda a conversar mejor con profesionales, no los reemplaza."
        }
      },
      {
        "id": "privacidad",
        "title": "Privacidad de información sanitaria",
        "objective": "Proteger datos sensibles al pedir orientación.",
        "concept": "La información clínica es especialmente sensible. No publiques recetas, números de identificación, diagnósticos ni imágenes de documentos en foros. Comprueba quién recibirá una pregunta antes de enviarla. Para estudiar conceptos utiliza casos ficticios y conserva tus documentos en un lugar privado.",
        "example": "Quieres traducir una instrucción médica: elimina nombre, número de historia y otros identificadores y, si hay dudas sobre indicaciones, consulta al personal sanitario o servicio de interpretación.",
        "practice": "Transforma un ejemplo de formulario en una versión que solo contenga preguntas generales de vocabulario y ninguna información identificable.",
        "quiz": {
          "question": "¿Qué es lo más seguro para un ejercicio público?",
          "choices": [
            "Subir una receta con nombre",
            "Usar un ejemplo completamente ficticio",
            "Enviar datos clínicos de un familiar"
          ],
          "correctIndex": 1,
          "explanation": "Un ejemplo ficticio preserva la finalidad educativa sin exponer datos."
        }
      },
      {
        "id": "decidir",
        "title": "Cuándo pedir ayuda humana",
        "objective": "Identificar límites de un chatbot educativo.",
        "concept": "Un tutor puede explicar cómo buscar un centro, qué suele significar una palabra o cómo preparar preguntas. No puede observar al paciente, explorarle ni valorar urgencias con fiabilidad. Ante una posible emergencia, busca atención urgente por los canales de tu localidad; en otras situaciones, consulta un profesional sanitario.",
        "example": "Alguien pregunta «¿Puedo dejar este tratamiento?». El tutor no responde que sí o no: indica que esa decisión requiere al profesional prescriptor y ofrece ayuda para preparar una pregunta clara.",
        "practice": "Clasifica cinco preguntas ficticias entre educación general y evaluación clínica. Redacta una respuesta segura para una petición de diagnóstico.",
        "quiz": {
          "question": "¿Qué debería hacer el tutor ante «¿Qué enfermedad tengo?»?",
          "choices": [
            "Dar un diagnóstico definitivo",
            "Orientar a atención profesional y ofrecer información general",
            "Recomendar un tratamiento personal"
          ],
          "correctIndex": 1,
          "explanation": "Una herramienta educativa reconoce el límite entre información y práctica clínica."
        }
      }
    ]
  }
];
export const PLAZA_NEEDS = [
  { id: 'digital', label: 'Manejar dispositivos y trámites', trackId: 'autonomia-digital' },
  { id: 'language', label: 'Hablar y entender información', trackId: 'lengua-cotidiana' },
  { id: 'job', label: 'Buscar trabajo y conocer condiciones', trackId: 'empleo-y-derechos' },
  { id: 'ai', label: 'Aprender a utilizar asistentes de IA', trackId: 'ia-responsable' },
  { id: 'health', label: 'Entender información general de salud', trackId: 'salud-ciudadana' },
] as const;
export function findTrack(id: string): PlazaTrack | undefined { return PLAZA_TRACKS.find(track => track.id === id); }
export function recommendTrack(needId: string): PlazaTrack | undefined {
  const need = PLAZA_NEEDS.find(need => need.id === needId);
  return need ? findTrack(need.trackId) : undefined;
}

import type { Lesson } from "@/shared/types";

/**
 * Lesson templates for each niche with real-world scenarios
 * These serve as templates that can be expanded with more lessons
 */

export const LOGISTICS_LESSONS: Lesson[] = [
  {
    id: "log-1",
    nicheId: "logistics",
    title: "Envío Internacional Básico",
    description: "Aprende términos esenciales para envíos internacionales",
    duration: 10,
    order: 1,
    status: "available",
    progress: 0,
    modules: [
      {
        id: "log-1-intro",
        type: "introduction",
        title: "Escenario Real",
        content:
          "Eres un agente de logística. Un cliente necesita enviar un paquete urgente a Alemania. Debes explicarle las opciones disponibles.",
      },
      {
        id: "log-1-vocab",
        type: "vocabulary",
        title: "Vocabulario Clave",
        content: [
          {
            word: "Shipping",
            translation: "Envío",
            pronunciation: "ˈʃɪpɪŋ",
            example: "The shipping cost is $50",
            exampleTranslation: "El costo del envío es $50",
          },
          {
            word: "Customs",
            translation: "Aduanas",
            pronunciation: "ˈkʌstəmz",
            example: "Customs will inspect your package",
            exampleTranslation: "Las aduanas inspeccionarán tu paquete",
          },
          {
            word: "Tracking number",
            translation: "Número de seguimiento",
            pronunciation: "ˈtrækɪŋ ˈnʌmbər",
            example: "Here is your tracking number",
            exampleTranslation: "Aquí está tu número de seguimiento",
          },
          {
            word: "Delivery",
            translation: "Entrega",
            pronunciation: "dɪˈlɪvəri",
            example: "Delivery will arrive in 3 days",
            exampleTranslation: "La entrega llegará en 3 días",
          },
        ],
      },
      {
        id: "log-1-dialogue",
        type: "dialogue",
        title: "Diálogo Profesional",
        content: {
          lines: [
            {
              speaker: "Customer",
              text: "I need to ship this package to Germany urgently",
              lang: "en",
            },
            {
              speaker: "Agent",
              text: "Necesito enviar este paquete a Alemania urgentemente",
              lang: "es",
            },
            {
              speaker: "Agent",
              text: "We have two options: Express (2 days) or Standard (5 days)",
              lang: "en",
            },
            {
              speaker: "Customer",
              text: "Tenemos dos opciones: Expresado (2 días) o Estándar (5 días)",
              lang: "es",
            },
            {
              speaker: "Customer",
              text: "What about customs?",
              lang: "en",
            },
            {
              speaker: "Agent",
              text: "¿Qué hay de las aduanas?",
              lang: "es",
            },
            {
              speaker: "Agent",
              text: "Customs clearance is included. You will receive a tracking number",
              lang: "en",
            },
            {
              speaker: "Customer",
              text: "El despacho aduanal está incluido. Recibirás un número de seguimiento",
              lang: "es",
            },
          ],
        },
      },
      {
        id: "log-1-exercise",
        type: "exercise",
        title: "Práctica",
        content: {
          type: "multiple_choice",
          question: "¿Cuál es la palabra en inglés para 'número de seguimiento'?",
          options: ["Shipping number", "Tracking number", "Delivery number", "Package number"],
          correctAnswer: "Tracking number",
          explanation:
            "Correcto. 'Tracking number' es el término profesional usado en logística internacional.",
        },
      },
      {
        id: "log-1-summary",
        type: "summary",
        title: "Resumen",
        content: "Has aprendido vocabulario esencial para envíos internacionales.",
      },
    ],
  },
  {
    id: "log-2",
    nicheId: "logistics",
    title: "Documentación Aduanal",
    description: "Entiende los documentos necesarios para aduanas",
    duration: 12,
    order: 2,
    status: "available",
    progress: 0,
    modules: [
      {
        id: "log-2-intro",
        type: "introduction",
        title: "Escenario Real",
        content:
          "Un cliente necesita entender qué documentos debe preparar para un envío internacional. Explícale los requisitos.",
      },
      {
        id: "log-2-vocab",
        type: "vocabulary",
        title: "Documentación",
        content: [
          {
            word: "Invoice",
            translation: "Factura",
            pronunciation: "ˈɪnvɔɪs",
            example: "Please provide the commercial invoice",
            exampleTranslation: "Por favor proporciona la factura comercial",
          },
          {
            word: "Bill of lading",
            translation: "Conocimiento de embarque",
            pronunciation: "bɪl əv ˈleɪdɪŋ",
            example: "The bill of lading is required for customs",
            exampleTranslation: "El conocimiento de embarque es requerido por aduanas",
          },
          {
            word: "Packing list",
            translation: "Lista de empaque",
            pronunciation: "ˈpækɪŋ lɪst",
            example: "Attach the packing list to the package",
            exampleTranslation: "Adjunta la lista de empaque al paquete",
          },
          {
            word: "Certificate of origin",
            translation: "Certificado de origen",
            pronunciation: "sərˈtɪfɪkət əv ˈɔrɪdʒɪn",
            example: "Some products require a certificate of origin",
            exampleTranslation: "Algunos productos requieren certificado de origen",
          },
        ],
      },
      {
        id: "log-2-dialogue",
        type: "dialogue",
        title: "Conversación",
        content: {
          lines: [
            {
              speaker: "Customer",
              text: "What documents do I need for export?",
              lang: "en",
            },
            {
              speaker: "Agent",
              text: "¿Qué documentos necesito para exportar?",
              lang: "es",
            },
            {
              speaker: "Agent",
              text: "You need: invoice, packing list, and bill of lading",
              lang: "en",
            },
            {
              speaker: "Customer",
              text: "Necesitas: factura, lista de empaque y conocimiento de embarque",
              lang: "es",
            },
          ],
        },
      },
      {
        id: "log-2-exercise",
        type: "exercise",
        title: "Ejercicio",
        content: {
          type: "multiple_choice",
          question: "¿Cuál documento es el 'bill of lading'?",
          options: [
            "Factura comercial",
            "Conocimiento de embarque",
            "Lista de empaque",
            "Certificado de origen",
          ],
          correctAnswer: "Conocimiento de embarque",
          explanation:
            "Correcto. El 'bill of lading' es el documento que prueba la recepción de mercancías para transporte.",
        },
      },
      {
        id: "log-2-summary",
        type: "summary",
        title: "Resumen",
        content: "Ahora entiendes los documentos esenciales para aduanas.",
      },
    ],
  },
];

export const MEDICINE_LESSONS: Lesson[] = [
  {
    id: "med-1",
    nicheId: "medicine",
    title: "Síntomas Comunes",
    description: "Vocabulario médico para describir síntomas",
    duration: 12,
    order: 1,
    status: "available",
    progress: 0,
    modules: [
      {
        id: "med-1-intro",
        type: "introduction",
        title: "Escenario Real",
        content:
          "Un paciente llega a la clínica sin hablar tu idioma. Necesitas entender sus síntomas en inglés.",
      },
      {
        id: "med-1-vocab",
        type: "vocabulary",
        title: "Síntomas",
        content: [
          {
            word: "Fever",
            translation: "Fiebre",
            pronunciation: "ˈfɛvər",
            example: "I have a high fever",
            exampleTranslation: "Tengo fiebre alta",
          },
          {
            word: "Headache",
            translation: "Dolor de cabeza",
            pronunciation: "ˈhɛdeɪk",
            example: "I have a terrible headache",
            exampleTranslation: "Tengo un dolor de cabeza terrible",
          },
          {
            word: "Cough",
            translation: "Tos",
            pronunciation: "kɔf",
            example: "I have been coughing all night",
            exampleTranslation: "He estado tosiendo toda la noche",
          },
          {
            word: "Nausea",
            translation: "Náusea",
            pronunciation: "ˈnɔʒə",
            example: "I feel nausea and dizziness",
            exampleTranslation: "Siento náusea y mareos",
          },
        ],
      },
      {
        id: "med-1-dialogue",
        type: "dialogue",
        title: "Consulta Médica",
        content: {
          lines: [
            {
              speaker: "Doctor",
              text: "What are your symptoms?",
              lang: "en",
            },
            {
              speaker: "Patient",
              text: "¿Cuáles son tus síntomas?",
              lang: "es",
            },
            {
              speaker: "Patient",
              text: "I have a fever and a bad cough",
              lang: "en",
            },
            {
              speaker: "Doctor",
              text: "Tengo fiebre y una tos fuerte",
              lang: "es",
            },
            {
              speaker: "Doctor",
              text: "How long have you had these symptoms?",
              lang: "en",
            },
            {
              speaker: "Patient",
              text: "¿Cuánto tiempo llevas con estos síntomas?",
              lang: "es",
            },
            {
              speaker: "Patient",
              text: "For three days",
              lang: "en",
            },
            {
              speaker: "Doctor",
              text: "Por tres días",
              lang: "es",
            },
          ],
        },
      },
      {
        id: "med-1-exercise",
        type: "exercise",
        title: "Práctica",
        content: {
          type: "multiple_choice",
          question: "¿Cuál es la palabra para 'tos' en inglés?",
          options: ["Fever", "Cough", "Headache", "Nausea"],
          correctAnswer: "Cough",
          explanation: "Correcto. 'Cough' es el término médico para tos.",
        },
      },
      {
        id: "med-1-summary",
        type: "summary",
        title: "Resumen",
        content: "Has aprendido vocabulario esencial para describir síntomas.",
      },
    ],
  },
];

export const SALES_LESSONS: Lesson[] = [
  {
    id: "sales-1",
    nicheId: "sales",
    title: "Apertura de Venta",
    description: "Cómo iniciar una conversación de venta profesional",
    duration: 10,
    order: 1,
    status: "available",
    progress: 0,
    modules: [
      {
        id: "sales-1-intro",
        type: "introduction",
        title: "Escenario Real",
        content:
          "Tienes una llamada con un cliente potencial. Necesitas captar su atención en los primeros 30 segundos.",
      },
      {
        id: "sales-1-vocab",
        type: "vocabulary",
        title: "Vocabulario de Ventas",
        content: [
          {
            word: "Value proposition",
            translation: "Propuesta de valor",
            pronunciation: "ˈvæljuː ˌprɑpəˈzɪʃən",
            example: "Our value proposition is unmatched quality",
            exampleTranslation: "Nuestra propuesta de valor es calidad sin igual",
          },
          {
            word: "Pain point",
            translation: "Punto de dolor",
            pronunciation: "peɪn pɔɪnt",
            example: "What is your main pain point?",
            exampleTranslation: "¿Cuál es tu principal punto de dolor?",
          },
          {
            word: "ROI",
            translation: "Retorno de inversión",
            pronunciation: "ɑr oʊ aɪ",
            example: "Our solution provides 300% ROI",
            exampleTranslation: "Nuestra solución proporciona 300% de ROI",
          },
          {
            word: "Close the deal",
            translation: "Cerrar la venta",
            pronunciation: "kloʊz ðə dil",
            example: "Let's close the deal today",
            exampleTranslation: "Cerremos la venta hoy",
          },
        ],
      },
      {
        id: "sales-1-dialogue",
        type: "dialogue",
        title: "Pitch de Venta",
        content: {
          lines: [
            {
              speaker: "Salesperson",
              text: "Hi! I noticed your company is growing rapidly",
              lang: "en",
            },
            {
              speaker: "Client",
              text: "¡Hola! Noté que tu empresa está creciendo rápidamente",
              lang: "es",
            },
            {
              speaker: "Client",
              text: "Yes, but we're struggling with efficiency",
              lang: "en",
            },
            {
              speaker: "Salesperson",
              text: "Sí, pero estamos luchando con la eficiencia",
              lang: "es",
            },
            {
              speaker: "Salesperson",
              text: "That's exactly what we solve. Can I show you how?",
              lang: "en",
            },
            {
              speaker: "Client",
              text: "Eso es exactamente lo que resolvemos. ¿Puedo mostrarte cómo?",
              lang: "es",
            },
          ],
        },
      },
      {
        id: "sales-1-exercise",
        type: "exercise",
        title: "Práctica",
        content: {
          type: "multiple_choice",
          question: "¿Qué significa 'close the deal'?",
          options: [
            "Cerrar la puerta",
            "Cerrar la venta",
            "Cerrar la conversación",
            "Cerrar el negocio",
          ],
          correctAnswer: "Cerrar la venta",
          explanation: "Correcto. 'Close the deal' significa finalizar la venta.",
        },
      },
      {
        id: "sales-1-summary",
        type: "summary",
        title: "Resumen",
        content: "Has aprendido cómo iniciar una conversación de venta efectiva.",
      },
    ],
  },
];

export const TOURISM_LESSONS: Lesson[] = [
  {
    id: "tour-1",
    nicheId: "tourism",
    title: "Atención al Cliente en Hotel",
    description: "Frases esenciales para recepcionistas de hotel",
    duration: 10,
    order: 1,
    status: "available",
    progress: 0,
    modules: [
      {
        id: "tour-1-intro",
        type: "introduction",
        title: "Escenario Real",
        content:
          "Un huésped llega al hotel sin hablar tu idioma. Necesitas ayudarle con el check-in.",
      },
      {
        id: "tour-1-vocab",
        type: "vocabulary",
        title: "Vocabulario Hotelero",
        content: [
          {
            word: "Check-in",
            translation: "Registro de entrada",
            pronunciation: "ˈtʃɛk ɪn",
            example: "Check-in is at 3 PM",
            exampleTranslation: "El registro es a las 3 PM",
          },
          {
            word: "Reservation",
            translation: "Reservación",
            pronunciation: "ˌrɛzərˈveɪʃən",
            example: "Do you have a reservation?",
            exampleTranslation: "¿Tienes una reservación?",
          },
          {
            word: "Room service",
            translation: "Servicio a la habitación",
            pronunciation: "rum ˈsɜrvɪs",
            example: "Room service is available 24/7",
            exampleTranslation: "El servicio a la habitación está disponible 24/7",
          },
          {
            word: "Amenities",
            translation: "Servicios",
            pronunciation: "əˈmɛnɪtiz",
            example: "Our amenities include a pool and gym",
            exampleTranslation: "Nuestros servicios incluyen piscina y gimnasio",
          },
        ],
      },
      {
        id: "tour-1-dialogue",
        type: "dialogue",
        title: "Check-in",
        content: {
          lines: [
            {
              speaker: "Receptionist",
              text: "Welcome! Do you have a reservation?",
              lang: "en",
            },
            {
              speaker: "Guest",
              text: "¡Bienvenido! ¿Tienes una reservación?",
              lang: "es",
            },
            {
              speaker: "Guest",
              text: "Yes, under the name Johnson",
              lang: "en",
            },
            {
              speaker: "Receptionist",
              text: "Sí, a nombre de Johnson",
              lang: "es",
            },
            {
              speaker: "Receptionist",
              text: "Perfect! You're in room 305. Here's your key card",
              lang: "en",
            },
            {
              speaker: "Guest",
              text: "¡Perfecto! Estás en la habitación 305. Aquí está tu tarjeta",
              lang: "es",
            },
          ],
        },
      },
      {
        id: "tour-1-exercise",
        type: "exercise",
        title: "Práctica",
        content: {
          type: "multiple_choice",
          question: "¿Qué es 'room service'?",
          options: [
            "Limpieza de habitación",
            "Servicio a la habitación",
            "Servicio de recepción",
            "Servicio de comida",
          ],
          correctAnswer: "Servicio a la habitación",
          explanation: "Correcto. 'Room service' es el servicio de comida y bebidas a la habitación.",
        },
      },
      {
        id: "tour-1-summary",
        type: "summary",
        title: "Resumen",
        content: "Has aprendido frases esenciales para atención hotelera.",
      },
    ],
  },
];

// Export all lessons by niche
export const ALL_LESSONS_BY_NICHE = {
  logistics: LOGISTICS_LESSONS,
  medicine: MEDICINE_LESSONS,
  sales: SALES_LESSONS,
  tourism: TOURISM_LESSONS,
  construction: [],
  gastronomy: [],
  technology: [],
  finance: [],
};

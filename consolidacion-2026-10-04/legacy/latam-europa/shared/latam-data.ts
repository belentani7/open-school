export const TOPICS = [
  "documentacion",
  "residencia",
  "trabajo",
  "vivienda",
  "salud",
  "educacion",
  "integracion",
] as const;

export type Topic = (typeof TOPICS)[number];
export type SourceStatus = "verified" | "review" | "unavailable";

export type OfficialSource = {
  slug: string;
  entity: string;
  title: string;
  category: Topic;
  url: string;
  lastCheckedAt: string;
  status: SourceStatus;
  note: string;
};

export type Guide = {
  slug: string;
  topic: Topic;
  title: string;
  eyebrow: string;
  description: string;
  steps: string[];
  requirements: string[];
  scope: string;
  sourceSlugs: string[];
};

export const topicMeta: Record<Topic, { label: string; shortLabel: string }> = {
  documentacion: { label: "Documentación", shortLabel: "Documentos" },
  residencia: { label: "Residencia", shortLabel: "Residencia" },
  trabajo: { label: "Trabajo", shortLabel: "Trabajo" },
  vivienda: { label: "Vivienda", shortLabel: "Vivienda" },
  salud: { label: "Salud", shortLabel: "Salud" },
  educacion: { label: "Educación", shortLabel: "Educación" },
  integracion: { label: "Integración", shortLabel: "Integración" },
};

const initialReview = "2026-08-27T06:54:24.000Z";
const expansionReview = "2026-08-27T07:16:31.000Z";

export const officialSources: OfficialSource[] = [
  {
    slug: "policia-extranjeria",
    entity: "Policía Nacional",
    title: "Servicios y trámites de extranjería",
    category: "documentacion",
    url: "https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria.php",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Incluye procedimientos de NIE, tarjetas y documentación vinculada a extranjería.",
  },
  {
    slug: "cita-previa-extranjeria",
    entity: "Administración General del Estado",
    title: "Cita previa de extranjería",
    category: "documentacion",
    url: "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Canal oficial de cita para la presentación de solicitudes en oficinas de extranjería; la entidad competente varía según el trámite y la provincia.",
  },
  {
    slug: "cita-previa-age",
    entity: "Punto de Acceso General · Administración General del Estado",
    title: "Solicitar cita previa",
    category: "documentacion",
    url: "https://administracion.gob.es/pag_Home/atencionCiudadana/Solicitar_cita_previa-nueva.html",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Índice oficial de citas frecuentes de la Administración General del Estado, con acceso a extranjería, empleo, registros y otros servicios presenciales.",
  },
  {
    slug: "migraciones-vivir-espana",
    entity: "Ministerio de Inclusión, Seguridad Social y Migraciones",
    title: "Portal de Migraciones",
    category: "residencia",
    url: "https://www.inclusion.gob.es/web/migraciones",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Portal institucional para información de migraciones, integración y recursos estatales.",
  },
  {
    slug: "extranjeria-delegaciones",
    entity: "Ministerio de Política Territorial y Memoria Democrática",
    title: "Extranjería en Delegaciones del Gobierno",
    category: "residencia",
    url: "https://mptmd.gob.es/portal/delegaciones_gobierno/extranjeria",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Acceso a oficinas, solicitudes telemáticas, modelos y cita previa cuando corresponda.",
  },
  {
    slug: "sepe-empleo",
    entity: "Servicio Público de Empleo Estatal",
    title: "Servicios de empleo para personas",
    category: "trabajo",
    url: "https://sede.sepe.gob.es/portalSede/es/procedimientos-y-servicios/personas/empleo",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Reúne búsqueda de empleo, orientación, demanda y ofertas públicas.",
  },
  {
    slug: "seguridad-social-nuss",
    entity: "Tesorería General de la Seguridad Social",
    title: "Solicitar el Número de la Seguridad Social (NUSS)",
    category: "trabajo",
    url: "https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Altas%2C+bajas+y+modificaciones/Altas+y+afiliacion+de+trabajadores/Solicitar+el+numero+de+la+Seguridad+Social",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Servicio oficial para solicitar el NUSS, necesario para el alta laboral inicial y utilizado por el sistema sanitario autonómico en los supuestos que correspondan.",
  },
  {
    slug: "madrid-ayuda-alquiler",
    entity: "Comunidad de Madrid · Administración Digital",
    title: "Ayudas al alquiler de vivienda",
    category: "vivienda",
    url: "https://sede.comunidad.madrid/ayudas-becas-subvenciones/ayudas-alquiler-jovenes-0",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Convocatoria autonómica de Madrid en tramitación; su alcance y requisitos se limitan a esa comunidad y a la convocatoria publicada.",
  },
  {
    slug: "vivienda-ayudas-ccaa",
    entity: "Ministerio de Vivienda y Agenda Urbana",
    title: "Ayudas al alquiler por comunidades autónomas",
    category: "vivienda",
    url: "https://www.mivau.gob.es/vivienda/alquila-bien-es-tu-derecho/alquiler/fianza",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Recurso estatal de orientación que reúne referencias territoriales. Las convocatorias, cuantías y requisitos aplicables dependen de la comunidad autónoma y del periodo publicado.",
  },
  {
    slug: "sanidad-acceso-universal",
    entity: "Ministerio de Sanidad",
    title: "Acceso a la sanidad pública",
    category: "salud",
    url: "https://www.sanidad.gob.es/profesionales/prestacionesSanitarias/CarteraDeServicios/AccesoUsuariosCS/accesoUniversalSP.htm",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Información estatal sobre el acceso a prestaciones del Sistema Nacional de Salud.",
  },
  {
    slug: "educacion-homologacion",
    entity: "Ministerio de Educación, Formación Profesional y Deportes",
    title: "Solicitud de homologación y convalidación",
    category: "educacion",
    url: "https://www.educacionfpydeportes.gob.es/mc/convalidacion-homologacion/convalidacion-no-universitaria/solicitud.html",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Ficha oficial de solicitud para homologar o convalidar títulos y estudios extranjeros no universitarios.",
  },
  {
    slug: "migraciones-integracion",
    entity: "Ministerio de Inclusión, Seguridad Social y Migraciones",
    title: "Información de integración migratoria",
    category: "integracion",
    url: "https://www.inclusion.gob.es/web/migraciones",
    lastCheckedAt: initialReview,
    status: "verified",
    note: "Portal estatal con acceso a integración, acogida y observatorios especializados.",
  },
  {
    slug: "migraciones-integracion-especifica",
    entity: "Ministerio de Inclusión, Seguridad Social y Migraciones",
    title: "Integración de personas migrantes",
    category: "integracion",
    url: "https://www.inclusion.gob.es/web/migraciones/integracion",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Página institucional sobre políticas de integración, prioridades, Oberaxe y el Foro para la Integración Social de los Inmigrantes (FISI).",
  },
  {
    slug: "padron-barcelona",
    entity: "Ayuntamiento de Barcelona",
    title: "Alta en el Padrón municipal de habitantes",
    category: "integracion",
    url: "https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/es/tramit/20200001402/12/27/documents-needed",
    lastCheckedAt: expansionReview,
    status: "verified",
    note: "Ejemplo territorial oficial de alta en padrón. Es aplicable al municipio de Barcelona; en otros municipios, consulta el ayuntamiento de residencia para conocer su procedimiento y documentos.",
  },
];

export const guides: Guide[] = [
  {
    slug: "primeros-documentos",
    topic: "documentacion",
    title: "Ordena tus documentos de llegada",
    eyebrow: "Primeros pasos",
    description: "Ubica el trámite que corresponde a tu situación antes de pedir una cita o pagar una tasa.",
    steps: [
      "Identifica si necesitas asignación de NIE, tarjeta de estudiante, TIE u otro procedimiento específico.",
      "Lee el trámite completo y descarga exclusivamente los formularios publicados por el organismo competente.",
      "Conserva comprobantes, copias y el número de expediente de cada presentación.",
    ],
    requirements: ["Documento de identidad o pasaporte vigente.", "Tipo de estancia o autorización aplicable.", "Provincia y organismo competente para solicitar la cita, cuando el procedimiento la exija."],
    scope: "La documentación exigida cambia según el procedimiento y la situación personal. Confirma los requisitos en la fuente oficial antes de actuar.",
    sourceSlugs: ["policia-extranjeria", "cita-previa-extranjeria", "cita-previa-age"],
  },
  {
    slug: "ruta-residencia",
    topic: "residencia",
    title: "Encuentra la ruta de residencia aplicable",
    eyebrow: "Situación migratoria",
    description: "Parte de las hojas informativas y de la oficina competente, no de resúmenes no oficiales.",
    steps: [
      "Revisa las hojas informativas oficiales para identificar la autorización que encaja con tu objetivo.",
      "Confirma si la solicitud puede iniciarse en línea o requiere una oficina de extranjería concreta.",
      "Consulta el estado de tu expediente solo en los canales institucionales indicados.",
    ],
    requirements: ["Tipo de autorización o renovación a solicitar.", "Medio de identificación digital cuando el trámite lo requiera.", "Canal y cita previa de la provincia competente, si el procedimiento exige atención presencial."],
    scope: "LATAM Europa no determina qué autorización corresponde en un caso individual ni sustituye una consulta profesional.",
    sourceSlugs: ["migraciones-vivir-espana", "extranjeria-delegaciones", "cita-previa-extranjeria"],
  },
  {
    slug: "buscar-trabajo",
    topic: "trabajo",
    title: "Activa tu búsqueda de empleo con canales públicos",
    eyebrow: "Empleo y orientación",
    description: "Accede a servicios públicos de orientación, ofertas y trámites de demanda cuando tu situación lo permita.",
    steps: [
      "Explora las ofertas y recursos de orientación disponibles en el sistema público de empleo.",
      "Comprueba las condiciones de acceso a la demanda de empleo con el servicio competente de tu territorio.",
      "Antes de aceptar un empleo, verifica que tu autorización o visado permita la actividad propuesta.",
      "Si vas a iniciar actividad laboral y no tienes asignado NUSS, consulta el procedimiento oficial de la Seguridad Social.",
    ],
    requirements: ["Situación de residencia y trabajo aplicable.", "Documentación requerida por el servicio de empleo territorial.", "Número de Seguridad Social cuando sea necesario para tu alta laboral."],
    scope: "La guía no valida contratos ni derechos laborales individuales. Si existe un conflicto laboral, busca orientación profesional o sindical especializada.",
    sourceSlugs: ["sepe-empleo", "seguridad-social-nuss", "migraciones-vivir-espana"],
  },
  {
    slug: "alojamiento-responsable",
    topic: "vivienda",
    title: "Busca vivienda con información verificable",
    eyebrow: "Alojamiento",
    description: "Consulta las ayudas y recursos públicos de tu comunidad autónoma y municipio antes de comprometerte.",
    steps: [
      "Guarda por escrito las condiciones esenciales de cualquier oferta de alquiler.",
      "Consulta en tu comunidad autónoma y ayuntamiento los programas o servicios disponibles en tu lugar de residencia.",
      "Contrasta la convocatoria territorial vigente en el directorio oficial antes de asumir que existe una ayuda aplicable a tu situación.",
      "No compartas documentación sensible ni realices pagos sin comprobar la identidad y las condiciones de la parte arrendadora.",
    ],
    requirements: ["Municipio o comunidad autónoma de residencia.", "Condiciones publicadas en cada convocatoria vigente."],
    scope: "Las ayudas y requisitos de vivienda dependen del territorio y de cada convocatoria. La fuente enlazada corresponde a una convocatoria de la Comunidad de Madrid; confirma siempre el recurso de tu territorio.",
    sourceSlugs: ["vivienda-ayudas-ccaa", "madrid-ayuda-alquiler"],
  },
  {
    slug: "acceso-salud",
    topic: "salud",
    title: "Orienta tu acceso a la atención sanitaria",
    eyebrow: "Salud",
    description: "Consulta la vía de acceso adecuada antes de necesitar atención no urgente y localiza el servicio de salud de tu comunidad.",
    steps: [
      "Revisa la información estatal sobre acceso a prestaciones sanitarias.",
      "Consulta con el servicio de salud de tu comunidad autónoma qué gestiones aplican a tu caso.",
      "Si el servicio competente te solicita identificación en la Seguridad Social, comprueba primero si dispones de NUSS y consulta su procedimiento oficial si no lo tienes.",
      "En una emergencia, utiliza los servicios de urgencia correspondientes.",
    ],
    requirements: ["Situación de residencia y cobertura aplicable.", "Gestiones del servicio sanitario competente.", "Número de Seguridad Social cuando el procedimiento autonómico lo requiera."],
    scope: "Esta guía es informativa y no realiza valoración médica ni determina cobertura sanitaria individual.",
    sourceSlugs: ["sanidad-acceso-universal", "seguridad-social-nuss"],
  },
  {
    slug: "estudios-homologacion",
    topic: "educacion",
    title: "Planifica la homologación de estudios",
    eyebrow: "Formación",
    description: "Distingue entre homologación y convalidación y usa las páginas oficiales específicas por tipo de estudios.",
    steps: [
      "Comprueba qué estudios o títulos pueden homologarse o convalidarse.",
      "Revisa las indicaciones aplicables a tu país de origen y reúne la documentación requerida.",
      "Antes de iniciar la solicitud, revisa el canal electrónico y los documentos de la ficha oficial específica para estudios no universitarios.",
      "Presenta la solicitud a través de los canales oficiales y conserva la referencia del expediente.",
    ],
    requirements: ["Título o estudios extranjeros a revisar.", "Documentación y tasa que indique la ficha oficial aplicable.", "Traducción o legalización de documentos cuando la página oficial del procedimiento lo requiera."],
    scope: "Los requisitos y documentos dependen del nivel educativo y del país de expedición. Consulta siempre la ficha oficial completa.",
    sourceSlugs: ["educacion-homologacion"],
  },
  {
    slug: "red-integracion",
    topic: "integracion",
    title: "Conecta con la red de integración",
    eyebrow: "Vida cotidiana",
    description: "Ubica los puntos institucionales y sociales que pueden orientar tu llegada y adaptación al territorio.",
    steps: [
      "Consulta los recursos de integración y acogida enlazados desde el portal estatal de Migraciones.",
      "Identifica los servicios públicos de tu comunidad autónoma y municipio de residencia.",
      "El empadronamiento se gestiona en el ayuntamiento de residencia. Si tu destino es Barcelona, consulta el procedimiento municipal específico incluido como ejemplo territorial.",
      "Contrasta la información recibida con la entidad competente y anota la fecha de tu consulta.",
    ],
    requirements: ["Lugar de residencia o destino en España.", "Necesidad concreta de orientación o acogida.", "Procedimiento y documentos indicados por el ayuntamiento competente para el padrón municipal."],
    scope: "Los recursos disponibles varían por territorio y perfil. LATAM Europa no reemplaza la valoración de los servicios sociales ni de entidades especializadas.",
    sourceSlugs: ["migraciones-integracion-especifica", "migraciones-integracion", "padron-barcelona"],
  },
];

export function getSourceBySlug(slug: string) {
  return officialSources.find(source => source.slug === slug);
}

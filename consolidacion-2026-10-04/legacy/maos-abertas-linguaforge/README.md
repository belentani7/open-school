# Maos Abertas + LinguaForge

**Maos Abertas + LinguaForge** es una institución digital de aprendizaje para conectar idiomas, tecnología cotidiana, programación y alfabetización responsable en inteligencia artificial. Esta base unifica la vocación de inclusión digital de Maos Abertas con el modelo de aprendizaje CEFR, práctica y progreso de LinguaForge en una única experiencia de producto.

## Qué incluye esta entrega

La plataforma presenta una institución con seis facultades conectadas, programas navegables, un catálogo con **39 idiomas de estudio**, perfiles de idioma con progresión **CEFR A1–C2**, un diagnóstico orientativo, área personal con progreso persistente, lecciones con objetivos verificables, biblioteca de recursos, tutor contextual y práctica oral voluntaria con transcripción.

| Área | Entregado | Alcance actual |
|---|---:|---|
| Identidad institucional | Sí | Marca unificada Maos Abertas + LinguaForge, misión y navegación pública. |
| Catálogo de idiomas | Sí | 39 idiomas con nombre nativo, escritura, dirección y perfil CEFR. |
| Facultades curriculares | Sí | Lenguas y comunicación, ciudadanía digital, tecnología, programación, IA responsable y trayectorias profesionales. |
| Diagnóstico y panel | Sí | Recomendación orientativa, perfil, progreso, puntos y próximo paso. |
| Biblioteca | Sí | Guías, glosario técnico, ejemplo de código y recursos base. |
| Internacionalización | Sí | Catálogo y metadatos de 39 idiomas; diccionarios de interfaz para español, inglés y portugués, con respaldo visible en español para las demás localizaciones. |
| Tutor IA | Sí | Explicar, practicar y revisar texto con contexto de idioma, ruta y CEFR; proveedor integrado y respaldo demostrativo explícito. |
| Evidencias personales | Sí | Constancia imprimible basada únicamente en actividades reales completadas; no es una certificación oficial. |
| Proyectos guiados | Sí | Briefs por facultad con entregables, criterios, borradores y proyectos registrados en el perfil. |
| Práctica oral | Sí | Grabación explícitamente voluntaria, almacenamiento controlado, transcripción y comparación pedagógica. |

> El diagnóstico y las comparaciones de práctica son **orientativos**. No constituyen un examen, certificación oficial, identificación biométrica ni evaluación clínica de pronunciación.

## Arquitectura

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Cliente | `client/src/pages` y `client/src/components` | Experiencia pública, catálogo, diagnóstico, panel, tutor y práctica oral. |
| Dominio compartido | `shared/institution.ts` | Fuente de verdad para 39 idiomas, niveles CEFR, rutas y primeras lecciones. |
| API | `server/routers.ts` | Contratos tRPC, catálogo público, perfil protegido, avance, tutor y voz. |
| Persistencia | `drizzle/schema.ts`, `server/db.ts` | Preferencias, avance, solicitudes de tutor y prácticas orales. |
| AI Core | `server/aiCore.ts` | Registro de proveedor integrado y proveedor demostrativo, con degradación declarada. |
| Contenido | `shared/content.ts` | Catálogo reutilizable, búsqueda lexical local, marcadores, historial y recomendaciones locales. |
| PWA | `client/public/manifest.webmanifest`, `client/public/sw.js` | Metadatos de instalación y caché básico de navegación del mismo origen. |
| Documentación | `docs/` | Modelo curricular, investigación y criterios de entrega. |

La experiencia separa el idioma de interfaz, el idioma de apoyo y el idioma de estudio. Esta decisión permite agregar traducciones mediante diccionarios sin duplicar rutas o componentes. La progresión utiliza los seis niveles CEFR del Consejo de Europa como orientación de diseño de competencias, no como certificación.[1]

## Idiomas soportados

| | | | |
|---|---|---|---|
| Akan | Amárico | Árabe | Aimara |
| Bambara | Bengalí | Ewe | Inglés |
| Español | Fula | Francés | Guaraní |
| Hausa | Hindi | Criollo haitiano | Igbo |
| Kongo | Jemer | Lingala | Lao |
| Malgache | Birmano | Nepalí | Oromo |
| Portugués | Quechua | Rumano | Kinyarwanda |
| Somalí | Suajili | Tigriña | Tagalo |
| Twi | Ucraniano | Urdu | Wólof |
| Yoruba | Chino mandarín | Zulú | |

La dirección de escritura RTL está preparada para árabe y urdu. La interfaz utiliza metadatos por idioma y valores compatibles con BCP 47 para integrarse con las APIs de internacionalización del navegador.[2]

## Ejecutar el proyecto

El proyecto utiliza React, TypeScript, Express, tRPC, Drizzle y una base de datos MySQL/TiDB gestionada. Las credenciales de infraestructura se inyectan en el entorno; no deben incluirse archivos `.env` en el repositorio.

```bash
pnpm install
pnpm dev
```

Para la verificación de calidad, ejecute:

```bash
pnpm check
pnpm test
pnpm build
```

Las migraciones generadas están en `drizzle/`. Antes de aplicar un cambio de esquema, revise el SQL de la migración y aplíquelo con el flujo administrado del proyecto. Las tablas `learningProfiles`, `lessonCompletions`, `tutorRequests` y `voiceAttempts` ya forman parte de la migración inicial de la institución.

## Despliegue y operación

El proyecto compila con `pnpm build` y se inicia con `pnpm start`. Está diseñado para un único proceso web gestionado: no necesita workers persistentes, procesos hijos ni puertos codificados. En un entorno con escalado a cero, las tareas duraderas, transcodificación pesada, modelos de voz locales o colas de trabajo deben trasladarse a infraestructura específica antes de declararse disponibles.

Los secretos de base de datos, autenticación, almacenamiento, IA y transcripción los inyecta el entorno gestionado. No copie valores en archivos de código ni en `.env` versionados. El proveedor por defecto de AI Core es `built-in`; en una instalación de demostración se puede configurar `EDUCATIONAL_AI_PROVIDER=demonstration` para responder con la guía local identificada como modo demostración. La aplicación conserva una alternativa local si el proveedor integrado falla.

La PWA registra un *service worker* solo en producción. Su caché cubre las rutas públicas de la aplicación y recursos del mismo origen; no almacena llamadas a `/api/`, sesiones ni grabaciones de voz. Al cambiar su comportamiento, incremente `CACHE_NAME` en `client/public/sw.js` y pruebe instalación, actualización y modo sin conexión en un navegador real. Antes de publicar desde el entorno gestionado, cree una versión, revise la vista previa y use el control de publicación de la interfaz.

## Tutor y práctica oral

El tutor se ejecuta en el servidor y recibe solo el contexto pedagógico necesario: idioma de apoyo, idioma de estudio, nivel CEFR, ruta y mensaje de aprendizaje. Cada persona autenticada tiene un límite diario de solicitudes para proteger disponibilidad y coste. El tutor no almacena el texto de las conversaciones como perfil de aprendizaje.

Para la práctica oral, el navegador solicita el permiso de micrófono únicamente cuando se pulsa **Grabar respuesta**. La grabación no se transmite durante la captura. Tras la confirmación de la persona usuaria, se valida el tamaño, se guarda en almacenamiento controlado, se transcribe en el servidor y se persiste el resultado pedagógico. `getUserMedia()` exige un contexto seguro y consentimiento explícito.[3]

## Documentación complementaria

Consulte los documentos siguientes antes de ampliar contenido o integrar nuevos proveedores.

| Documento | Propósito |
|---|---|
| [Arquitectura](docs/ARCHITECTURE.md) | Decisiones técnicas, privacidad e internacionalización. |
| [Modelo curricular](docs/CURRICULUM.md) | Rutas, evidencias y gobernanza de contenido. |
| [Criterios de entrega](docs/DELIVERY-CRITERIA.md) | Correspondencia verificable con el alcance solicitado. |
| [Investigación a infraestructura](docs/RESEARCH-TO-INFRASTRUCTURE.md) | Referencias de accesibilidad y las funcionalidades que motivan. |
| [AI Core](docs/AI-CORE.md) | Contratos de proveedor, límites del tutor y degradación segura. |
| [Traducciones](docs/TRANSLATIONS.md) | Fuente de verdad de locales, respaldos y dirección RTL. |
| [Base abierta](docs/OPEN-SOURCE.md) | Calidad, licencias y criterio frente al relleno de repositorio. |

## Contribución y contenido

El código y el contenido educativo deben mantener trazabilidad separada. Antes de incorporar un texto, grabación, conjunto de datos, voz, modelo o ejercicio externo, documente su origen, licencia, fecha de revisión, atribución y alcance de uso. No se deben agregar reseñas, calificaciones ni testimonios inventados.

## Referencias

[1]: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions "Council of Europe — CEFR level descriptions"
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Internationalization "MDN — JavaScript internationalization"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia "MDN — MediaDevices.getUserMedia()"

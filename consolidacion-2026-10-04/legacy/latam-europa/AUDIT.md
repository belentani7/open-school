# Auditoría de cierre — LATAM Europa

**Fecha de auditoría:** 27 de agosto de 2026  
**Ámbito:** interfaz pública, rutas, catálogo, fuentes, persistencia, programación periódica, pruebas, compilación y dependencias de producción.

## Resultado ejecutivo

La revisión confirmó que la plataforma presenta un catálogo público funcional para el módulo inicial de España, con siete rutas temáticas, enlaces externos identificables, advertencia de alcance jurídico visible, buscador, filtros, estados de carga, vacío y error, además de una página de detalle para cada guía. Los controles técnicos de tipos, pruebas unitarias y compilación de producción finalizaron correctamente.

> **Límite de alcance:** la plataforma organiza información pública y no determina la elegibilidad de una persona para un trámite, una ayuda, una autorización o una cobertura sanitaria. La confirmación corresponde siempre al organismo competente o, cuando proceda, a asesoramiento profesional.

| Área auditada | Resultado | Evidencia o corrección |
|---|---|---|
| Rutas públicas | Conforme | Inicio y detalles de guía disponen de navegación de retorno, estructura semántica y diseño responsive. |
| Búsqueda y filtros | Conforme | El catálogo filtra por tema y texto sin diferenciar mayúsculas o acentos; se probaron estados normal, vacío y fallo controlado. |
| Directorio | Conforme | Cada recurso muestra organismo responsable, categoría, fecha de comprobación, estado y enlace externo. |
| Aviso jurídico | Conforme | El aviso está visible en portada y detalle de guía; se mantiene la delimitación informativa del producto. |
| Fuentes | Conforme con alcance indicado | Las fuentes se contrastaron el 27 de agosto de 2026; vivienda se identifica expresamente como convocatoria de la Comunidad de Madrid. |
| Persistencia | Conforme | Existen tablas para configuraciones del monitor y resultados diarios de comprobación, con claves idempotentes. |
| Programación periódica | Preparada, pendiente de publicación | El handler autenticado y la configuración persistente están listos. La tarea HTTP debe crearse después de publicar el sitio, ya que el entorno de desarrollo no acepta llamadas programadas. |
| Dependencias de producción | Conforme | Se actualizaron paquetes auditados y el análisis de producción terminó sin vulnerabilidades conocidas de severidad alta o crítica. |
| Pruebas y build | Conforme | `pnpm check`, `pnpm test` (7 pruebas) y `pnpm build` finalizaron correctamente. |

## Fuentes verificadas

La validación contrastó la disponibilidad y pertinencia temática de las fuentes a continuación. La ficha de Policía Nacional contiene procedimientos de extranjería, incluidos NIE, tarjetas y otros documentos. El portal de Migraciones se identifica como órgano estatal de política migratoria e integración. El SEPE publica recursos de búsqueda de empleo, orientación, demanda y ofertas. [1] [2] [3]

Para salud, el Ministerio de Sanidad publica la información de acceso a la atención sanitaria de personas extranjeras sin residencia legal, incluida la orientación para tramitarlo en la comunidad autónoma. Para educación, se sustituyó el enlace general por la ficha específica de solicitud de homologación y convalidación no universitaria. Para vivienda, se mantiene una convocatoria oficialmente publicada por la Comunidad de Madrid y se expone su ámbito autonómico para evitar una interpretación nacional errónea. [4] [5] [6]

| Tema | Fuente primaria | Alcance expuesto en la plataforma |
|---|---|---|
| Documentación | Policía Nacional | Trámites de extranjería y documentos vinculados. |
| Residencia | Secretaría de Estado de Migraciones y Delegaciones del Gobierno | Información institucional y acceso a oficinas o trámites. |
| Trabajo | Servicio Público de Empleo Estatal | Búsqueda, orientación, demanda y ofertas públicas. |
| Vivienda | Comunidad de Madrid | Convocatoria autonómica; no se presenta como ayuda nacional. |
| Salud | Ministerio de Sanidad | Información estatal y derivación al procedimiento autonómico. |
| Educación | Ministerio de Educación, Formación Profesional y Deportes | Solicitud de homologación o convalidación no universitaria. |
| Integración | Secretaría de Estado de Migraciones | Integración, acogida y recursos asociados. |

## Acciones correctivas realizadas

La auditoría encontró dependencias de producción desactualizadas. Se actualizaron los paquetes tRPC, AWS SDK, Axios, Drizzle ORM, Express, Nanoid, Recharts y Streamdown. La transición a Express actual requirió adaptar las rutas comodín del proxy de almacenamiento y de los fallbacks de aplicación. La transición de Recharts exigió actualizar los tipos internos del componente de gráficas incluido en la plantilla. Tras las correcciones, el análisis de dependencias de producción no notificó vulnerabilidades conocidas.

También se corrigió una inconsistencia editorial de la guía de vivienda: ahora declara que la fuente enlazada es autonómica, en lugar de referirse a una fuente estatal no incluida. La fuente educativa se actualizó a la página específica de solicitud, que describe el acceso electrónico, la presentación de solicitud, la documentación pertinente y la tasa aplicable.

## Pendiente operativo externo

La única acción que no puede completarse dentro del entorno de desarrollo es **activar la programación semanal real**. Tras pulsar **Publish**, se debe crear la tarea HTTP `latam-europa-official-sources-weekly` con la expresión UTC `0 0 8 * * 1`, la ruta `/api/scheduled/check-official-sources` y persistir el `taskUid` emitido en `sourceMonitoringJobs.scheduleCronTaskUid`. Este requisito existe para que las llamadas procedan del servicio de programación autenticado y se dirijan a una URL pública desplegada. El procedimiento está detallado en [`OPERATIONS.md`](./OPERATIONS.md).

## Referencias

[1]: https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria.php "Policía Nacional — Trámites de extranjería"
[2]: https://www.inclusion.gob.es/web/migraciones "Ministerio de Inclusión — Migraciones"
[3]: https://sede.sepe.gob.es/portalSede/es/procedimientos-y-servicios/personas/empleo "SEPE — Servicios de empleo para personas"
[4]: https://www.sanidad.gob.es/profesionales/prestacionesSanitarias/CarteraDeServicios/AccesoUsuariosCS/accesoUniversalSP.htm "Ministerio de Sanidad — Acceso universal a la sanidad pública"
[5]: https://www.educacionfpydeportes.gob.es/mc/convalidacion-homologacion/convalidacion-no-universitaria/solicitud.html "Ministerio de Educación — Solicitud de homologación y convalidación"
[6]: https://sede.comunidad.madrid/ayudas-becas-subvenciones/ayudas-alquiler-jovenes-0 "Comunidad de Madrid — Ayudas al alquiler"

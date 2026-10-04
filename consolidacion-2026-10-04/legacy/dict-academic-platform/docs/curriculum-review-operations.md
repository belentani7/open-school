# Operación de revisiones curriculares

El endpoint de revisión de D.I.C.T. está preparado para recibir únicamente ejecuciones programadas autenticadas en `/api/scheduled/curriculum-review`. Por diseño, una ejecución verifica la accesibilidad de las fuentes configuradas y registra propuestas con estado `proposed`; no modifica materias, traducciones, prerrequisitos, rúbricas, certificados ni calificaciones.

## Activación posterior a publicación

La programación no se activa en el entorno de desarrollo. Una vez publicada la aplicación, el propietario debe crear una tarea gestionada por la plataforma, asociada a dicho endpoint y con una expresión cron UTC de seis campos. La configuración `curriculum_review_settings` conserva el `scheduleCronTaskUid`; el callback recupera la configuración exclusivamente por ese identificador autenticado, nunca por datos del cuerpo de la petición.

| Paso | Responsable | Garantía |
| --- | --- | --- |
| Publicar una versión validada | Propietario del proyecto | El destino del callback es alcanzable por la plataforma. |
| Crear una revisión semanal o mensual | Propietario del proyecto | La tarea usa cron UTC de seis campos y el UID se conserva en la configuración. |
| Recoger señales de fuentes seleccionadas | Ejecución programada | Crea solo propuestas idempotentes por fuente y versión de revisión. |
| Revisar impacto | Administrador académico | Evalúa licencia, seguridad, nivel, traducciones y dependencias. |
| Aprobar o rechazar | Administrador académico | La decisión conserva responsable, fecha y razón. |
| Publicar una versión curricular | Administrador académico | Es un acto explícito y separado de la tarea de revisión. |

> Una fuente accesible no constituye por sí sola un cambio curricular. El análisis humano decide si una novedad es pertinente, segura, mantenible y proporcional al nivel de la asignatura.

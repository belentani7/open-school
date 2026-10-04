# Operación del comprobador de fuentes

La aplicación incluye un punto seguro e idempotente para verificar los enlaces del directorio en `/api/scheduled/source-monitor`. Cada ejecución recorre las fuentes definidas, sigue redirecciones, registra el resultado HTTP y actualiza un registro de comprobación por fuente y día.

La programación no se activa en el entorno de desarrollo porque el servicio público debe estar publicado antes de que pueda recibir llamadas programadas. Tras la publicación, se ha creado una tarea semanal de propietario con este criterio:

| Parámetro | Valor |
|---|---|
| Nombre | `latam-europa-official-sources-weekly` |
| Frecuencia | Cada lunes a las 07:00 UTC |
| Expresión | `0 0 7 * * 1` |
| Ruta de llamada | `/api/scheduled/source-monitor` |
| Finalidad | Comprobar accesibilidad, redirecciones y estado HTTP de las fuentes oficiales |
| Identificador de tarea | `ZD6jQrYeBmfXuGneg37bmT` |

La configuración de la tarea se conserva en `sourceMonitoringJobs`. El identificador de programación se ha registrado en `scheduleCronTaskUid`; el punto de llamada acepta únicamente ejecuciones autenticadas de esa tarea. Si una fuente no responde correctamente, se conservará el fallo y su detalle para revisión; no se modificará el contenido jurídico de forma automática.

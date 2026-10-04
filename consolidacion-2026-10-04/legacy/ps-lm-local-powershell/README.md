# PS-LM: asistente local para PowerShell

PS-LM es un asistente educativo de una sola página para consultar vocabulario y ejemplos básicos de PowerShell. Utiliza un motor simbólico basado en intenciones, patrones ponderados y extracción de entidades; **no ejecuta comandos de PowerShell en el equipo**.

| Característica | Descripción |
|---|---|
| Ejecución | Navegador moderno, abriendo `ps-lm.html` |
| Conectividad | Sin API, sin descargas de modelos y sin recursos remotos requeridos |
| Idiomas | Interfaz y consultas en español o inglés; vocabulario técnico de PowerShell |
| Persistencia | La memoria enseñada con `/teach` se guarda solamente en el almacenamiento local del navegador |
| Tamaño | Aproximadamente 125 KB |

## Uso

Descargue o copie `ps-lm.html` y ábralo en un navegador moderno. Espere a que finalice la breve secuencia de inicio y escriba una pregunta, por ejemplo `¿cómo mato un proceso?` o `¿qué es el pipeline?`. La aplicación genera explicaciones y ejemplos; estos ejemplos no se ejecutan automáticamente.

## Comandos internos

| Comando | Función |
|---|---|
| `/help` | Muestra la ayuda integrada. |
| `/teach pregunta :: respuesta` | Añade una entrada a la memoria local del navegador. |
| `/vocab` | Abre la consulta de vocabulario. |
| `/theme` | Alterna los temas Carbon y Blueprint. |
| `/export` | Descarga una copia JSON de la memoria local. |
| `/forget` | Gestiona o elimina entradas de memoria locales. |

## Correcciones aplicadas

Durante la verificación se corrigió un comentario de JavaScript sin cierre que bloqueaba la ejecución del script. Asimismo, se eliminaron las referencias a una fuente externa para que la aplicación no requiera recursos de red. Consulte `verificacion_ejecucion.md` para los resultados de la prueba funcional.

## Nota de alcance

Este proyecto es un asistente de referencia y aprendizaje para PowerShell, no un modelo neuronal de 4 GB ni un sustituto de la documentación oficial. Antes de ejecutar cualquier comando sugerido, revíselo y adapte rutas, nombres y permisos a su propio entorno.

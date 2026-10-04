# Contrato de API tRPC

La API usa contratos tipados de tRPC y validación Zod. Los procedimientos protegidos recuperan la identidad de la sesión en el servidor; el cliente no decide el usuario propietario de ningún progreso, proyecto o conversación.

| Espacio | Procedimiento | Acceso | Propósito |
| --- | --- | --- | --- |
| `academic` | `catalog` | Público | Obtiene asignaturas filtrables por semestre y ámbito, localizadas en ES/PT/EN. |
| `academic` | `course` | Público | Recupera la ficha curricular por código, con detalle académico cuando está disponible. |
| `academic` | `prerequisiteGraph` | Público | Publica nodos y dependencias para el mapa navegable. |
| `student` | `dashboard` | Autenticado | Recupera perfil, créditos logrados, matrícula, progreso y transcript interno del usuario actual. |
| `student` | `enroll` | Autenticado | Matricula al usuario actual solo si las materias previas están completadas con nota mínima de 65/100. |
| `student` | `projects` | Autenticado | Lista los proyectos cuyo titular es el usuario actual. |
| `student` | `createProject` | Autenticado | Crea un proyecto de portfolio validando texto, tecnología, visibilidad y enlaces HTTP(S). |
| `portfolio` | `getPublic` | Público | Devuelve exclusivamente perfiles que eligieron ser públicos y sus proyectos públicos. |
| `tutor` | `ask` | Autenticado | Registra una consulta y devuelve una respuesta pedagógica no resolutiva. |

> **Contrato académico.** Los campos de créditos, calificaciones, transcript y certificados se etiquetan como registros académicos internos. La API no emite ni afirma títulos oficiales, ECTS o equivalencias universitarias.

Los campos de evaluación, competencias, certificado y propuesta de cambio existen ya en el esquema relacional para extender el contrato de forma controlada. Las mutaciones administrativas deberán exigir rol `admin`, comprobar la propiedad de la materia y conservar quién, cuándo y por qué realizó una decisión académica.

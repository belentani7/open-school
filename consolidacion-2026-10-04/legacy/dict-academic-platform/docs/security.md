# Seguridad y privacidad

La plataforma aplica una separación entre contenido público y operaciones bajo sesión. Los procedimientos de estudiante se vinculan al usuario autenticado en el servidor y validan entradas con contratos tipados. La API no toma un identificador de propietario desde el cliente para decidir a quién pertenece una matrícula, proyecto o conversación.

| Área | Control implementado o requerido |
| --- | --- |
| Sesión y permisos | Autenticación integrada, procedimientos protegidos, validación de rol administrativo para las operaciones de gobierno a ampliar. |
| Entrada | Esquemas Zod, límites de longitud, códigos de materia con patrón explícito y URL limitadas a HTTP(S). |
| Datos | Claves foráneas, índices, identificadores únicos y estado explícito de visibilidad para portfolios y archivos. |
| Archivos | Los binarios se almacenan fuera de la base de datos; esta conserva únicamente referencia, tipo, tamaño y política de acceso. |
| Tutor | Invocación de IA exclusivamente en servidor, registro de mensajes y límites contra respuestas evaluables completas. |
| Laboratorios | Entornos aislados, propósito didáctico, datos sintéticos cuando corresponda y prohibición de objetivos externos no autorizados. |

No se guardan API keys reales en el frontend ni en el repositorio. La política de seguridad debe revisarse ante cada cambio de autenticación, carga de archivos, exposición de portfolio o integración externa.

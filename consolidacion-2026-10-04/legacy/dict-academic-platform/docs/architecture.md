# Arquitectura técnica de D.I.C.T.

D.I.C.T. utiliza una aplicación React y TypeScript con un backend Express/tRPC, autenticación de la plataforma, Drizzle ORM y una base de datos relacional MySQL/TiDB. La elección preserva tipos de extremo a extremo y permite separar con claridad las vistas públicas de las operaciones que requieren sesión. La plataforma funciona como formación académica independiente; sus CA, certificados y transcript son documentación interna y no representan titulación, reconocimiento estatal ni equivalencia universitaria oficial.

| Capa | Responsabilidad | Controles principales |
| --- | --- | --- |
| Experiencia pública | Landing, catálogo, mapa, biblioteca y fichas académicas. | Solo contenido de publicación pública; selector ES/PT/EN; aviso de naturaleza no oficial en cabecera y pie. |
| Experiencia autenticada | Progreso, matrículas, proyectos, portfolio, tutor y expediente interno. | Autenticación de sesión; operaciones asociadas al `ctx.user.id`; separación entre contenido privado y público. |
| API tRPC | Contratos tipados para catálogo, grafo, estudiante, portfolio y tutor. | Esquemas Zod, validación de códigos, límites de tamaño y procedimientos públicos/protegidos. |
| Persistencia | Materias, traducciones, requisitos, matrículas, evaluaciones, competencias, proyectos, certificados y propuestas. | Claves únicas, claves foráneas, índices de consulta y borrado en cascada solo en relaciones de propiedad inequívoca. |
| Almacenamiento de archivos | Entregables de proyecto y materiales descargables permitidos. | Referencias (`storageKey`, tipo, tamaño, nivel de acceso) en base de datos; nunca binarios en columnas. |
| Tutor académico | Explicación, práctica, pistas y simulaciones. | Invocación exclusivamente en servidor, registro de interacción, límites pedagógicos y guía de seguridad legal. |

## Modelo de autorización

El catálogo, el mapa de prerrequisitos y la biblioteca se exponen mediante procedimientos públicos. Las consultas y mutaciones de estudiante se ejecutan bajo sesión autenticada y siempre usan el identificador del usuario presente en el contexto, nunca un identificador recibido desde la interfaz. La creación de un proyecto permite exclusivamente al usuario autenticado asignarse como titular. Los portfolios públicos requieren una decisión explícita de publicación y solo recuperan proyectos marcados como públicos.

Los roles base son `user` y `admin`. El rol administrativo está reservado a operaciones académicas de gobierno, como la evaluación, la emisión de certificados y la aprobación de propuestas curriculares. La interfaz no debe confiar en ocultar botones para aplicar permisos: la comprobación definitiva pertenece al backend.

## Integridad académica y seguridad

Cada materia registra una política de uso de IA. El tutor guía, pregunta y propone pasos verificables; no debe redactar una respuesta íntegra evaluable ni alterar calificaciones. Para las prácticas de seguridad, el alcance se limita a laboratorios locales, aislados y autorizados. La plataforma trata los enlaces de portfolio como URL HTTP(S) validadas y no acepta secretos ni binarios en solicitudes académicas.

Las propuestas de actualización se registran con fuente, tipo, versión propuesta, análisis de impacto, estado y revisor. **Proponer no equivale a publicar:** ningún flujo automático modifica una materia, prerrequisito, rúbrica o requisito de evaluación.

## Operación de revisiones periódicas

Las revisiones de fuentes se diseñan como trabajos programados con endpoint autenticado y persistencia de un identificador de tarea. No se usan temporizadores dentro del proceso. Una vez publicada la plataforma, una ejecución de revisión puede recopilar señales de fuentes seleccionadas y crear exclusivamente registros `proposed`; la aprobación o el rechazo requiere una acción humana registrada. El trabajo debe ser idempotente, completar en el límite de tiempo del entorno y devolver errores estructurados para auditoría.

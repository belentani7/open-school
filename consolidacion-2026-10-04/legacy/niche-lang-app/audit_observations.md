# Hallazgos preliminares de auditoría

## Evidencia automática

| Control | Resultado | Evidencia |
|---|---|---|
| TypeScript | Conforme en la ejecución aislada | `pnpm exec tsc --noEmit --pretty false` terminó con `TSC_EXIT=0`. |
| Lint | Conforme con observaciones | `pnpm lint` terminó con código 0, pero informó 7 warnings de variables/importaciones sin uso. |
| Tests | Parcialmente conforme | 25 tests pasan y 1 test queda omitido; no existe una prueba de integración real del flujo completo de lección, sincronización o notificaciones. |
| Build del servidor | Conforme | `pnpm build` generó `dist/index.js` de 24,9 KB. |
| Auditoría de dependencias | No concluyente | `pnpm audit --prod --audit-level=high` expiró después de 90 segundos con código 124; no se puede afirmar ausencia de vulnerabilidades. |
| Dev server | Riesgo operativo | El entorno reportó `ENOSPC: System limit for number of file watchers reached`. Esto afecta la estabilidad del desarrollo, no prueba por sí solo un fallo de producción. |

## Hallazgos de alta prioridad

| ID | Área | Hallazgo | Evidencia | Impacto |
|---|---|---|---|---|
| H-001 | Sincronización | `processSyncQueue` elimina elementos como si se hubieran sincronizado, pero la llamada al backend está comentada. | `lib/services/sync.ts`, proceso de cola. | Pérdida silenciosa de cambios y falsa sensación de sincronización. |
| H-002 | Procesos background | `startBackgroundSync` usa `setInterval`, que no constituye una tarea persistente de background en iOS/Android. | `lib/services/sync.ts`. | El proceso puede detenerse al suspenderse la aplicación. |
| H-003 | Persistencia | `updateStreakAtMidnight(userId)` busca `user_profile_${userId}`, mientras `UserProvider` guarda `user_profile`. | `lib/services/sync.ts` y `lib/contexts/user-context.tsx`. | La actualización de racha no encuentra el perfil almacenado. |
| H-004 | Progreso | El reducer de lecciones reemplaza un registro existente, pero no inserta el registro cuando el módulo se actualiza por primera vez. | `lib/contexts/lessons-context.tsx`, caso `UPDATE_PROGRESS`. | El progreso nuevo puede no aparecer en el estado en memoria hasta recargar. |
| H-005 | Flujo pedagógico | El reproductor de lecciones marca módulos sin validar respuestas, no marca la lección completa y no actualiza estadísticas. | `app/lesson/[id].tsx`. | La experiencia principal no cumple el flujo declarado de aprendizaje y progreso. |
| H-006 | Notificaciones | La pantalla de configuración solo cambia estado local; no carga consentimiento, no programa recordatorios y no inicializa permisos. | `app/(tabs)/settings.tsx` y `lib/services/notifications.ts`. | Los controles aparentan activar funciones que no se ejecutan ni persisten. |
| H-007 | Privacidad | `getUserDataExport` puede leer datos de AsyncStorage, pero la UI no ofrece un archivo exportable ni un mecanismo de compartir/descargar. | `lib/services/security.ts` y `app/(tabs)/settings.tsx`. | La exportación anunciada no entrega un artefacto utilizable al usuario. |
| H-008 | Privacidad | El perfil y las estadísticas se guardan con AsyncStorage en `UserProvider`, aunque existe un servicio SecureStore separado que no está integrado. | `lib/contexts/user-context.tsx` y `lib/services/security.ts`. | Datos sensibles potencialmente accesibles sin el nivel de protección anunciado. |

## Hallazgos de prioridad media

| ID | Área | Hallazgo |
|---|---|---|
| M-001 | Home | El progreso por nicho usa `const completed = 0`, por lo que las barras son placeholders. |
| M-002 | Progreso | El cálculo depende de `lesson.status === "completed"`, pero ese estado no se actualiza al finalizar una lección. |
| M-003 | Contenido | Los metadatos de `lessonsCount` en los nichos superan las lecciones reales disponibles. |
| M-004 | Tipado | `LessonModule.content` y `SyncAction.payload` usan `any`, reduciendo la seguridad de tipos. |
| M-005 | Calidad | Hay 7 warnings de lint por variables/importaciones sin uso. |
| M-006 | Accesibilidad | Los controles interactivos carecen de labels/roles de accesibilidad verificables. |
| M-007 | Audio | Los botones de audio solo producen feedback háptico y no reproducen pronunciación. |
| M-008 | Mantenibilidad | La documentación afirma funciones completadas que el código actual todavía simula o no conecta. |

## Limitaciones de esta fase

La auditoría automática no pudo concluir el estado de vulnerabilidades de dependencias porque el comando de auditoría expiró. Tampoco se ha realizado una prueba en dispositivos físicos iOS/Android, una revisión legal formal de GDPR, una prueba de penetración, un análisis de consumo de batería ni una prueba de accesibilidad con VoiceOver/TalkBack. Estos puntos se clasificarán como no verificados, no como conformes.

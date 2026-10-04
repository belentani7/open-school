# Informe final de auditoría de NicheLang — 10.000 controles

**Proyecto:** NicheLang: Idiomas Especializados  
**Plataforma:** Expo SDK 54 / React Native / TypeScript  
**Fecha de auditoría:** 20 de agosto de 2026  
**Auditor:** Manus AI  
**Versión auditada:** estado posterior a la corrección de hallazgos y antes del siguiente checkpoint

## 1. Dictamen ejecutivo

La aplicación presenta una base funcional sólida para aprendizaje de idiomas por nichos: compila con TypeScript, supera la suite automatizada actual, genera el bundle del servidor y exporta correctamente la versión web estática. Durante la auditoría se identificaron problemas reales en sincronización offline, tareas en segundo plano, persistencia de perfil, progreso de lecciones, notificaciones, privacidad, audio y accesibilidad. Los hallazgos de mayor impacto que podían corregirse de forma segura dentro del proyecto fueron tratados y se añadieron pruebas de regresión.

El resultado **no debe interpretarse como certificación de seguridad, cumplimiento legal GDPR, preparación para producción ni validación en dispositivos físicos**. La auditoría generó una matriz exacta de 10.000 controles, pero solo una parte de ellos tiene evidencia individual ejecutada en esta sesión. La matriz distingue explícitamente entre controles verificados, corregidos, no conformes y no verificados para evitar presentar una cobertura hipotética como una comprobación completa.

| Estado de la matriz | Controles | Interpretación |
|---|---:|---|
| Verificado | 3 | Evidencia automática directa con resultado satisfactorio. |
| Corregido | 5 | El defecto fue tratado en código y existe evidencia de validación asociada. |
| No conforme | 2 | Existe una limitación o una integración todavía incompleta. |
| No verificado | 9.990 | No existe evidencia individual suficiente para afirmar conformidad. |
| **Total** | **10.000** | Matriz completa de trazabilidad. |

## 2. Evidencia de validación ejecutada

| Control | Resultado | Evidencia |
|---|---|---|
| TypeScript | Conforme | `pnpm exec tsc --noEmit --pretty false` terminó con código 0. |
| Lint | Conforme con advertencia de entorno | `pnpm lint` terminó con código 0; Node mostró un warning sobre `MODULE_TYPELESS_PACKAGE_JSON` en `eslint.config.js`. |
| Tests | Conforme para la suite existente | 28 tests pasan, 1 permanece omitido; 4 archivos de prueba ejecutados. |
| Build del servidor | Conforme | `pnpm build` terminó con código 0 y generó `dist/index.js` de 24,9 KB. |
| Configuración Expo | Conforme | `expo config --type public` terminó con código 0 y reconoció `expo-background-task`. |
| Exportación web | Conforme | `expo export --platform web` terminó con código 0 y generó 13 rutas estáticas. |
| Dependencias | Inconcluso | `pnpm audit --prod --audit-level=high` expiró con código 124; no se puede afirmar ausencia de vulnerabilidades. |
| File watchers | Riesgo del entorno | El servidor administrado reportó `ENOSPC: System limit for number of file watchers reached`. |

## 3. Hallazgos críticos y altos tratados

| ID | Área | Problema observado | Tratamiento aplicado | Estado |
|---|---|---|---|---|
| H-001 | Sincronización | La cola eliminaba elementos aunque el backend real no estaba conectado. | `processSyncQueue` ahora conserva la cola si no hay handler configurado y solo elimina después de una operación exitosa. | Corregido |
| H-002 | Background | `setInterval` no garantiza ejecución cuando la aplicación está suspendida. | Se añadió `expo-background-task`, `expo-task-manager`, definición global de tarea, registro idempotente y plugin Expo. | Parcialmente corregido; falta conectar backend real. |
| H-003 | Persistencia | La actualización de racha buscaba `user_profile_<id>` aunque el perfil se guardaba con `user_profile`. | Se unificó la clave canónica y se añadió prueba de regresión. | Corregido |
| H-004 | Progreso | El reducer no insertaba un registro de progreso nuevo. | `UPDATE_PROGRESS` ahora actualiza o inserta, y la persistencia lee el valor más reciente antes de fusionar. | Corregido |
| H-005 | Flujo de lección | Las respuestas no se validaban, la lección no se completaba y las estadísticas no se actualizaban. | Se añadió selección, feedback correcto/incorrecto, validación antes de avanzar, finalización de lección y actualización de estadísticas. | Corregido |
| H-006 | Notificaciones | El interruptor de configuración no solicitaba permisos ni programaba recordatorios. | Se conectaron permisos, canal Android, handler, programación diaria y cancelación multiplataforma. | Corregido |
| H-007 | Privacidad | La exportación no producía un resultado utilizable para el usuario. | Se añadió exportación JSON mediante `Share.share`, además de registro de auditoría. | Corregido |
| H-008 | Almacenamiento | El perfil se guardaba en AsyncStorage aunque existía un servicio SecureStore separado. | El perfil usa SecureStore en native, fallback documentado en web y migración desde la clave heredada. | Corregido con limitación web |
| H-009 | Audio | El botón de audio solo producía hápticos. | Se añadió `expo-speech` con detención de habla previa, idioma y velocidad base. | Corregido |
| H-010 | Progreso visual | Home mostraba `completed = 0`. | Home calcula lecciones completadas desde el estado real. | Corregido |
| H-011 | Accesibilidad | Los controles principales no tenían etiquetas ni roles verificables. | Se añadieron roles, labels, hints y estado seleccionado en controles de lección y configuración. | Corregido parcialmente; falta prueba con VoiceOver/TalkBack |

## 4. Riesgos pendientes

### 4.1 Sincronización de backend

El mecanismo offline-first ya no descarta datos sin confirmación, pero todavía no existe un handler backend conectado en la ejecución auditada. Por tanto, la aplicación puede conservar cambios locales, pero no se debe comunicar al usuario que la sincronización entre dispositivos está operativa. La remediación consiste en conectar `configureSyncHandler` a una operación autenticada del backend, definir idempotencia por `SyncQueueItem.id`, devolver errores transitorios y verificar el resultado con una prueba de integración.

### 4.2 Dependencias

La auditoría de paquetes expiró por timeout. Esto es un resultado inconcluso, no una aprobación. Antes de publicar debe repetirse en un entorno con suficiente tiempo de red y guardarse el resultado completo. También se recomienda revisar los avisos de paquetes deprecados reportados por pnpm.

### 4.3 File watchers

El error `ENOSPC` pertenece al entorno de desarrollo administrado y puede impedir que Metro observe cambios correctamente. No demuestra por sí mismo un fallo del bundle de producción, pero debe resolverse o mitigarse con configuración de polling, reducción de raíces observadas o reinicio del servicio antes de una sesión de desarrollo prolongada.

### 4.4 Metadatos de contenidos

La auditoría previa detectó discrepancias entre algunos valores declarados de `lessonsCount` y las lecciones efectivamente disponibles. Los valores deben calcularse a partir de la fuente de contenido o validarse con una prueba que falle cuando el catálogo y sus metadatos diverjan.

### 4.5 Tipado residual

Persisten usos de `any` en estructuras de contenido de módulos, payloads de sincronización y otros puntos heredados. TypeScript no reporta errores, pero el tipado no es todavía suficientemente estricto para considerar el modelo de datos endurecido.

### 4.6 Validación de dispositivo y cumplimiento

No se ejecutaron pruebas físicas en iOS o Android, pruebas de consumo de batería, pruebas de red intermitente, accesibilidad con VoiceOver/TalkBack, penetración, recuperación tras reinstalación, ni revisión jurídica formal. Estos puntos permanecen como **no verificados**.

## 5. Cambios aplicados en esta auditoría

Se incorporó un servicio de tarea background en `lib/services/background-task.ts`, se actualizó `app.config.ts` con el plugin Expo correspondiente y se añadieron las dependencias compatibles con SDK 54. Se reforzaron `lib/services/sync.ts`, `lib/services/security.ts`, `lib/services/notifications.ts`, `lib/contexts/user-context.tsx` y `lib/contexts/lessons-context.tsx`. La pantalla `app/lesson/[id].tsx` ahora valida ejercicios, ofrece feedback, completa lecciones, actualiza estadísticas, reproduce pronunciación TTS y expone etiquetas de accesibilidad. Home calcula el progreso real y Settings conecta consentimiento, permisos, notificaciones y exportación compartible.

También se creó `tests/audit-regressions.test.ts`, que verifica que la cola no se vacía sin handler, que solo se eliminan elementos después de una sincronización exitosa y que la racha usa la clave canónica del perfil.

## 6. Matriz y trazabilidad

La matriz completa está en [`audit-matrix-10000.csv`](./audit-matrix-10000.csv). La especificación de categorías, severidades y estados está en [`audit_matrix_spec.md`](./audit_matrix_spec.md). Los hallazgos detallados previos y sus evidencias están en [`audit_observations.md`](./audit_observations.md). Las salidas de validación se conservan en [`audit-final-validation.txt`](./audit-final-validation.txt), [`audit-regression-validation.txt`](./audit-regression-validation.txt), [`expo-config-audit.txt`](./expo-config-audit.txt) y [`expo-export-audit.txt`](./expo-export-audit.txt).

## 7. Conclusión y decisión recomendada

La recomendación es **apto para revisión funcional controlada**, no apto todavía para afirmar producción o publicación final. El siguiente hito técnico debe ser conectar y probar el handler backend de sincronización, resolver la auditoría de dependencias sin timeout, corregir los metadatos de lecciones, reemplazar los `any` residuales y ejecutar pruebas en dispositivos físicos. Una vez completados esos puntos, debe repetirse la matriz con evidencia individual para elevar los controles actualmente no verificados.

## Referencias internas

1. [`audit_matrix_spec.md`](./audit_matrix_spec.md) — Especificación de la matriz de 10.000 controles.
2. [`audit_observations.md`](./audit_observations.md) — Observaciones y hallazgos preliminares con rutas de código.
3. [`todo.md`](./todo.md) — Historial de tareas, correcciones verificadas y pendientes.
4. [`tests/audit-regressions.test.ts`](./tests/audit-regressions.test.ts) — Pruebas de regresión añadidas durante la auditoría.
5. [`PROJECT_README.md`](./PROJECT_README.md) — Documentación funcional y técnica del proyecto.


## 8. Addendum de continuación autónoma

Después del informe inicial se implementó una segunda iteración centrada en los pendientes de mayor impacto. El proyecto ahora incluye una tabla `sync_actions` con unicidad por usuario y acción, una migración Drizzle aplicada, la mutación protegida `sync.push` con validación Zod y un helper de base de datos idempotente. El cliente offline encola cambios de progreso, perfil y estadísticas; el handler tRPC se inyecta para aislar la lógica de red de las pruebas; las acciones sin backend no se eliminan; los fallos se reintentan tres veces y después quedan bloqueados hasta una acción explícita de recuperación desde Configuración.

También se corrigió el catálogo para derivar `lessonsCount` de `ALL_LESSONS_BY_NICHE`, se eliminaron los `any` del código de producto auditado, se definieron módulos discriminados y valores `JsonValue`, se añadieron pruebas de consistencia de contenidos y se expuso un control manual de sincronización en Settings. Los contextos de progreso, perfil y estadísticas ahora generan acciones offline serializables.

| Validación adicional | Resultado |
|---|---|
| TypeScript posterior | Código 0 |
| Lint posterior | Código 0; permanece warning de `MODULE_TYPELESS_PACKAGE_JSON` en ESLint |
| Suite posterior | 33 tests pasan; 1 test existente permanece omitido |
| Build de servidor posterior | Código 0; `dist/index.js` generado |
| Expo config final | Código 0 |
| Exportación web final | Código 0; 13 rutas estáticas |
| Dependencias | Sin conclusión: `pnpm audit --prod --audit-level=high --json` volvió a expirar a los 90 segundos |

### Estado actualizado de riesgos

La sincronización backend ya está conectada a una mutación protegida, pero la prueba automatizada usa un cliente inyectado y no realiza una sesión OAuth real contra el gateway. Por ello, la autenticación end-to-end, la sincronización multiusuario y la recuperación ante respuestas HTTP concretas todavía deben validarse en un entorno autenticado. La matriz de 10.000 controles continúa siendo un registro de trazabilidad; no se convierte automáticamente en 10.000 verificaciones ejecutadas.

El warning de ESLint no afecta el código de salida, pero puede eliminarse migrando la configuración a un formato de módulo explícito sin alterar las configuraciones CommonJS de Metro y Tailwind. El límite `ENOSPC` de file watchers sigue siendo una condición del entorno administrado. La auditoría de dependencias requiere ejecutarse con acceso de red estable o desde un entorno con la base de advisories disponible.

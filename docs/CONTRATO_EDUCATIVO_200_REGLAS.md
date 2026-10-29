# Contrato educativo Belentani / NOIACORE — 200 reglas

**Versión:** 1.0 · **Fecha de adopción:** 2026-10-15 · **Propietario:** Pedro Belentani  
**Fuente canónica prevista:** `belentani7/open-school/docs/CONTRATO_EDUCATIVO_200_REGLAS.md`

Este contrato es obligatorio para cada plataforma educativa del ecosistema. Cada regla exige una decisión y una evidencia. Si una capacidad no aplica, se registra `N/A JUSTIFICADO`; nunca se elimina la regla ni se declara cumplida por intención, README o dependencia instalada.

## Estados y evidencia

- `NO MEDIDO`: todavía no existe una comprobación reproducible.
- `EN CONSTRUCCIÓN`: hay una rama o PR abierta con responsable y criterio de aceptación.
- `VERIFICADO`: existe evidencia enlazada y una comprobación repetible.
- `N/A JUSTIFICADO`: la regla no aplica y la razón está documentada.
- `BLOQUEADO`: existe una dependencia externa concreta, con responsable y siguiente acción.

Una evidencia válida es uno o varios de estos elementos: prueba automatizada, prueba manual fechada, archivo y línea estable, informe de herramienta, ADR, registro de contenido, captura de despliegue, métrica o PR. “Está implementado” sin prueba no es evidencia.

## Matriz viva del ecosistema

La cifra solo se completa después de medir las 200 reglas. Un guion significa “baseline aún no ejecutada”, no cero calidad.

| Plataforma | Repositorio canónico | Verificadas / 200 | Última medición | Evidencia local |
|---|---|---:|---|---|
| Open School | `belentani7/open-school` | — | — | `docs/quality/` |
| ManosAbiertas | `belentani7/ManosAbiertas` | — | — | `docs/quality/` |
| LinguaForge | `belentani7/linguaforge` | — | — | `docs/quality/` |
| Lingua Aberta | `belentani7/lingua-aberta` | — | — | `docs/quality/` |
| Cruzando el Charco | `belentani7/Cruzando-el-charco` | — | — | `docs/quality/` |
| Secure-T | `belentani7/secure-t` | — | — | `docs/quality/` |
| WILLIAMSCHOOL | por confirmar | — | — | `docs/quality/` |
| UX Academy | por confirmar | — | — | `docs/quality/` |
| Aprende Brasil | por confirmar | — | — | `docs/quality/` |

## 1. Misión, alcance y gobernanza (E001–E015)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E001 | Definir en una frase el problema educativo real que resuelve el producto. | Canon/README aprobado |
| E002 | Identificar público primario, necesidades, contexto cultural y barreras de acceso. | Personas o investigación fechada |
| E003 | Declarar resultados de aprendizaje observables, no promesas vagas. | Mapa curso→resultado |
| E004 | Separar con precisión lo implementado, lo experimental y lo planificado. | Matriz de estado verificable |
| E005 | Mantener una única fuente canónica de producto y enlazar documentos secundarios. | Índice documental sin contradicciones |
| E006 | Asignar propietario, responsables de contenido y responsables técnicos. | CODEOWNERS o gobernanza |
| E007 | Documentar decisiones irreversibles o costosas mediante ADR. | ADR fechado y enlazado |
| E008 | Definir criterios de entrada, terminación y retirada de cada función. | DoR/DoD por entrega |
| E009 | Publicar límites, exclusiones y usos no admitidos del producto. | Sección de no-objetivos |
| E010 | Mantener registro de riesgos con probabilidad, impacto, mitigación y propietario. | Riesgos revisados por versión |
| E011 | Registrar cambios funcionales y de contenido que afecten al alumnado. | CHANGELOG comprensible |
| E012 | Establecer un canal accesible de soporte, incidencias y sugerencias. | Canal probado desde producción |
| E013 | Definir política de contribución, revisión y conducta. | CONTRIBUTING y CODE_OF_CONDUCT |
| E014 | Prohibir estados de éxito sin evidencia reproducible. | Plantilla de PR/gate |
| E015 | Revisar este contrato en cada release y al menos trimestralmente. | Fecha, responsable y diff |

## 2. Pedagogía y diseño curricular (E016–E040)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E016 | Vincular cada unidad a objetivos medibles y apropiados para el público. | Objetivos por unidad |
| E017 | Explicitar conocimientos previos, nivel y tiempo estimado. | Metadatos del curso |
| E018 | Organizar la progresión de simple a complejo con dependencias visibles. | Grafo o secuencia curricular |
| E019 | Dividir contenido en unidades manejables y retomables. | Lecciones con puntos de reentrada |
| E020 | Combinar explicación, ejemplo, práctica, feedback y recuperación. | Plantilla de lección completa |
| E021 | Incluir práctica activa; leer o mirar no puede ser la única actividad. | Actividad comprobable por unidad |
| E022 | Usar recuperación espaciada cuando el dominio requiera retención. | Algoritmo o calendario documentado |
| E023 | Incorporar repetición intercalada cuando mejore transferencia. | Diseño de práctica y justificación |
| E024 | Dar feedback inmediato, específico y orientado a la mejora. | Prueba de respuestas y mensajes |
| E025 | Permitir reintentos sin castigo desproporcionado. | Flujo de reintento probado |
| E026 | Explicar por qué una respuesta es correcta o incorrecta. | Racionales en evaluaciones |
| E027 | Evitar preguntas trampa, ambigüedad y memorización irrelevante. | Revisión editorial rubricada |
| E028 | Incluir ejemplos culturalmente diversos y no estereotipados. | Muestreo editorial fechado |
| E029 | Adaptar dificultad sin ocultar criterios ni manipular al alumno. | Reglas de adaptación explicables |
| E030 | Ofrecer rutas alternativas para distintos ritmos y conocimientos previos. | Diagnóstico y rutas probadas |
| E031 | Proporcionar resumen y próximos pasos al terminar una unidad. | Pantalla/resultado de cierre |
| E032 | Permitir retomar exactamente donde se dejó. | Test de persistencia y reentrada |
| E033 | Mostrar progreso real basado en evidencias, no en tiempo de pantalla. | Cálculo documentado y probado |
| E034 | Diferenciar práctica, evaluación formativa y evaluación final. | Tipos y reglas declaradas |
| E035 | Alinear cada evaluación con los objetivos que afirma medir. | Matriz objetivo→ítem |
| E036 | Definir rúbricas para tareas abiertas y proyectos. | Rúbricas publicadas |
| E037 | Ofrecer ejemplos de calidad y contraejemplos. | Biblioteca de ejemplos revisada |
| E038 | Facilitar metacognición: planificar, comprobar y reflexionar. | Actividades de autorregulación |
| E039 | Evitar gamificación que sustituya el aprendizaje o induzca compulsión. | Revisión de mecánicas |
| E040 | Validar el currículo con usuarios o expertos del dominio. | Acta, prueba piloto o revisión |

## 3. Contenido, autoría y procedencia (E041–E060)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E041 | Registrar autor, revisor, fecha y versión de cada recurso. | Metadatos por recurso |
| E042 | Citar fuentes primarias y separar hechos, opinión e inferencia. | Referencias trazables |
| E043 | Verificar enlaces, cifras, leyes y procedimientos antes de publicar. | Chequeo automatizado/editorial |
| E044 | Fechar contenido que pueda caducar y definir su revisión. | `review_by` o equivalente |
| E045 | Retirar o marcar contenido obsoleto sin borrar su historial. | Estado y redirección |
| E046 | Mantener licencias y atribuciones de texto, imágenes, audio, vídeo y código. | NOTICE/registro de activos |
| E047 | No copiar materiales sin permiso o licencia compatible. | Procedencia y licencia comprobadas |
| E048 | Distinguir contenido propio, adaptado, traducido y generado por IA. | Etiqueta de procedencia |
| E049 | Revisar humanamente todo contenido generado o transformado por IA. | Revisor y fecha |
| E050 | Prohibir referencias inventadas, citas no comprobadas y fuentes inexistentes. | Gate editorial/test |
| E051 | Mantener terminología coherente mediante glosario canónico. | Glosario versionado |
| E052 | Usar lenguaje claro y apropiado al nivel lector del público. | Revisión de legibilidad |
| E053 | Explicar siglas y términos antes de exigirlos. | Test/muestreo de primera aparición |
| E054 | No presentar orientación legal, médica o financiera como asesoramiento profesional. | Aviso contextual y derivación |
| E055 | Priorizar fuentes oficiales para trámites, derechos y seguridad. | Enlace oficial y fecha |
| E056 | Publicar correcciones materiales y avisar cuando afecten decisiones del alumno. | Fe de erratas/cambio visible |
| E057 | Mantener identificadores estables para cursos, unidades y recursos. | Esquema de IDs y test |
| E058 | Exportar contenido estructurado sin depender de la interfaz visual. | JSON/Markdown/estándar documentado |
| E059 | Preservar contenido fuente separado de su representación generada. | Pipeline fuente→build |
| E060 | Probar que la regeneración de contenido es determinista o explica diferencias. | Test reproducible |

## 4. Accesibilidad e inclusión (E061–E085)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E061 | Alcanzar WCAG 2.2 nivel AA como mínimo verificable. | axe + revisión manual |
| E062 | Usar HTML semántico antes de ARIA. | Auditoría DOM |
| E063 | Garantizar navegación completa con teclado. | Prueba manual documentada |
| E064 | Mantener foco visible y orden lógico. | Test de foco |
| E065 | Incluir enlace para saltar al contenido principal. | Prueba funcional |
| E066 | Etiquetar campos, controles, errores e instrucciones de forma programática. | Tests de formularios |
| E067 | No comunicar información únicamente mediante color, forma, sonido o posición. | Revisión visual y SR |
| E068 | Mantener contraste suficiente en texto, iconos y estados interactivos. | Informe de contraste |
| E069 | Permitir zoom al 200 % sin pérdida de contenido o función. | Matriz de viewport |
| E070 | Soportar reflow a 320 CSS px sin desplazamiento bidimensional injustificado. | Capturas/test |
| E071 | Ofrecer objetivos táctiles adecuados y separación segura. | Medición UI |
| E072 | Respetar `prefers-reduced-motion` y eliminar animación peligrosa. | Test de preferencia |
| E073 | Evitar destellos que puedan provocar convulsiones. | Revisión de flashes |
| E074 | Proporcionar texto alternativo útil o marcar decoración. | Muestreo de activos |
| E075 | Subtitular vídeo y transcribir audio esencial. | Archivo de subtítulos/transcripción |
| E076 | Proporcionar audiodescripción o alternativa equivalente cuando sea necesaria. | Revisión de medios |
| E077 | Identificar idioma de página y cambios de idioma. | Test DOM/i18n |
| E078 | Hacer comprensibles los mensajes de error y cómo corregirlos. | Casos de error probados |
| E079 | Evitar límites de tiempo; si existen, permitir ampliarlos. | Configuración y test |
| E080 | Evitar autenticación basada solo en memoria, puzzles o capacidad cognitiva. | Flujo de acceso probado |
| E081 | Probar con lector de pantalla en al menos dos combinaciones relevantes. | Registro de prueba |
| E082 | Probar con usuarios con distintas capacidades cuando sea viable. | Sesión y hallazgos |
| E083 | Ofrecer modo de bajo ancho de banda y degradación funcional. | Presupuesto/red simulada |
| E084 | Garantizar uso esencial en móvil económico. | Matriz de dispositivos |
| E085 | Publicar declaración de accesibilidad y canal de reporte. | Página accesible y vigente |

## 5. Idiomas, cultura y alfabetización (E086–E100)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E086 | Definir locales soportados y nivel real de cobertura. | Matriz de locales |
| E087 | No mezclar idiomas accidentalmente en una misma experiencia. | Test de claves y fallback |
| E088 | Usar traducción humana o revisión humana para contenido crítico. | Revisor por locale |
| E089 | Conservar significado, tono y nivel pedagógico al traducir. | Revisión comparada |
| E090 | Adaptar fechas, números, moneda, unidades y pluralización al locale. | Tests i18n |
| E091 | Soportar RTL cuando se declare un idioma RTL. | Prueba visual y teclado |
| E092 | Evitar banderas como sustituto único del idioma. | Revisión UI |
| E093 | Permitir cambiar de idioma sin perder página, progreso ni datos. | Test de continuidad |
| E094 | Mostrar fallback explícito cuando falte una traducción. | Test de ausencia |
| E095 | Mantener claves estables y detectar traducciones huérfanas o faltantes. | Gate automatizado |
| E096 | Evitar lenguaje discriminatorio, colonial o estigmatizante. | Guía editorial y revisión |
| E097 | Explicar supuestos culturales y variaciones regionales. | Notas contextuales |
| E098 | Diseñar para baja alfabetización digital con instrucciones concretas. | Test de primera tarea |
| E099 | Evitar jerga institucional en trámites o explicar su significado. | Revisión de contenido |
| E100 | Probar comprensión con hablantes reales de los idiomas prioritarios. | Pruebas y cambios |

## 6. Privacidad y control de datos (E101–E120)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E101 | Minimizar datos: no recoger lo que no sea necesario. | Inventario dato→finalidad |
| E102 | Definir base jurídica y finalidad antes de cada tratamiento. | Registro de tratamiento |
| E103 | Informar de forma clara, breve y accesible al recoger datos. | Aviso contextual |
| E104 | Separar consentimiento opcional de acceso al aprendizaje esencial. | Flujo probado |
| E105 | No usar casillas premarcadas ni patrones oscuros de consentimiento. | Revisión UI |
| E106 | Permitir acceso, rectificación, exportación, oposición y supresión cuando proceda. | Procedimiento y prueba |
| E107 | Definir retención y borrado para cada categoría de dato. | Tabla y job/test |
| E108 | Probar el borrado real en aplicación, copias y proveedores. | Evidencia de borrado |
| E109 | Cifrar datos sensibles en tránsito y en reposo. | Configuración verificada |
| E110 | Separar identificadores directos, analítica y contenido educativo. | Modelo de datos |
| E111 | No incluir datos personales en logs, URLs, prompts o telemetría. | Tests/redacción |
| E112 | Mantener contratos y subencargados de tratamiento inventariados. | Registro de proveedores |
| E113 | Evaluar transferencias internacionales y salvaguardas. | TIA/SCC si aplica |
| E114 | Ejecutar DPIA cuando exista alto riesgo, menores o perfilado significativo. | DPIA o decisión motivada |
| E115 | Limitar privilegios internos y registrar accesos administrativos. | RBAC y auditoría |
| E116 | Proteger datos de aprendizaje frente a uso publicitario o reventa. | Política y controles |
| E117 | Prohibir entrenar modelos con datos del alumnado sin base y permiso explícitos. | Configuración/contrato |
| E118 | Mantener plan de respuesta y notificación de brechas. | Runbook y simulacro |
| E119 | Revisar RGPD, LOPDGDD y normativa aplicable antes de producción institucional. | Revisión jurídica fechada |
| E120 | Diseñar analítica respetuosa: agregada, proporcional y desactivable. | Esquema y consentimiento |

## 7. Seguridad y abuso (E121–E145)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E121 | Mantener modelo de amenazas actualizado por superficie y actor. | Threat model versionado |
| E122 | Validar entradas en el límite de confianza con esquemas estrictos. | Tests negativos |
| E123 | Codificar salidas según contexto y prevenir XSS. | Tests/SAST |
| E124 | Parametrizar consultas y prevenir inyección. | Revisión y test |
| E125 | Aplicar autenticación segura solo donde sea necesaria. | Diseño y pruebas |
| E126 | Exigir MFA para administración y funciones de alto riesgo. | Configuración probada |
| E127 | Aplicar autorización en servidor y mínimo privilegio. | Tests de acceso |
| E128 | Rotar sesiones, expirar tokens y proteger cookies. | Configuración y tests |
| E129 | Proteger cambios de estado frente a CSRF cuando corresponda. | Test de request |
| E130 | Limitar frecuencia, tamaño, concurrencia y coste por actor. | Rate limits probados |
| E131 | Gestionar secretos fuera del repositorio y escanear filtraciones. | Secret scan y proveedor |
| E132 | Fijar dependencias con lockfile y revisar vulnerabilidades. | SBOM/auditoría |
| E133 | Verificar procedencia e integridad de artefactos y builds. | Hash/provenance |
| E134 | Mantener cabeceras de seguridad y CSP apropiadas. | Escaneo HTTP |
| E135 | Restringir CORS a orígenes necesarios. | Test de orígenes |
| E136 | Validar cargas de archivos por tipo real, tamaño y contenido. | Tests/malware scan |
| E137 | Aislar procesamiento de contenido no confiable. | Sandbox/arquitectura |
| E138 | Registrar eventos de seguridad sin datos excesivos. | Esquema y alertas |
| E139 | Disponer de reporte responsable de vulnerabilidades. | SECURITY.md operativo |
| E140 | Definir SLA de triage y parcheo por severidad. | Política y métricas |
| E141 | Probar restauración, no solo creación, de copias de seguridad. | Simulacro fechado |
| E142 | Evitar acciones destructivas sin confirmación, alcance y rollback. | Guardas y tests |
| E143 | Proteger la plataforma contra spam, scraping abusivo y automatización hostil. | Controles proporcionales |
| E144 | Mantener protocolo de moderación y apelación si existe contenido de usuarios. | Flujo y registro |
| E145 | Ejecutar revisión de seguridad antes de cada release material. | Gate y resultado |

## 8. Menores, bienestar y seguridad educativa (E146–E158)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E146 | Determinar si el servicio es accesible a menores y aplicar protección por diseño. | Decisión de edad |
| E147 | Usar avisos y controles comprensibles para la edad prevista. | Prueba de comprensión |
| E148 | Aplicar privacidad alta por defecto para menores. | Configuración verificada |
| E149 | Evitar perfilado publicitario y persuasión comercial de menores. | Ausencia/controles |
| E150 | No usar rachas, presión social o escasez para inducir uso compulsivo. | Revisión de mecánicas |
| E151 | Facilitar reporte de daño, acoso o contenido inadecuado. | Flujo probado |
| E152 | Definir escalado humano para riesgo, abuso o emergencia. | Runbook y responsables |
| E153 | No diagnosticar salud mental, capacidad o personalidad. | Revisión de funciones |
| E154 | Mostrar límites de tutores automáticos y vías de ayuda humana. | Mensajes contextuales |
| E155 | Bloquear instrucciones peligrosas o ilegales sin impedir educación legítima. | Casos de seguridad |
| E156 | Evitar rankings públicos humillantes o comparaciones dañinas. | Revisión de producto |
| E157 | Dar control sobre notificaciones, pausas y tiempo de uso. | Preferencias probadas |
| E158 | Revisar DSA y guías europeas de protección de menores cuando apliquen. | Revisión fechada |

## 9. IA educativa responsable (E159–E175)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E159 | Declarar cuándo una persona interactúa con IA. | Etiqueta visible |
| E160 | Definir finalidad pedagógica concreta para cada función de IA. | Ficha de uso |
| E161 | Ofrecer alternativa no-IA para funciones esenciales. | Flujo alternativo probado |
| E162 | No fingir capacidades, memoria, fuentes o comprensión inexistentes. | Mensajes y tests |
| E163 | Recuperar contenido desde fuentes controladas cuando la precisión sea crítica. | RAG/catálogo con citas |
| E164 | Mostrar fuentes y nivel de incertidumbre en respuestas factuales. | UI y pruebas |
| E165 | Evaluar alucinación, sesgo, toxicidad y fuga de datos antes del release. | Dataset y resultados |
| E166 | Proteger instrucciones, herramientas y datos frente a prompt injection. | Tests adversariales |
| E167 | Limitar herramientas por allowlist y validar sus argumentos. | Política y tests |
| E168 | Exigir confirmación humana para acciones externas o de alto impacto. | Gate HITL probado |
| E169 | No usar IA como única base de calificación, admisión o exclusión. | Diseño de decisión |
| E170 | Permitir impugnar y corregir resultados asistidos por IA. | Flujo de apelación |
| E171 | Registrar modelo, versión, prompt, contexto y política sin almacenar secretos. | Trazabilidad segura |
| E172 | Controlar coste, latencia, cuotas y fallback de proveedores. | Presupuestos y pruebas |
| E173 | Evaluar riesgo conforme al AI Act antes de usos educativos sensibles. | Clasificación y medidas |
| E174 | Garantizar alfabetización en IA para responsables y operadores. | Formación registrada |
| E175 | Suspender automáticamente una función de IA que exceda umbrales de daño. | Kill switch y runbook |

## 10. Evaluación, credenciales e integridad (E176–E185)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E176 | Definir qué significa aprobar y qué no demuestra el resultado. | Política de evaluación |
| E177 | Separar identidad, intento, respuesta, puntuación y evidencia. | Modelo de datos |
| E178 | Versionar bancos de ítems y detectar preguntas defectuosas. | Historial y métricas |
| E179 | Evitar filtraciones de respuestas sin vigilancia invasiva. | Diseño proporcional |
| E180 | Ofrecer adaptaciones razonables sin penalizar al alumno. | Flujo documentado |
| E181 | Verificar certificados y evitar afirmaciones de acreditación no oficial. | Firma/QR y texto legal |
| E182 | Permitir exportar logros y evidencias en formato portable. | Exportación probada |
| E183 | Detectar fraude con señales múltiples y revisión humana. | Política de decisión |
| E184 | Permitir revisión, apelación y corrección de calificaciones. | Flujo y SLA |
| E185 | Conservar solo la evidencia necesaria durante el plazo declarado. | Retención aplicada |

## 11. Ingeniería, entrega y operación (E186–E200)

| ID | Regla obligatoria | Evidencia mínima |
|---|---|---|
| E186 | Preservar la arquitectura natural del producto y documentar límites de módulos. | Diagrama y ADR |
| E187 | Mantener un arranque reproducible desde un clon limpio. | CI de bootstrap |
| E188 | Ejecutar lint, tipos, pruebas y build en CI. | Workflow y ejecución |
| E189 | Probar flujos críticos de extremo a extremo. | E2E estable |
| E190 | Probar accesibilidad automáticamente y de forma manual. | Gate + informe |
| E191 | Definir presupuestos de rendimiento, bundle y red. | Tests de presupuesto |
| E192 | Medir Core Web Vitals o equivalentes con privacidad. | Métricas y umbrales |
| E193 | Diseñar offline, reintentos e idempotencia donde el público lo necesite. | Pruebas de fallo |
| E194 | Mantener observabilidad con logs, métricas, trazas y alertas accionables. | Dashboard/runbook |
| E195 | Definir SLO, degradación y comunicación de incidentes. | SLO y plantilla |
| E196 | Probar rollback y migraciones hacia delante y atrás en entorno seguro. | Simulacro |
| E197 | Separar configuración, secretos, datos y código. | Estructura y escaneo |
| E198 | Reutilizar componentes mantenidos antes de crear equivalentes; registrar licencia y ajuste. | ADR/NOTICE/SBOM |
| E199 | Eliminar dependencias, archivos y funciones muertas con prueba de no uso. | Análisis y diff reversible |
| E200 | Publicar solo cuando todas las reglas bloqueantes tengan evidencia o excepción firmada. | Gate de release |

## Política de reutilización y bancos de código

La reutilización es obligatoria cuando reduce riesgo y encaja con la arquitectura. Se priorizan, por este orden: dependencia mantenida y fijada por lockfile; API/servicio aislado; plantilla oficial; módulo extraído con tests y atribución; implementación propia solo cuando las anteriores no sirven.

Antes de incorporar código externo se registra: repositorio y commit/tag, licencia SPDX, archivos o paquete usado, cambios locales, mantenimiento, vulnerabilidades conocidas, tamaño, datos que procesa, alternativa de retirada y pruebas. AGPL/GPL, modelos y datasets requieren revisión de compatibilidad antes de mezclarlos con el producto.

Catálogo inicial de referencia, no importación automática:

- Plataformas educativas: Open edX, Kolibri, Oppia, Moodle y Frappe LMS.
- Backend Python cuando exista un servicio Python real: Django, FastAPI, Pydantic, Celery, SQLAlchemy, Alembic y Authlib.
- Calidad Python: pytest, Hypothesis, Ruff, mypy, Bandit, pip-audit y coverage.py.
- Contenido e idiomas: Babel, ICU/CLDR, CommonMark y formatos abiertos con procedencia.
- Interoperabilidad: LTI, xAPI, SCORM solo cuando exista un consumidor concreto.
- En repositorios TypeScript se prefieren componentes del stack ya existente; no se introduce Python solo para cumplir una preferencia tecnológica.

## Marco normativo y técnico de referencia

Este contrato traduce requisitos de ingeniería; no sustituye asesoramiento jurídico. Fuentes primarias a revisar en cada release relevante:

- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- RGPD, Reglamento (UE) 2016/679: <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- LOPDGDD, Ley Orgánica 3/2018: <https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673>
- AI Act, Reglamento (UE) 2024/1689: <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>
- Digital Services Act, Reglamento (UE) 2022/2065: <https://eur-lex.europa.eu/eli/reg/2022/2065/oj>
- European Accessibility Act, Directiva (UE) 2019/882: <https://eur-lex.europa.eu/eli/dir/2019/882/oj>
- Real Decreto 1112/2018: <https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699>
- Guías europeas para menores en línea: <https://eur-lex.europa.eu/eli/C/2025/5519/oj>
- INCIBE / Internet Segura for Kids: <https://www.incibe.es/menores>

## Protocolo de actualización

1. El repositorio aporta evidencia en `docs/quality/evidence.json` o documento equivalente.
2. Una comprobación automática valida IDs, estados y enlaces.
3. El PR cambia el estado de reglas concretas y adjunta prueba.
4. La fuente canónica actualiza el total únicamente después de integrar la evidencia.
5. Si una regla retrocede, se registra el incidente y vuelve a `EN CONSTRUCCIÓN` o `BLOQUEADO`; nunca se conserva un verde histórico falso.


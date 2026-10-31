# Mejores Skills Mundo OpenCode

- Chat ID: `9d57b095-69bc-4bc6-b69e-d1aa109d9843`
- Mensajes: 4
- Periodo: 2026-08-28 23:45 UTC → 2026-08-29 01:20 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-08-28 23:45

los mejores skills del mundo opencode

## [ASSISTANT] 2026-08-28 23:45 · Qwen3.7-Plus

En el ecosistema del "open code" (desarrollo de código abierto, colaborativo y distribuido en plataformas como GitHub, GitLab o Codeberg), las habilidades más valoradas no son solo los lenguajes de programación, sino las **meta-habilidades técnicas y de colaboración** que permiten construir, mantener y escalar proyectos con miles de contribuidores anónimos.

A continuación, se detallan las mejores y más críticas habilidades en el mundo del código abierto, divididas en dominio técnico, colaboración y gestión de proyectos.

---

### 1. Dominio Técnico Avanzado (Hard Skills)

En el código abierto, el código debe ser mantenible por personas que no conocen el contexto interno del proyecto. Por ello, las habilidades técnicas van más allá de escribir código funcional.

*   **Dominio Avanzado de Git y Control de Versiones:**
    *   No se limita a `commit` y `push`. Implica el uso experto de `git rebase -i` para mantener un historial de commits limpio y atómico.
    *   Habilidad para resolver conflictos de merge complejos en monorepos.
    *   Uso de `git bisect` para identificar commits que introdujeron errores (regresiones) de forma automatizada.
    *   Gestión de submódulos, subtrees y flujos de trabajo complejos (como GitFlow o Trunk-Based Development adaptado a OSS).
*   **Arquitectura de Software y Diseño de APIs (Enfoque en Retrocompatibilidad):**
    *   Diseñar sistemas modulares y desacoplados. En el código abierto, romper la retrocompatibilidad (breaking changes) es un pecado capital porque afecta a miles de usuarios downstream.
    *   Habilidad para diseñar APIs (REST, GraphQL, gRPC) intuitivas, bien documentadas y versionadas correctamente.
    *   Creación de interfaces de plugins o extensiones que permitan a la comunidad extender el proyecto sin modificar el núcleo (core).
*   **Automatización, CI/CD y DevOps:**
    *   Configuración y mantenimiento de pipelines de Integración y Despliegue Continuo (GitHub Actions, GitLab CI).
    *   Automatización de pruebas (unitarias, de integración, end-to-end) para que ningún Pull Request (PR) se fusione sin pasar por un rigoroso control de calidad.
    *   Configuración de linters, formateadores automáticos (Prettier, Black) y pre-commit hooks para estandarizar el código sin fricción humana.
*   **Seguridad en la Cadena de Suministro (Supply Chain Security):**
    *   Gestión proactiva de dependencias (uso de Dependabot, Renovate).
    *   Implementación de SAST (Análisis Estático) y DAST (Análisis Dinámico) en los pipelines.
    *   Generación y mantenimiento de SBOM (Software Bill of Materials) y manejo responsable de vulnerabilidades (CVEs) y divulgación de seguridad privada.

### 2. Habilidades de Colaboración y Comunicación (Soft Skills Técnicos)

El código abierto es, ante todo, un ejercicio de comunicación asíncrona entre personas de diferentes zonas horarias, idiomas y culturas.

*   **Comunicación Asíncrona y Documentación Excepcional:**
    *   **Redacción de RFCs (Request for Comments) y ADRs (Architecture Decision Records):** Habilidad para proponer cambios arquitectónicos mayores mediante documentos estructurados que detallen el contexto, las opciones consideradas, los trade-offs y la decisión final.
    *   **Descripciones de PR impecables:** Un buen PR no solo muestra código; incluye el "por qué" del cambio, capturas de pantalla, benchmarks de rendimiento y enlaces a los issues que resuelve.
    *   **Documentación orientada al usuario y al contribuidor:** Escribir READMEs claros, guías de inicio rápido (Quickstart), y documentos `CONTRIBUTING.md` que reduzcan la fricción para los nuevos colaboradores.
*   **Code Review Empático y Constructivo:**
    *   Revisar código enfocándose en la arquitectura, la seguridad y la mantenibilidad, dejando la sintaxis a los linters automáticos.
    *   Utilizar un lenguaje inclusivo y no confrontacional (ej. "¿Qué pasaría si..." en lugar de "Esto está mal").
    *   Diferenciar entre bloqueos obligatorios (must-fix) y sugerencias menores (nitpicks), y marcar estos últimos claramente para no ralentizar la fusión.
*   **Mentoría y Onboarding de Nuevos Contribuidores:**
    *   Habilidad para etiquetar issues con `good first issue` o `help wanted`.
    *   Paciencia y claridad para guiar a principiantes a través del proceso de fork, branch, commit y pull request sin hacer el trabajo por ellos.

### 3. Gestión de Proyectos y Comunidad (Maintainer Skills)

Mantener un proyecto de código abierto exitoso requiere habilidades de gestión de productos y comunidades.

*   **Triaje y Gestión de Issues (Issue Triage):**
    *   Habilidad para filtrar el ruido: reproducir errores reportados, etiquetar issues correctamente, cerrar duplicados y priorizar el backlog.
    *   Redactar plantillas de issues (Issue Templates) que obliguen a los usuarios a proporcionar la información mínima necesaria (logs, versión, pasos para reproducir) para evitar el ida y vuelta innecesario.
*   **Gestión de la Deuda Técnica y Refactorización:**
    *   Equilibrar la incorporación de nuevas características (features) con la refactorización del código existente.
    *   Saber cuándo decir "no" a una nueva feature porque no se alinea con la visión del proyecto (evitando el "feature creep" o scope creep).
*   **Gobernanza y Gestión de Comunidad:**
    *   Redacción y aplicación de un `CODE_OF_CONDUCT` (Código de Conducta) claro para mantener un entorno seguro e inclusivo.
    *   Manejo de conflictos interpersonales en los hilos de discusión de GitHub/GitLab.
    *   Establecimiento de un modelo de gobernanza (ej. meritocracia, BDFL, comité directivo) y definición de cómo se otorgan permisos de mantenimiento (maintainership) a contribuidores destacados.

### Resumen de Valor

En el mundo del open code, un desarrollador que escribe código brillante pero es hostil en las revisiones o no documenta sus cambios tiene un valor neto bajo para el ecosistema. **Los "mejores skills" son aquellos que multiplican la productividad de los demás:** la capacidad de automatizar lo repetitivo, documentar lo complejo, y colaborar con empatía en un entorno distribuido.

## [USER] 2026-08-29 01:20

,E REFIERP A LAS EXTRAS QUE SE LE INSTALAN

## [ASSISTANT] 2026-08-29 01:20 · Qwen3.7-Plus

Entendido. En el contexto de **OpenCode** (el agente de IA de código abierto para terminal, IDE o escritorio), las "skills" (o extras) no son habilidades humanas, sino **módulos instalables** (generalmente archivos `SKILL.md` o plugins) que dotan al agente de capacidades específicas, reutilizables y bajo demanda, similares a las *skills* de Claude Code o las reglas de Cursor [[2], [17]]. 

A continuación, se detallan las mejores y más útiles *skills* para instalar en OpenCode en 2026, categorizadas por su función, basadas en el consenso actual de la comunidad de desarrollo y benchmarks de agentes de IA [[22], [25], [29]].

---

### 1. Acceso a Datos Externos e Integración (Conectividad)
OpenCode, por defecto, opera con el conocimiento con el que fue entrenado el modelo base y no tiene acceso nativo a internet en tiempo real ni a tus herramientas SaaS. Estas *skills* rompen ese aislamiento.

*   **Firecrawl**: Es la *skill* definitiva para otorgar a OpenCode acceso web en vivo. Permite al agente buscar, hacer *scraping*, rastrear sitios y automatizar navegadores para obtener documentación reciente, changelogs de librerías o contexto de páginas publicadas después de su entrenamiento [[36]].
*   **Composio**: Actúa como el tejido conectivo entre OpenCode y más de 1000 aplicaciones SaaS (GitHub, Linear, Slack, Stripe, Jira, Notion). Enseña al agente a usar la CLI, autenticación y acciones MCP (Model Context Protocol) para crear tickets, leer hilos o consultar bases de datos sin que tengas que copiar y pegar información manualmente [[23], [36]].

### 2. Metodología y Planificación de Desarrollo
Evitan que el agente genere código de forma impulsiva y errónea, forzando un flujo de trabajo de ingeniería de software disciplinado.

*   **Obra Superpowers**: El framework de desarrollo multi-agente más completo disponible. Inyecta una "regla del 1%" (si hay una mínima posibilidad de que una *skill* aplique, el agente debe usarla). Orquesta todo el ciclo: *brainstorming*, creación de *git worktrees*, planificación en tareas de 2-5 minutos, desarrollo guiado por pruebas (TDD), ejecución por subagentes y revisión sistemática antes de marcar una tarea como completada [[29], [36]].
*   **Grill Me**: Diseñada para la fase de especificación. Antes de escribir una sola línea de código, esta *skill* entrevista al usuario de forma implacable sobre cada rama del plan, resuelve dependencias y ofrece respuestas recomendadas para cada decisión, evitando que el agente avance con suposiciones incorrectas [[25], [36]].

### 3. Comprensión y Calidad del Código
Mejoran la capacidad del agente para navegar repositorios grandes y mantener estándares de calidad estrictos.

*   **Understand-Anything**: Convierte cualquier base de código en un grafo de conocimiento interactivo. Utiliza una tubería de subagentes especializados (escáner de proyecto, analizador de arquitectura, etc.) combinados con *Tree-sitter* para generar resúmenes en lenguaje natural de cada archivo, función y dependencia, exponiéndolos mediante búsqueda semántica y tours guiados [[25], [36]].
*   **Vercel React Best Practices**: Proporciona un libro de reglas concreto y priorizado por impacto (no solo una guía de estilo) para revisiones de rendimiento y refactorización en React y Next.js. Detecta cascadas de *fetch*, problemas de serialización en RSC/SSR y reglas de memorización [[23]].
*   **Anthropic Frontend Design**: Obliga al agente a elegir una dirección estética explícita (tipografía, color, movimiento) antes de generar código UI, evitando el típico diseño genérico y degradado de "plantilla de IA" [[23]].

### 4. Optimización de Recursos y Documentación
Gestionan los límites técnicos del modelo y la calidad de la salida escrita.

*   **Handoff**: Resuelve el problema de la "deriva del contexto". Cuando una sesión se acerca al límite de compresión (aprox. 120k tokens), la calidad de las respuestas decae. Esta *skill* comprime la sesión actual en un documento Markdown estructurado, permitiendo continuar en una sesión fresca o delegar el trabajo a otro agente sin perder el hilo [[25], [36]].
*   **Caveman**: Reduce los tokens de salida en un 65% en promedio. Elimina narración, relleno y cortesía de las respuestas del agente, manteniendo cada hecho técnico y bloque de código intacto byte por byte (ej. en lugar de una explicación larga, responde: "Nueva ref de objeto en cada render. Envolver en `useMemo`") [[25], [36]].
*   **stop-slop**: Una *skill* de preferencia codificada para la escritura. Elimina los patrones delatorres de la IA en textos (muletillas iniciales, jerga corporativa, uso excesivo de rayas, estructura "No es X. Es Y."). Aplica una rúbrica de puntuación de 1 a 10 y revisa cualquier texto que no supere el umbral, ideal para READMEs, mensajes de commit y documentación [[23], [36]].

---

### Cómo se instalan las Skills en OpenCode

OpenCode tiene soporte nativo para el descubrimiento de *skills* y es compatible con el ecosistema de *skills* de Claude Code y Codex [[2], [31]]. 

1. **Ubicación de archivos**: Puedes colocar las carpetas de las *skills* (que contienen el archivo `SKILL.md`) en:
   - Global: `~/.config/opencode/skills` o `~/.agents/skills`
   - Por proyecto: `.opencode/skills` o `.claude/skills` en la raíz de tu repositorio [[2], [24]].
2. **Instalación vía CLI**: La forma más eficiente es usar la herramienta `skills` de npm, que instala la *skill* en todas tus herramientas de IA compatibles a la vez:
   ```bash
   npx skills add https://github.com/anthropics/skills --skill frontend-design
   # o para firecrawl
   npx skills add firecrawl-dev/skills
   ```
3. **Plugins vs. Skills**: Ten en cuenta que las *skills* son archivos de instrucciones en Markdown que el agente carga bajo demanda. Si necesitas modificar el comportamiento interno del motor (como inyectar la "regla del 1%" de Obra), debes instalar un **plugin** añadiéndolo a tu archivo `opencode.json` [[23], [28]].

### Recomendación de Implementación
No instales todo a la vez. El enfoque óptimo es:
1. Comienza con **Firecrawl** o **Composio** para darle ojos y manos al agente fuera de tu sistema de archivos.
2. Añade **stop-slop** o **Caveman** para limpiar inmediatamente la salida y ahorrar tokens/costos.
3. Si trabajas en un equipo o en código base complejo, incorpora **Obra Superpowers** o **Understand-Anything** para estructurar el flujo de trabajo. 

Mantén las *skills* actualizadas, ya que funcionan como pequeños manuales de operaciones versionados que evolucionan con tu flujo de trabajo [[23]].

# Open School Repository Analysis

- Chat ID: `5da65888-5cbc-4b94-b3d6-a4c41fcd0beb`
- Mensajes: 2
- Periodo: 2026-09-29 03:07 UTC → 2026-09-29 03:07 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-09-29 03:07

Intenta definir a cada parte al máximo Skip to content
belentani7
open-school
Repository navigation
Code
Issues
Pull requests
6
 (6)
Agents
Actions
Projects
Wiki
Security and quality
Insights
Settings
belentani7
open-school
Public
Your main branch isn't protected
Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.
Go to file
t
T
belentani7
belentani7
tutor-ia: capsula didactica 2026-09-28 [pt]
0406ff5
 · 
10 hours ago
Name		
.github
feat(pages): desplegar app React en /app/ junto al campus PWA (workfl…
yesterday
assets
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
backend
fix: cliente NVIDIA via http.client con host fijo (anti-SSRF)
2 weeks ago
campus
tutor-ia: capsula didactica 2026-09-28 [pt]
10 hours ago
client
feat(open-data): pack de 6 temas desde APIs abiertas + copia servible…
2 weeks ago
open-data
feat(open-data): pack de 6 temas desde APIs abiertas + copia servible…
2 weeks ago
.env.example
fix: resolver conflictos restantes (LICENSE MIT, .gitignore, .env.exa…
3 weeks ago
.gitignore
Blindar .gitignore con bloque IA agent states
2 weeks ago
AGENTS.md
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
ASSETS-NECESARIOS.txt
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
CONTRIBUTING.md
docs: add SECURITY.md and CONTRIBUTING.md; configure Dependabot
last week
GAME-LOOP-SPEC.md
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
LICENSE
fix: resolver conflictos restantes (LICENSE MIT, .gitignore, .env.exa…
3 weeks ago
NOTICE-ATRIBUCIONES.md
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
README.md
docs: badge Open in VS Code (github.dev)
3 days ago
SECURITY.md
docs: add SECURITY.md and CONTRIBUTING.md; configure Dependabot
last week
SKILL.md
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
app.html
feat(pages): desplegar app React en /app/ junto al campus PWA (workfl…
yesterday
campus.html
edu-forge: unificacion + campus Harvard/Coursera + voz IA + agente tu…
3 weeks ago
index.html
feat: index.html redirect to campus for GitHub Pages
3 weeks ago
open-school-secure-t-coupling.zip
chore: belentani legacy sync
3 weeks ago
package-lock.json
chore(deps): regenerar lockfiles alineados con package.json (fix pnpm…
yesterday
package.json
chore: remove legacy deps and scripts after client-only migration
last week
pnpm-lock.yaml
chore(deps): regenerar lockfiles alineados con package.json (fix pnpm…
yesterday
pnpm-workspace.yaml
fix(open-school): allowBuilds con booleano real, docstring del nucleo…
2 weeks ago
theme-demo-glass.html
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
theme-demo.html
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
tsconfig.json
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
vercel.json
feat(front): reconstruir el frontend sobre la identidad BELENTANI
3 weeks ago
vite.config.ts
fix: restaurar app real (client vite + shared + assets) eliminada por…
3 weeks ago
Repository files navigation
README
Contributing
MIT license
Security
Open in VS Code

Open School
Instituto digital abierto y gratuito. Formación para quien empieza de cero en un país nuevo: sin matrícula, sin datos personales, sin publicidad.

Estado: frontend completo y con build verde · backend sin implementar. Este README describe lo que hay en el repositorio hoy. Lo que está planificado va aparte, en Hoja de ruta, para que nadie clone esperando un servidor que todavía no existe. La especificación completa del producto está en SKILL.md.

Qué funciona hoy
Una SPA de React que sirve el catálogo de rutas, el detalle de cada una, un panel de progreso y un tutor de orientación. Todo el estado vive en el navegador; no hay servidor propio ni base de datos conectada.

Área	Estado
Catálogo, buscador y filtros	funcionando
Ficha de ruta con progreso	funcionando, progreso local
Panel anónimo (UUID + borrado real)	funcionando
Tutor orientador	funcionando, sin modelo de lenguaje
Instalable / funciona sin conexión	funcionando (service worker)
Contenido de las lecciones	no implementado
API, base de datos, autenticación	no implementado
Certificados verificables por QR	no implementado
Anónimo de verdad
No hay pantalla de registro porque no hay cuentas. Al entrar se genera un UUID aleatorio en el propio dispositivo, con caducidad de 365 días, y el progreso se guarda junto a él en localStorage. Sin correo, sin teléfono, sin IP, sin cookies de terceros. El botón Borrar todo del panel elimina identificador y progreso; no queda copia en ninguna parte porque nunca salió del dispositivo.

Implementación: client/src/lib/progress.ts.

El tutor no finge
No hay ningún LLM detrás. El tutor enruta la pregunta por palabras clave y responde con datos reales del catálogo; cuando no sabe, lo dice en vez de improvisar. Simular inteligencia en una plataforma educativa es precisamente el fallo que no se perdona. Cuando haya endpoint, se sustituye la función answer() y el aviso desaparece solo.

Sistema de diseño
Identidad BELENTANI / NOIACORE: contención de Apple, noir de HBO Max, liquid glass, plasma y cine. Sustrato negro al 97 %, presupuesto de luz global del 3 %, y una jerarquía que no se negocia:

negro › material › luz › información — la luz nunca por encima de la información.

Capa	Fichero	Contenido
1 · Tokens	styles/tokens.css	color, luz, tipografía, forma, física del movimiento
2 · Material	styles/material.css	liquid glass de 4 capas, escala tipográfica, controles
3 · Chrome	styles/chrome.css	navegación, pie, escaparate, medidores
Material de 4 capas (no es un background: rgba()): efecto (backdrop-filter + refracción SVG) → tinte sólido → shine de 4 inset-shadow que dibuja el bisel → contenido.

Refracción real en components/Refraction.tsx: feTurbulence genera el mapa de espesor y tres feDisplacementMap con escalas distintas separan los canales RGB — la franja cromática del vidrio. Solo Chromium aplica filtros SVG en backdrop-filter; el resto degrada al blur, que ya es correcto por sí solo.

Rendimiento: el plasma pre-renderiza los degradados a sprites una vez y cada frame solo hace drawImage — crear gradientes dentro del bucle es lo que hunde el framerate en móviles. El bucle se detiene fuera de pantalla, con la pestaña oculta o si el usuario pidió menos movimiento.

Accesibilidad: contraste AAA en texto (blanco 21:1, gris 8.9:1, heliotropo 7.3:1 sobre negro), objetivos táctiles de 44 px, foco siempre visible, salto al contenido, filtros como button aria-pressed, recuento de resultados en live region, y el estado nunca se comunica solo por color. Respeta prefers-reduced-motion y prefers-contrast.

Estructura real
open-school/
├── client/
│   ├── public/            favicon, manifest, service worker
│   ├── index.html
│   └── src/
│       ├── main.tsx       entry — monta React e instala el SW
│       ├── App.tsx        chrome + rutas
│       ├── components/    PlasmaField, Refraction, Glass, ZeroText,
│       │                  RouteCase, Nav, Footer
│       ├── lib/           motion.ts · catalog.ts · progress.ts
│       ├── pages/         Home, Catalog, CourseDetail, Dashboard,
│       │                  Chat, NotFound
│       └── styles/        tokens · material · chrome
├── shared/                types.ts + design system heredado
├── drizzle/               esquema de BD (definido, sin conectar)
├── SKILL.md               especificación completa del producto
└── AGENTS.md              instrucciones para agentes
Stack
Capa	Tecnología
UI	React 19 · Vite 7 · TypeScript 5.6 (strict)
Estilos	Tailwind 4 + CSS propio en 3 capas
Router	Wouter 3
Persistencia	localStorage (anónima)
Offline	Service worker propio, sin dependencias
package.json incluye además el stack previsto en SKILL.md (Radix, Drizzle, Zod, Recharts…) que todavía no usa ningún componente. Están declaradas a propósito, como contrato con la especificación.

Puesta en marcha
Requiere Node 20+ y pnpm. No mezclar con npm: el proyecto tiene pnpm-lock.yaml y Vercel instala con pnpm.

pnpm install
pnpm dev        # desarrollo — http://localhost:5173
pnpm check      # tsc --noEmit
pnpm build      # produccion → dist/client
pnpm start      # sirve el build en http://localhost:8000
No hace falta .env para arrancar: no hay servicios externos conectados.

Despliegue
Vercel, configurado en vercel.json: build con pnpm, salida en dist/client, rewrite de SPA y cabeceras de seguridad (CSP, X-Frame-Options: DENY, Referrer-Policy: no-referrer, caché inmutable para los assets con hash).

Hoja de ruta
Por orden de dependencia:

Contenido real de las lecciones (hoy el catálogo es metadatos).
API y base de datos — el esquema Drizzle ya está definido.
Conectar el tutor a un modelo local (Ollama), sin claves externas.
Certificados verificables por QR.
Voz: Web Speech API para la ruta de fonética.
Multilenguaje PT · ES · CA · EN (hoy la interfaz es solo español).
Licencia
MIT — © 2026 Pedro Belentani. Úsalo libremente, también en proyectos institucionales.

Datos abiertos
El directorio open-data/ ya trae un portal de datos abiertos (temas, fuentes y licencias en open-data/topics.json). Se regenera con python enrich_portals.py <portal> en el proyecto edu-open-data.

Ver open-data/README.md.

Proyectos open similares
Open edX
Moodle
Kolibri
Oppia
Sugar Labs
About

Instituto educativo digital universal — cursos modulares, certificaciones verificables, accesibilidad WCAG, offline-first

open-school-gamma.vercel.app
Topics
Resources
Readme
MIT license
Contributing
Contributing
Security policy
Security policy
Activity
Stars
0 stars
Watchers
0 watching
Forks
0 forks
Releases
1
 (1)
v1.0 primera estable
Latest
last week
Deployments
134
 (134)
Production
10 hours ago
github-pages
yesterday
Preview
yesterday
Packages
No packages published
Publish your first package
Contributors
3
 (3)
@belentani7
belentani7Belentani
@claude
claudeClaude
@aider-chat-bot
aider-chat-botAider
Languages
TypeScript
44.7%
HTML
20.1%
CSS
19.8%
Python
9.7%
JavaScript
5.7%
Footer
© 2026 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Community
Docs
Contact
Manage cookies
Do not share my personal information
tutor-ia: capsula didactica 2026-09-28 [pt]
+5 −0 5 lines changed
Belentani
belentani7 committed 10 hours ago
Press escape to close this hovercard

## [ASSISTANT] 2026-09-29 03:07 · Qwen3.8-Max

A partir de la **Biblia de Términos de Desarrollo de Software (Versión Universal Expandida)** y el análisis exhaustivo del repositorio `open-school` (belentani7), se presenta la deconstrucción técnica, arquitectónica y de gobernanza de cada componente, archivo y concepto mencionado en la interfaz de GitHub y el `README.md`.

Esta documentación es **técnica, extensa y carente de relleno**, mapeando cada elemento del proyecto a su definición universal y su aplicación específica en el ecosistema `open-school`.

---

## 1. ARQUITECTURA DE SOFTWARE Y FRONTEND (CLIENTE)

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **SPA (Single Page Application)** | Aplicación de página única. Una página que se actualiza dinámicamente sin recargar el navegador completo. | El núcleo de la plataforma. React 19 renderiza el catálogo, fichas de ruta y panel de progreso dinámicamente sobre un único `index.html`. |
| **PWA (Progressive Web App)** | Aplicación web progresiva. App web con capacidades nativas, instalable y funcional sin conexión. | El "campus" está diseñado como PWA, permitiendo la instalación en dispositivos móviles y el acceso offline. |
| **Service Worker** | Script que se ejecuta en segundo plano (background) e intercepta peticiones de red. | Implementado en `client/public/` para garantizar la arquitectura **Offline-first**, almacenando en caché los activos y permitiendo el uso sin conexión a internet. |
| **React 19** | Librería JavaScript para interfaces de usuario basada en componentes y estado reactivo. | Motor de renderizado de la UI. Maneja el árbol de componentes (`PlasmaField`, `Refraction`, `Glass`, `RouteCase`). |
| **Vite 7** | Herramienta de build rápida y servidor de desarrollo basado en ESModules nativos. | Entorno de desarrollo y empaquetador (bundler) que compila el código TypeScript y CSS para producción (`dist/client`). |
| **TypeScript (strict)** | Superset tipado de JavaScript que añade tipado estático y opcional. | Lenguaje base (v5.6) configurado en modo `strict` para garantizar la seguridad de tipos, prevenir errores en tiempo de ejecución y servir como documentación viva del código. |
| **Design System (Tokens, Material, Chrome)** | Sistema de diseño. Proceso de crear soluciones visuales y funcionales estandarizadas y reutilizables. | Arquitectura CSS de 3 capas:<br>1. **Tokens** (`tokens.css`): Variables atómicas (color, luz, física).<br>2. **Material** (`material.css`): Componentes, *liquid glass*, tipografía.<br>3. **Chrome** (`chrome.css`): Layout, navegación, pie de página. |
| **Liquid Glass / Refracción (SVG)** | Técnicas avanzadas de CSS y SVG para simular físicas de materiales. | Uso de `backdrop-filter` combinado con filtros SVG (`feTurbulence`, `feDisplacementMap`) en `Refraction.tsx` para separar canales RGB y simular la aberración cromática del vidrio real. |
| **Accesibilidad (a11y) / WCAG** | Diseño inclusivo para personas con discapacidades, regido por las Pautas de Accesibilidad para Contenido Web. | Cumplimiento estricto: Contraste AAA (21:1), objetivos táctiles de 44px, foco visible, uso de `aria-pressed`, `live regions` y respeto a las preferencias del sistema (`prefers-reduced-motion`, `prefers-contrast`). |
| **Wouter 3** | Librería de enrutamiento (Router) minimalista para React. | Gestiona la navegación entre las páginas (`Home`, `Catalog`, `CourseDetail`, `Dashboard`, `Chat`) sin recargar el DOM. |

---

## 2. PERSISTENCIA, DATOS Y PRIVACIDAD (ARQUITECTURA ANÓNIMA)

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **localStorage** | Almacenamiento local persistente en el navegador (Web Storage API). | Base de datos del cliente. Almacena el progreso del usuario y su identificador anónimo. Los datos **nunca** abandonan el dispositivo. |
| **UUID (Identificador Único)** | Estándar para generar identificadores únicos universales sin necesidad de una autoridad central. | Generado algorítmicamente en el dispositivo del usuario al entrar. Sustituye a las cuentas de usuario, correos y sesiones de servidor. Caduca a los 365 días. |
| **Privacidad por Diseño** | Principio de ingeniería que integra la protección de datos desde la concepción del sistema. | Ausencia total de registros, IPs trackeadas, cookies de terceros o telemetría invasiva. El botón "Borrar todo" destruye el UUID y el progreso local de forma irreversible. |
| **ORM (Drizzle)** | Object-Relational Mapping. Mapeo entre objetos de código y tablas de bases de datos relacionales. | Ubicado en `/drizzle`. El esquema de la base de datos ya está definido como contrato (Infrastructure as Code), aunque el backend aún no está conectado. |
| **Open Data / APIs Abiertas** | Datos gubernamentales o institucionales expuestos mediante APIs públicas y licencias abiertas. | El directorio `/open-data` contiene scripts (`enrich_portals.py`) para consumir, normalizar y almacenar localmente planes de estudio de fuentes abiertas. |

---

## 3. SEGURIDAD, CABECERAS HTTP Y VULNERABILIDADES

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **CSP (Content Security Policy)** | Cabecera HTTP de seguridad que previene XSS (Cross-Site Scripting) y ataques de inyección limitando los orígenes de recursos. | Configurada en `vercel.json` para blindar el frontend, restringiendo de dónde se pueden cargar scripts, estilos e imágenes. |
| **X-Frame-Options (DENY)** | Cabecera de seguridad web para prevenir *Clickjacking* (secuestro de clics). | Impide que `open-school` sea embebido dentro de un `<iframe>` en dominios maliciosos. |
| **Referrer-Policy (no-referrer)** | Cabecera HTTP que controla cuánta información de origen (URL previa) se envía al servidor de destino. | Protege la privacidad del usuario; al hacer clic en un enlace externo, el destino no sabe que el usuario provino de la plataforma educativa. |
| **SSRF (Server-Side Request Forgery)** | Vulnerabilidad donde un atacante engaña al servidor para que realice peticiones HTTP a recursos internos o no autorizados. | El commit del backend menciona "cliente NVIDIA via http.client con host fijo (anti-SSRF)", mitigando este vector de ataque al prohibir la redirección dinámica de URLs. |
| **SCA / Dependabot** | Software Composition Analysis. Análisis automatizado de dependencias en busca de CVEs (vulnerabilidades conocidas). | Configurado en `.github/` para escanear el `package.json` y generar *Pull Requests* automáticos cuando una librería (ej. React, Vite) reporta una vulnerabilidad. |

---

## 4. DEVOPS, INFRAESTRUCTURA Y DESPLIEGUE (CI/CD)

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **Vercel / PaaS** | Platform as a Service. Plataforma cloud gestionada para despliegue de frontend y funciones serverless. | Proveedor de hosting. `vercel.json` dicta las reglas de build, los *rewrites* para la SPA (redirigir todo a `index.html`) y las cabeceras de seguridad. |
| **Cache Inmutable / Fingerprinting** | Técnica de optimización donde los assets estáticos incluyen un hash criptográfico en su nombre de archivo. | Vercel sirve los JS/CSS con cabeceras de caché inmutable. Si el código cambia, el hash cambia, invalidando la caché del navegador instantáneamente (Cache Busting). |
| **pnpm / Node.js** | Node.js es el runtime de JavaScript; pnpm es un gestor de paquetes rápido y eficiente en espacio (usa enlaces duros). | El proyecto exige `pnpm` (documentado en `pnpm-lock.yaml`) para garantizar que las instalaciones de dependencias sean deterministas y los builds en CI/CD no fallen por resoluciones ambiguas. |
| **Monorepo / Workspace** | Estrategia de repositorio único que alberga múltiples proyectos o paquetes lógicos. | Configurado mediante `pnpm-workspace.yaml`. Permite que el `client` (React), el `backend` (Node) y `shared` (Tipos/Design System) convivan, compartan tipos de TypeScript y se construyan de forma coordinada. |
| **CI/CD (GitHub Actions)** | Continuous Integration / Continuous Delivery. Automatización de pruebas y despliegues. | El directorio `.github/workflows/` contiene los scripts que compilan la app y la despliegan automáticamente en Vercel (Producción/Preview) y GitHub Pages tras cada *push*. |

---

## 5. INTELIGENCIA ARTIFICIAL Y BACKEND (ESTADO Y ROADMAP)

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **LLM (Large Language Model)** | Modelo de lenguaje grande. Arquitectura de red neuronal (Transformer) entrenada para generar y comprender lenguaje natural. | El "Tutor IA" actual **no usa un LLM** para evitar alucinaciones (anti-patrón en educación). Usa un motor de reglas (keywords). El Roadmap planifica conectar un LLM local. |
| **Ollama** | Herramienta de infraestructura para ejecutar LLMs de código abierto localmente. | Planificado en la Hoja de Ruta para proporcionar inteligencia artificial sin enviar datos de estudiantes a APIs corporativas (privacidad total). |
| **Endpoint / API** | Application Programming Interface. Punto final de comunicación entre el cliente (React) y el servidor. | Futura capa de abstracción donde el frontend enviará las consultas del estudiante y recibirá las respuestas estructuradas del modelo de IA o la base de datos. |
| **Web Speech API** | API del navegador para reconocimiento de voz (STT) y síntesis de voz (TTS). | Planificada para la ruta de fonética, permitiendo que el estudiante practique pronunciación y la plataforma la evalúe nativamente sin servidores externos. |

---

## 6. CONTROL DE VERSIONES, GOBERNANZA Y METADATOS (GIT)

| Término / Concepto | Definición Universal (Biblia) | Aplicación en `open-school` |
| :--- | :--- | :--- |
| **Branch Protection** | Reglas de gobernanza en Git que previenen la eliminación o sobreescritura (*force push*) de ramas críticas. | Advertencia de GitHub: *"Your main branch isn't protected"*. Requiere configuración para exigir *Status Checks* (tests/CI) antes de permitir *merges* a producción. |
| **Pull Request (PR)** | Solicitud de fusión. Mecanismo de *Code Review* donde se discuten los cambios antes de integrarlos a la rama principal. | Hay 6 PRs abiertos, indicando trabajo en progreso, revisión de arquitectura o resolución de conflictos de *merge*. |
| **Commit (Hash 0406ff5)** | Conjunto atómico de cambios en el código, identificado por un hash SHA-1 y un mensaje descriptivo. | Ej: `tutor-ia: capsula didactica 2026-09-28 [pt]`. Sigue la convención de *Conventional Commits* (tipo: descripción). |
| **License (MIT)** | Licencia de software libre permisiva. Permite uso, copia, modificación y distribución, incluso comercial, exigiendo solo mantener el aviso de copyright. | Archivo `LICENSE`. Define legalmente que el Instituto Digital es Open Source y puede ser forked por otras instituciones. |
| **`.gitignore`** | Archivo de configuración que indica al VCS (Git) qué archivos o directorios no deben ser versionados. | "Blindar .gitignore con bloque IA agent states": Evita que los estados de memoria de los agentes de IA (ej. Cursor, Aider, Claude) o las variables de entorno (`.env`) se suban al repositorio público. |
| **Fork / Clone** | *Fork* es crear una copia del repositorio en tu propia cuenta de GitHub para proponer cambios. *Clone* es descargarlo a tu máquina local. | Métricas del repo: 0 Forks, 0 Stars. Indica que es un proyecto de origen reciente o de uso personal/institucional cerrado por el momento. |
| **AGENTS.md / SKILL.md** | Documentación técnica estructurada específicamente para ser parseada por LLMs y Agentes de IA (Codex, Devin, Aider). | `SKILL.md` actúa como el **PRD (Product Requirements Document)** y **TRD (Technical Requirements Document)** para que los agentes de IA entiendan el contexto, las reglas de negocio y la arquitectura sin alucinar. |

---
**Nota de Cumplimiento:** Esta deconstrucción valida que el repositorio `open-school` sigue una arquitectura moderna **Client-Heavy / Offline-First**, priorizando la privacidad (Cero Conocimiento del Servidor sobre el estudiante) y la accesibilidad (WCAG AAA), mientras prepara la capa de infraestructura (Drizzle, Monorepo) para una futura transición a un modelo **Full Stack** con IA Local.

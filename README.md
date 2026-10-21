[![Open in VS Code](https://img.shields.io/badge/Open_in-VS_Code-007ACC?logo=visualstudiocode&logoColor=white)](https://github.dev/belentani7/open-school)

# Open School

Instituto digital abierto y gratuito. Formación para quien empieza de cero
en un país nuevo: **sin matrícula, sin datos personales, sin publicidad.**

> **Estado:** frontend completo y con build verde · backend Python WSGI opcional, con rutas de Vercel para salud, catálogo y tutor. El catálogo del servidor sigue en memoria y el tutor requiere un Ollama configurado por la instalación; si no está disponible, la interfaz conserva su modo local.
> Este README describe lo que hay en el repositorio hoy. Lo que está
> planificado va aparte, en [Hoja de ruta](#hoja-de-ruta).
> La especificación completa del producto está en [`SKILL.md`](SKILL.md).

---

## Entrega real frente a programa previsto

El catálogo define **6 rutas** y presenta su programa previsto (módulos y horas), pero **hay 12 unidades evaluables publicadas en esta aplicación (dos por ruta)**. Las fichas muestran "módulos previstos" y "duración prevista"; el panel distingue unidades disponibles de planes. La certificación está contemplada en algunos itinerarios, **pero este campus no emite ni verifica certificados**. No se declara completo un curso por tener su ficha o una unidad inicial.

## Qué funciona hoy

Una SPA de React que sirve el catálogo de rutas, el detalle de cada una,
un panel de progreso y un tutor de orientación. Todo el estado vive en el
navegador; no hay servidor propio ni base de datos conectada.

| Área | Estado |
|---|---|
| Catálogo, buscador y filtros | funcionando |
| Ficha de ruta con progreso | funcionando, progreso local |
| Panel anónimo (UUID + borrado real) | funcionando |
| Tutor orientador | funcionando en modo local; Ollama opcional con consentimiento explícito |
| Instalable / funciona sin conexión | funcionando (service worker) |
| Contenido de las lecciones | doce unidades propias (dos por ruta), con ejercicios y evaluación; los módulos completos restantes siguen pendientes |
| API Python WSGI | salud, catálogo en memoria y tutor; expuesta en Vercel mediante `api/` |
| Base de datos, autenticación y sincronización | no implementadas; el progreso sigue local |
| Certificados verificables por QR | no implementado |

### Anónimo de verdad

No hay pantalla de registro porque no hay cuentas. Al entrar se genera un
UUID aleatorio en el propio dispositivo, con caducidad de 365 días, y el
progreso se guarda junto a él en `localStorage`. No se solicita correo ni
teléfono y no se usan cookies de terceros. Por defecto, las preguntas del
tutor tampoco salen del dispositivo; activar Ollama envía el texto al
backend de esta instalación. El hosting puede procesar metadatos de red
según su propia política. El botón **Borrar todo** elimina el identificador
y el progreso locales.

Implementación: [`client/src/lib/progress.ts`](client/src/lib/progress.ts).

### El tutor no finge

Por defecto, el tutor enruta la pregunta por palabras clave en el navegador
y responde con datos reales del catálogo. No envía la conversación a ningún
servidor en ese modo. Si la persona activa la casilla de Ollama, solo se
envían las preguntas escritas bajo ese consentimiento y el historial
producido en ese modo; las preguntas anteriores del modo privado se excluyen.
El backend de esta instalación procesa el texto; no se envía audio y la
interfaz vuelve al enrutador local si el servicio no está configurado o falla.
No incluyas datos sensibles en el modo de modelo.

El endpoint usa un modelo Ollama elegido por la instalación (por defecto
`llama3.2:3b`) y no requiere una API key de un proveedor externo. Las
conversaciones no se guardan intencionalmente por esta aplicación; el
operador del servidor y su configuración de registros siguen siendo parte
de la política de privacidad.

---

## Sistema de diseño

Identidad **BELENTANI / NOIACORE**: contención de Apple, noir de HBO Max,
liquid glass, plasma y cine. Sustrato negro al 97 %, presupuesto de luz
global del 3 %, y una jerarquía que no se negocia:

> **negro › material › luz › información** — la luz nunca por encima de la información.

| Capa | Fichero | Contenido |
|---|---|---|
| 1 · Tokens | [`styles/tokens.css`](client/src/styles/tokens.css) | color, luz, tipografía, forma, física del movimiento |
| 2 · Material | [`styles/material.css`](client/src/styles/material.css) | liquid glass de 4 capas, escala tipográfica, controles |
| 3 · Chrome | [`styles/chrome.css`](client/src/styles/chrome.css) | navegación, pie, escaparate, medidores |

**Material de 4 capas** (no es un `background: rgba()`): efecto
(`backdrop-filter` + refracción SVG) → tinte sólido → *shine* de 4
`inset-shadow` que dibuja el bisel → contenido.

**Refracción real** en [`components/Refraction.tsx`](client/src/components/Refraction.tsx):
`feTurbulence` genera el mapa de espesor y tres `feDisplacementMap` con
escalas distintas separan los canales RGB — la franja cromática del vidrio.
Solo Chromium aplica filtros SVG en `backdrop-filter`; el resto degrada al
blur, que ya es correcto por sí solo.

**Rendimiento:** el plasma pre-renderiza los degradados a sprites una vez y
cada frame solo hace `drawImage` — crear gradientes dentro del bucle es lo
que hunde el framerate en móviles. El bucle se detiene fuera de pantalla,
con la pestaña oculta o si el usuario pidió menos movimiento.

**Accesibilidad:** contraste AAA en texto (blanco 21:1, gris 8.9:1,
heliotropo 7.3:1 sobre negro), objetivos táctiles de 44 px, foco siempre
visible, salto al contenido, filtros como `button aria-pressed`, recuento
de resultados en *live region*, y el estado nunca se comunica solo por
color. Respeta `prefers-reduced-motion` y `prefers-contrast`.

---

## Estructura real

```
open-school/
├── api/                  rutas de Vercel para el backend Python
├── backend/
│   ├── app/              dominio, casos de uso, adaptadores e interfaz WSGI
│   └── tests/            pruebas del backend
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
├── open-data/             temas, fuentes y licencias
├── SKILL.md               especificación completa del producto
└── AGENTS.md              instrucciones para agentes
```

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 · Vite 7 · TypeScript 5.6 (strict) |
| Estilos | Tailwind 4 + CSS propio en 3 capas |
| Router | Wouter 3 |
| Persistencia | `localStorage` (anónima) |
| Offline | Service worker propio, sin dependencias |

`package.json` mantiene el runtime pequeño: React, React DOM y Wouter.
Vite, TypeScript, Vitest y Tailwind 4 están en las dependencias de desarrollo.
No hay una base de datos conectada ni dependencias declaradas para Drizzle,
Radix, Zod o Recharts.

## Puesta en marcha

Requiere Node 20+ y pnpm. **No mezclar con npm**: el proyecto tiene
`pnpm-lock.yaml` y Vercel instala con pnpm.

```bash
pnpm install
pnpm dev        # desarrollo — http://localhost:5173
pnpm check      # tsc --noEmit
pnpm build      # produccion → dist/client
pnpm start      # sirve el build en http://localhost:8000
```

No hace falta `.env` para arrancar: no hay servicios externos conectados.

## Despliegue

Vercel, configurado en [`vercel.json`](vercel.json): build reproducible
con pnpm, salida en `dist/client`, *rewrite* de SPA y cabeceras de seguridad
(CSP, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, caché
inmutable para los assets con hash). Las funciones Python publican
`/api/tutor`, `/api/v1/catalog` y `/api/health` desde `api/`.

El tutor de servidor usa Ollama. Las funciones se ejecutan en París
(`cdg1`). En un despliegue que quiera habilitarlo, configura `OLLAMA_HOST`,
`OLLAMA_PORT` y `OLLAMA_MODEL` como variables del entorno del backend (nunca
en el cliente ni en un archivo versionado). El
valor predeterminado (`127.0.0.1:11434`) es para un backend y Ollama en la
misma máquina; una función cloud necesita una instancia Ollama alcanzable.
Sin ella, el tutor local del navegador sigue funcionando.

## Hoja de ruta

Por orden de dependencia:

1. Completar las lecciones de todas las rutas. Cada ruta dispone de dos unidades completas con teoría, práctica y evaluación; únicamente estas unidades pueden sumar progreso aquí.
2. Decidir si el catálogo necesita persistencia. El endpoint está disponible, pero el repositorio sigue en memoria; el progreso anónimo permanece en el dispositivo.
3. Certificados verificables por QR.
4. Voz: Web Speech API para la ruta de fonética.
5. Multilenguaje PT · ES · CA · EN (hoy la interfaz es solo español).

## Licencia

MIT — © 2026 Pedro Belentani. Úsalo libremente, también en proyectos
institucionales.

## Datos abiertos

El directorio [open-data/](open-data/) ya trae un portal de datos abiertos
(temas, fuentes y licencias en open-data/topics.json). Se regenera con
`python enrich_portals.py <portal>` en el proyecto `edu-open-data`.

Ver [open-data/README.md](open-data/README.md).

## Proyectos open similares

- [Open edX](https://github.com/openedx/openedx-platform)
- [Moodle](https://github.com/moodle/moodle)
- [Kolibri](https://github.com/learningequality/kolibri)
- [Oppia](https://github.com/oppia/oppia)
- [Sugar Labs](https://github.com/sugarlabs)

---

## Parte del indice educativo

Esta plataforma forma parte del conjunto educativo de **Belentani / NOIACORE**:
formacion gratuita y abierta. El indice completo, con material y estado de cada una,
vive en el nodo central:

**<https://github.com/belentani7/open-school/blob/main/INDICE-EDUCATIVO.md>**

| Plataforma | Que ensena | Enlace |
|---|---|---|
| Open School | Instituto digital universal | https://open-school-gamma.vercel.app |
| ManosAbiertas | IA y ofimatica para recien llegados | https://belentani7.github.io/ManosAbiertas/ |
| WILLIAMSCHOOL | Escuela comunitaria (curriculo Nepal) | https://williamschool.vercel.app |
| UX Academy | Diseno UX/Producto, trilingue | https://ux-academy-professional.vercel.app |
| Aprende Brasil | Educacion para Brasil | https://aprende-brasil.vercel.app/ |
| Lingua Aberta | Idiomas, progresion CEFR | https://belentani7.github.io/lingua-aberta-empresa/ |
| Cruzando el Charco | Acogida y arraigo | https://belentani7.github.io/Cruzando-el-charco/ |
| secure-t | Ciberseguridad e IA | https://belentani7.github.io/secure-t/ |

**PT > ES > EN > CA.** Gratuito, accesible (WCAG) y conectado.

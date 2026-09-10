# Open School

Instituto digital abierto y gratuito. Formación para quien empieza de cero
en un país nuevo: **sin matrícula, sin datos personales, sin publicidad.**

> **Estado:** frontend completo y con build verde · backend sin implementar.
> Este README describe lo que hay en el repositorio hoy. Lo que está
> planificado va aparte, en [Hoja de ruta](#hoja-de-ruta), para que nadie
> clone esperando un servidor que todavía no existe.
> La especificación completa del producto está en [`SKILL.md`](SKILL.md).

---

## Qué funciona hoy

Una SPA de React que sirve el catálogo de rutas, el detalle de cada una,
un panel de progreso y un tutor de orientación. Todo el estado vive en el
navegador; no hay servidor propio ni base de datos conectada.

| Área | Estado |
|---|---|
| Catálogo, buscador y filtros | funcionando |
| Ficha de ruta con progreso | funcionando, progreso local |
| Panel anónimo (UUID + borrado real) | funcionando |
| Tutor orientador | funcionando, **sin modelo de lenguaje** |
| Instalable / funciona sin conexión | funcionando (service worker) |
| Contenido de las lecciones | no implementado |
| API, base de datos, autenticación | no implementado |
| Certificados verificables por QR | no implementado |

### Anónimo de verdad

No hay pantalla de registro porque no hay cuentas. Al entrar se genera un
UUID aleatorio en el propio dispositivo, con caducidad de 365 días, y el
progreso se guarda junto a él en `localStorage`. Sin correo, sin teléfono,
sin IP, sin cookies de terceros. El botón **Borrar todo** del panel elimina
identificador y progreso; no queda copia en ninguna parte porque nunca
salió del dispositivo.

Implementación: [`client/src/lib/progress.ts`](client/src/lib/progress.ts).

### El tutor no finge

No hay ningún LLM detrás. El tutor enruta la pregunta por palabras clave y
responde con datos reales del catálogo; cuando no sabe, lo dice en vez de
improvisar. Simular inteligencia en una plataforma educativa es
precisamente el fallo que no se perdona. Cuando haya endpoint, se sustituye
la función `answer()` y el aviso desaparece solo.

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
```

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 · Vite 7 · TypeScript 5.6 (strict) |
| Estilos | Tailwind 4 + CSS propio en 3 capas |
| Router | Wouter 3 |
| Persistencia | `localStorage` (anónima) |
| Offline | Service worker propio, sin dependencias |

`package.json` incluye además el stack previsto en `SKILL.md` (Radix,
Drizzle, Zod, Recharts…) que **todavía no usa ningún componente**. Están
declaradas a propósito, como contrato con la especificación.

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

Vercel, configurado en [`vercel.json`](vercel.json): build con pnpm, salida
en `dist/client`, *rewrite* de SPA y cabeceras de seguridad (CSP,
`X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, caché inmutable
para los assets con hash).

## Hoja de ruta

Por orden de dependencia:

1. Contenido real de las lecciones (hoy el catálogo es metadatos).
2. API y base de datos — el esquema Drizzle ya está definido.
3. Conectar el tutor a un modelo local (Ollama), sin claves externas.
4. Certificados verificables por QR.
5. Voz: Web Speech API para la ruta de fonética.
6. Multilenguaje PT · ES · CA · EN (hoy la interfaz es solo español).

## Licencia

MIT — © 2026 Pedro Belentani. Úsalo libremente, también en proyectos
institucionales.

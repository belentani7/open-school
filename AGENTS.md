# AGENTS.md — Instructions for AI Coding Agents

This file provides guidance to AI coding agents working on Open School or
related educational platforms. Agents should read this file before making any
changes.

Everything below was verified against the code on 2026-10-01. If you find a
mismatch, fix this file rather than trusting it blindly.

## What this project is

A curriculum platform: a catalogue of educational routes with searchable
course content, a glossary (the "Biblia"), local progress tracking, and a
Python backend that serves the course catalog and an AI tutor endpoint.

- **Frontend**: `client/` — a Vite SPA (no server rendering, no SSR).
- **Backend**: `backend/` — a Python WSGI app with a clean architecture.

## Stack (verified)

| Area | Reality |
|---|---|
| UI | React 19 + TypeScript (`strict: true`), JSX via `react-jsx` |
| Build | Vite 7 (`root: ./client`, output `dist/client`) |
| Routing | `wouter` (`Route`, `Switch`, `Link`, `useLocation`) — client-side only |
| Styling | Own CSS design system in `client/src/styles/*.css` + inline `style={{}}` |
| State | React state/hooks; persistence in `localStorage` (`client/src/lib/progress.ts`) |
| Backend | Python WSGI (`backend/app/`), in-memory repository, `wsgiref` server on port 8001 |
| Tests | Vitest (frontend, colocated `*.test.ts`) + pytest (backend) |

### Dependencies: pruned on 2026-10-01

`package.json` now declares **only** what is imported: `react`, `react-dom`,
`wouter` (+ dev tooling: vite, typescript, vitest, tailwind, prettier).
~30 packages that nothing imported (`express`, `pg`, `postgres`,
`@supabase/supabase-js`, `zustand`, `framer-motion`, `react-hook-form`,
`zod`, `recharts`, `sonner`, `lucide-react`, `@react-pdf/renderer`,
`@radix-ui/*`, `class-variance-authority`, `tailwind-merge`,
`next-themes`, `qrcode`, `axios`, `clsx`, `nanoid`, …) were removed.
`npm audit` reports **0 vulnerabilities** as a result.

If you need a new library, declare it deliberately and import it in the
same change — do not re-add "for later".

Likewise there is **no** Express/tRPC server, **no** Drizzle/PostgreSQL
schema, **no** `server/` or `shared/` directory (the aliases `@/server` and
`@/shared` in `tsconfig.json` and `vite.config.ts` point at folders that do
not exist), and **no** shadcn/ui components.

Tailwind 4 is installed and imported (`@import "tailwindcss"`), so its
preflight/reset is active, but **no utility classes are used anywhere in the
markup**. Components are styled with the project's own semantic classes. New
code should follow that, not introduce utility-class soup.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # production build → dist/client
npm run check          # tsc --noEmit
npm test               # vitest run
npm run build:biblia   # regenerate client/src/lib/biblia.ts
npm audit              # dependency advisories (must stay at 0)
npm run format         # prettier
```

Backend (uses `backend/.venv`, gitignored):

```bash
backend\.venv\Scripts\python.exe -m app.main        # http://127.0.0.1:8001
backend\.venv\Scripts\python.exe -m pytest backend\tests -q
backend\.venv\Scripts\ruff.exe check backend
```

## Layout

```
client/src/
  pages/         Biblia, Catalog, CourseDetail, Dashboard, Home, Chat,
                 Escuelas, NotFound
  components/    Nav, Footer, RouteCase, Glass, ZeroText, Refraction, PlasmaField
  fonts/         self-hosted woff2 (Sora, Inter, JetBrains Mono) + fonts.css
  lib/           catalog (routes), biblia (GENERATED), highlight, progress, motion
  styles/        tokens.css → material.css → chrome.css (cascade order matters)
backend/app/
  domain/        catalog entities
  application/   catalog + tutor services
  adapters/      in-memory repository, NVIDIA client
  interfaces/    wsgi.py — HTTP layer
campus/          curriculum content
open-data/       static JSON registries
docs/            BIBLIA.md, BIBLIA_TERMINOS_DESARROLLO.md
```

## Naming and structure

- Pages/components: `PascalCase.tsx`, colocated by concern (page + its
  components + its data module in `client/src/`).
- Plain modules/tests: `camelCase.ts`, colocated next to what they belong to
  (`biblia.ts` + `biblia.test.ts`).
- Types: PascalCase (`Termino`, `Categoria`). Module constants: `UPPER_SNAKE`
  (`CURSO`, `AMBIGUOS`, `RECUENTO`).
- Import order: React/external → internal (`@/...`) → relative.

### Server Components do not apply here

This is a Vite SPA. Do **not** write `async function Page()` server components
or `'use client'` directives — there is no React Server runtime. Components
are plain client components; use hooks and `fetch` for data.

## Generated files

`client/src/lib/biblia.ts` is generated. Never edit it by hand:

- Correct definitions in `docs/BIBLIA_TERMINOS_DESARROLLO.md` (single source).
- Run `npm run build:biblia`.
- Details in `docs/BIBLIA.md`.

The generator validates course links **before writing**, so a typo in a course
id aborts with an error instead of shipping a broken link.

## Styling

- Three layers, imported in `index.css`, cascade order fixed: `tailwindcss`
  → `tokens.css` (identity: color, type, space, physics) → `material.css`
  (glass, typography scale, controls) → `chrome.css` (layout primitives).
- Reuse the existing primitives: `bay`, `shell`, `stack`, `row`, `grid`,
  `t-display` / `t-title` / `t-body` / `t-label`, `btn`, `chip`, `field`,
  `meter`, `dot`, `sr-only`.
- Use CSS variables (`--color-*`, `--bay`) rather than hard-coded hex.
- Inline `style={{}}` for one-off exceptions (a `maxWidth`, a gap); anything
  reusable belongs in `styles/`.

## Backend

Layered, no framework: `interfaces/wsgi.py` builds the WSGI app from
`application` services over `adapters` (in-memory store — data does not
survive a restart). Endpoints: `GET /api/v1/catalog`, `POST /api/tutor`
(NVIDIA proxy, streaming).

## Known gaps (not fixed yet)

1. **Tutor endpoint wiring.** `Chat.tsx` POSTs `/api/tutor`. In dev, Vite
   proxies `/api` to `localhost:3000` but the Python backend defaults to
   `8001` (workaround: `PORT=3000 python -m app.main`); in production,
   `vercel.json` serves the SPA statically and rewrites everything to
   `index.html`, so there is no `/api` function. The endpoint exists in the
   backend but is not reachable out of the box from either environment.
2. **Dead aliases.** `@/server` and `@/shared` in `tsconfig.json` /
   `vite.config.ts` resolve to missing directories.
3. **Course detail progress** is still partially simulated; real persistence
   lives in `lib/progress.ts`.
4. **Missing registry data.** `Escuelas.tsx` fetches
   `/open-data/unified-campus-registry.json`, which is not in the repo
   (only `topics.json` and `data/*.json` are). The page renders an error
   state instead of crashing, so `/escuelas` is effectively empty until that
   file is generated or the fetch is repointed at what exists.
5. **Rate limiting is per process.** `RateLimiter` (`interfaces/wsgi.py`)
   keeps its counters in memory: two instances behind a load balancer each
   allow their own 30 req/min. That still stops sustained abuse from one
   client; an exact global limit would need a shared store (Redis).
6. **No SAST / secret scanning in CI.** CI gates on `tsc`, `npm audit
   --audit-level=high`, build and tests, but there is no CodeQL or
   secret-scanning workflow yet.

## Security (audited 2026-10-01)

Frontend attack surface:

- No `dangerouslySetInnerHTML` / `innerHTML` / `eval` anywhere in
  `client/src` — enforced by `xss-surface.test.ts`, so it cannot regress.
- CSP in `vercel.json`: `default-src 'self'`, `script-src 'self'` (no
  inline, no eval), `object-src 'none'`, `frame-ancestors 'none'`,
  `connect-src 'self'`. If you add an external origin it must be declared
  there explicitly — and `security-headers.test.ts` will notice if you relax
  it.
- **Zero third-party requests.** Fonts are self-hosted in
  `client/src/fonts/` (SIL OFL); `index.html` references no external origin.
  `security-headers.test.ts` fails if either regresses.
- No cookies, no analytics, no tracking pixels. Progress is local-only
  (`localStorage`, already guarded for Safari private mode).
- The service worker caches only `res.ok` responses, so a 404/500 can never
  be cached as the app shell (`sw.test.ts`).

Backend (Python WSGI):

- `POST /api/tutor` role allowlist is `{user, assistant}`: the client cannot
  send a `system` message (that would be prompt injection against the
  tutor). Also ≤20 messages and ≤2000 chars each.
- Body capped at 512 KiB → `413` **before** the buffer is read.
- Per-IP rate limit (30/min) → `429` + `Retry-After`, checked before any
  work so a request that will be rejected never spends NVIDIA credit.
- Outbound host is a fixed constant (no SSRF from user input); the NVIDIA
  API key is read from the environment and never reaches the client.
- JSON responses carry `X-Content-Type-Options: nosniff`.
- No database, no filesystem paths taken from input, no cookies → no SQLi,
  path traversal or CSRF surface to speak of.

Dependencies: `npm audit` reports **0 vulnerabilities** (express and its
`qs` advisory are gone; vitest ≥4.1.11). CI fails on high/critical.

## Tests

| Suite | Scope |
|---|---|
| `client/src/lib/catalog.test.ts` | Route integrity |
| `client/src/lib/biblia.test.ts` | Glossary integrity: 673 terms, 23 categories, no empty fields, course links real, ambiguous acronyms, search ranking, neighbours |
| `client/src/lib/highlight.test.ts` | Highlighting invariant: `unir(tramos(x)) === x` (never drops or invents text) |
| `client/src/lib/sw.test.ts` | Service worker never caches a non-ok navigation as the shell |
| `client/src/lib/security-headers.test.ts` | CSP + security headers in `vercel.json`, zero third-party origins |
| `client/src/lib/xss-surface.test.ts` | No `innerHTML` / `eval` / `dangerouslySetInnerHTML` in `client/src` |
| `backend/tests/` | WSGI status codes, `nosniff`, body cap, tutor validation and prompt-injection role, per-IP rate limiting |

Run `npm test`, `npm run check` and `npm audit` before declaring work done.

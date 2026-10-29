# AGENTS.md — Instructions for AI Coding Agents

This file provides guidance to AI coding agents working on Open School or
related educational platforms. Agents should read this file before making any
changes.

This file was refreshed against the code on 2026-10-16. If you find a
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
| Backend | Python WSGI (`backend/app/`), in-memory catalog, optional Ollama client, Vercel routes in `api/` |
| Tests | Vitest (frontend, colocated `*.test.ts`) + pytest (backend) |

### Dependencies: pruned on 2026-10-01

`package.json` now declares **only** what is imported: `react`, `react-dom`,
`wouter` (+ dev tooling: vite, typescript, vitest, tailwind, prettier).
~30 packages that nothing imported (`express`, `pg`, `postgres`,
`@supabase/supabase-js`, `zustand`, `framer-motion`, `react-hook-form`,
`zod`, `recharts`, `sonner`, `lucide-react`, `@react-pdf/renderer`,
`@radix-ui/*`, `class-variance-authority`, `tailwind-merge`,
`next-themes`, `qrcode`, `axios`, `clsx`, `nanoid`, …) were removed.
The active dependency lockfile is `pnpm-lock.yaml`; keep it as the only package-manager lockfile.

If you need a new library, declare it deliberately and import it in the
same change — do not re-add "for later".

Likewise there is **no** Express/tRPC server, **no** Drizzle/PostgreSQL
schema, **no** `server/` or `shared/` directory (the dead `@/server` and
`@/shared` aliases were removed from `tsconfig.json` and `vite.config.ts`
on 2026-10-01), and **no** shadcn/ui components.

Tailwind 4 is installed and imported (`@import "tailwindcss"`), so its
preflight/reset is active, but **no utility classes are used anywhere in the
markup**. Components are styled with the project's own semantic classes. New
code should follow that, not introduce utility-class soup.

## Commands

```bash
corepack pnpm dev            # Vite dev server
corepack pnpm build          # production build → dist/client
corepack pnpm check          # tsc --noEmit
corepack pnpm test           # vitest run
corepack pnpm build:biblia   # regenerate client/src/lib/biblia.ts
corepack pnpm audit          # dependency advisories
corepack pnpm format         # prettier
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
  adapters/      in-memory repository, local Ollama client
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
- Run `corepack pnpm build:biblia`.
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

Layered WSGI app: `interfaces/wsgi.py` builds the service graph over
adapters. The catalog is in memory and does not survive a restart. The
optional tutor uses the Ollama host configured by the operator; questions
are sent only after explicit opt-in in `Chat.tsx`. Vercel entrypoints live
in `api/` and expose tutor, health and catalog routes.

## Known gaps (not fixed yet)

1. **Ollama availability.** `api/tutor.py` exposes the shared WSGI endpoint
   on Vercel, but the function can answer with a model only when the
   operator-configured Ollama host is reachable. Without it the endpoint
   returns a controlled error and the browser falls back to its local router.
2. **Course detail progress** is still partially simulated; real persistence
   lives in `lib/progress.ts`.
3. **Federated registry abandoned (2026-10-01).** `Escuelas.tsx` used to fetch
   `/open-data/unified-campus-registry.json`, an inventory of resources in the
   sibling repos. That file never existed, and generating it would have meant
   publishing the file tree of personal repositories inside a **public** repo.
   The page now renders the open data that really is published and verified:
   `open-data/topics.json` plus `open-data/data/<tema>.json`, flattened by
   `lib/openData.ts` (each source has its own keys — `url`, `autor`, `doi`,
   `indicador`, `valor` — and `ciencia-y-actualidad` arrives with no `datos`
   because arXiv returned 429, which the page states instead of hiding).
   If the federated view is ever wanted again, it needs a generator that emits
   only public metadata, and a decision on where that inventory is hosted.
4. **Rate limiting is per process.** `RateLimiter` (`interfaces/wsgi.py`)
   keeps counters in memory and caps the key table. Separate instances still
   apply separate limits; an exact global quota needs a shared store.
5. **No secret scanning in CI.** CI runs dependency audit, typecheck, tests
   and build; `.github/workflows/security.yml` runs CodeQL for JavaScript and
   TypeScript, but there is no credential-scanning workflow yet.

## Security (audited 2026-10-01)

Frontend attack surface:

- No `dangerouslySetInnerHTML` / `innerHTML` / `eval` anywhere in
  `client/src` — enforced by `xss-surface.test.ts`, so it cannot regress.
- CSP in `vercel.json`: `default-src 'self'`, `script-src 'self'` (no
  inline, no eval), `object-src 'none'`, `frame-ancestors 'none'`,
  `connect-src 'self'`. If you add an external origin it must be declared
  there explicitly — and `security-headers.test.ts` will notice if you relax
  it.
- **No third-party requests from the frontend bundle.** Fonts are self-hosted
  in `client/src/fonts/` (SIL OFL); `index.html` references no external
  origin. The optional tutor call is same-origin and off by default.
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
  model call; the in-memory key table is capped and expired entries are pruned.
- The Ollama host and model come only from server configuration; request
  content cannot change the outbound destination. No provider API key is used.
- JSON responses carry `X-Content-Type-Options: nosniff`.
- No database, no filesystem paths taken from input, no cookies → no SQLi,
  path traversal or CSRF surface to speak of.

Dependencies: the active lockfile is `pnpm-lock.yaml`; run `corepack pnpm audit` after dependency changes. Vercel and CI use pnpm consistently.

## Tests

| Suite | Scope |
|---|---|
| `client/src/lib/catalog.test.ts` | Route integrity |
| `client/src/lib/biblia.test.ts` | Glossary integrity: 673 terms, 23 categories, no empty fields, course links real, ambiguous acronyms, search ranking, neighbours |
| `client/src/lib/highlight.test.ts` | Highlighting invariant: `unir(tramos(x)) === x` (never drops or invents text) |
| `client/src/lib/sw.test.ts` | Service worker never caches a non-ok navigation as the shell |
| `client/src/lib/security-headers.test.ts` | CSP + security headers in `vercel.json`, zero third-party origins |
| `client/src/lib/openData.test.ts` | Published open data is intact: every manifest theme has its file, ids unique, no item without title or source, links are https, failed sources reported, and the 5 heterogeneous source shapes flatten correctly (loads the real JSON) |
| `client/src/lib/xss-surface.test.ts` | No `innerHTML` / `eval` / `dangerouslySetInnerHTML` in `client/src` |
| `backend/tests/` | WSGI routes, `nosniff`, body cap, tutor validation, Ollama adapter, Vercel routing and bounded per-IP rate limiting |

Run `corepack pnpm test`, `corepack pnpm check`, `corepack pnpm build` and `corepack pnpm audit` before declaring work done.

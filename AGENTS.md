# AGENTS.md — Instructions for AI Coding Agents

This file provides guidance to AI coding agents working on Open School or related educational platforms.
Agents should read this file before making any changes.

## Tech Stack
- Frontend: React 19, TypeScript (strict), Vite 7
- Backend: Express.js + tRPC (type-safe API)
- Database: PostgreSQL via Drizzle ORM
- Styling: Tailwind CSS 4 + shadcn/ui + Radix primitives
- Animation: Framer Motion
- Forms: React Hook Form + Zod
- State: Zustand (global) + TanStack Query (server state)

## Key Conventions

### File Organization
- Monorepo with client/server/shared structure
- Colocate related files together (page + its component + its data fetcher)
- Private folders use `_` prefix (e.g., `_core`, `_utils`)
- Import order: React → External → Internal → Local

### Component Patterns
- Server Components by default (`async function Page()`)
- `'use client'` ONLY at leaf level where interactivity needed
- Pass data down as props through server-to-client boundary
- Use `async/await` directly in Server Components

### Naming
- Files: kebab-case for routes (`course-detail.tsx`), PascalCase for components (`CourseCard.tsx`)
- Functions: camelCase verb-driven (`getUserProgress()`)
- Types/Interfaces: PascalCase (`UserProgress`, `LessonType`)
- Constants: UPPER_SNAKE_CASE (`MAX_ATTEMPTS`, `DEFAULT_LANGUAGE`)

### Database
- Drizzle schema defined in `drizzle/schema.ts`
- Migrations generated via `pnpm db:generate`
- Seeds via `tsx scripts/seed.ts`
- NEVER drop/rename columns in production — always add-only first
- All student data is age-restricted; never expose sensitive personal info publicly

### Security (Youth Platform)
- NO cookies/persistent tracking without parental consent
- No public leaderboards or social features that could expose minor identities
- ALL user input validated with Zod schemas before processing
- Rate limit auth endpoints
- HTTPS enforced in production
- CSP headers via Helmet.js

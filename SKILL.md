---
name: open-school
description: "Plataforma educativa digital universal — cursos modulares con ruta→modulo→lección, certificaciones QR verificables, 11 roles RBAC, accesibilidad WCAG 2.1+, offline-first PWA, IA educativa con Ollama local, multilenguaje pt-BR/es/ca/en."
version: 2.0.0
author: Belentani
license: MIT
platforms: [linux, macos, windows]
metadata:
  related_skills: [cursor-ai-cli-unified, nextjs-ssr-architecture, design-taste, brainstorming, qwen-input-cache-max-context, lean-build]
---

# OPEN SCHOOL v2 — Platforma Educativa Digital Universal

## QUÉ ES

Sistema completo para crear institutos educativos digitales gratuitos basados en:

- **X.txt** (Desktop) — Especificación de 11,000+ líneas para "Instituto Universal Gratuito para Jóvenes"
- **Open Tongue** (`C:\Users\USER\Videos\DRIVE\Documents\lingua-aberta\`) — Instituto de idiomas con tutor conversacional + Web Speech API + Ollama local
- **UX Academy Professional Program** — Plataforma trilingüe con evaluación formativa y capstone
- **LinguaForge** — Herramientas de traducción/adaptación multilingüe
- **Harmonia Hub** — Coordinación y bienestar estudiantil

## CUÁNDO USAR

Cuando el usuario pide:
- Crear plataforma educativa / LMS (Learning Management System)
- Sistema de cursos modulares con rutas de aprendizaje personalizadas
- Certificación por competencias con verificación pública (QR)
- App educativa con 11 roles (estudiante, docente, mentor, admin, moderador, psicólogo, familia...)
- Plataforma con accesibilidad WCAG 2.1+
- Modo offline/PWA para conectividad limitada
- Tutor inteligente con voz (Web Speech API + Ollama)
- Multilenguaje pt-BR → es/ca/en

### Decision Tree

```
¿LMS/cursos online?      → Open School
¿Solo idioma/traducción? → LinguaForge pattern
¿Educación formal/school → Open School completo
¿Certificación skills?   → Open School + Verifiable Credentials
```

---

## 1. ARQUITECTURA MONOREPO (V1: Simple — Para un solo developer)

Ideal para empezar rápido. Mismo patrón que UX Academy + Open Tongue.

```bash
open-school/                    # Proyecto raíz monorepo
├── package.json                # pnpm workspace, dependencias compartidas
├── tsconfig.json               # TypeScript strict mode
├── vite.config.ts              # Vite + React plugin
├── drizzle.config.ts           # ORM configuration
├── pnpm-workspace.yaml         # Workspace definition
│
├── client/                     # Frontend (React 19 + Vite + Tailwind 4)
│   ├── index.html
│   └── src/
│       ├── App.tsx             # Wouter router + providers
│       ├── main.tsx            # Entry point
│       ├── const.ts            # App constants, feature flags
│       ├── _core/              # Core utilities, hooks, contexts
│       │   ├── llm.ts          # Ollama integration
│       │   └── speech.ts       # Web Speech API wrapper
│       ├── components/         # shadcn/ui primitives + custom
│       │   ├── ui/             # Button, Input, Dialog...
│       │   └── courses/        # LessonCard, ProgressTracker, QuizPlayer
│       ├── pages/              # Route-level pages
│       ├── hooks/              # useAuth, useProgress, useSpeech
│       └── stores/             # Zustand stores
│
├── server/                     # Backend (Express + tRPC)
│   ├── _core/
│   │   ├── db.ts               # PostgreSQL connection
│   │   ├── env.ts              # Environment variables
│   │   ├── llm.ts              # AI tutor endpoint
│   │   └── trpc.ts             # tRPC initialization
│   └── routers/
│       ├── auth.router.ts      # Login, register, OAuth
│       ├── courses.router.ts   # CRUD courses/modules/lessons
│       ├── progress.router.ts  # Track learning state
│       └── assessment.router.ts # Quizzes, certificates
│
├── shared/                     # Code shared between client/server
│   ├── types.ts                # User, Course, Lesson, Role interfaces
│   └── errors.ts               # Standardized error types
│
├── drizzle/                    # Database schema & migrations
│   ├── schema.ts               # All table definitions
│   ├── meta/                   # Migration metadata
│   └── migrations/             # SQL files (version controlled)
│
├── scripts/                    # Automation
│   └── seed.ts                 # Sample data seeding
│
├── docs/                       # Documentation
│   ├── AGENTS.md               # AI agent instructions
│   └── README.md               # Project overview
│
├── .github/workflows/
│   └── ci.yml                  # Lint + test + build checks
├── .env.example                # Environment variables template
└── README.md                   # Project setup guide
```

**Stack:** React 19 + Vite 7 + TypeScript 5.6+ + Tailwind 4 + shadcn/ui + Drizzle ORM + PostgreSQL + Express.js + tRPC + Zustand + Wouter + Framer Motion

---

## 2. ARQUITECTURA MULTI-APPS (V2 — Para equipos o expansión)

Para cuando necesitas apps separadas pero comparten packages. Basado en especificación X.txt §12.2.

```bash
institute-monorepo/
├── pnpm-workspace.yaml
├── package.json # root scripts, shared devDeps
├── turbo.json # Build pipeline config
│
├── apps/
│   ├── student-app/     # Frontend principal estudiante (React/Vite)
│   ├── teacher-dashboard/# Panel docente (React/Vite)
│   ├── admin-console/   # Admin institucional
│   ├── mentor-hub/      # Mentoría entre pares
│   ├── parent-panel/    # Seguimiento parental (minores)
│   ├── api-gateway/     # Express + tRPC API
│   └── ai-assistant/    # Servicio IA (Ollama + Python/FastAPI opcional)
│
├── packages/
│   ├── ui/              # Componentes compartidos (shadcn/ui base)
│   ├── core/            # Utilidades, tipos, constantes
│   ├── auth/            # Auth abstraction (JWT/OAuth, RBAC middleware)
│   ├── database/        # Drizzle schemas, migraciones, seeds
│   ├── i18n/            # Traducciones (es/en/pt/ca)
│   ├── forms/           # Zod schemas + react-hook-form resolvers
│   ├── charts/          # Recharts wrappers para dashboards
│   ├── certifications/  # QR generation, PDF templates, verificación
│   ├── offline-sync/    # Service Worker + IndexedDB sync
│   └── accessibility/   # WCAG helpers, screen-reader utils
│
├── content/             # Git-managed contenido educativo (separado del código)
│   ├── mathematics/
│   ├── sciences/
│   ├── languages/
│   ├── technology/
│   ├── design/
│   ├── health/
│   ├── finance/
│   ├── trades/          # Oficios/prácticos
│   └── citizenship/
│
└── docs/
    ├── ARCHITECTURE.md
    ├── CONTRIBUTING.md
    └── pedagoogy-model.md
```

---

## 3. MODELO DE DATOS — CURRÍCULO JERÁRQUICO

Basado en X.txt §4.x y §5.x:

```
INSTITUTO (multi-tenant)
├── RUTA DE APRENDIZAJE (Learning Route)
│   ├── Objetivo, duración estimada, nivel inicial
│   ├── Módulos (4-8 por ruta)
│   │   ├── Lección 1: Video corto (3-10 min)
│   │   ├── Lección 2: Lectura (5-15 min)
│   │   ├── Lección 3: Ejercicio interactivo (5-20 min)
│   │   ├── Lección 4: Reto rápido (2-5 min)
│   │   └── Proyecto práctico
│   ├── Evaluaciones (diagnóstica → formativa → sumativa)
│   └── Certificado al completar
```

### Tablas SQL Requeridas (Drizzle Schema)

#### Identity & Security
```sql
users { id, email, name, avatarUrl, role enum(11), ageRange, language, timezone, createdAt }
parental_controls { userId, parentUserId, approved boolean, timeLimits }
consents { userId, consentType, grantedAt, revokedAt }
```

#### Education (Core)
```sql
learning_routes { id, title, description, durationHours, initialLevel enum(basico,intermedio,avanzado), 
                   category, skills array, prerequisites route_id[], createdById }

modules { id, routeId, title, orderNumber, estimatedHours }

lessons { id, moduleId, type enum(video,lectura,ejercicio,proyecto,simulacion), 
          title, contentUrl, contentType, transcriptText, durationSeconds, difficultyLevel, tags }

lesson_components { lessonId, type enum(introduccion,explicacion,ejemplo,practica,evaluacion,cierre), text }

competencies { id, name, description, levelInicial, nivelIntermedio, nivelAvanzado }
course_competencies { courseId, competencyId, evidenceRequired, criteria }

enrollments { userId, routeId, status enum(enrolled,in_progress,completed,dropped), startedAt, completedAt }
student_progress { userId, lessonId, status enum(pending,in_progress,completed), score float, attempts int, lastAccessed }
```

#### Assessment & Certification
```sql
assessments { id, lessonId, type enum(diagnostica,formativa,sumativa), passingScore, timeLimitMin, maxAttempts }
assessment_questions { assessmentId, questionText, options JSONB, correctAnswer, points }
attempts { attemptId, assessmentId, userId, answers JSONB, score float, submittedAt }

certificates { id, userId, routeId, code unique, issueDate, expiresAt, qrHash, competencies array, issuerName }
certificate_verifications { certificateId, verifiedBy, verifiedAt, valid boolean }

badges { id, name, icon, criteriaJSON }
user_badges { userId, badgeId, earnedAt }
```

#### Community
```sql
forums { id, routeId, title, moderationStatus }
forum_posts { id, forumId, authorId, parentId, content, status, createdAt }
peer_mentorships { mentorId, menteeId, startDate, endDate, status, topics array }
```

#### Analytics (Privacy-preserving)
```sql
events { id, userId, eventType, properties JSONB, createdAt } // Anonymized for aggregation
risk_scores { userId, score float, reason string, updatedAt } // For dropout prevention
```

---

## 4. MATRIZ DE ROLES Y PERMISOS (RBAC Completo)

11 roles definidos según X.txt §3.x:

| Rol | Lee Cursos | Crea Contenido | Evalúa | Modera | Ve Analytics | Configura | Certifica | Padres Control |
|-----|-----------|---------------|--------|--------|--------------|-----------|-----------|----------------|
| **Estudiante** | ✅ | ❌ | ✅ Responde | ❌ | ✅ Solo suya | ❌ | ✅ Básico | ❌ |
| **Docente** | ✅ Editar | ✅ Crea | ✅ | ❌ | ✅ Sus cursos | ❌ | ✅ Validado | ❌ |
| **Mentor Par** | ✅ Lee | ✅ Sugiere | ✅ Asesora | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Admin Institucional** | ✅ Todo | ✅ Todo | ✅ Todo | ✅ Total | ✅ Todas | ✅ Todo | ✅ Emisor | ✅ Configurar |
| **Admin Técnico** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Infraestructura | ✅ Infraestructura | ❌ | ❌ |
| **Creador Contenido** | ✅ Suyo | ✅ Suyo | ❌ | ❌ | ✅ Suyo | ❌ | ❌ | ❌ |
| **Moderador** | ✅ Todo | ❌ | ❌ | ✅ Total | ❌ | ❌ | ❌ | ❌ |
| **Psicólogo** | ✅ Todo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Familia/Tutor** | ✅ Hijo/a | ❌ | ❌ | ❌ | ✅ Hijo/a | ✅ Permisos hijo | ❌ | ✅ Full |
| **Aliado Estratégico** | ✅ Analiza | ✅ Donativo | ✅ Valida | ❌ | ✅ Agregados | ❌ | ✅ Validador | ❌ |
| **Investigador** | ✅ Anonimizado | ❌ | ❌ | ❌ | ✅ Desidentificado | ❌ | ❌ | ❌ |

---

## 5. MODELADO DE CONTENIDO (Content Repository)

Cada lección usa formato markdown con frontmatter YAML (X.txt §18):

```yaml
---
id: math-algebra-equations-01
title: "Introducción a Ecuaciones Lineales"
subject: mathematics
module: algebra/sub-topic: equations
level: basico
duration_minutes: 7
language: es
version: 1.2.0
last_reviewed: 2026-08-15
reviewer: "Maria Santos"
competencies: ["Resuelve ecuaciones lineales de una variable", "Verifica soluciones"]
tags: [algebra, ecuaciones, principiante]
prerequisites: ["math-arithmetic-basics"]
accessibility:
  transcript_available: true
  video_subtitles: true
  audio_description: true
  reading_speed: normal
---

# Introducción a Ecuaciones Lineales

[Video: 5 min explainer]

## Lo que aprenderás

- ...

## Práctica

::exercise
type: multiple-choice
question: "¿Cuál ecuación representa y = mx + b cuando m=2 y b=-3?"
options:
  - text: "y = 2x - 3"
    correct: true
  - text: "y = 3x - 2"
    correct: false
feedback_correct: "¡Correcto! Sustituyiste m y b correctamente."
feedback_incorrect: "Revisa qué valor corresponde a pendiente (m) e intercepto (b)."
::
```

**Delivery Pipeline:**
1. Autores editan `/content/` (markdown + JSON/YAML)
2. CI valida enlaces, prerequisitos, cobertura i18n
3. Compiler convierte markdown → JSON structurado
4. Apps consumen via API `/api/content/[subject]/[moduleId]/[lessonId]`

---

## 6. MULTILENGUAJE (Patrón Open Tongue)

Cada campo traducido individualmente NO traducción de documento entero:

```typescript
// shared/types.ts
interface CourseContent {
  courseId: string;
  translations: {
    'pt-BR': { title: string; lessons: LessonTranslation[] };
    'es': { title: string; lessons: LessonTranslation[] };
    'ca': { title: string; lessons: LessonTranslation[] };
    'en': { title: string; lessons: LessonTranslation[] };
  };
}
```

**Datos de contenido** → JSON separado del código (`data/*.json`) como Open Tongue.

---

## 7. IA EDUCATIVA (Voice + Text Tutor)

### Tutor Conversacional (Ollama Local)

```typescript
// server/_core/llm.ts
async function getTutorResponse(question: string, context: LessonContext): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL || 'llama3.2:3b',
      prompt: `You are an educational tutor. Student asked: "${question}"
               Context: ${JSON.stringify(context)}.
               Answer in language: ${context.targetLanguage}.
               Keep response encouraging, under 200 words. Never humiliate or discourage.`,
      stream: false
    })
  });
  const data = await response.json();
  return data.response;
}
```

### Reconocimiento de Voz (Web Speech API Nativo)

```typescript
// client/src/hooks/useSpeechRecognition.ts
export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    if ('SpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.onresult = (event) => onTranscript(event.results[0][0].transcript);
    }
  }, []);
  
  return { isListening, start: () => {}, stop: () => {} };
}
```

---

## 8. CERTIFICACIÓN VERIFICABLE

```typescript
// Generación con código único + QR hash
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

async function generateCertificate(opts: {
  studentName: string; courseTitle: string; issuerName: string;
  issueDate: Date; competencies: string[]; hours: number;
}): Promise<{ verificationUrl: string; qrCodeBase64: string }> {
  const code = nanoid(12);
  const verificationUrl = `https://open-school.belentani.app/verify/${code}`;
  const qrBase64 = await QRCode.toDataURL(verificationUrl);
  return { verificationUrl, qrCodeBase64 };
}

// Endpoint público de verificación
app.get('/verify/:code', async (req, res) => {
  const cert = await db.query.certificates.findFirst({
    where: (table, eq) => eq(table.code, req.params.code)
  });
  if (!cert) return res.status(404).json({ error: 'No encontrado' });
  res.json({ valid: !cert.expires_at || new Date(cert.expires_at) > new Date(), ... });
});
```

**Tipos de certificación:** Participation, Completion, Competence, Digital Badge, Microcredential, Route Diploma.

---

## 9. ACCESIBILIDAD (WCAG 2.1+)

```css
/* Reduce motion */
.reduce-motion * { animation-duration: 0ms !important; transition-duration: 0ms !important; }
/* High contrast */
.high-contrast { filter: contrast(1.2) brightness(1.05); background: #000 !important; color: #fff !important; }
/* Focus visible */
*:focus-visible { outline: 3px solid #ff073a; outline-offset: 2px; }
/* Skip link */
.skip-link { position:absolute; top:-40px; left:0; background:#000; color:#fff; padding:8px; z-index:9999; }
.skip-link:focus { top:0; }
/* Large font */
.large-font { font-size:1.25rem !important; line-height:1.6 !important; }
/* Simplified read */
.simplified-read { max-width:65ch; margin:0 auto; }
.simplified-read nav, .simplified-read header, .simplified-read footer { display:none; }
```

**Checklist obligatorio:**
- ✅ Todos los `<input>` tienen `<label>` o `aria-label`
- ✅ Imágenes siempre con `alt` descriptivo
- ✅ Videos con subtítulos + transcripción descargable
- ✅ Navegación completa por teclado (`tabindex`, `taborder`)
- ✅ Colores no únicos para transmitir info
- ✅ Tiempo extensible para tareas
- ✅ Modo sin animaciones disponible
- ✅ Texto legible escalable
- ✅ Compatible lectores de pantalla (ARIA roles, semantic HTML)

---

## 10. MODO OFFLINE / PWA

### Service Worker Strategy
```typescript
// Cache-first para contenido, network-first para APIs
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.endsWith('.json')) {
    // Content: cache-first
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  } else {
    // Other: network-first
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline-page')));
  }
});
```

### Qué funciona offline vs requiere conexión

| Función | Offline | Requiere Conexión |
|---------|---------|-------------------|
| Lecciones descargadas | ✅ | ❌ |
| Videos (calidad baja) | ✅ | ❌ |
| Ejercicios básicos | ✅ | ❌ |
| Foros/Comunidad | ❌ | ✅ |
| Tutor AI avanzado | ❌ | ✅ |
| Sync de progreso | Auto al reconectar | ✅ |
| Publicación certificados | ❌ | ✅ |
| Búsqueda global | ❌ | ✅ |

**PWA manifest:**
```json
{
  "name": "Open School — Aprende Sin Límites",
  "short_name": "OpenSchool",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#ff073a"
}
```

---

## COMPARACIÓN CON REPOS EXISTENTES

| Feature | Open School v2 | Open Tongue | UX Academy | LinguaForge |
|---------|---------------|-------------|------------|-------------|
| Roles múltiples | ✅ 11 roles RBAC | ✅ Estudiante | ✅ Docente+E | ✅ Translators |
| Currículo modular | ✅ Ruta→Modulo→Lección | ✅ 12 módulos/48 lecciones | ✅ Unidades | ❌ |
| Evaluación formativa | ✅ Quiz inmediato + feedback | ✅ Ejercicios básicos | ✅ Evaluación+feedback | ❌ |
| Certificación QR | ✅ Verificable pública | ❌ Logros simples | ✅ Capstone cert | ❌ |
| Multilenguaje | ✅ pt-BR/es/ca/en | ✅ PT+ES+CA+EN | ✅ Trilingüe | ✅ Traducción tools |
| IA Local | ✅ Ollama + Web Speech | ✅ Ollama + Web Speech | ❌ | ❌ |
| Modo Offline | ✅ SW + Cache + PWA | ❌ | ❌ | ❌ |
| Accesibilidad | ✅ WCAG 2.1 checklist | Básico | ✅ | ✅ |
| Comunidad | ✅ Foros + mentoring | ❌ | ❌ | ❌ |
| Vocational Guidance | ✅ Tests + rutas laborales | ❌ | ❌ | ❌ |
| Parental Controls | ✅ Consent + limits | ❌ | ❌ | ❌ |

---

## IMPLEMENTACIÓN RÁPIDA

### Quick Start
```bash
# Clonar plantilla
git clone https://github.com/belentani7/open-school YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME

# Instalar + config
pnpm install
cp .env.example .env.local

# Database
pnpm db:generate && pnpm db:migrate && pnpm db:seed

# Dev
pnpm dev  # http://localhost:3000
```

### Variables esenciales (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/open_school
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
NEXT_PUBLIC_DEFAULT_LANGUAGE=es
NEXT_PUBLIC_SUPPORTED_LANGUAGES=es,en,pt-BR,ca
NEXT_PUBLIC_ENABLE_OFFLINE=true
```

---

*Documento v2 compilado desde: X.txt (11,000+ líneas) + repos reales (Open Tongue, UX Academy, LinguaForge) + investigación de 2 agentes Explore sobre arquitectura multi-repo + especificación completa.*

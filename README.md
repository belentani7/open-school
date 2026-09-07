# 🏫 Open School — Plataforma Educativa Digital Universal

**Instituto digital gratuito para jóvenes** — basado en especificación de 11,000+ líneas del documento X.txt.

## 🔗 Documentación completa de arquitectura y patrones

📄 **SKILL.md** — Documento maestro con todo el modelo de datos, roles, patrones técnicos, implementación de IA, certificaciones verificables, accesibilidad WCAG, modo offline.

## 🎯 Visión

Crear un **Instituto Universal Gratuito para Jóvenes** en formato digital que combine:
- Campus virtual multi-rol (estudiante, docente, mentor, admin, moderador, familia)
- Biblioteca universal con 15+ áreas temáticas
- Tutor inteligente por voz y texto (Ollama local + Web Speech API)
- Laboratorio virtual con simuladores interactivos
- Comunidad educativa segura (foros, mentoring entre pares)
- Plataforma de certificación verificable (QR codes)
- Sistema de orientación vocacional
- Panel institucional con analíticas

## 📁 Estructura del Proyecto

```bash
open-school/                    # Proyecto raíz monorepo
├── client/                     # Frontend (React 19 + Vite)
│   └── src/
│       ├── App.tsx             # Router principal
│       ├── main.tsx            # Entry point
│       ├── pages/              # Home, Dashboard, CourseDetail...
│       ├── components/         # UI components (shadcn/ui + custom)
│       ├── hooks/              # useSpeechRecognition, useTextToSpeech...
│       └── contexts/           # AuthContext, ThemeContext, RoleContext
│
├── server/                     # Backend (Express.js + tRPC)
│   └── _core/
│       ├── llm.ts              # Ollama / LLM integration
│       ├── trpc.ts             # tRPC router initialization
│       └── notification.ts     # Email/push notifications
│
├── shared/                     # Code compartido cliente/servidor
│   └── types.ts                # User, Course, Lesson, Certificate types
│
├── drizzle/                    # Database schema & migrations
│   └── schema.ts               # Tables: users, routes, modules, lessons, certificates...
│
├── .env.example                # Environment variables template
├── AGENTS.md                   # Instructions for AI coding agents
└── SKILL.md                    # Comprehensive skill documentation
```

## ⚡ Stack Técnico

| Categoría | Tecnología | Uso |
|-----------|-----------|-----|
| Framework | React 19 + Vite 7 | Build tool + SSR-ready |
| Language | TypeScript 5.6+ | Strict mode everywhere |
| Styling | Tailwind CSS 4 + shadcn/ui | Utility-first + Radix primitives |
| Animation | Framer Motion 12.x | Smooth transitions |
| Router | Wouter 3.x | Lightweight routing |
| Forms | React Hook Form + Zod 4.x | Validation + submission |
| Charts | Recharts 2.x | Progress dashboards |
| Database | Drizzle ORM + PostgreSQL 15+ | Type-safe queries |
| Backend | Express.js + tRPC | API layer type-safe |
| AI | Ollama local + Web Speech API | Voice input/output |
| State | Zustand 5.x | Client state management |

## 🚀 Quick Start

```bash
# 1. Clonar el proyecto
git clone https://github.com/belentani7/open-school YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME

# 2. Instalar dependencias
pnpm install

# 3. Configurar entorno
cp .env.example .env.local
# Editar .env.local con valores reales

# 4. Setup base de datos
pnpm db:generate  # Generar archivos de migración
pnpm db:migrate   # Aplicar migraciones
pnpm db:seed      # Poblar con datos iniciales

# 5. Iniciar desarrollo
pnpm dev          # Frontend en http://localhost:3000
```

## 👥 Roles del Sistema

| Rol | Acceso | Descripción |
|-----|--------|-------------|
| **Estudiante** | Lee curso, responde evaluaciones, obtiene certificados | Usuario principal |
| **Docente** | Crea/edita cursos, evalúa, revisa proyectos | Facilita aprendizaje |
| **Mentor** | Acompaña estudiantes, resuelve dudas | Mentoría entre pares |
| **Admin Institucional** | Gestiona usuarios, roles, cursos, reportes | Control total |
| **Moderador** | Modera comunidad, foros, comentarios | Seguridad comunitaria |
| **Psicólogo/Orientador** | Apoyo emocional y vocacional | Bienestar estudiantil |
| **Familia/Tutor Legal** | Ve progreso del hijo/a | Supervisión parental |

## ✅ Características Principales

### Pedagogía
- ✅ Rutas de aprendizaje personalizadas
- ✅ Microaprendizaje (lecciones 3-10 min)
- ✅ Evaluación formativa inmediata
- ✅ Aprendizaje basado en proyectos
- ✅ Retroalimentación adaptativa

### Tecnología
- ✅ IA local con Ollama (sin claves externas)
- ✅ Reconocimiento de voz nativo (Web Speech API)
- ✅ Text-to-Speech accesible
- ✅ Modo offline completo (Service Worker)
- ✅ Certificados verificables con QR

### Accesibilidad
- ✅ WCAG 2.1 AA compliance
- ✅ Modo alto contraste
- ✅ Navegación por teclado
- ✅ Lectores de pantalla
- ✅ Texto a voz
- ✅ Subtítulos y transcripciones

### Seguridad
- ✅ Protección de datos juveniles
- ✅ Control parental opcional
- ✅ Moderación de comunidad
- ✅ Privacidad by design
- ✅ Consentimiento verificable

## 🌐 Multilenguaje

Soporte para múltiples idiomas desde diseño:
- `pt-BR` — Portugués brasileño (base)
- `es` — Español
- `ca` — Catalán
- `en` — Inglés

Cada lección traduce individualmente título, descripción, ejercicios.

## 🏗️ Inspirado en

- **X.txt** — Especificación "Instituto Universal Gratuito para Jóvenes"
- **Open Tongue** — Instituto de idiomas con tutor conversacional local
- **UX Academy Professional Program** — Plataforma de evaluación y capstone
- **LinguaForge** — Herramientas de traducción multilingüe

## 📄 Licencia

MIT — Usalo libremente en proyectos personales o institucionales.

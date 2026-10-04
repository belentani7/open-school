# Arquitectura y Planificación Estratégica: NicheLang

## 1. Definición del Alcance y Módulos Lógicos

**NicheLang** es una plataforma y aplicación móvil de aprendizaje de idiomas profesionales por nichos (Logística, Medicina, Ventas, Turismo, Finanzas, etc.), diseñada con arquitectura **Offline-First**, sincronización idempotente por cola de acciones, notificaciones locales y soporte opcional de backend autenticado.

Los módulos lógicos se dividen en:
- **Core Móvil (React Native + Expo SDK 54 + NativeWind)**: Navegación basada en pestañas y modales con Expo Router, manejo seguro de sesiones y perfiles con `expo-secure-store` y `AsyncStorage`, componentes accesibles y diseño adaptado a móviles (iOS/Android).
- **Motor de Aprendizaje y Módulos**: Lecciones estructuradas por módulos de vocabulario, diálogos con audio integrado (Expo Speech / TTS), y ejercicios interactivos con feedback inmediato.
- **Cola de Sincronización y Background Tasks (`expo-task-manager`, `expo-background-task`)**: Sincronización diferida automática cada 5 minutos, reintentos con límite de 3 fallos y bloqueo seguro con recuperación manual en la pantalla de configuración.
- **Seguridad y Privacidad (GDPR Compliance)**: Almacenamiento encriptado de datos sensibles, exportación de perfil y estadísticas, consentimiento explícito y derecho al olvido (borrado completo).
- **Backend Opcional (Node.js + Express + tRPC + PostgreSQL / Drizzle ORM)**: Mutación protegida `sync.push` para procesar acciones de progreso, perfiles y estadísticas de forma idempotente.

---

## 2. Stack Tecnológico

| Capa | Tecnología / Librería | Propósito |
|---|---|---|
| **Frontend Móvil** | React Native 0.81, Expo SDK 54, React 19 | Runtime multiplataforma nativo |
| **Enrutamiento** | Expo Router 6 | Enrutamiento basado en archivos |
| **Estilos** | NativeWind v4 (Tailwind CSS) | Sistema de diseño responsive y tokens |
| **Persistencia Local** | `@react-native-async-storage/async-storage`, `expo-secure-store` | Almacenamiento de perfiles y progreso |
| **Audio y Voz** | `expo-audio`, `expo-speech` | Reproducción de diálogos y síntesis de voz |
| **Notificaciones** | `expo-notifications`, `expo-task-manager` | Recordatorios diarios y avisos de racha |
| **API & Backend** | tRPC 11, Express 4, TypeScript 5.9 | Contratos tipados y servidor REST/RPC |
| **Base de Datos** | PostgreSQL, Drizzle ORM 0.44 | Persistencia relacional de usuarios y acciones |
| **Pruebas** | Vitest 2.1 | Pruebas unitarias y de regresión |
| **Contenerización** | Docker, Docker Compose | Entorno de desarrollo e infraestructura reproducible |

---

## 3. Árbol de Directorios del Proyecto

```text
niche-lang-app/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── progress.tsx
│   │   └── settings.tsx
│   ├── niche/
│   │   └── [id].tsx
│   ├── lesson/
│   │   └── [id].tsx
│   ├── niches.tsx
│   ├── dev/
│   │   └── theme-lab.tsx
│   └── oauth/
│       └── callback.tsx
├── components/
│   ├── screen-container.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
├── constants/
│   ├── const.ts
│   ├── niches.ts
│   └── theme.ts
├── drizzle/
│   ├── schema.ts
│   ├── relations.ts
│   └── migrations/
├── hooks/
│   ├── use-auth.ts
│   ├── use-color-scheme.ts
│   ├── use-colors.ts
│   └── ...
├── lib/
│   ├── contexts/
│   │   ├── lessons-context.tsx
│   │   └── user-context.tsx
│   ├── data/
│   │   └── lesson-templates.ts
│   ├── services/
│   │   ├── background-task.ts
│   │   ├── notifications.ts
│   │   ├── security.ts
│   │   └── sync.ts
│   ├── trpc.ts
│   └── utils.ts
├── server/
│   ├── db.ts
│   ├── routers.ts
│   ├── storage.ts
│   └── _core/
├── shared/
│   ├── const.ts
│   ├── types.ts
│   └── _core/
├── tests/
│   ├── audit-regressions.test.ts
│   ├── catalog-consistency.test.ts
│   ├── lessons-context.test.ts
│   ├── services.test.ts
│   └── user-context.test.ts
├── scripts/
│   ├── backup.mjs
│   └── ...
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
└── README.md

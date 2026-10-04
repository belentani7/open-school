# NicheLang

NicheLang es una aplicación móvil de aprendizaje de idiomas profesionales por nichos. Su diseño prioriza el estudio contextual, la operación **offline-first**, la privacidad local y la sincronización segura cuando existe una sesión autenticada. El proyecto utiliza Expo para el cliente móvil, TypeScript para contratos compartidos, tRPC para la API y Drizzle ORM para el acceso a datos.

> **Estado de entrega:** el proyecto está preparado para revisión técnica y publicación controlada. Las validaciones automatizadas pasan, pero la autenticación OAuth end-to-end en dispositivos físicos y la auditoría completa de dependencias todavía requieren un entorno externo estable.

## Características

La aplicación incluye selección de nichos profesionales, lecciones modulares de vocabulario, diálogos y ejercicios, pronunciación TTS, progreso por módulo, rachas, logros, recordatorios locales, tareas de fondo, cola offline-first y controles de privacidad. Los perfiles y datos sensibles se almacenan mediante el adaptador seguro disponible en cada plataforma; el progreso local se conserva aunque la red no esté disponible.

La sincronización utiliza una tabla de acciones idempotentes por usuario. Los cambios se conservan localmente hasta que el servidor confirma su recepción. Los errores se reintentan de forma limitada y las acciones bloqueadas pueden reintentarse manualmente desde Configuración.

## Stack

| Capa | Tecnología |
|---|---|
| Cliente móvil | React Native 0.81, Expo SDK 54, React 19 |
| Navegación y UI | Expo Router 6, NativeWind 4, Tailwind CSS |
| Estado local | Context API, AsyncStorage, SecureStore |
| Audio y notificaciones | Expo Speech, Expo Audio, Expo Notifications, Expo Background Task |
| Backend | Node.js, Express, tRPC 11, TypeScript |
| Persistencia servidor | PostgreSQL y Drizzle ORM |
| Calidad | Vitest, TypeScript, Expo lint, esbuild |
| Entrega | Docker, Docker Compose y GitHub Actions |

## Estructura

```text
app/                  Pantallas Expo Router y navegación
components/           Componentes reutilizables de interfaz
constants/            Nichos, tema y constantes compartidas
lib/contexts/         Estado de usuario y progreso
lib/data/             Catálogo de lecciones profesionales
lib/services/         Sincronización, seguridad, voz y background tasks
server/               Routers tRPC y helpers de persistencia
shared/               Tipos y contratos compartidos
drizzle/              Esquema y migraciones de base de datos
tests/                Pruebas unitarias y de regresión
docs/                 Arquitectura y documentación de auditoría
scripts/              Backup y validación reproducible
.github/workflows/    CI/CD de GitHub Actions
```

## Requisitos

Se necesita Node.js 22, pnpm 9.12, una instalación de Expo compatible con SDK 54 y, para el backend persistente, PostgreSQL. Docker es opcional para ejecutar el entorno de servidor junto con PostgreSQL. La documentación de Expo recomienda seleccionar el módulo correspondiente a cada capacidad nativa y mantener las versiones alineadas con el SDK utilizado [1].

## Instalación local

```bash
git clone <URL_DEL_REPOSITORIO>
cd niche-lang-app
pnpm install --frozen-lockfile
cp .env.template .env
# Edita .env localmente y nunca lo subas al repositorio.
pnpm check
pnpm lint
pnpm test
pnpm build
```

Para iniciar el entorno de desarrollo móvil y de servidor:

```bash
pnpm dev
```

Para abrir el cliente web de Expo de forma independiente:

```bash
pnpm dev:metro
```

## Variables de entorno

El repositorio incluye `.env.template` para documentar las variables necesarias sin incluir credenciales. La configuración real debe mantenerse fuera de Git. Como mínimo, el servidor necesita `NODE_ENV`, `PORT` y `DATABASE_URL`; el flujo de autenticación y los servicios gestionados pueden requerir variables adicionales inyectadas por la plataforma.

| Variable | Uso | Obligatoria |
|---|---|---:|
| `NODE_ENV` | Modo de ejecución del servidor | Sí |
| `PORT` | Puerto HTTP del servidor | Sí |
| `DATABASE_URL` | Conexión PostgreSQL/Drizzle | Para backend con DB |
| `JWT_SECRET` | Firma de sesiones o tokens configurados por el entorno | Según despliegue |

Nunca escribas valores reales en `README.md`, `docker-compose.yml`, workflows, archivos de ejemplo o commits. Los secretos de GitHub deben configurarse en **Settings → Secrets and variables → Actions**.

## Docker

El `Dockerfile` construye el bundle de servidor en una etapa separada y ejecuta una imagen Node.js mínima. `docker-compose.yml` levanta PostgreSQL y el servidor sin contraseñas embebidas; exige `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` mediante el entorno.

```bash
export POSTGRES_USER=nichelang
export POSTGRES_PASSWORD='cambia-esta-contraseña'
export POSTGRES_DB=nichelang_db
docker compose config
docker compose up --build
```

El comando `docker compose config` debe ejecutarse antes de levantar servicios para detectar variables faltantes. No se incluyen credenciales predeterminadas deliberadamente.

## Base de datos

Después de modificar `drizzle/schema.ts`, genera una migración y revísala antes de aplicarla:

```bash
pnpm drizzle-kit generate
pnpm db:push
```

Las operaciones destructivas deben revisarse manualmente. La migración incluida para sincronización añade acciones idempotentes asociadas a usuarios; no debe reemplazarse por una migración destructiva.

## Pruebas y validación

Los comandos de calidad son:

```bash
pnpm check       # TypeScript
pnpm lint        # Expo lint
pnpm test        # Vitest
pnpm build       # Bundle Node/Express
npx expo config --type public
pnpm backup      # Genera el ZIP estructurado
```

El workflow `.github/workflows/main.yml` ejecuta instalación reproducible, typecheck, lint, tests y build en cada push o pull request dirigido a `main` o `master`. El proyecto incluye pruebas de contextos, servicios, regresión de cola offline y consistencia del catálogo.

## Backup estructurado

El script `scripts/backup.mjs` genera un archivo con el patrón `Proyecto_NicheLang_Backup_YYYY-MM-DD.zip` en `/home/ubuntu`. Dentro del ZIP se crean las carpetas `/src`, `/docs`, `/tests` y `/assets`, junto con carpetas auxiliares `/ci` y `/ops` y los archivos raíz de configuración.

```bash
pnpm backup
unzip -l /home/ubuntu/Proyecto_NicheLang_Backup_$(date +%F).zip
```

El backup excluye `node_modules`, `.git`, `.env`, builds temporales y otros artefactos no necesarios. Antes de subirlo a Drive, verifica que no contenga secretos.

## GitHub

La creación y publicación del repositorio debe hacerse en un repositorio privado. El flujo recomendado se encuentra en `docs/architecture.md` y en el informe de auditoría. GitHub Actions utiliza secretos configurados en el repositorio y nunca credenciales almacenadas en el código [2].

## Google Drive

La copia puede subirse manualmente desde la interfaz web de Drive o mediante Google Workspace CLI después de que el usuario autentique ese servicio. La estructura recomendada es:

```text
NicheLang Backup/
├── src/
├── docs/
├── tests/
├── assets/
├── ci/
└── ops/
```

No se ejecuta autenticación de Google en este entorno. Para operaciones de Drive, utiliza la CLI oficial configurada para la cuenta correcta y evita eliminar permanentemente archivos; conserva versiones y mueve elementos a la papelera cuando sea necesario [3].

## Privacidad y seguridad

El proyecto aplica almacenamiento seguro para información sensible, consentimiento persistente, exportación de datos, borrado local, cola offline con límites de reintento y validación Zod en el endpoint de sincronización. Estas medidas no sustituyen una revisión legal ni una prueba de penetración. Antes de producción deben verificarse la configuración TLS, las políticas de retención, el control de acceso a la base de datos y la autenticación OAuth real.

## Documentación adicional

- `docs/architecture.md`: alcance, stack y árbol de directorios.
- `PROJECT_README.md`: documentación ampliada del proyecto existente.
- `AUDIT_REPORT_10000.md`: informe y addendum de auditoría.
- `audit_matrix_spec.md`: especificación de la matriz de controles.
- `todo.md`: estado histórico de tareas y pendientes.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` incluido en la raíz para el texto completo.

## Referencias

[1]: https://docs.expo.dev/versions/latest/ "Expo Documentation"
[2]: https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions "Using secrets in GitHub Actions"
[3]: https://developers.google.com/workspace/guides/get-started "Google Workspace APIs and guides"

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

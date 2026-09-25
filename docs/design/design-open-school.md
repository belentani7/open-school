# SDD / Design Doc -- open-school
Fecha: 2026-09-25 | Estado: Draft

## Arquitectura general

Stack: Node.js, Next.js, React, Vite, Tailwind, Express, TypeScript, Deploy: vercel.json. Estructura de primer nivel detectada:

```
  .env.example
  .github
  .gitignore
  AGENTS.md
  ASSETS-NECESARIOS.txt
  CONTRIBUTING.md
  GAME-LOOP-SPEC.md
  LICENSE
  NOTICE-ATRIBUCIONES.md
  README.md
  SECURITY.md
  SKILL.md
  assets
  backend
  campus
  campus.html
  client
  index.html
  open-data
  open-school-secure-t-coupling.zip
```

CI: build.yml, ci.yml, tutor-ia.yml.

## Decisiones clave

Ver `docs/adr/`. Regla: una fuente de verdad por concern, contratos de frontera
claros y direccion de dependencias sin ciclos.

## Flujos criticos

1. Desarrollo local -> build -> test -> CI.
2. Cambio -> PR -> revision -> merge -> deploy (si aplica).

## Estrategia de verificacion

- Build y tests en CI en cada PR.
- Revision de seguridad (cero secretos, validacion).
- Comprobacion de deploy segun la matriz de plataforma.

## Limites y riesgos

- Deuda tecnica no documentada: registrar como ADR antes de refactor mayor.
- Dependencias externas: fijar versiones y lockfile.

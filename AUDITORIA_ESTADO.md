# AUDITORIA_ESTADO — open-school

> Repositorio físico: `belentani-ecosystem/educacion/open-school`

## Situación actual

| Indicador | Valor |
|-----------|-------|
| Categoría | educacion |
| Lenguaje | TypeScript |
| Rama | main |
| package.json | Sí |
| Python | No |
| Docker | Sí |
| README | Sí |
| AGENTS.md | Sí |
| Tests | Sí |
| CI | Sí |

## Comentarios

- Instituto educativo digital universal, cursos modulares.
- Tiene AGENTS.md, tests, CI y Docker.

## Comando para arreglar y elevar

```bash
npm install
npm run dev
npm run build
npm run test
docker compose up -d --build
# Crear .env.example si faltan variables de entorno
gitleaks detect --source .
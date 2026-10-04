# D.I.C.T. — Digital Intelligence & Cyber Technology

D.I.C.T. es una plataforma académica tecnológica independiente para un currículo propio de cinco años en software, inteligencia artificial, cloud y ciberseguridad. Está construida con React, TypeScript, Express, tRPC, Drizzle y base de datos relacional.

> **Transparencia académica.** D.I.C.T. no es una universidad ni otorga títulos universitarios oficiales. Sus **Créditos Académicos Internos (CA)** son una unidad organizativa propia; no son ECTS y no implican reconocimiento estatal ni equivalencia académica oficial.

## Ejecutar el proyecto

Instala dependencias con `pnpm install`, inicia desarrollo con `pnpm dev`, comprueba los tipos con `pnpm check` y ejecuta pruebas con `pnpm test`. La autenticación se integra mediante la sesión de la plataforma; no se deben introducir secretos en el cliente ni añadir archivos `.env` al repositorio.

## Estructura relevante

| Ruta | Contenido |
| --- | --- |
| `shared/dictCatalog.ts` | Currículo de diez semestres, localización ES/PT/EN, prerrequisitos, fichas, recursos, rúbricas y evaluación. |
| `drizzle/schema.ts` | Modelo relacional de programa, materias, progreso, evaluaciones, competencias, portfolio, archivos, certificados, tutor y propuestas curriculares. |
| `server/routers.ts` | API tRPC pública y protegida. |
| `client/src/pages/` | Landing, catálogo, mapa, biblioteca, ficha de asignatura, panel de estudiante y tutor. |
| `docs/` | Arquitectura, API, currículo, seguridad, instrucciones académicas e investigación de fuentes. |

El catálogo prioriza documentación, estándares, laboratorios y repositorios abiertos con licencia explícita. D.I.C.T. enlaza recursos en origen y no copia contenido protegido.

# Open School · backend Python

Esta carpeta añade un backend **opcional y aislado** al frontend existente. No sustituye React/Vite, no cambia el esquema Drizzle y no contiene contenido educativo real. Su propósito es ofrecer una base compatible para un SaaS educativo institucional: universidad, catálogo de cursos, módulos, lecciones, progreso y futuras certificaciones.

## Principios

- **Núcleo independiente:** el dominio usa solo la biblioteca estándar de Python.
- **Adaptadores intercambiables:** memoria, PostgreSQL, SQLite, FastAPI, Flask o Django pueden conectarse sin modificar el dominio.
- **Contratos explícitos:** los puertos se definen con `Protocol`, por lo que las implementaciones pueden sustituirse en pruebas o producción.
- **Fallos controlados:** la API devuelve respuestas JSON consistentes y no expone excepciones internas.
- **Contenido separado:** los cursos son entidades y contratos; el contenido real se añadirá después.

## Arranque sin dependencias externas

```bash
cd backend
python3 -m app.main
```

El servidor WSGI estándar queda en `http://127.0.0.1:8001`. Rutas iniciales:

- `GET /health`
- `GET /api/v1/catalog`

También se puede ejecutar el objeto `app` con Gunicorn, uWSGI, mod_wsgi o un adaptador de FastAPI/Flask cuando se añada ese extra.

## Estructura

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Dominio | `app/domain/` | Entidades y contratos sin infraestructura |
| Aplicación | `app/application/` | Casos de uso y orquestación |
| Adaptadores | `app/adapters/` | Persistencia y servicios reemplazables |
| Interfaces | `app/interfaces/` | HTTP/JSON y futuros adaptadores de framework |
| Entrada | `app/main.py` | Composición de dependencias y servidor local |
| Pruebas | `tests/` | Contratos mínimos y regresión |

## Evolución prevista

1. Sustituir `InMemoryCourseRepository` por un adaptador PostgreSQL alineado con `drizzle/schema.ts`.
2. Añadir autenticación institucional detrás de un puerto, sin acoplarla al dominio.
3. Incorporar FastAPI, Flask o Django como capa HTTP opcional.
4. Añadir colas, almacenamiento de archivos y certificados como adaptadores independientes.
5. Conectar el frontend mediante `/api/v1`, manteniendo compatibilidad offline cuando la API no esté disponible.

# Open School · backend Python

Backend WSGI opcional, sin dependencias obligatorias y separado del progreso local del navegador. Expone salud, un catálogo en memoria y un tutor conectado a Ollama cuando la persona lo activa en la interfaz.

## Rutas

| Método | Ruta | Comportamiento |
|---|---|---|
| `GET` | `/health` | Salud del proceso |
| `GET` | `/api/v1/catalog` | Catálogo en memoria (vacío hasta cargar contenido) |
| `POST` | `/api/tutor` | Tutor Ollama; límites de tamaño, mensajes y frecuencia |

Las funciones de Vercel de `api/` adaptan esas rutas a `/api/health`, `/api/v1/catalog` y `/api/tutor`. La app web sigue teniendo un tutor determinista local y no manda preguntas al servidor por defecto.

## Desarrollo local

```bash
cd backend
python3 -m app.main
```

Arranca en `http://127.0.0.1:8001`. Para habilitar el tutor, arranca Ollama en el mismo equipo y configura opcionalmente:

```bash
OLLAMA_HOST=127.0.0.1 OLLAMA_PORT=11434 OLLAMA_MODEL=llama3.2:3b python3 -m app.main
```

El proceso se comunica solo con el host Ollama configurado por el operador; el destino no puede elegirse desde una petición. No se requiere ni se incluye una API key de un proveedor externo. No guardes preguntas ni credenciales en Git o en el frontend.

## Ejecución WSGI en servidor propio

Para un proceso de producción instala el extra `server` y usa Gunicorn:

```bash
cd backend
python3 -m pip install '.[server]'
HOST=0.0.0.0 PORT=8001 gunicorn --bind 0.0.0.0:8001 --workers 2 app.main:app
```

Las funciones Vercel usan la misma app WSGI; el backend de Ollama debe ser alcanzable desde el entorno de ejecución. El host predeterminado `127.0.0.1` solo funciona si Ollama comparte ese entorno. Sin Ollama, el endpoint falla de forma controlada y el frontend conserva la orientación local.

## Límites deliberados

- El repositorio de cursos es en memoria y no contiene el currículo completo; sus datos se pierden al reiniciar o cambiar de instancia.
- No hay cuentas, autenticación, sincronización de progreso, base de datos ni certificados verificables implementados.
- El limitador de frecuencia es local a cada proceso y tiene capacidad acotada; no sustituye un limitador distribuido ni una cuota de proveedor.
- La pregunta solo se envía al endpoint cuando la persona activa la opción de Ollama. La política de registros y retención del hosting sigue correspondiendo a quien opera el despliegue.

## Pruebas

Desde esta carpeta: `python3 -m pytest -q` (requiere el extra `dev`).

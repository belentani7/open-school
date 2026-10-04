# Política de seguridad

## Cómo reportar una vulnerabilidad

Por favor, **no abras issues públicos** con detalles de vulnerabilidades.

Usa el canal privado de GitHub:

1. Ve a la pestaña **Security** del repositorio.
2. Selecciona **Report a vulnerability** (Private vulnerability reporting).
3. Describe: impacto, versión afectada, pasos para reproducir y, si tienes, una prueba de concepto.

## Qué puedes esperar

- **Acuse de recibo**: ~5 días laborables.
- **Actualización de estado**: ~14 días laborables.
- **Divulgación coordinada**: tras publicar un fix, o de mutuo acuerdo.

## Versiones soportadas

| Versión | Soportada |
|---|---|
| Rama principal (`main`) | ✅ |

## Auditoría 2026-10-01

Revisión del frontend (Vite/React SPA), del backend (WSGI) y de la cadena de
suministro. Lo revisado sin hallazgo y lo corregido:

| Área | Resultado |
|---|---|
| XSS en `client/src` | Sin `innerHTML` / `dangerouslySetInnerHTML` / `eval`. React escapa todo el texto (incluidas las respuestas del tutor). Gate automático: `client/src/lib/xss-surface.test.ts`. |
| Secretos en el repo | Ninguno. Solo `.env.example` (plantilla). `.env`, `*.pem`, `*.key` están en `.gitignore`. |
| SSRF | El host de salida del tutor es una constante (`integrate.api.nvidia.com`), nunca se deriva del input. |
| Inyección SQL / traversal / CSRF | No hay base de datos, ni rutas de fichero de entrada, ni cookies ni estado autenticado. |
| Cabeceras | CSP estricta (`script-src 'self'`, `object-src 'none'`, `connect-src 'self'`), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`. Gate: `security-headers.test.ts`. |
| Terceros | **Cero.** Las fuentes (Sora, Inter, JetBrains Mono) se auto-alojan; antes se pedían a Google en cada carga. |
| Dependencias | `npm audit`: **0** vulnerabilidades (se eliminaron ~30 paquetes no usados y se subió vitest a ≥4.1.11). CI falla en high/critical. |
| Prompt injection | `POST /api/tutor` solo acepta roles `user`/`assistant`: el cliente no puede enviar un mensaje `system`. |
| Abuso / coste del proxy IA | Límite por IP de 30 req/min (`429` + `Retry-After`), comprobado antes de gastar créditos. |
| DoS por cuerpo grande | Cuerpo limitado a 512 KiB → `413` sin llegar a leer el buffer. |
| Service worker | Solo cachea respuestas válidas: un error ya no puede quedar cacheado como la app. |

### Riesgos aceptados

- El límite de peticiones es **por proceso** (en memoria). En un despliegue
  multi-instancia cada instancia lleva su propia cuenta; para un límite
  exacto global haría falta un almacén compartido (p. ej. Redis).
- `/api/tutor` no está expuesto en producción (Vercel sirve solo estático),
  así que los controles del backend son efectivos en local/hosting propio.
  Antes de publicar el endpoint hay que revisar el límite real de uso.

## Proceso

1. Triaje privado del reporte.
2. Fix en rama privada con test.
3. Publicación del advisory y release del fix.
4. Crédito al investigador/a (si lo desea).

Gracias por ayudar a mantener este proyecto seguro.

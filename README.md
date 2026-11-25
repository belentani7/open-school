# Open School — recuperación web-first (23/11/2026)

Versión de campus educativo histórico recuperada de Google Drive: [`index.html`](index.html) (documento de 2026-09-05, ID Drive `1FazRHonwmjlLbrYtbGFESy4-1nP9CnQF`). Conserva el temario de la fuente y su UI autónoma en HTML/CSS/JavaScript. La rama de recuperación mantiene intacto el `main` previo y evita incorporar material personal de otros proyectos.

## Ejecución

```sh
npm test
npm run build
```

El artefacto web queda en `dist/` para alojarlo mediante Vercel (configuración en `vercel.json`). No se ha publicado ni fusionado.

## Correcciones de seguridad y fidelidad

- El texto enviado por estudiantes al chat se muestra con `textContent`, no mediante concatenación HTML; se evita la inyección de etiquetas en respuestas del usuario.
- Se ha retirado el registro del service worker y el caché de modo sin conexión: el producto está pensado para acceso web.
- Se identifica claramente que el asistente del archivo utiliza **respuestas predefinidas**, no una conexión real a un modelo de IA.
- El build solo publica el HTML y `robots.txt` provisional; no copia documentación privada, archivos personales ni credenciales.

## Pendiente para publicar

Validar el conjunto de lecciones y sus fuentes, contenido histórico, UX de móvil, teclado, contraste, rendimiento, políticas de privacidad y derechos. Las pruebas de sintaxis JavaScript se han ejecutado sobre el contenido reconstruido; los tests Node del checkout y pruebas visuales siguen pendientes. Vercel conectado devolvió HTTP 403 al intentar crear un proyecto del equipo: **sin despliegue nuevo confirmado**. Mantener PR en borrador y no sustituir dominio principal sin comprobación.

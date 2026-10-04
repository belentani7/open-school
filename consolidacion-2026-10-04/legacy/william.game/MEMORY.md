# MEMORY — PolyGlot William

## Decisiones

Se eligió una interfaz single-flow en React para mantener la sensación de un único HTML compacto sin sacrificar estados y componentes. La voz usa `SpeechSynthesisUtterance` porque está disponible sin backend ni credenciales, con selección por `pt-BR`, `es-ES`, `ca-ES` y `en-US`; el texto siempre permanece visible para accesibilidad.

El fondo Babylon.js es deliberadamente ligero: escena ortográfica fija, luz hemisférica, 28 partículas con material emissive y GlowLayer. La interacción educativa reside en la UI, mientras el canvas aporta atmósfera y no roba contraste.

## Verificación completada

- Se añadió `@babylonjs/core` y se reinició el servidor.
- `pnpm check` terminó sin errores.
- `pnpm build` terminó correctamente.
- Capturas móviles revisadas para arranque, home, quiz y lección.
- La ruta demo `?demo=1&game=quiz` y `?demo=1&screen=lesson` facilita futuras revisiones.

## Nota conocida

El build advierte que el chunk principal queda por encima de 500 kB debido a Babylon.js y sus módulos de renderizado. El gzip mostrado está alrededor de 489 kB. Si el rendimiento inicial se convierte en prioridad, el siguiente paso sería cargar el canvas de forma diferida después del primer toque, manteniendo la misma experiencia visual.

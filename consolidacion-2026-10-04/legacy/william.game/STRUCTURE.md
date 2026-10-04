# STRUCTURE — PolyGlot William

## Capas

`App.tsx` monta el marco de la aplicación y mantiene el tema oscuro. `pages/Home.tsx` contiene el flujo móvil completo, el estado de sesión y las mecánicas compactas de ocho minijuegos. `components/GameCanvas.tsx` es una capa visual segura para React que monta Babylon.js una sola vez, desmonta listeners y redimensiona el motor. `game/scene.ts` mantiene la escena y las partículas como código independiente de la UI.

## Flujo de estado

| Estado | Uso |
|---|---|
| `screen` | Alterna home, game y lesson sin crear rutas profundas |
| `selectedGame` | Selecciona uno de los ocho modos |
| `sourceLang`, `targetLang` | Controlan la dirección de traducción |
| `wordIndex` | Avanza por el banco de palabras contextual |
| `feedback`, `score`, `streak`, `xp` | Progreso y refuerzo inmediato |
| `lunaText`, `lunaTalking`, `voiceOn` | Acompañamiento hablado y visible |
| `typed`, `selectedLetters`, `guessed`, `matched` | Datos efímeros de cada minijuego |

## Recursos

Las imágenes generadas viven fuera del proyecto y se consumen con URLs `/manus-storage/...`, para evitar que el despliegue cargue archivos grandes desde `client/public`.

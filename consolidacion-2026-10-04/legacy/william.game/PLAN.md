# PLAN — PolyGlot William

## Objetivo

Crear una experiencia educativa móvil, compacta y jugable para William Danilo, de 14 años, que está pasando de Brasil a Cataluña. La interfaz reúne lecciones y minijuegos de inglés, español y catalán, y Luna acompaña cada paso mediante texto visible y síntesis de voz del navegador.

## Riesgos aislados

| Riesgo | Mitigación | Verificación |
|---|---|---|
| Voz robótica o poco natural | Frases breves, pausas por puntuación, velocidad 0.92, selección por locale y botón de repetición | Confirmar que el texto se muestra aunque la voz no esté disponible |
| Interacción táctil incómoda | Botones con altura mínima cercana a 40–47 px, navegación inferior y estados de foco | Probar a 390×844 y con teclado |
| Saturación visual | Fondo Babylon limitado a partículas, paneles oscuros, color semántico por estado y `prefers-reduced-motion` | Revisar capturas de arranque, home, juego y lección |
| Contenido insuficiente | Ocho modos jugables y ruta de tres lecciones con palabras contextualizadas | Abrir cada modo desde la cuadrícula y validar siguiente ronda |
| Dependencia de assets pesados | Assets generados fuera del árbol del proyecto y URLs persistentes de almacenamiento | Confirmar que las imágenes se cargan desde `/manus-storage/` |

## Criterios de aceptación

- La pantalla de arranque funciona con toque o Enter.
- La home muestra a Luna, progreso, ruta, ocho minijuegos y lección express.
- Flashcards, quiz, emparejar, ahorcado, anagrama, escucha, ordena y situación real tienen una acción de respuesta.
- La voz es opcional, localizada y repetible; el juego sigue siendo usable sin audio.
- El layout se adapta primero a móvil y conserva una vista de escritorio razonable.
- La ruta `?demo=1&game=quiz` permite revisión visual determinista.
- `pnpm check` y `pnpm build` terminan correctamente.

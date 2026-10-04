# PolyGlot William — Dirección creativa

## Referencia y criterio rector

La referencia de partida es la interfaz **Belentani//OS / PolyGlot 90's** contenida en los materiales adjuntos: un sistema móvil de aprendizaje de idiomas con neón rojo, glassmorfismo multicapa, luz líquida reactiva, ambiente arcade de los años 90 y una profesora amiga que acompaña con voz. Esta referencia es la especificación visual base; no se sustituye por una estética genérica.

## Dirección elegida: Belentani//OS — Liquid Language Arcade

### Design Movement

Neo-glassmorphism expresivo con influencias de interfaces de arcades de los años noventa, HUDs compactos y diseño de producto móvil experimental. La experiencia debe sentirse como una consola de bolsillo inteligente: cálida en el acompañamiento, precisa en las instrucciones y energética en las recompensas.

### Core Principles

1. **Juego primero, explicación después.** Cada interacción debe poder entenderse con una mirada y una respuesta táctil clara.
2. **La luz comunica estado.** El rojo Belentani marca acción y energía; el cian confirma comprensión; el oro señala avance; el verde celebra el dominio.
3. **La IA acompaña, no invade.** Luna habla en frases breves, naturales y apropiadas para un adolescente, con correcciones cariñosas y pistas graduales.
4. **Densidad útil en móvil.** El HTML será compacto, pero la pantalla mantendrá jerarquía, contraste, botones grandes y descanso visual.

### Color Philosophy

El **rojo líquido** representa impulso y presencia; no debe convertirse en una alarma permanente. El fondo violeta-negro crea profundidad para que el vidrio y los reflejos sean visibles. El **cian** funciona como contraste cognitivo para respuestas correctas y el **oro** como señal de progreso. El verde aparece únicamente en celebraciones o estados resueltos. La paleta debe conservar legibilidad WCAG razonable mediante texto blanco, capas oscuras y contornos visibles.

### Layout Paradigm

Composición vertical de consola móvil: una barra superior de sistema, cápsula de acompañamiento de Luna, HUD de progreso y una bandeja de misiones. Los minijuegos se abren como módulos de pantalla completa dentro del mismo flujo, con salida siempre visible. Se evita el panel central genérico mediante una retícula asimétrica: navegación y progreso arriba, contenido activo en una tarjeta principal, y controles en una barra inferior segura para el pulgar.

### Signature Elements

- Una **onda líquida** que sigue el cursor o el dedo y se convierte en halo de respuesta al tocar.
- El **avatar de Luna** con anillo de voz que pulsa mientras habla y cambia a cian/verde según la intención.
- Un **terminal de ruta** con mensajes breves, nivel actual, racha y próximos destinos lingüísticos.

### Interaction Philosophy

Cada toque produce una confirmación visual inmediata: escala breve, ripple, sonido opcional y una frase de Luna. Las respuestas incorrectas no castigan con ruido; muestran el patrón correcto, permiten repetir y ofrecen una pista. Las lecciones se dividen en microobjetivos para que William sienta avance incluso en sesiones cortas.

### Animation

Las transiciones de controles duran entre 120 y 220 ms con easing de salida pronunciado. Las tarjetas entran con desplazamiento corto y opacidad, nunca desde escala cero. La luz líquida se mueve lentamente en segundo plano y reacciona al puntero mediante variables CSS. Las celebraciones se limitan a ráfagas de partículas y pulso de borde para no saturar la lectura. `prefers-reduced-motion` desactiva el movimiento no esencial.

### Typography System

La jerarquía combina un display geométrico condensado para títulos de sistema, una tipografía monoespaciada de arcade solo para etiquetas pequeñas y una sans humanista para instrucciones y diálogos. Se priorizan tamaños fluidos con `clamp`, interlineado amplio en las lecciones y palabras clave resaltadas por color, no por exceso de mayúsculas.

### Brand Essence

**PolyGlot William es un arcade de idiomas para un adolescente brasileño que llega a Cataluña y convierte cada situación cotidiana en una misión hablada, breve y motivadora.** Personalidad: **cercana, curiosa, luminosa**.

### Brand Voice

Los titulares son directos y con energía; las CTA suenan a invitación concreta. Luna usa frases cortas, humor suave y correcciones que explican el porqué. No usa relleno genérico ni tono infantilizado.

Ejemplos: “Hoy desbloqueamos tres frases para moverte por la ciudad.” / “Casi: escucha el final, cambia una palabra y vuelve a intentarlo.”

### Wordmark & Logo

El símbolo es una **W modular** formada por tres trazos líquidos unidos por un pequeño núcleo rojo, como una ruta que conecta tres idiomas. Se usará como marca gráfica sin texto en el arranque y como icono compacto en la barra superior.

### Signature Brand Color

**Belentani Red — `#ff3158`**, un rojo coral eléctrico pensado para destacar sobre vidrio oscuro sin perder calidez.

## Voz de Luna

La voz debe sonar como una mentora joven y natural, nunca como un sistema automático. Para los mensajes de juego se usarán frases de 4 a 12 palabras, pausas mediante puntuación y cambios de energía según el estado: tono conversacional para explicar, sonrisa audible para celebrar y ritmo más lento para corregir. La síntesis del navegador se adaptará a `pt-BR`, `es-ES`, `ca-ES` y `en-US`; cuando no haya voz preferida, se elegirá automáticamente una voz disponible por idioma.

La mezcla lingüística se mantiene contextual: Luna puede saludar en portugués brasileño, explicar en español y practicar la frase objetivo en inglés o catalán. Las respuestas se muestran siempre por escrito para que la voz no sea el único canal de aprendizaje.

## Contenido y minijuegos compactos

El núcleo inicial incluye ocho actividades, cada una con rondas breves: **Flashcards**, **Opción múltiple**, **Emparejar**, **Ahorcado amable**, **Anagrama**, **Escucha y escribe**, **Ordena la frase** y **Situación real**. Los temas se organizan por rutas: llegada a Cataluña, instituto, transporte, comida, amistades y supervivencia cotidiana.

Cada ronda debe registrar aciertos, racha, XP y palabras practicadas. El juego empieza en modo guiado con Luna, y después deja elegir actividad y dirección de traducción entre portugués, español, catalán e inglés sin abandonar la pantalla principal.

## Alcance técnico

La experiencia se implementará como frontend móvil en React dentro de WebDev, manteniendo la lógica de juego separada y con un modo de demostración determinista para revisión visual. La entrega tendrá un único flujo principal y una arquitectura compacta que puede exportarse posteriormente a un HTML autocontenido si se necesita una versión fuera de línea.

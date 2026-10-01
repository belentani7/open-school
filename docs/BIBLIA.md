# La Biblia de términos — de dónde sale y cómo se regenera

`client/src/lib/biblia.ts` (673 términos, 23 categorías) alimenta la página
[/biblia](client/src/pages/Biblia.tsx): buscador, filtro por categoría y enlaces
de cada término al curso donde se usa de verdad.

## Flujo

```
docs/BIBLIA_TERMINOS_DESARROLLO.md   ← fuente única, se edita aquí
        │  npm run build:biblia
        ▼
client/src/lib/biblia.ts             ← generado, no se toca a mano
        │  import desde la UI
        ▼
client/src/pages/Biblia.tsx          ← /biblia
```

Una sola verdad: las definiciones se corrigen en el Markdown, y el módulo TS
es una proyección suya. Si `biblia.ts` se edita a mano, el siguiente
`build:biblia` lo pisa y se pierde el cambio.

## Regenerar

```bash
npm run build:biblia   # node client/scripts/build-biblia.mjs
npm run check
npm run test
```

El script no necesita Python ni red, solo Node. Su comportamiento:

1. Lee el Markdown y parsea las tres columnas de cada tabla
   (`| **ABREV** | nombre | significado |`) bajo cada encabezado `##`.
2. Valida el mapa `CURSO` **antes de escribir nada**: si una ruta o un término
   no existe, sale con error. Así no se llega a generar un enlace roto en
   pantalla.
3. Escribe el `.ts` con finales de línea LF y UTF-8 sin BOM.

Un resultado correcto es reproducible: ejecutarlo dos veces sobre el mismo
Markdown produce el mismo fichero byte a byte.

## Lo que el módulo añade y el Markdown no

El Markdown es cómodo para leer y corregir, pero no puede hacer en el navegador:

- **Buscar** por sigla, nombre o texto de la definición, tolerando faltas de
  tilde (`diseno` → `diseño`). Las definiciones están en español y 90 de los
  muchos de los 673 términos llevan acento, así que sin normalizar la búsqueda se rompe justo
  cuando se necesita.
- **Filtrar** por categoría sin recargar la página.
- **Enlazar** cada término al curso donde se usa (`CURSO`), con las rutas
  verificadas contra el catálogo real.
- **Distinguir siglas ambiguas**: `TDD` es *Test-Driven Development* en
  TÉRMINOS FUNDAMENTALES y *Technical Design Document* en DOCUMENTOS TÉCNICOS.
  `AMBIGUOS` expone ese aviso; sin él, `getTermino('TDD')` devuelve una de las
  dos en silencio.
- **Ordenar por relevancia** en la búsqueda: la sigla exacta gana a la que solo
  empieza igual, y esa gana a la que la menciona dentro de la definición.

## Tests

| Fichero | Qué cubre |
|---|---|
| `client/src/lib/biblia.test.ts` | Integridad del documento (673/23, sin campos vacíos), enlaces a cursos reales, siglas ambiguas, búsqueda, ranking y vecinos |
| `client/src/lib/highlight.test.ts` | El resaltado de resultados: `unir(tramos(x)) === x`, es decir, el resaltado no borra ni inventa texto |

Ejecutar con `npm test`.

## Adjunto en rutas

`biblia.ts` se carga con `React.lazy` en `App.tsx`, así que solo viaja con el
chunk de `/biblia`; la página principal no paga por esos datos.

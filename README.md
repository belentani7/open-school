# Open School

Campus estático abierto. La edición pública recuperada contiene **428 materiales
indexados y navegables**. `cursos.html` es la biblioteca accesible sin
JavaScript; con JavaScript permite buscar sin distinguir acentos, filtrar por
categoría, guardar favoritos y marcar materiales completados. El progreso se
conserva en el navegador, sin cuenta. `catalog.json` es el índice de referencia.

## Uso

```bash
python -m http.server 8080
# abre http://localhost:8080/cursos.html
```

En cualquier página del campus:

- **Ctrl/Cmd + K** (o el botón «Buscar») abre la paleta de búsqueda sobre
  `search-index.json`.
- El botón ◐ alterna el tema claro/oscuro (persistido en `localStorage`).
- Una barra superior muestra el progreso de lectura.

## Arquitectura

| Ruta | Qué es |
| --- | --- |
| `index.html` | Portada con catálogo filtrable (JS inline, sin dependencias). |
| `cursos.html` | Biblioteca accesible de los 413 materiales (funciona sin JS). |
| `catalog.json` | Índice canónico `[{id,title,type,url}]`. |
| `search-index.json` | Índice de la paleta `[{title,description,section,href}]` (generado). |
| `assets/css/campus.css` | Design system compartido (cabecera, artículos, paleta, tema claro). |
| `assets/js/shell.js` | Cáscara sin dependencias: paleta, tema, progreso (~11 KB). |
| `lecciones/ modulos/ rutas/ universal-*` | Páginas de contenido (HTML autocontenido + CSS en línea). |
| `tools/` | Herramientas de reparación, generación y auditoría. |
| `tests/` | Suite: unit (Python), unit+DOM (Node/jsdom), E2E HTTP. |

## Herramientas internas

Todas aceptan `--help`:

```bash
python tools/audit_site.py            # auditoría integral (estructura, enlaces,
                                      # mojibake, chattera, contraste, índice)
python tools/repair_pages.py --check  # idempotente: repara estructura HTML
python tools/repair_index.py --check  # idempotente: repara index.html
python tools/gen_search_index.py      # regenera search-index.json (--check en CI)
```

`--check` nunca escribe: sirve como verificación en CI. `--apply` (en los
repair) solo escribe si la verificación del resultado pasa.

## Tests

```bash
python -m unittest discover -s tests -v   # herramientas, contraste, índices
node --test tests/*.test.mjs              # núcleo de shell.js + DOM (jsdom)
python tests/e2e_smoke.py                 # camino feliz sobre HTTP real
python scripts/verify_catalog.py          # verificación histórica del catálogo
# o todo junto:
npm run verify && npm test && python tests/e2e_smoke.py
```

## Alcance

La carpeta legacy de origen, incluida `open-school-private`, queda preservada
localmente y no se publica en esta edición. No se afirma que sus archivos sean
cursos únicos ni públicos. El número de materiales indexados no equivale a una
certificación ni a una cifra de cursos completos.

## Ruta Java 21

[Programa profesional](universal-rutas/java-21-profesional.html): 14 módulos, 42 bloques teóricos, 14 prácticas y 28 preguntas. Ejemplos didácticos, no todos compilados en CI.

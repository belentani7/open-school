# Alejandría Universal — integración en open-school

- **Origen:** `alejandria-universal-agent.zip` (`0f8b0cdce0e87068…`)
- **Integrado:** 2026-10-31T04:24:26+00:00
- **Destino:** `C:\Users\USER\belentani-ecosystem\educacion\open-school\campus\alejandria-universal`
- **Repositorios nuevos:** 0 (contenido dentro de un superviviente existente).

## Qué contiene

| Raíz | Contenido |
|---|---|
| `universal-platform/` | 20 tracks, 160 módulos, 800 lecciones de desarrollo de producto |
| `android-platform/` | 10 tracks de Android, 211 HTMLs según su portada |
| `agent-web/` | portada y biblioteca para agentes (incluye `knowledge/`) |
| `skills-raw/` | 53 fichas JSON de repositorios (skills cosechadas) |

## Cifras reales medidas (no editoriales)

- Ficheros: **1892**
- HTML: **1436**
- JSON: **425** · JS: **12** · MD: **4**
- Tamaño: **14.23 MB**
- Grupos de ficheros idénticos: **400** (ahorro potencial 2.49 MB, **no se ha borrado ninguno**)

### Cifras que declara el propio bundle

- `universal-platform`: Alejandría Universal — 1001 páginas para agentes
- `android-platform`: Android — Plataforma Completa 211 HTMLs — Plataforma Android
- `agent-library`: 216 páginas indexadas

No se reescriben los títulos ni las cifras editoriales: se conservan tal cual.
Las cifras reales medidas están arriba y en `MANIFEST.json`.

## Cómo servirlo

Cada plataforma es estática. Desde su carpeta:

```bash
python -m http.server 8000
# abrir http://127.0.0.1:8000/
```

Para `agent-web`, el servidor de referencia está en `agent-web/package.json`.

## Compactación y deduplicación

`agent-web/knowledge/` contiene copias byte a byte de ficheros de
`android-platform/` y `universal-platform/`. Se conservan todas para no
romper rutas relativas; `DUPLICADOS.md` y `MANIFEST.json` registran cada
grupo y su copia canónica. Si más adelante se quiere adelgazar, se puede
sustituir una copia por un enlace o por una nota, con el manifiesto como
prueba de que no se pierde contenido.

## Seguridad

- Hallazgos del escaneo de secretos: **0 reales** (15 falsos positivos:
  `passwordless` y referencias `process.env`). Ver `security-scan.json`,
  `VERIFICACION.json` y `VERIFICACION.md`.
- El bundle es contenido estático; no se ejecuta ningún servidor ni instalación.

## Reglas

- No se crea ningún repositorio nuevo.
- No se mezcla con los chats: conviven en `open-school` pero en carpetas distintas.
- Este README y `MANIFEST.json` son la procedencia verificable del contenido.

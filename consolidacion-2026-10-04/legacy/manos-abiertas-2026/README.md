# Manos Abiertas

**Instituto Universal William** · Educación abierta para quien llega a España.

Sitio estático que reúne el currículum completo del programa, un generador de
currículum y un panel de **datos abiertos** con indicadores reales de acogida.

## Qué incluye

- **La ruta** — 4 niveles y 21 módulos, 250 h, desde alfabetización digital hasta
  despliegue de proyectos. Los datos se cargan de `curriculum.json`.
- **Datos abiertos** — empleo, salud, demografía, derechos y países de origen,
  generados por el pipeline [`edu-open-data`](../edu-open-data) desde APIs públicas
  sin credenciales. Los packs están en `open-data/`.
- **Fuentes oficiales** — accesos directos a las sedes de Extranjería, Seguridad
  Social, SEPE, Agencia Tributaria, Sanidad, Educación, PAG y BOE.
- **Currículum** — generador local que produce un archivo imprimible. Nada se
  envía a ningún servidor.
- **Interfaz trilingüe** — PT > ES > EN (orden del ecosistema), con preferencia
  guardada en el navegador.

## Estructura

```
index.html              # el sitio (autocontenido, sin build)
curriculum.json         # currículum normalizado que consume el frontend
data/
  curriculum.source.json # material original del proyecto (CC BY-SA 4.0)
open-data/              # pack de datos abiertos (generado, no editar a mano)
  index.html
  topics.json
  data/<tema>.json
tests/                  # pytest: coherencia sitio + currículum + pack
tools/                  # (en edu-open-data) gen_curriculum.py
```

## Cómo verlo

El sitio carga `curriculum.json` y `open-data/*` por `fetch`, así que necesita un
servidor: **no funciona abriendo el archivo con `file://`**.

```bash
python -m http.server 8000
# http://localhost:8000
```

En producción se sirve desde la raíz: Vercel (`outputDirectory: "."`) y GitHub
Pages (`upload-pages-artifact` con `path: .`).

## Regenerar el contenido

Los datos abiertos y el currículum no se editan a mano:

```bash
# en el proyecto edu-open-data
python enrich_portals.py manos-abiertas-2026        # rehace open-data/
python gen_curriculum.py \
  --src  <repo>/data/curriculum.source.json \
  --out  <repo>/curriculum.json
```

## Tests

```bash
python -m pytest tests -q
```

Comprueban que el frontend carga el currículum y el pack, que no quedó el
degradado genérico anterior, que el selector de idioma tiene PT/ES/EN y que
`curriculum.json` y `open-data/` son coherentes.

## Tecnología

- HTML, CSS y JavaScript vanilla. Sin frameworks ni build.
- Única dependencia de red opcional: Google Fonts (Fraunces + IBM Plex Sans), con
  fallback a fuentes del sistema.

## Licencias

- **Contenido educativo:** CC BY-SA 4.0.
- **Código:** MIT (ver `LICENSE`).
- **Datos abiertos:** cada fuente declara su licencia en `open-data/topics.json`.

## Contacto

- Email: belentani7studio@proton.me
- GitHub: [github.com/belentani7](https://github.com/belentani7)

---

**Manos Abiertas: la educación no tiene fronteras.**

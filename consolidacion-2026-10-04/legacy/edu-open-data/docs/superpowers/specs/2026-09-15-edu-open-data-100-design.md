# edu-open-data al 100% — Diseño

**Fecha:** 2026-09-15
**Enfoque aprobado:** 1 (cerrar los 8 portales actuales + ampliar registro)
**Publicación aprobada:** A (Vercel static export; NO se cambia la visibilidad de ningún repo)
**Autor:** opencode (superpowers: brainstorming)

## Problema

Los 8 portales educativos del ecosistema Belentani ya tienen un motor de
enriquecimiento con datos abiertos (`edu-open-data`), pero está a medias:

- Registro: 193 fuentes verificadas de 8 áreas; hay 765 candidatas cosechadas y
  391 vivas en `registry/_intake/approved.json` sin ingresar.
- Portales: 3-4 temas cada uno (finos). Cobertura por categoría con agujeros
  (ciberseguridad 1/8, ux_diseno 1/8, civico_derechos 3/8).
- Enlaces rotos por slug vacío de OpenStax (manosabiertas 8, open-school 9,
  williamschool 16) y Met 429/Unicode (ux-academy). El parser ya está corregido;
  falta re-generar.
- Deploy: 6/8 en vivo. `lingua-aberta` (Vercel sirve bundle JS en la raíz) y
  `aprende-brasil` (sin web) caídos.
- `edu-open-data` no es repositorio git ni está en GitHub: el trabajo local se
  perderá cuando el usuario borre el disco.

## Definición de "100%"

1. **Registro completo:** ingestar las candidatas máquina-legibles con licencia
   de `approved.json` (193 → ~380). Mantener regla: sin API key + licencia.
2. **Cobertura por portal:** cada uno de los 8 portales con ≥6 temas de su
   dominio, todos con datos reales de fuentes verificadas.
3. **0 enlaces rotos** en los 8 portales.
4. **8/8 portales publicados**, sirviendo `open-data/` (y `voces/` cuando exista).
5. **Verificación reproducible:** `pytest`, `verify_sources.py`,
   `coverage_matrix.py`, `probe_deploy.py` en verde.
6. **Persistencia:** todo en git (repo nuevo `edu-open-data` en GitHub).

## No objetivos

- NO hacer públicos repos privados (decisión del usuario: vía A).
- NO crear portales nuevos para `patrimonio_arte`/`ciencia_salud`/`datos_pais`
  (enfoque 1). Sus fuentes sí entran al registro.
- NO tocar la visibilidad ni el contenido de marca de los repos educativos más
  allá del pack `open-data/` y la config de deploy.

## Arquitectura

```
registry/_intake/approved.json ──patch_registry.py──▶ registry/<area>.json
                                                          │
                                          verify_sources.py│ (marca meta.json)
                                                          ▼
                                                    sources.json (generado)
                                                          │
                     PORTALS (temas+fetchers) enrich_portals.py
                                                          ▼
                                     portals/<portal>/{topics.json,index.html,data/*.json}
                                                          │
                          coverage_matrix.py ◀────────────┤
                                                          │
                             publish_packs.py ────────────▶ <repo>/open-data/ + public/
                             publish_pages_branch.py ─────▶ rama gh-pages
                                                          │
                                          probe_deploy.py │ (marca estricta)
                                                          ▼
                                                    web pública 8/8
```

- **Fuente de verdad:** `registry/` (no `sources.json`, que es artefacto).
- **Idempotencia:** todos los scripts son re-ejecutables; `enrich_portals.py`
  acepta un portal concreto (`python enrich_portals.py ux-academy`).
- **Sin dependencias externas:** stdlib de Python 3.11; solo `pytest` para tests.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| APIs caídas o rate-limited al re-enriquecer (Tatoeba 500, Met 429, arXiv 429) | Los fetchers ya degradan a `ok:false`; el portal se genera con el resto. Reintento con backoff. |
| Vercel del repo privado no acepta deploy sin login | Usar token Vercel existente o publicar el pack estático en rama `gh-pages` de un repo público alternativo. Fallback: dejar el pack en `open-data/` y documentar. |
| Slug OpenStax vuelve a vaciarse | Test `test_openstax_url_tiene_slug_real` ya cubre; corre en el gate. |
| Pérdida del trabajo local | Repo git + push a GitHub como primer entregable verificable. |
| Sesión de agente larga y cara | Delegar trabajo pequeño a modelos gratis (OpenRouter/opencode zen) vía CLI. |

## Verificación

- `python -m pytest tests -q` → PASS.
- `python verify_sources.py --json` → ≥95% fuentes `ok`.
- `python coverage_matrix.py` → 0 "temas sin ancla", 0 enlaces rotos.
- `python probe_deploy.py --json` → 8/8 `web:true`, `open_data:true`.
- `gh repo view belentani7/edu-open-data` → existe y sincronizado.

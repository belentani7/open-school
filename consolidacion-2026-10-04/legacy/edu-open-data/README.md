# edu-open-data

Motor de enriquecimiento con **datos abiertos** para los 8 portales educativos
del ecosistema Belentani. Construye packs de contenido (JSON + HTML
autocontenido) a partir de APIs públicas sin API key y con licencia
determinada, y los publica dentro de cada repositorio educativo.

## Portales

| Portal | Dominio | Repo |
|---|---|---|
| aprende-brasil | Educação PT-BR e cidadania | belentani7/aprende-brasil |
| lingua-aberta | Idiomas (PT > ES > EN > CA) | belentani7/lingua-aberta |
| linguaforge | Idiomas (motor de práctica) | belentani7/linguaforge |
| manosabiertas | Integración, derechos y trámites | belentani7/ManosAbiertas |
| open-school | Instituto digital (ESO/bachillerato) | belentani7/open-school |
| secure-t-university | Ciberseguridad y trust & safety | belentani7/secure-t-university |
| ux-academy | UX, producto y diseño | belentani7/ux-academy-professional-program |
| williamschool | ESO, tutoría cultural y refuerzo | belentani7/WILLIAMSCHOOL |

## Pipeline

```
registry/_intake/approved.json ──patch_registry.py──▶ registry/<area>.json
                                          verify_sources.py│
                                                          ▼
                                                    sources.json (generado)
                                                          │
                                       enrich_portals.py  ▼
                                     portals/<portal>/{topics.json,index.html,data/*.json}
                                                          │
                          coverage_matrix.py ◀────────────┤
                             publish_packs.py ────────────▶ <repo>/open-data/ + public/
                                          probe_deploy.py │
                                                          ▼
                                                    web pública
```

Orden de idiomas fijo: **PT > ES > EN > CA**.

## Uso

```bash
python patch_registry.py          # ingesta del intake verificado
python verify_sources.py --json   # verificación en vivo del registro
python enrich_portals.py          # (re)genera los 8 packs
python coverage_matrix.py --probe # cobertura y enlaces
python publish_packs.py --apply   # publica en los repos
python probe_deploy.py --json     # comprueba el deploy real
python -m pytest tests -q         # tests
```

Sin dependencias externas salvo `pytest` (Python 3.11, stdlib).

## Licencias

Cada fuente del registro declara su licencia; los packs incluyen manifiesto de
atribución. Solo se ingieren fuentes con endpoint accesible sin credenciales y
licencia determinada para redistribución.

## Estado (2026-09-15)

- Registro: **198 fuentes** verificadas en 8 áreas.
- Portales: **11/11 con web pública y `open-data/` servido** (6-7 temas cada uno).
- Enlaces rotos: **0**.
- Detalle de despliegue y cambios: [`SIN-WEB.txt`](SIN-WEB.txt) y
  [`cobertura.md`](cobertura.md).

---

## Parte del indice educativo

Esta plataforma forma parte del conjunto educativo de **Belentani / NOIACORE**:
formacion gratuita y abierta. El indice completo, con material y estado de cada una,
vive en el nodo central:

**<https://github.com/belentani7/open-school/blob/main/INDICE-EDUCATIVO.md>**

| Plataforma | Que ensena | Enlace |
|---|---|---|
| Open School | Instituto digital universal | https://open-school-gamma.vercel.app |
| ManosAbiertas | IA y ofimatica para recien llegados | https://belentani7.github.io/ManosAbiertas/ |
| WILLIAMSCHOOL | Escuela comunitaria (curriculo Nepal) | https://williamschool.vercel.app |
| UX Academy | Diseno UX/Producto, trilingue | https://ux-academy-professional.vercel.app |
| Aprende Brasil | Educacion para Brasil | https://aprende-brasil.vercel.app/ |
| Lingua Aberta | Idiomas, progresion CEFR | https://belentani7.github.io/lingua-aberta-empresa/ |
| Cruzando el Charco | Acogida y arraigo | https://belentani7.github.io/Cruzando-el-charco/ |
| secure-t | Ciberseguridad e IA | https://belentani7.github.io/secure-t/ |

**PT > ES > EN > CA.** Gratuito, accesible (WCAG) y conectado.

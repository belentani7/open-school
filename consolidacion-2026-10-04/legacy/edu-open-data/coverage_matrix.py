"""Mide el ALCANCE real de cada portal: que categorias de informacion cubre,
que temas tienen seccion navegable y cuantos enlaces llegan de verdad.

Salidas:
  - cobertura.md      matriz portal x categoria, legible
  - coverage_report.json  detalle maquina

Uso:
    python coverage_matrix.py             # sin red (analisis del HTML local)
    python coverage_matrix.py --probe     # ademas comprueba los enlaces (1 por fuente)
"""

from __future__ import annotations

import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).parent
PORTALS = ROOT / "portals"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) belentani7-coverage"

SECTION_RX = re.compile(r"<section id='([^']+)'", re.I)
NAV_RX = re.compile(r"<nav>(.*?)</nav>", re.S | re.I)
NAV_A_RX = re.compile(r"href='#([^']+)'")
LINK_RX = re.compile(r"<a href='([^']+)'[^>]*>(.*?)</a>", re.S | re.I)
H3_RX = re.compile(r"<h3>([^<]+)</h3>")
ROTO_RX = re.compile(r"/(None|undefined|null)($|[?'#])|=\s*None|/None$", re.I)


def areas_de_fuentes() -> dict[str, str]:
    """nombre normalizado de fuente -> area del registro."""
    reg = json.loads((ROOT / "sources.json").read_text(encoding="utf-8"))
    mapa: dict[str, str] = {}
    for area, entradas in reg.items():
        if area in ("meta",) or not isinstance(entradas, list):
            continue
        for e in entradas:
            nombre = str(e.get("name", "")).lower()
            corto = re.split(r"[(\[]", nombre)[0].strip()
            mapa[corto] = area
            mapa[nombre] = area
            mapa[str(e.get("id", "")).lower()] = area
    return mapa


def area_de(fuente: str, mapa: dict[str, str]) -> str:
    f = fuente.lower().strip()
    if f in mapa:
        return mapa[f]
    for clave, area in mapa.items():
        if clave and (clave in f or f in clave):
            return area
    # alias conocidos que el registro nombra distinto
    alias = {
        "openstax": "academico",
        "open library": "academico",
        "arxiv": "academico",
        "world bank": "civico_derechos",
        "eurostat": "civico_derechos",
        "cisa": "ciberseguridad",
        "nvd": "ciberseguridad",
        "mitre": "ciberseguridad",
        "unhcr": "civico_derechos",
        "ibge": "civico_derechos",
        "wikidata": "idiomas",
        "wikipedia": "idiomas",
        "tatoeba": "idiomas",
        "openverse": "idiomas",
        "iconify": "ux_diseno",
        "lucide": "ux_diseno",
        "met museum": "ux_diseno",
        "librevox": "idiomas",
        "librivox": "idiomas",
        "openalex": "academico",
        "crossref": "academico",
        "gutenberg": "idiomas",
        "internet archive": "academico",
        "unesco": "academico",
        "tailwind": "ux_diseno",
        "material tokens": "ux_diseno",
        "open color": "ux_diseno",
        "smk": "ux_diseno",
        "cwe": "ciberseguridad",
        "epss": "ciberseguridad",
        "urlhaus": "ciberseguridad",
        "owasp": "ciberseguridad",
        "datos.gob.es": "civico_derechos",
        "eu open data": "civico_derechos",
        "camara": "civico_derechos",
        "wikiversity": "idiomas",
        "wiktionary": "idiomas",
        "freedict": "idiomas",
        "wikisource": "idiomas",
        "viccionari": "idiomas",
        "wikibooks": "academico",
        "wikilibros": "academico",
        "wikiversidad": "academico",
        "github advisories": "ciberseguridad",
        "pubmed": "academico",
        "gbif": "academico",
        "rest countries": "civico_derechos",
        "google fonts": "ux_diseno",
        "art institute": "ux_diseno",
        "mediawiki": "academico",
    }
    for clave, area in alias.items():
        if clave in f:
            return area
    return f"desconocida:{fuente}"


def analiza(portal: Path) -> dict:
    html = (portal / "index.html").read_text(encoding="utf-8")
    temas_json = json.loads((portal / "topics.json").read_text(encoding="utf-8"))
    secciones = SECTION_RX.findall(html)
    nav = NAV_RX.search(html)
    anclas_nav = NAV_A_RX.findall(nav.group(1)) if nav else []
    enlaces = LINK_RX.findall(html)
    return {
        "secciones": secciones,
        "anclas_nav": anclas_nav,
        "enlaces": [(u, t.strip()[:60]) for u, t in enlaces if not u.startswith("#")],
        "temas_json": temas_json,
        "html": html,
    }


def probe(url: str) -> tuple[bool, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20, context=CTX) as r:
            return 200 <= r.status < 400, f"HTTP {r.status}"
    except urllib.error.HTTPError as exc:
        return False, f"HTTP {exc.code}"
    except Exception as exc:  # noqa: BLE001
        return False, f"{type(exc).__name__}"


def main() -> int:
    mapa = areas_de_fuentes()
    con_probe = "--probe" in sys.argv

    informe: dict[str, dict] = {}
    cats: Counter = Counter()
    por_categoria: defaultdict[str, list[str]] = defaultdict(list)

    for portal in sorted(PORTALS.iterdir()):
        if not (portal / "topics.json").exists():
            continue
        d = analiza(portal)
        tjson = d["temas_json"]

        temas = [t["tema"] for t in tjson.get("temas", [])]
        sin_seccion = [t for t in temas if t not in d["secciones"]]
        sin_ancla_nav = [t for t in temas if t not in d["anclas_nav"]]

        fuentes = tjson.get("fuentes", [])
        areas: defaultdict[str, list[str]] = defaultdict(list)
        for f in fuentes:
            areas[area_de(f.get("fuente", ""), mapa)].append(f.get("fuente", "?"))

        rotos = [u for u, _ in d["enlaces"] if ROTO_RX.search(u)]
        probe_ok = probe_ko = 0
        detalle_probe: list[str] = []
        if con_probe:
            vistos: set[str] = set()
            for u, _ in d["enlaces"]:
                host = re.match(r"https?://([^/]+)", u)
                host = host.group(1) if host else u
                if host in vistos:
                    continue
                vistos.add(host)
                ok, nota = probe(u)
                if ok:
                    probe_ok += 1
                else:
                    probe_ko += 1
                    detalle_probe.append(f"{host} {nota}")

        informe[portal.name] = {
            "repo": tjson.get("repo"),
            "dominio": tjson.get("dominio"),
            "categorias": sorted(areas),
            "fuentes_por_categoria": {k: sorted(set(v)) for k, v in areas.items()},
            "temas": temas,
            "secciones": d["secciones"],
            "temas_sin_seccion": sin_seccion,
            "temas_sin_ancla_nav": sin_ancla_nav,
            "enlaces_totales": len(d["enlaces"]),
            "enlaces_rotos": rotos[:20],
            "probe_ok": probe_ok,
            "probe_ko": probe_ko,
            "probe_fallos": detalle_probe[:20],
        }
        for c in areas:
            cats[c] += 1
            por_categoria[c].append(portal.name)

    todas = sorted(cats)
    lineas = [
        "# Alcance de informacion por portal y categoria",
        "",
        "Categorias del registro (`sources.json`): " + ", ".join(f"`{c}`" for c in todas),
        "",
        "| Portal | " + " | ".join(todas) + " | temas | secciones | temas sin ancla | enlaces | rotos |",
        "|" + "---|" * (len(todas) + 6),
    ]
    for portal, d in informe.items():
        fila = []
        for c in todas:
            fila.append("SI" if c in d["categorias"] else "-")
        lineas.append(
            f"| {portal} | " + " | ".join(fila)
            + f" | {len(d['temas'])} | {len(d['secciones'])} | {len(d['temas_sin_ancla_nav'])} |"
            + f" {d['enlaces_totales']} | {len(d['enlaces_rotos'])} |"
        )

    lineas += ["", "## Categorias que ningun portal publica", ""]
    huerfanas = [c for c in todas if cats[c] < len(informe)]
    lineas.append(", ".join(f"`{c}` ({cats[c]}/{len(informe)} portales)" for c in sorted(huerfanas, key=lambda c: cats[c])) or "ninguna")

    lineas += ["", "## Fallos concretos", ""]
    for portal, d in informe.items():
        avisos = []
        if d["temas_sin_seccion"]:
            avisos.append(f"temas sin `<section>`: {', '.join(d['temas_sin_seccion'])}")
        if d["temas_sin_ancla_nav"]:
            avisos.append(f"temas sin ancla en `<nav>`: {', '.join(d['temas_sin_ancla_nav'])}")
        if d["enlaces_rotos"]:
            avisos.append(f"enlaces con slug vacio (`None`): {len(d['enlaces_rotos'])}")
        if d["probe_fallos"]:
            avisos.append(f"hosts sin respuesta: {', '.join(d['probe_fallos'][:6])}")
        if avisos:
            lineas.append(f"- **{portal}**: " + " · ".join(avisos))

    (ROOT / "cobertura.md").write_text("\n".join(lineas) + "\n", encoding="utf-8")
    (ROOT / "coverage_report.json").write_text(
        json.dumps(informe, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("\n".join(lineas))
    print("\n-> cobertura.md  coverage_report.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Verifica el registro tras la ingesta: integridad, procedencia y forma."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

E = Path(r"C:\Users\USER\edu-open-data")
R = E / "registry"
AREAS = ["idiomas", "academico", "civico_derechos", "ciberseguridad",
         "ux_diseno", "patrimonio_arte", "ciencia_salud", "datos_pais"]
ORIGINAL = {
    "openalex", "crossref", "arxiv", "epss", "openlibrary", "openstax",
    "wiktionary_es", "eurostat", "gutenberg_direct", "librivox",
    "ibge_br", "camara_br", "freedict_en", "datos_gob_es", "eu_publications",
}


def load(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def main() -> int:
    reg = {a: load(R / f"{a}.json") for a in AREAS}
    merged = load(R / "_merged.json")
    index = load(R / "index.json")
    sources = load(E / "sources.json")

    total = sum(len(v) for v in reg.values())
    ids = [e["id"] for a in AREAS for e in reg[a]]

    print("=" * 70)
    print("1. INTEGRIDAD")
    print("=" * 70)
    print(f"  total entradas        : {total}")
    print(f"  ids unicos            : {len(set(ids))}")
    print(f"  index.json count      : {index['count']}")
    print(f"  sources.json total    : {sum(len(v) for k, v in sources.items() if isinstance(v, list))}")
    print(f"  _merged total         : {sum(len(v) for k, v in merged.items() if isinstance(v, list))}")
    print(f"  coinsiden los 4       : {len(set(ids)) == index['count'] == sum(len(v) for k, v in sources.items() if isinstance(v, list)) == sum(len(v) for k, v in merged.items() if isinstance(v, list))}")

    print()
    print("=" * 70)
    print("2. NADA PERDIDO: las 36 originales siguen?")
    print("=" * 70)
    present = ORIGINAL & set(ids)
    print(f"  de la muestra original ({len(ORIGINAL)}): presentes {len(present)}")
    print(f"  ausentes: {sorted(ORIGINAL - set(ids)) or 'ninguna'}")
    print(f"  arxiv conservado (timeout, no definitivo): {'arxiv' in ids}")

    print()
    print("=" * 70)
    print("3. FORMA: ningun campo obligatorio vacio")
    print("=" * 70)
    req = ["id", "name", "url", "kind", "license", "use", "topics", "area",
           "auth", "country", "region", "langs", "quality", "ttl_h"]
    bad = []
    for a in AREAS:
        for e in reg[a]:
            for k in req:
                if e.get(k) in (None, "", []):
                    bad.append(f"{e['id']}.{k}")
            if e.get("area") != a:
                bad.append(f"{e['id']}.area_desalineada")
            if e.get("auth") != "none":
                bad.append(f"{e['id']}.auth_no_none")
    print(f"  campos vacios o violaciones: {len(bad)} {bad[:8]}")

    print()
    print("=" * 70)
    print("4. COMPOSICION")
    print("=" * 70)
    print("  por kind   :", dict(Counter(e.get("kind") for a in AREAS for e in reg[a])))
    print("  por quality:", dict(Counter(e.get("quality") for a in AREAS for e in reg[a])))
    print("  top licencias:")
    for k, n in Counter(e.get("license") for a in AREAS for e in reg[a]).most_common(8):
        print(f"    {str(k):<22} {n}")
    print("  con parser definido:", sum(1 for a in AREAS for e in reg[a] if e.get("parser")))
    print("  con probe.status  :", sum(1 for a in AREAS for e in reg[a] if (e.get("probe") or {}).get("status")))

    print()
    print("=" * 70)
    print("5. MUESTRA (2 por area, 4 areas)")
    print("=" * 70)
    for a in ("academico", "ciencia_salud", "idiomas", "patrimonio_arte"):
        print(f"  --- {a} ---")
        for e in reg[a][:2]:
            print(f"    id      : {e['id']}")
            print(f"    name    : {e['name'][:70]}")
            print(f"    url     : {e['url'][:78]}")
            print(f"    license : {e.get('license')}   kind={e.get('kind')}  quality={e.get('quality')}")
            print(f"    use     : {str(e.get('use'))[:78]}")
            print(f"    topics  : {e.get('topics')}")
            print(f"    probe   : status={(e.get('probe') or {}).get('status')} ms={(e.get('probe') or {}).get('ms')} records={(e.get('probe') or {}).get('records')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

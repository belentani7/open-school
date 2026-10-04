"""Busca de donde derivar license/use/topics para las 391 aprobadas.

Cruza approved.json con raw_catalogs.json y approved_candidates.json por id y
por url para ver si la licencia existe en alguna fase anterior del intake.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

E = Path(r"C:\Users\USER\edu-open-data")
I = E / "registry" / "_intake"


def load(name):
    return json.loads((I / name).read_text(encoding="utf-8"))


def keys_of(items, label):
    print(f"\n--- {label} ---")
    if isinstance(items, dict):
        print(f"  claves raiz: {list(items)}")
        for k, v in items.items():
            if isinstance(v, list) and v:
                items = v
                print(f"  usando lista '{k}' ({len(v)})")
                break
        else:
            return
    if not isinstance(items, list) or not items:
        print("  (vacia)")
        return
    first = items[0]
    print(f"  {len(items)} elementos")
    for k, v in first.items():
        print(f"    {k:<16}: {type(v).__name__:<6} = {repr(v)[:70]}")
    freq = Counter()
    for it in items:
        if isinstance(it, dict):
            freq.update(it.keys())
    withlic = sum(1 for it in items if isinstance(it, dict) and it.get("license"))
    print(f"  con 'license' no vacia: {withlic} / {len(items)}")
    print(f"  claves presentes: {dict(freq)}")


def main() -> int:
    app = load("approved.json")
    keys_of(load("raw_catalogs.json"), "raw_catalogs.json")
    keys_of(load("approved_candidates.json"), "approved_candidates.json")
    keys_of(load("raw_public_apis.json"), "raw_public_apis.json")

    print()
    print("=" * 70)
    print("VACIO DE LICENCIA EN approved.json")
    print("=" * 70)
    ents = app["entries"]
    print("  aprobadas sin 'license':", sum(1 for e in ents if not e.get("license")))
    print("  aprobadas sin 'use'    :", sum(1 for e in ents if not e.get("use")))
    print("  aprobadas sin 'topics' :", sum(1 for e in ents if not e.get("topics")))
    print("  aprobadas sin 'area'   :", sum(1 for e in ents if not e.get("area")))

    print()
    print("=" * 70)
    print("AREAS de las aprobadas")
    print("=" * 70)
    print(" ", dict(Counter(e.get("area") for e in ents)))
    print("  kinds:", dict(Counter(e.get("kind") for e in ents)))
    print("  quality:", dict(Counter(e.get("quality") for e in ents)))
    print("  portal_only:", dict(Counter(e.get("portal_only") for e in ents)))
    print("  tls_insecure_observed:", dict(Counter(e.get("tls_insecure_observed") for e in ents)))
    print("  source:", dict(Counter(e.get("source") for e in ents)))

    print()
    print("=" * 70)
    print("MUESTRA de sin_clasificar (10)")
    print("=" * 70)
    n = 0
    for e in ents:
        if e.get("area") == "sin_clasificar":
            print(f"  {e['id']:<28} {e.get('kind',''):<6} {e['name'][:44]}")
            n += 1
            if n >= 10:
                break

    print()
    print("=" * 70)
    print("MUESTRA de aprobadas machine (5) con evidencia")
    print("=" * 70)
    for e in ents[:5]:
        print(f"  {e['id']:<24} area={e.get('area'):<16} kind={e.get('kind'):<6} "
              f"quality={e.get('quality')} portal_only={e.get('portal_only')}")
        print(f"      url={e['url'][:88]}")
        print(f"      evidence={json.dumps(e.get('evidence'), ensure_ascii=False)[:110]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

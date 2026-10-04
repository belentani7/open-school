"""Esquema exacto de las entradas: intake vs registro, y solape de ids."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

E = Path(r"C:\Users\USER\edu-open-data")


def load(rel):
    return json.loads((E / rel).read_text(encoding="utf-8"))


def main() -> int:
    app = load("registry/_intake/approved.json")
    rej = load("registry/_intake/rejections.json")
    stats = load("registry/_intake/_stats.json")

    print("=" * 70)
    print("APPROVED.entries[0]")
    print("=" * 70)
    e = app["entries"][0]
    for k, v in e.items():
        print(f"  {k:<14}: {type(v).__name__:<6} = {repr(v)[:80]}")

    print()
    print("  by_area:", json.dumps(app["by_area"], ensure_ascii=False))
    print("  entradas:", len(app["entries"]), " machine:", app["machine"])

    areas_app = Counter(x.get("area", "SIN_AREA") for x in app["entries"])
    print("  area en entries:", dict(areas_app))

    print()
    print("=" * 70)
    print("REJECTIONS.entries[0]")
    print("=" * 70)
    r = rej["entries"][0]
    for k, v in r.items():
        print(f"  {k:<14}: {type(v).__name__:<6} = {repr(v)[:80]}")

    print()
    print("=" * 70)
    print("STATS")
    print("=" * 70)
    for k, v in stats.items():
        print(f"  {k}: {json.dumps(v, ensure_ascii=False)[:220]}")

    print()
    print("=" * 70)
    print("REGISTRO actuaL por area y esquema de entrada")
    print("=" * 70)
    merged = load("registry/_merged.json")
    reg_ids: set[str] = set()
    allkeys: Counter = Counter()
    for area, items in merged.items():
        if area == "meta" or not isinstance(items, list):
            continue
        print(f"  {area:<20} : {len(items)}")
        for it in items:
            reg_ids.add(it["id"])
            allkeys.update(it.keys())
    print(f"  TOTAL ids en registro: {len(reg_ids)}")

    app_ids = {x["id"] for x in app["entries"]}
    rej_ids = {x["id"] for x in rej["entries"]}

    print()
    print("  claves de entrada de registro (frecuencia):")
    for k, n in allkeys.most_common():
        print(f"    {k:<14} {n}")

    print()
    print("=" * 70)
    print("SOLAPE")
    print("=" * 70)
    print(f"  ids aprobados          : {len(app_ids)}")
    print(f"  ids rechazados         : {len(rej_ids)}")
    print(f"  ids en registro actual : {len(reg_ids)}")
    print(f"  aprobados YA en registro : {len(app_ids & reg_ids)}  -> {sorted(app_ids & reg_ids)[:12]}")
    print(f"  aprobados NUEVOS         : {len(app_ids - reg_ids)}")
    print(f"  rechazados presentes en registro (a DROPear): {len(rej_ids & reg_ids)} -> {sorted(rej_ids & reg_ids)[:12]}")
    print(f"  ids en ambos lados (aprobado Y rechazado): {len(app_ids & rej_ids)} -> {sorted(app_ids & rej_ids)[:12]}")

    print()
    print("  claves de un aprobado que NO estan en el registro:")
    print("   ", sorted(set(e) - set(allkeys)))
    print("  claves del registro que NO estan en un aprobado:")
    print("   ", sorted(set(allkeys) - set(e)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

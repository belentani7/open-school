"""Distribucion de licencia y campos entre las 391 aprobadas, via candidates."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

E = Path(r"C:\Users\USER\edu-open-data")
I = E / "registry" / "_intake"


def load(p):
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    app = load(I / "approved.json")
    cand = load(I / "approved_candidates.json")["entries"]
    raw = load(I / "raw_catalogs.json")["entries"]

    cby = {c["id"]: c for c in cand}
    rby = {r["id"]: r for r in raw}

    print("candidates:", len(cby), " raw_catalogs:", len(rby), " aprobadas:", len(app["entries"]))

    print()
    print("=== cobertura del join por id ===")
    hit_c = sum(1 for e in app["entries"] if e["id"] in cby)
    hit_r = sum(1 for e in app["entries"] if e["id"] in rby)
    print(f"  aprobadas con ficha en candidates : {hit_c} / {len(app['entries'])}")
    print(f"  aprobadas con ficha en raw_catalogs: {hit_r} / {len(app['entries'])}")
    faltan = [e["id"] for e in app["entries"] if e["id"] not in cby]
    print(f"  SIN ficha en candidates: {len(faltan)} -> {faltan[:10]}")

    print()
    print("=== licencia de las aprobadas (via candidates) ===")
    lic = Counter()
    for e in app["entries"]:
        c = cby.get(e["id"])
        lic[(c or {}).get("license") or "SIN_FICHA"] += 1
    for k, v in lic.most_common():
        print(f"  {str(k):<22} {v}")

    print()
    print("=== licencia declarada vs desconocida, por portal_only ===")
    for po in (False, True):
        sub = [e for e in app["entries"] if e.get("portal_only") == po]
        known = sum(1 for e in sub if (cby.get(e["id"]) or {}).get("license") not in (None, "unknown", "mixed"))
        print(f"  portal_only={str(po):<5} total={len(sub):<4} licencia conocida={known:<4} desconocida/mixta={len(sub) - known}")

    print()
    print("=== parser disponible (util para parsers.html) ===")
    n_parser = sum(1 for e in app["entries"] if (cby.get(e["id"]) or {}).get("parser") or (rby.get(e["id"]) or {}).get("parser"))
    print(f"  aprobadas con parser definido: {n_parser} / {len(app['entries'])}")

    print()
    print("=== muestras de area academico e idiomas (machine) ===")
    for area in ("academico", "idiomas"):
        print(f"  --- {area} ---")
        n = 0
        for e in app["entries"]:
            if e.get("area") != area or e.get("portal_only"):
                continue
            c = cby.get(e["id"]) or {}
            print(f"    {e['id']:<26} lic={str(c.get('license'))[:14]:<14} kind={e.get('kind'):<5} "
                  f"topics={','.join((c.get('topics') or [])[:3])[:34]}")
            n += 1
            if n >= 6:
                break
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

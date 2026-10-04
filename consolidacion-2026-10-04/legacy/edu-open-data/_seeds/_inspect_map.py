import io, json, os
ROOT = r"C:\Users\USER\edu-open-data"
INTAKE = os.path.join(ROOT, "registry", "_intake")

m = json.load(io.open(os.path.join(ROOT, "registry", "_merged.json"), encoding="utf-8"))
print("_merged type:", type(m).__name__)
if isinstance(m, dict):
    print("keys:", list(m.keys())[:8])
    for k, v in m.items():
        if isinstance(v, list):
            print("list key", k, "len", len(v))
            print("  sample:", json.dumps(v[0], ensure_ascii=False)[:300] if v else "empty")
            break
else:
    print("len", len(m), "sample:", json.dumps(m[0], ensure_ascii=False)[:300])

c = json.load(io.open(os.path.join(INTAKE, "approved_candidates.json"), encoding="utf-8"))["entries"]
print("\n--- civico_derechos sample ---")
for r in [x for x in c if x["area"] == "civico_derechos"][:15]:
    print(" ", r["id"][:34].ljust(34), (r.get("categoria_public_apis") or "seed")[:18].ljust(18), r["name"][:44])
print("\n--- academico sample ---")
for r in [x for x in c if x["area"] == "academico"][:12]:
    print(" ", r["id"][:34].ljust(34), (r.get("categoria_public_apis") or "seed")[:18].ljust(18), r["name"][:44])
print("\n--- sin_clasificar sample ---")
for r in [x for x in c if x["area"] == "sin_clasificar"][:20]:
    print(" ", r["id"][:34].ljust(34), (r.get("categoria_public_apis") or "seed")[:18].ljust(18), r["name"][:44])
print("\nsin_clasificar por categoria:")
import collections
print(collections.Counter((x.get("categoria_public_apis") or "seed") for x in c if x["area"] == "sin_clasificar").most_common())

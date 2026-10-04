"""M1.2 - Expande _seeds/catalogs.json (semilla curada, prioridad escuelas) a candidatas.

Anadir una fuente = anadir un objeto en _seeds/catalogs.json. Nada mas.

Salida: registry/_intake/raw_catalogs.json
"""
import io
import json
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
SEEDS = os.path.join(ROOT, "_seeds", "catalogs.json")
INTAKE = os.path.join(ROOT, "registry", "_intake")

EXT_KIND = [(".xml", "xml"), (".csv", "csv"), (".json", "json"),
            (".txt", "text"), (".dat", "text"), (".png", "image"),
            (".jpg", "image"), (".svg", "text")]

# Orden de resolucion de placeholders. PT primero (regla fija).
PLACEHOLDERS = {
    "q": "escola",        # ESCUELAS PRIMERO: la sonda es educativa
    "limit": "3",
    "lang": "pt",
    "iso3": "BRA",
    "doi": "10.1038/nature12373",
    "year": "2024",
}

PH = re.compile(r"\{(?P<k>[a-z0-9_]+)\}")


def guess_kind(url):
    low = url.split("?")[0].lower()
    for ext, kind in EXT_KIND:
        if low.endswith(ext):
            return kind
    return "json"


def resolve(url, defaults):
    """Sustituye {q},{lang},... por valores ASCII-safe para la sonda."""
    def sub(m):
        key = m.group("k")
        return defaults.get(key, PLACEHOLDERS.get(key, "1"))
    return PH.sub(sub, url)


def main():
    with io.open(SEEDS, encoding="utf-8") as fh:
        doc = json.load(fh)
    defaults = doc.get("defaults", {})
    ph_defaults = doc.get("placeholder_defaults", {})
    seeds = doc.get("seeds", [])

    out_rows, ids, stats = [], {}, Counter()
    for s in seeds:
        sid = s["id"]
        if sid in ids:
            stats["descartado_id_duplicado"] += 1
            continue
        ids[sid] = True

        url = s["url"]
        kind = s.get("kind") or guess_kind(url)
        explicit_probe = s.get("probe")
        probe_url = explicit_probe["url"] if explicit_probe else resolve(url, ph_defaults)
        expect = explicit_probe.get("expect") if explicit_probe else kind

        row = {
            "id": sid,
            "name": s["name"],
            "area": s.get("area") or "sin_clasificar",
            "url": url,
            "kind": kind,
            "auth": s.get("auth", defaults.get("auth", "none")),
            "country": s.get("country", defaults.get("country", "global")),
            "region": s.get("region", defaults.get("region", "global")),
            "langs": s.get("langs", defaults.get("langs", ["pt", "es", "en", "ca"])),
            "license": s.get("license", "unknown"),
            "docs_url": s.get("docs"),
            "rate_limit": s.get("rate"),
            "ttl_h": s.get("ttl_h", defaults.get("ttl_h", 168)),
            "tls_insecure": s.get("tls_insecure", defaults.get("tls_insecure", False)),
            "http_only": s.get("http_only", defaults.get("http_only", False)),
            "quality": s.get("quality", defaults.get("quality", "A")),
            "topics": s.get("topics", []),
            "parser": s.get("parser"),
            "source": "catalogs",
            "probe": {"url": probe_url, "expect": expect},
        }
        out_rows.append(row)
        stats["seed_" + row["area"]] += 1

    os.makedirs(INTAKE, exist_ok=True)
    out = os.path.join(INTAKE, "raw_catalogs.json")
    with io.open(out, "w", encoding="utf-8") as fh:
        json.dump({"schema_version": 1, "source": "_seeds/catalogs.json",
                   "total": len(out_rows), "entries": out_rows}, fh,
                  ensure_ascii=False, indent=1)

    by_area = Counter(r["area"] for r in out_rows)
    print("--- harvest_catalogs ---")
    print(f"  seeds leidas      {len(seeds)}")
    print(f"  candidatas        {len(out_rows)}")
    for a, n in by_area.most_common():
        print(f"  {a:20s} {n}")
    if stats["descartado_id_duplicado"]:
        print("  descartado_id_duplicado", stats["descartado_id_duplicado"])
    print("  ->", out)


if __name__ == "__main__":
    sys.exit(main())

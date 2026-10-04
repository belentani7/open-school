"""Loader del registro de fuentes (registry/) — fuente de verdad única.

El registro deja de ser un `sources.json` monolítico y pasa a ser un directorio
dividido por área. `sources.json` se mantiene como artefacto GENERADO para no
romper los scripts existentes (enrich_portals.py, verify_sources.py,
patch_registry.py, coverage_matrix.py).

Uso:
    python registry_loader.py --check     # integridad del registro
    python registry_loader.py --sync      # regenera sources.json desde registry/
    python registry_loader.py --index     # reescribe registry/index.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent
REGISTRY = ROOT / "registry"
SOURCES_JSON = ROOT / "sources.json"
MERGE_PATH = REGISTRY / "_merged.json"
INDEX_PATH = REGISTRY / "index.json"
META_PATH = REGISTRY / "meta.json"

SCHEMA_VERSION = 1
LANGS = ["pt", "es", "en", "ca"]
AREAS = [
    "idiomas",
    "academico",
    "civico_derechos",
    "ciberseguridad",
    "ux_diseno",
    "patrimonio_arte",
    "ciencia_salud",
    "datos_pais",
]

ENTRY_DEFAULTS: dict[str, object] = {
    "auth": "none",
    "country": "global",
    "region": "global",
    "langs": LANGS,
    "license_url": None,
    "docs_url": None,
    "rate_limit": None,
    "ttl_h": 168,
    "tls_insecure": False,
    "http_only": False,
    "quality": "A",
    "parser": None,
    "probe": None,
}

LICENSE_URLS = {
    # identificadores SPDX usados por el intake
    "CC0-1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC-BY-4.0": "https://creativecommons.org/licenses/by/4.0/",
    "CC-BY-SA-4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC-BY-SA-3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC-BY-SA-3.0-IGO": "https://creativecommons.org/licenses/by-sa/3.0/igo/",
    "CC-BY-NC-4.0": "https://creativecommons.org/licenses/by-nc/4.0/",
    "CC-BY-NC-SA-3.0-IGO": "https://creativecommons.org/licenses/by-nc-sa/3.0/igo/",
    "ODbL-1.0": "https://opendatacommons.org/licenses/odbl/1-0/",
    "ODC-BY-1.0": "https://opendatacommons.org/licenses/by/1-0/",
    "PDDL-1.0": "https://opendatacommons.org/licenses/pddl/1-0/",
    "public-domain": "https://creativecommons.org/publicdomain/mark/1.0/",
    "MIT": "https://opensource.org/license/mit",
    "ISC": "https://opensource.org/license/isc-license-txt",
    "Apache-2.0": "https://www.apache.org/licenses/LICENSE-2.0",
    "GPL-2.0": "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html",
    "LGPL-2.1": "https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html",
    "MPL-2.0": "https://www.mozilla.org/MPL/2.0/",
    "OFL-1.1": "https://openfontlicense.org/",
    "Unicode-3.0": "https://www.unicode.org/license.txt",
    "OGL-3.0": "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    # grafias equivalentes ya presentes en el registro historico
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC0 (metadata)": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC-BY 2.0 FR": "https://creativecommons.org/licenses/by/2.0/fr/",
    "CC-BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
    "CC-BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "Public domain": "https://creativecommons.org/publicdomain/mark/1.0/",
}


def _read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, payload) -> None:
    path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def sha256_entry(entry: dict) -> str:
    blob = json.dumps(entry, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()


def normalize(entry: dict, area: str) -> dict:
    out = dict(entry)
    out["area"] = area
    for key, default in ENTRY_DEFAULTS.items():
        out.setdefault(key, list(default) if isinstance(default, list) else default)
    if not out.get("license_url"):
        out["license_url"] = LICENSE_URLS.get(str(out.get("license", "")).strip())
    return out


def load_meta() -> dict:
    if META_PATH.exists():
        return _read_json(META_PATH)
    return {
        "schema_version": SCHEMA_VERSION,
        "purpose": "Registro de fuentes de datos abiertos sin API key para portales educativos Belentani",
        "langs": LANGS,
        "areas": AREAS,
        "verified_at": None,
        "rules": [],
        "fix_log": "",
    }


def load_registry() -> dict[str, list[dict]]:
    registry: dict[str, list[dict]] = {}
    for area in AREAS:
        path = REGISTRY / f"{area}.json"
        registry[area] = _read_json(path) if path.exists() else []
    return registry


def merged(registry: dict[str, list[dict]] | None = None) -> dict:
    registry = registry if registry is not None else load_registry()
    meta = load_meta()
    out: dict = {"meta": meta}
    for area in AREAS:
        out[area] = registry.get(area, [])
    return out


def build_index(registry: dict[str, list[dict]] | None = None) -> dict:
    registry = registry if registry is not None else load_registry()
    entries = {}
    for area in AREAS:
        for entry in registry.get(area, []):
            entries[entry["id"]] = {"area": area, "sha256": sha256_entry(entry)}
    return {
        "generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "schema_version": SCHEMA_VERSION,
        "count": len(entries),
        "entries": entries,
    }


def save_all(registry: dict[str, list[dict]], meta: dict | None = None) -> None:
    REGISTRY.mkdir(parents=True, exist_ok=True)
    _write_json(META_PATH, meta if meta is not None else load_meta())
    for area in AREAS:
        _write_json(REGISTRY / f"{area}.json", registry.get(area, []))
    _write_json(MERGE_PATH, merged(registry))
    _write_json(INDEX_PATH, build_index(registry))


def sync_sources_json() -> Path:
    _write_json(SOURCES_JSON, merged())
    return SOURCES_JSON


def check() -> int:
    registry = load_registry()
    problems: list[str] = []

    ids: list[str] = []
    for area in AREAS:
        for entry in registry.get(area, []):
            ids.append(entry["id"])
            if entry.get("area") != area:
                problems.append(f"{entry['id']}: area={entry.get('area')} en fichero {area}.json")
            missing = [k for k in ENTRY_DEFAULTS if k not in entry]
            if missing:
                problems.append(f"{entry['id']}: faltan campos {missing}")
            if not entry.get("license"):
                problems.append(f"{entry['id']}: sin licencia")
            if "auth" in entry and entry["auth"] != "none":
                problems.append(f"{entry['id']}: auth={entry['auth']} (viola la regla sin credenciales)")

    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        problems.append(f"ids duplicados: {dupes}")

    if MERGE_PATH.exists():
        merged_ids = [
            e["id"]
            for area in AREAS
            for e in _read_json(MERGE_PATH).get(area, [])
        ]
        if sorted(merged_ids) != sorted(ids):
            problems.append("_merged.json desincronizado respecto a registry/")

    total = len(ids)
    print(f"areas: {len(AREAS)}  entradas: {total}  ids unicos: {len(set(ids))}")
    for area in AREAS:
        print(f"  {area:18s} {len(registry.get(area, []))}")
    if problems:
        print(f"\nPROBLEMAS ({len(problems)}):")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("\nOK: registro integro")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Loader del registro de fuentes")
    parser.add_argument("--check", action="store_true", help="verifica integridad")
    parser.add_argument("--sync", action="store_true", help="regenera sources.json")
    parser.add_argument("--index", action="store_true", help="reescribe index.json")
    args = parser.parse_args()

    if args.check:
        return check()
    if args.sync:
        path = sync_sources_json()
        print(f"escrito: {path}")
        return 0
    if args.index:
        _write_json(INDEX_PATH, build_index())
        print(f"escrito: {INDEX_PATH}")
        return 0
    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""M0 — divide el registro monolítico sources.json en registry/ por área.

No destructivo: antes de tocar nada copia el original a _audit/sources.json.bak
y solo entonces regenera sources.json desde el registro (mismo contenido mas los
campos nuevos del esquema).

Uso:
    python registry_split.py            # migra si registry/ no existe
    python registry_split.py --force    # rehace el registro desde sources.json
    python registry_split.py --verify   # comprueba que nada se perdio
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

import registry_loader as rl

ROOT = rl.ROOT
SOURCES = rl.SOURCES_JSON
BACKUP_DIR = ROOT / "_audit"
BACKUP = BACKUP_DIR / "sources.json.bak"


def _entry_core(entry: dict) -> dict:
    return {k: entry[k] for k in ("id", "name", "url", "kind", "license", "use", "topics") if k in entry}


def verify() -> int:
    if not BACKUP.exists():
        print(f"no hay respaldo para verificar: {BACKUP}")
        return 2
    original = json.loads(BACKUP.read_text(encoding="utf-8"))
    produced = rl.merged()

    problems: list[str] = []
    orig_ids: list[str] = []
    for area, value in original.items():
        if not isinstance(value, list):
            continue
        for entry in value:
            orig_ids.append(entry["id"])
            match = next((e for e in produced.get(area, []) if e["id"] == entry["id"]), None)
            if match is None:
                problems.append(f"{entry['id']}: ausente en el area {area}")
                continue
            for key in ("name", "url", "kind", "license", "use", "topics"):
                if key in entry and match.get(key) != entry[key]:
                    problems.append(f"{entry['id']}.{key}: {entry[key]!r} -> {match.get(key)!r}")

    produced_ids = [e["id"] for a in rl.AREAS for e in produced.get(a, [])]
    if sorted(produced_ids) != sorted(orig_ids):
        problems.append(f"conteo distinto: original={len(orig_ids)} producido={len(produced_ids)}")

    print(f"original: {len(orig_ids)} entradas | producido: {len(produced_ids)}")
    if problems:
        print(f"PERDIDAS/CAMBIOS ({len(problems)}):")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("OK: cero perdidas, cero cambios en los campos originales")
    return 0


def migrate(force: bool = False) -> int:
    if rl.REGISTRY.exists() and not force:
        print(f"registry/ ya existe ({rl.REGISTRY}). Usa --force para rehacerlo desde sources.json.")
        return 0
    if not SOURCES.exists():
        print(f"no existe {SOURCES}")
        return 2

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    if not BACKUP.exists():
        shutil.copy2(SOURCES, BACKUP)
        print(f"respaldo: {BACKUP}")

    original = json.loads(SOURCES.read_text(encoding="utf-8"))
    meta_in = original.get("meta", {})
    registry: dict[str, list[dict]] = {area: [] for area in rl.AREAS}

    moved = 0
    for area, value in original.items():
        if not isinstance(value, list):
            continue
        target = area if area in rl.AREAS else "academico"
        for entry in value:
            registry[target].append(rl.normalize(entry, target))
            moved += 1

    meta = {
        "schema_version": rl.SCHEMA_VERSION,
        "purpose": meta_in.get("purpose"),
        "langs": meta_in.get("langs", rl.LANGS),
        "areas": rl.AREAS,
        "verified_at": meta_in.get("verified_at"),
        "rules": meta_in.get("rules", []),
        "fix_log": meta_in.get("fix_log", ""),
        "split_from": "sources.json",
        "split_at": rl.time.strftime("%Y-%m-%dT%H:%M:%SZ", rl.time.gmtime()),
    }

    rl.save_all(registry, meta)
    rl.sync_sources_json()

    print(f"entradas migradas: {moved}")
    for area in rl.AREAS:
        print(f"  {area:18s} {len(registry[area])}")
    print(f"escrito: {rl.REGISTRY}\\  (meta.json, _merged.json, index.json, {len(rl.AREAS)} areas)")
    print(f"regenerado: {SOURCES}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="M0: divide sources.json en registry/")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    if args.verify:
        return verify()
    return migrate(force=args.force)


if __name__ == "__main__":
    raise SystemExit(main())

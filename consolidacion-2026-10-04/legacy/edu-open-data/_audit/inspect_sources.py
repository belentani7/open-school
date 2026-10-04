"""Inspecciona la estructura de sources.json (solo lectura)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(r"C:\Users\USER\edu-open-data")
data = json.loads((ROOT / "sources.json").read_text(encoding="utf-8"))

print("grupos:")
total = 0
entry_keys: set[str] = set()
ids: list[str] = []
for key, value in data.items():
    if isinstance(value, list):
        print(f"  {key:22s} {len(value)}")
        total += len(value)
        for entry in value:
            entry_keys |= set(entry.keys())
            ids.append(entry.get("id", "?"))
    else:
        print(f"  {key:22s} (objeto: {sorted(value.keys()) if isinstance(value, dict) else type(value).__name__})")

print(f"total entries: {total}")
print(f"claves usadas en entradas: {sorted(entry_keys)}")
print(f"ids unicos: {len(set(ids))} / {len(ids)}")
dupes = [i for i in set(ids) if ids.count(i) > 1]
print(f"ids duplicados: {dupes}")

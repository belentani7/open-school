"""Inspecciona la forma de los JSON del intake y del registro actual."""

from __future__ import annotations

import json
from pathlib import Path

E = Path(r"C:\Users\USER\edu-open-data")


def shape(obj, depth=0, maxdepth=3, label="root"):
    pad = "  " * depth
    if isinstance(obj, dict):
        print(f"{pad}{label}: dict con {len(obj)} claves -> {list(obj)[:14]}")
        if depth < maxdepth:
            for k in list(obj)[:3]:
                shape(obj[k], depth + 1, maxdepth, k)
    elif isinstance(obj, list):
        print(f"{pad}{label}: list con {len(obj)} elementos")
        if obj and depth < maxdepth:
            shape(obj[0], depth + 1, maxdepth, "[0]")
    else:
        v = repr(obj)
        print(f"{pad}{label}: {type(obj).__name__} = {v[:90]}")


def load(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    for rel in ("registry/_intake/approved.json",
                "registry/_intake/rejections.json",
                "registry/_intake/_stats.json",
                "registry/academico.json",
                "registry/index.json",
                "registry/meta.json",
                "registry/_merged.json",
                "sources.json"):
        p = E / rel
        if not p.is_file():
            print(f"\n### {rel}: NO EXISTE")
            continue
        print(f"\n### {rel}  ({p.stat().st_size:,} B)")
        try:
            shape(load(p), 1, 3)
        except Exception as exc:  # noqa: BLE001
            print("  ERROR:", exc)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

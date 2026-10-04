"""Tests de integridad del registro de fuentes.

Uso:  python -m pytest tests/test_registry_ingest.py -q
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

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


def test_registro_poblado_tras_ingesta() -> None:
    idx = json.loads((ROOT / "registry" / "index.json").read_text(encoding="utf-8"))
    assert idx["count"] >= 195, f"solo {idx['count']} fuentes"


def test_todas_las_areas_tienen_al_menos_diez_fuentes() -> None:
    for area in AREAS:
        fuentes = json.loads((ROOT / "registry" / f"{area}.json").read_text(encoding="utf-8"))
        assert len(fuentes) >= 10, f"{area} tiene {len(fuentes)} fuentes"


def test_toda_fuente_tiene_area_y_licencia() -> None:
    for area in AREAS:
        path = ROOT / "registry" / f"{area}.json"
        fuentes = json.loads(path.read_text(encoding="utf-8"))
        assert isinstance(fuentes, list), f"{area}.json no es lista"
        for fuente in fuentes:
            assert fuente.get("license"), f"sin licencia: {fuente.get('id')}"

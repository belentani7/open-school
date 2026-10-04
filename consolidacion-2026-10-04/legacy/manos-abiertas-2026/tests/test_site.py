"""Comprueba que el sitio estatico, el curriculum y el pack de datos abiertos
se mantienen coherentes entre si.

Uso:  python -m pytest tests -q
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CURRICULUM = ROOT / "curriculum.json"
OPEN_DATA = ROOT / "open-data"

TEMAS_MINIMOS = 6
# el degradado morado generico que se retiro del frontend
LEGACY_GRADIENT = "667eea"


def test_index_existe() -> None:
    assert INDEX.is_file(), "falta index.html"


def test_index_carga_curriculum_y_datos_abiertos() -> None:
    html = INDEX.read_text(encoding="utf-8")
    assert "curriculum.json" in html, "el frontend no carga curriculum.json"
    assert "open-data/topics.json" in html, "el frontend no carga el pack de datos abiertos"


def test_index_sin_degradado_generico() -> None:
    html = INDEX.read_text(encoding="utf-8")
    assert LEGACY_GRADIENT not in html, f"quedo el degradado generico #{LEGACY_GRADIENT}"


def test_index_tiene_selector_de_idioma_pt_es_en() -> None:
    html = INDEX.read_text(encoding="utf-8")
    for lang in ("pt", "es", "en"):
        assert re.search(rf'data-lang="{lang}"', html), f"falta el idioma {lang} en el selector"


def test_curriculum_estructura() -> None:
    data = json.loads(CURRICULUM.read_text(encoding="utf-8"))
    niveles = data["niveles"]
    assert len(niveles) == 4, f"se esperaban 4 niveles, hay {len(niveles)}"
    modulos = [m for n in niveles for m in n["modulos"]]
    assert len(modulos) == 21, f"se esperaban 21 modulos, hay {len(modulos)}"
    for m in modulos:
        assert m.get("codigo"), f"modulo sin codigo: {m}"
        assert m.get("titulo"), f"modulo sin titulo: {m}"
        assert isinstance(m.get("horas"), int), f"horas invalidas en {m.get('codigo')}"
    assert data["estadistica"]["horas_estimadas"] == sum(m["horas"] for m in modulos)


def test_pack_de_datos_abiertos() -> None:
    topics = json.loads((OPEN_DATA / "topics.json").read_text(encoding="utf-8"))
    temas = topics["temas"]
    assert len(temas) >= TEMAS_MINIMOS, f"solo {len(temas)} temas (min {TEMAS_MINIMOS})"
    for tt in temas:
        assert tt["fuentes_ok"] >= 1, f"{tt['tema']} sin fuentes con datos"
        pack = json.loads((OPEN_DATA / "data" / f"{tt['tema']}.json").read_text(encoding="utf-8"))
        assert pack["registros"], f"{tt['tema']} sin registros"


def test_index_referencia_todos_los_temas_del_pack() -> None:
    """El frontend descubre los temas por topics.json, asi que el pack y el
    manifiesto deben coincidir sin listas duplicadas en el HTML."""
    topics = json.loads((OPEN_DATA / "topics.json").read_text(encoding="utf-8"))
    archivos = {p.name for p in (OPEN_DATA / "data").glob("*.json")}
    esperados = {f"{tt['tema']}.json" for tt in topics["temas"]}
    assert archivos == esperados, f"data/ desalineado con topics.json: {archivos ^ esperados}"

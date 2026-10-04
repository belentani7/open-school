"""Tests de cobertura mínima de los portales.

Uso:  python -m pytest tests/test_portales_cobertura.py -q
"""

from __future__ import annotations

import inspect
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import enrich_portals as ep  # noqa: E402


def test_portales_definidos() -> None:
    esperados = {
        "lingua-aberta",
        "linguaforge",
        "manosabiertas",
        "secure-t-university",
        "ux-academy",
        "open-school",
        "williamschool",
        "aprende-brasil",
        "lingua-aberta-empresa",
        "cruzando-el-charco",
        "secure-t",
        "manos-abiertas-2026",
    }
    assert set(ep.PORTALS) == esperados


def test_cada_portal_tiene_seis_o_mas_temas() -> None:
    for pid, cfg in ep.PORTALS.items():
        assert len(cfg["temas"]) >= 6, f"{pid} tiene {len(cfg['temas'])} temas"


def test_cada_tema_tiene_al_menos_una_fuente() -> None:
    for pid, cfg in ep.PORTALS.items():
        for tema, fuentes in cfg["temas"].items():
            assert fuentes, f"{pid}/{tema} sin fuentes"


def test_todos_los_fetchers_referenciados_estan_implementados() -> None:
    source = inspect.getsource(ep.run_fetcher)
    for pid, cfg in ep.PORTALS.items():
        for tema, fuentes in cfg["temas"].items():
            for _, spec in fuentes:
                name = spec.split(":", 1)[0]
                assert f'name == "{name}"' in source, f"{pid}/{tema}: fetcher no implementado: {name}"


def test_todo_portal_tiene_destino_de_publicacion() -> None:
    import publish_packs as pp  # noqa: PLC0415

    for pid, cfg in ep.PORTALS.items():
        assert cfg["repo"] in pp.DESTINO, f"{pid}: {cfg['repo']} sin DESTINO en publish_packs"

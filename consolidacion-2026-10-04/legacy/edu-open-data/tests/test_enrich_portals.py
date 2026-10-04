"""Tests de los parsers de enrich_portals.py.

Red real, sin mocks: estas fuentes son HTTP por naturaleza y el fallo que se
cubre aqui (slug vacio -> /books/None) solo aparece con el payload de verdad.

Uso:  python -m pytest tests -q
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import enrich_portals as ep  # noqa: E402

# captura el identificador final de /books/<slug>
SLUG_RX = re.compile(r"/books/([^/?#]+)")

VACIOS = {"none", "null", "undefined", "", "nan"}


@pytest.mark.parametrize("tema", ["physics", "biology", "math", "history"])
def test_openstax_url_tiene_slug_real(tema: str) -> None:
    libros = ep.openstax(tema)
    assert libros, f"openstax({tema}) no devolvio libros"
    for libro in libros:
        url = libro.get("url") or ""
        assert url, f"libro sin url: {libro}"
        m = SLUG_RX.search(url)
        assert m, f"url sin patron /books/<slug>: {url}"
        assert m.group(1).lower() not in VACIOS, f"slug vacio en {url}"
        assert libro.get("titulo"), f"libro sin titulo: {libro}"


def test_openstax_titulos_no_vacios() -> None:
    for libro in ep.openstax("physics"):
        assert (libro.get("titulo") or "").strip(), f"titulo vacio: {libro}"

#!/usr/bin/env python3
"""gen_search_index.py — Genera search-index.json para la paleta de búsqueda.

La paleta (assets/js/shell.js) descarga `<raíz>/search-index.json` en su
primera apertura y espera un array de objetos:

    {"title": str, "description": str, "section": str, "href": str}

Fuentes: los índices de sección, las 413 entradas de catalog.json y las
páginas del campus (raíz). La descripción se toma del <meta name="description">
de cada página; el título, de su <title>.

Uso:
  python tools/gen_search_index.py            # escribe search-index.json
  python tools/gen_search_index.py --check    # verifica que esté al día (CI)
  python tools/gen_search_index.py --help
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'search-index.json'

SECTION_LABELS = {
    'rutas': 'Rutas',
    'modulos': 'Módulos',
    'lecciones': 'Lecciones',
    'universal-rutas': 'Rutas universales',
    'universal-modulos': 'Módulos universales',
    'universal-lecciones': 'Lecciones universales',
    'universal-docs': 'Documentación',
}
SECTION_INDEXES = [
    'rutas/index.html',
    'modulos/index.html',
    'lecciones/index.html',
    'universal-rutas/index.html',
    'universal-modulos/index.html',
    'universal-lecciones/index.html',
    'universal-docs/index.html',
]
ROOT_SECTION = 'Campus'
EXCLUDE = {'404.html'}

TITLE_RE = re.compile(r'<title>([^<]+)</title>', re.S)
DESC_RE = re.compile(
    r'<meta name="description" content="([^"]*)"', re.I
)


def read_meta(path: Path) -> tuple[str, str]:
    text = path.read_text(encoding='utf-8')
    t = TITLE_RE.search(text)
    d = DESC_RE.search(text)
    title = re.sub(r'\s+', ' ', t.group(1)).strip() if t else path.stem
    desc = re.sub(r'\s+', ' ', d.group(1)).strip() if d else ''
    return title, desc


def build() -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    seen: set[str] = set()

    def add(rel: str, section: str) -> None:
        if rel in seen:
            return
        path = ROOT / rel
        if not path.is_file():
            raise SystemExit(f'ERROR: falta la página {rel}')
        title, desc = read_meta(path)
        seen.add(rel)
        items.append({
            'title': title,
            'description': desc,
            'section': section,
            'href': rel,
        })

    for rel in SECTION_INDEXES:
        add(rel, SECTION_LABELS[rel.split('/')[0]])

    catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
    for entry in catalog:
        add(entry['url'], SECTION_LABELS[entry['type']])

    for path in sorted(ROOT.glob('*.html')):
        rel = path.name
        if rel in EXCLUDE or rel in seen:
            continue
        add(rel, ROOT_SECTION)

    return items


def main() -> int:
    ap = argparse.ArgumentParser(
        prog='gen_search_index.py',
        description='Genera o verifica search-index.json (índice de la paleta).',
    )
    ap.add_argument(
        '--check', action='store_true',
        help='no escribe: falla (exit 1) si el archivo no está al día',
    )
    args = ap.parse_args()

    items = build()
    payload = json.dumps(items, ensure_ascii=False, indent=0) + '\n'

    if args.check:
        if not OUTPUT.is_file():
            print('ERROR: search-index.json no existe', file=sys.stderr)
            return 1
        current = OUTPUT.read_text(encoding='utf-8')
        if current != payload:
            print(
                'ERROR: search-index.json desactualizado; '
                'ejecuta python tools/gen_search_index.py',
                file=sys.stderr,
            )
            return 1
        print(f'PASS: search-index.json al día ({len(items)} entradas).')
        return 0

    OUTPUT.write_text(payload, encoding='utf-8')
    print(f'PASS: search-index.json escrito con {len(items)} entradas.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

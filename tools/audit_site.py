#!/usr/bin/env python3
"""audit_site.py — Auditoría integral del campus estático Open School.

Comprueba, sobre el árbol completo:

  1. Estructura HTML por página: doctype, <html>/<head>/<body>/<title> únicos,
     un solo <main> sin anidar, <footer> único, artículos y divs balanceados,
     sin <html><body> incrustados y sin anclas sin href.
  2. Codificación: ausencia de mojibake (Ã, â€, Â) y de caracteres de
     reemplazo U+FFFD.
  3. Enlaces y recursos internos resolubles (href/src relative).
  4. Infraestructura de la cáscara: campus.css y shell.js presentes y
     enlazados donde hay botones de búsqueda; cero referencias a assets
     eliminados (bundle React, CSS huérfano, data/, locales/, docs.html…).
  5. Chatarra: metas de generador, rutas locales de Windows, selectores de
     idioma muertos, cabeceras legacy, role="main" duplicado.
  6. search-index.json al día y con cobertura completa de catalog.json.
  7. index.html sin problemas (reutiliza repair_index.problems).
  8. Accesibilidad básica: contraste WCAG AA de la paleta clara declarada
     en el CSS compartido y bloque prefers-reduced-motion presente.

Uso:
  python tools/audit_site.py           # informe + exit 1 si hay errores
  python tools/audit_site.py --quiet   # solo errores
  python tools/audit_site.py --help
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

ERRORS: list[str] = []
WARNINGS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)


def warn(msg: str) -> None:
    WARNINGS.append(msg)


def html_files() -> list[Path]:
    return sorted(
        p for p in ROOT.rglob('*.html') if '.git' not in p.parts
    )


# --------------------------------------------------------------------------- #
# 1. Estructura
# --------------------------------------------------------------------------- #

def check_structure(path: Path, text: str) -> None:
    rel = path.relative_to(ROOT)

    def n(pat: str) -> int:
        return len(re.findall(pat, text))

    if not re.search(r'<!doctype html>', text, re.I):
        err(f'{rel}: sin doctype')
    for label, pat, want in [
        ('html', r'<html[\s>]', 1),
        ('</html>', r'</html>', 1),
        ('head', r'<head[\s>]', 1),
        ('body', r'<body[\s>]', 1),
        ('</body>', r'</body>', 1),
        ('title', r'<title[\s>]', 1),
        ('main', r'<main[\s>]', 1),
        ('</main>', r'</main>', 1),
        ('footer', r'<footer[\s>]', 1),
    ]:
        got = n(pat)
        if got != want:
            err(f'{rel}: {label}={got} (se esperaba {want})')

    art_o = n(r'<article[\s>]')
    art_c = n(r'</article>')
    if art_o != art_c:
        err(f'{rel}: article={art_o}/{art_c}')
    div_o = n(r'<div[\s>]')
    div_c = text.count('</div>')
    if div_o != div_c:
        err(f'{rel}: divs={div_o}/{div_c}')

    # <main> anidado o desequilibrado (recorrido por tokens)
    depth = 0
    max_depth = 0
    for m in re.finditer(r'<main[\s>]|</main>', text):
        if m.group(0).startswith('</'):
            depth -= 1
        else:
            depth += 1
            max_depth = max(max_depth, depth)
    if max_depth > 1 or depth != 0:
        err(f'{rel}: <main> anidado o sin cerrar (profundidad {max_depth})')

    if '<html><body>' in text:
        err(f'{rel}: <html><body> incrustado en el cuerpo')
    if re.search(r'<a\s+(?![^>]*\bhref\b)[^>]*>', text):
        err(f'{rel}: anclas sin href')


# --------------------------------------------------------------------------- #
# 2. Codificación
# --------------------------------------------------------------------------- #

def check_encoding(path: Path, text: str) -> None:
    rel = path.relative_to(ROOT)
    for seq, label in [('Ã', 'mojibake (Ã)'), ('â€', 'mojibake (â€)'),
                       ('Â·', 'mojibake (Â·)'), ('�', 'U+FFFD')]:
        if seq in text:
            err(f'{rel}: {label} x{text.count(seq)}')


# --------------------------------------------------------------------------- #
# 3. Enlaces internos
# --------------------------------------------------------------------------- #

def check_links(path: Path, text: str) -> None:
    rel = path.relative_to(ROOT)
    refs = re.findall(r'(?:href|src)="([^"]+)"', text)
    for ref in refs:
        if ref.startswith(('http://', 'https://', 'mailto:', 'tel:',
                           'javascript:', 'data:', '#')):
            continue
        target = unquote(ref.split('#')[0].split('?')[0])
        if not target:
            continue
        resolved = (path.parent / target).resolve()
        try:
            resolved.relative_to(ROOT)
        except ValueError:
            err(f'{rel}: enlace fuera del repositorio → {ref}')
            continue
        if not resolved.exists():
            err(f'{rel}: recurso inexistente → {ref}')


# --------------------------------------------------------------------------- #
# 4-5. Cáscara y chatarra
# --------------------------------------------------------------------------- #

DEAD_REFS = [
    'index-CkYlgyHh', 'index-lSU0YY1M', 'assets/css/styles',
    'assets/css/variables', 'assets/js/app.js', 'ux-kit', 'ux-enhance',
    'belentani-ui', 'data/manifest', 'navigation-map', 'locales/',
    'docs.html', 'ampliacion.html',
]
CHATTARA = [
    ('name="generator" content="repo-', 'meta generator'),
    ('omega-max', 'meta omega-max'),
    ('WebGL listo', 'texto WebGL listo'),
    ('ecosistema Belentani · WebGL', 'cabecera legacy'),
    ('lang-selector', 'selector de idioma muerto'),
    ('react-root', 'react-root'),
    ('__PLATFORM__', 'config __PLATFORM__'),
    ('.superpowers-badge', 'regla badge'),
    ('role="main"', 'role=main duplicado'),
    ('superpowers-mcp', 'sección MCP'),
]


def check_shell(path: Path, text: str) -> None:
    rel = path.relative_to(ROOT)
    has_tools = 'data-search-open' in text
    has_shell = 'assets/js/shell.js' in text
    has_campus = 'assets/css/campus.css' in text

    if has_tools and not has_shell:
        err(f'{rel}: botones de búsqueda sin shell.js')
    if has_tools and not has_campus:
        err(f'{rel}: botones de búsqueda sin campus.css')
    if has_shell and not has_campus:
        err(f'{rel}: shell.js sin campus.css')
    if re.search(r'C:\\+Users', text):
        err(f'{rel}: ruta local de Windows publicada')

    for needle in DEAD_REFS:
        if needle in text:
            err(f'{rel}: referencia a asset eliminado → {needle}')
    for needle, label in CHATTARA:
        if needle in text:
            err(f'{rel}: chattera residual ({label})')


# --------------------------------------------------------------------------- #
# 6. search-index.json
# --------------------------------------------------------------------------- #

def check_search_index() -> None:
    idx_path = ROOT / 'search-index.json'
    if not idx_path.is_file():
        err('search-index.json ausente')
        return
    try:
        items = json.loads(idx_path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as exc:
        err(f'search-index.json inválido: {exc}')
        return
    if not isinstance(items, list) or not items:
        err('search-index.json vacío')
        return

    hrefs = set()
    for i, it in enumerate(items):
        for key in ('title', 'description', 'section', 'href'):
            if not isinstance(it.get(key), str) or not it[key]:
                err(f'search-index[{i}]: campo {key} inválido')
        href = it.get('href', '')
        if href in hrefs:
            err(f'search-index: href duplicado → {href}')
        hrefs.add(href)
        if not (ROOT / href).is_file():
            err(f'search-index: página inexistente → {href}')

    catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
    missing = [c['url'] for c in catalog if c['url'] not in hrefs]
    if missing:
        err(f'search-index: faltan {len(missing)} entradas de catalog.json')


# --------------------------------------------------------------------------- #
# 7. index.html
# --------------------------------------------------------------------------- #

def check_index() -> None:
    import repair_index

    text = (ROOT / 'index.html').read_text(encoding='utf-8')
    for problem in repair_index.problems(text):
        err(f'index.html: {problem}')


# --------------------------------------------------------------------------- #
# 8. Accesibilidad / CSS
# --------------------------------------------------------------------------- #

def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    h = hex_color.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return (
        0.2126 * srgb_to_linear(r)
        + 0.7152 * srgb_to_linear(g)
        + 0.0722 * srgb_to_linear(b)
    )


def contrast(a: str, b: str) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def check_accessibility() -> None:
    campus = (ROOT / 'assets' / 'css' / 'campus.css').read_text(encoding='utf-8')
    if 'prefers-reduced-motion' not in campus:
        err('campus.css: sin bloque prefers-reduced-motion')

    # Contraste AA de la paleta clara (definida en tools/repair_pages.py)
    import repair_pages

    m = re.search(r':root\[data-theme=light\]\{(.*?)\}', repair_pages.LIGHT_ROOT)
    if not m:
        err('LIGHT_ROOT ilegible')
        return
    vars_ = dict(re.findall(r'(--[\w-]+):(#[0-9a-fA-F]{6})', m.group(1)))
    pairs = [
        ('--ink', '--bg', 4.5, 'texto principal sobre fondo'),
        ('--dim', '--bg', 4.5, 'texto secundario sobre fondo'),
        ('--accent', '--bg', 4.5, 'enlace/acento sobre fondo'),
        ('--accent2', '--bg', 4.5, 'acento 2 sobre fondo'),
        ('--text', '--surface-solid', 4.5, 'texto campus sobre superficie'),
        ('--muted', '--surface-solid', 4.5, 'texto atenuado sobre superficie'),
    ]
    for fg, bg, need, label in pairs:
        if fg not in vars_ or bg not in vars_:
            err(f'LIGHT_ROOT: falta {fg if fg not in vars_ else bg}')
            continue
        ratio = contrast(vars_[fg], vars_[bg])
        if ratio < need:
            err(
                f'contraste claro insuficiente ({label}): '
                f'{ratio:.2f} < {need}'
            )


# --------------------------------------------------------------------------- #

def main() -> int:
    ap = argparse.ArgumentParser(
        prog='audit_site.py',
        description='Auditoría integral del campus estático Open School.',
    )
    ap.add_argument('--quiet', action='store_true', help='solo imprime errores')
    args = ap.parse_args()

    files = html_files()
    for path in files:
        text = path.read_text(encoding='utf-8')
        check_structure(path, text)
        check_encoding(path, text)
        check_links(path, text)
        check_shell(path, text)

    check_search_index()
    check_index()
    check_accessibility()

    if not args.quiet:
        print(f'HTML auditados: {len(files)}')
        print(f'search-index.json: {len(json.loads((ROOT / "search-index.json").read_text(encoding="utf-8")) if (ROOT / "search-index.json").is_file() else [])} entradas')
        print(f'Errores: {len(ERRORS)} · Avisos: {len(WARNINGS)}')
    for msg in ERRORS:
        print(f'ERROR  {msg}', file=sys.stderr)
    for msg in WARNINGS:
        print(f'AVISO  {msg}', file=sys.stderr)
    if ERRORS:
        return 1
    if not args.quiet:
        print('AUDIT PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

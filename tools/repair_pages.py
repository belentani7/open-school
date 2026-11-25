#!/usr/bin/env python3
"""repair_pages.py — Reparación estructural del campus estático Open School.

El sitio fue generado con una plantilla defectuosa que produjo, en las 413
páginas de contenido y sus índices:

  * <main>, <header> y <footer> duplicados o anidados (5 copias en lecciones);
  * <html><body> embebidos en medio del artículo;
  * artículos sin cerrar y role="main" duplicado (dos landmarks principales);
  * cabeceras legacy "ecosistema Belentani · WebGL online" sin estilos;
  * selectores de idioma muertos (sin JavaScript asociado);
  * scripts WebGL sólidos repetidos (434 archivos, hasta 5 veces por página);
  * rutas locales de Windows y metadatos de generador en el HTML publicado.

Esta herramienta reconstruye el <body> de cada página a partir de sus piezas
válidas (skip link, cabecera real, migas, artículo, pie), conserva el contenido
íntegro, y verifica el resultado antes de escribir nada.

Uso:
  python tools/repair_pages.py --check    # informa sin escribir (dry-run)
  python tools/repair_pages.py --apply    # repara y verifica
  python tools/repair_pages.py --apply --only typea
  python tools/repair_pages.py --help
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

GENERATOR_META = re.compile(
    r'[ \t]*<meta name="generator" content="repo-[^"]*">\s*\n?'
)
SUPERPOWERS_META = re.compile(
    r'[ \t]*<meta name="(superpowers|omega-max)"[^>]*>\s*\n?'
)
STYLE_BLOCK = re.compile(r'<style>(?P<css>.*?)</style>', re.S)
MINI_HEADER = re.compile(r'<header class="site">.*?</header>', re.S)
SITE_HEADER = re.compile(r'<header class="site-header">.*?</header>', re.S)
BREADCRUMBS = re.compile(r'<nav class="breadcrumbs".*?</nav>', re.S)
FIRST_SKIP = re.compile(r'<a class="skip[^"]*"[^>]*>.*?</a>', re.S)
FOOTER_SITE = re.compile(r'<footer class="site">.*?</footer>', re.S)
FOOTER_RICH = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)
WEBGL_SCRIPT = re.compile(r'<script>\s*\(function\(\)\s*\{[^<]*webgl-canvas.*?</script>', re.S)
REVEAL_SCRIPT = re.compile(
    r'<script>(?:(?!</script>).)*IntersectionObserver.*?</script>', re.S
)
BRAND_SMALL_TRUNC = 'Instituto digital abierto: rutas, módulos y le</small>'
BRAND_SMALL_FULL = 'Instituto digital abierto: rutas, módulos y lecciones verificables</small>'

# Referencias oficiales cuyo href se perdió en la generación original.
# El texto de cada enlace nombra el destino exacto; las URLs oficiales están
# verificadas (developer.android.com/topic/architecture = "Guide to app
# architecture", indexado por el buscador en la FASE 2).
REF_LINKS = [
    ('developer.android.com — guía oficial', 'https://developer.android.com'),
    ('source.android.com — AOSP', 'https://source.android.com'),
    ('App Architecture guide', 'https://developer.android.com/topic/architecture'),
    ('developer.android.com', 'https://developer.android.com'),
    ('source.android.com', 'https://source.android.com'),
    ('kotlinlang.org', 'https://kotlinlang.org'),
    ('CTS', 'https://source.android.com/docs/compatibility/cts'),
    ('Security tips', 'https://developer.android.com/privacy-and-security/security-tips'),
    ('Perf', 'https://developer.android.com/training/articles/perf-tips.html'),
]

# Bloque :root con alias hacia el vocabulario del design system (campus.css).
ROOT_ALIASES = (
    ';--text:var(--ink);--text-dim:var(--dim);--muted:var(--dim)'
    ';--accent-2:var(--accent2)'
    ';--surface:color-mix(in srgb,var(--ink) 7%,transparent)'
    ';--surface-solid:var(--bg2);--bg-soft:var(--bg2)'
    ';--line-strong:color-mix(in srgb,var(--ink) 24%,transparent)'
    ';--shadow:0 24px 70px -28px rgba(0,0,0,.75)'
    ';--font:var(--sans);--radius-sm:var(--radius)'
)

# Tema claro propio de la plantilla (mismo vocabulario que :root oscuro).
LIGHT_ROOT = (
    ':root[data-theme=light]{--bg:#f6f2ec;--bg2:#ebe5dc;--ink:#191713;'
    '--dim:#575046;--line:rgba(25,23,19,.16);--accent:#8a5a08;--accent2:#3d6b4f;'
    '--text:#191713;--text-dim:#3a352d;--muted:#575046;--accent-2:#3d6b4f;'
    '--surface:rgba(255,255,255,.72);--surface-solid:#fffdf9;--bg-soft:#ebe5dc;'
    '--line-strong:rgba(25,23,19,.3);--shadow:0 24px 70px -34px rgba(25,23,19,.35);'
    'color-scheme:light}'
)


def fail(msg: str) -> None:
    print(f'ERROR: {msg}', file=sys.stderr)
    raise SystemExit(1)


def classify(text: str, path: Path) -> str | None:
    """Devuelve la familia de reparación o None si la página está limpia."""
    if 'react-root' in text:
        return 'shell'
    if (
        path.parent.name.startswith('universal-')
        and path.name == 'index.html'
        and 'assets/js/shell.js' not in text
    ):
        return 'uindex'
    if '<html><body>' in text:
        return 'typea' if '<article class="content"' in text else 'typeb'
    return None


def site_prefix(path: Path) -> str:
    depth = len(path.resolve().relative_to(ROOT).parts) - 1
    return './' if depth == 0 else '../' * depth


def transform_style(css: str) -> str:
    """Deja el bloque de estilo compartido listo: sin restos WebGL ni badge,
    con alias al design system y con tema claro."""
    css = re.sub(r'\.webgl-canvas\{[^}]*\}', '', css)
    css = re.sub(r'\.superpowers-badge\{[^}]*\}', '', css)
    m = re.search(r':root\{', css)
    if not m:
        fail('bloque :root no encontrado en el CSS compartido')
    close = css.index('}', m.end())
    if '--text:' not in css[m.end():close]:
        css = css[:close] + ROOT_ALIASES + css[close:]
    if ':root[data-theme=light]' not in css:
        css = css.rstrip() + '\n' + LIGHT_ROOT + '\n'
    return css


def extract_region(text: str) -> tuple[str, int, int]:
    """Región de contenido: desde el ÚLTIMO <main> hasta su </main>."""
    opens = [m.start() for m in re.finditer(r'<main[\s>]', text)]
    if not opens:
        fail('sin <main> en la página')
    last = opens[-1]
    start = text.find('>', last) + 1
    end = text.find('</main>', start)
    if end < 0:
        fail('</main> no encontrado tras el último <main>')
    return text[start:end], start, end


def repair_body(text: str, family: str, prefix: str) -> str:
    head_end = text.find('<body')
    if head_end < 0:
        fail('<body> no encontrado')
    head = text[:head_end]

    skip_m = FIRST_SKIP.search(text)
    if not skip_m:
        fail('skip link no encontrado')
    skip = skip_m.group(0)

    header_m = SITE_HEADER.search(text)
    if header_m:
        header = header_m.group(0).replace(BRAND_SMALL_TRUNC, BRAND_SMALL_FULL)
    elif family == 'uindex':
        header = synth_header(section_of(text))
    else:
        fail('cabecera real (site-header) no encontrada')

    crumbs_m = BREADCRUMBS.search(text)
    crumbs = crumbs_m.group(0) if crumbs_m else ''

    region, _, _ = extract_region(text)

    # Rutas locales de Windows dentro del contenido → repositorio público.
    region = re.sub(
        r'C:\\+Users[^<"]*',
        'https://github.com/belentani7/open-school',
        region,
    )

    # Referencias oficiales sin href → URLs verificadas.
    for label, url in REF_LINKS:
        region = re.sub(
            r'<a\s+rel="noopener"\s+target="_blank">'
            + re.escape(label)
            + r'</a>',
            f'<a href="{url}" rel="noopener" target="_blank">{label}</a>',
            region,
        )

    # --- transformaciones específicas de familia ---
    if family == 'typea':
        if '<html><body>' not in region:
            fail('typea: falta <html><body> en la región')
        region = region.replace('<html><body>', '')
        region = region.replace(
            '<article class="content" role="main">', '<div class="content">'
        )
        if region.count('</article>') != 1:
            fail(f'typea: {region.count("</article>")} cierres de article (se esperaba 1)')
        region = region.replace('</article>', '</div></article>', 1)
    elif family == 'typeb':
        if '<html><body>' not in region:
            fail('typeb: falta <html><body> en la región')
        region = region.replace('<html><body>', '')
        opens = len(re.findall(r'<div[\s>]', region))
        closes = region.count('</div>')
        if opens == closes + 1:
            # Contenedor sin cerrar (artículo también): cerramos ambos al final.
            region = region.rstrip() + '</article></div>'
        elif opens == closes and region.rstrip().endswith('</div>'):
            # Contenedor cerrado, artículo aún abierto: cerrarlo antes del contenedor.
            idx = region.rfind('</div>')
            region = region[:idx] + '</article>' + region[idx:]
        else:
            fail(f'typeb: balance de divs inesperado ({opens}/{closes})')

    # --- pie ---
    if family == 'shell':
        footer_m = FOOTER_RICH.search(text)
        if not footer_m:
            fail('shell: pie site-footer no encontrado')
        footer = footer_m.group(0)
        footer = re.sub(
            r'\s*<p>Generado desde contenido real · C:\\\\Users[^<]*</p>', '', footer
        )
    else:
        footer_m = FOOTER_SITE.search(text)
        if not footer_m:
            fail(f'{family}: pie site no encontrado')
        footer = footer_m.group(0).replace(
            'WebGL listo para servir online', 'Material abierto'
        )

    reveal = ''
    if family == 'uindex':
        rev_m = REVEAL_SCRIPT.search(text)
        reveal = rev_m.group(0) if rev_m else ''

    parts = ['<body>', skip, header]
    if crumbs:
        parts.append(crumbs)
    parts.append(f'<main id="contenido">{region}</main>')
    parts.append(footer)
    if reveal:
        parts.append(reveal)
    parts.append(f'<script src="{prefix}assets/js/shell.js" defer></script>')
    parts.append('</body>\n</html>\n')
    return head + '\n'.join(p for p in parts if p)


def section_of(text: str) -> str:
    m = re.search(r'<title>([^<·]+)', text)
    title = m.group(1).strip() if m else ''
    mapping = {
        'Rutas universales': 'universal-rutas',
        'Módulos universales': 'universal-modulos',
        'Lecciones universales': 'universal-lecciones',
        'Documentación': 'universal-docs',
    }
    for label, slug in mapping.items():
        if label.lower() in title.lower():
            return slug
    m2 = re.search(r'universal-(rutas|modulos|lecciones|docs)', text)
    return 'universal-' + m2.group(1) if m2 else 'universal'


def synth_header(section: str) -> str:
    nav = [
        ('../index.html', 'Inicio'),
        ('../rutas/index.html', 'Rutas'),
        ('../modulos/index.html', 'Módulos'),
        ('../lecciones/index.html', 'Lecciones'),
        ('../universal-rutas/index.html', 'Rutas universales'),
        ('../universal-modulos/index.html', 'Módulos universales'),
        ('../universal-lecciones/index.html', 'Lecciones universales'),
        ('../universal-docs/index.html', 'Documentación'),
        ('../buscar.html', 'Buscar'),
    ]
    links = []
    for href, label in nav:
        current = ' aria-current="page"' if href == f'../{section}/index.html' else ''
        links.append(f'<a href="{href}"{current}>{label}</a>')
    return (
        '<header class="site-header">\n  <div class="container">\n'
        '    <a class="brand" href="../index.html" aria-label="Open School — inicio">\n'
        '      <span class="brand-mark" aria-hidden="true">OP</span>\n'
        '      <span>Open School<small>Instituto digital abierto: rutas, módulos '
        'y lecciones verificables</small></span>\n'
        '    </a>\n'
        '    <nav class="nav" aria-label="Navegación principal">'
        + ''.join(links)
        + '</nav>\n'
        '    <div class="header-tools">\n'
        '      <button class="icon-button" type="button" data-search-open '
        'aria-label="Buscar en la plataforma">\n'
        '        <span aria-hidden="true">⌕</span><span>Buscar</span>'
        '<kbd>Ctrl K</kbd>\n      </button>\n'
        '      <button class="icon-button" type="button" data-theme-toggle '
        'aria-label="Cambiar tema">\n'
        '        <span aria-hidden="true">◐</span>\n      </button>\n'
        '    </div>\n  </div>\n</header>'
    )


def repair_file(path: Path) -> tuple[str, str | None, list[str]]:
    """Devuelve (texto_nuevo, familia_o_None, problemas)."""
    text = path.read_text(encoding='utf-8')
    family = classify(text, path)
    if family is None:
        return text, None, []

    problems: list[str] = []

    # 1) Meta de generador / chatarra en <head>
    text = GENERATOR_META.sub('', text)
    text = SUPERPOWERS_META.sub('', text)

    # 2) Bloque de estilo compartido (idéntico en las 434 páginas)
    style_m = STYLE_BLOCK.search(text)
    if not style_m:
        problems.append('sin bloque <style>')
        return text, family, problems
    new_css = transform_style(style_m.group('css'))
    text = (
        text[: style_m.start('css')]
        + new_css
        + text[style_m.end('css'):]
    )

    # 3) Enlace al design system compartido, antes del CSS en línea
    if 'assets/css/campus.css' not in text:
        prefix = site_prefix(path)
        idx = text.find('<style>')
        if idx < 0:
            problems.append('sin <style> para insertar campus.css')
            return text, family, problems
        link = f'<link rel="stylesheet" href="{prefix}assets/css/campus.css">\n'
        text = text[:idx] + link + text[idx:]

    # 4) Cuerpo reconstruido
    try:
        text = repair_body(text, family, site_prefix(path))
    except SystemExit:
        raise
    except Exception as exc:  # pragma: no cover - defensa
        problems.append(f'reparación de cuerpo fallida: {exc}')
        return text, family, problems

    # 5) Verificación
    problems = verify(text, family, path)
    return text, family, problems


def verify(text: str, family: str, path: Path) -> list[str]:
    p: list[str] = []
    def count(pat: str) -> int:
        return len(re.findall(pat, text))

    if not re.search(r'<!doctype html>', text, re.I):
        p.append('doctype ausente')
    html_o = count(r'<html[\s>]')
    html_c = count(r'</html>')
    body_o = count(r'<body[\s>]')
    body_c = count(r'</body>')
    head_o = count(r'<head[\s>]')
    title_o = count(r'<title[\s>]')
    main_o = count(r'<main[\s>]')
    main_c = count(r'</main>')
    foot_o = count(r'<footer[\s>]')
    art_o = count(r'<article[\s>]')
    art_c = count(r'</article>')
    if html_o != 1:
        p.append('html=%d' % html_o)
    if html_c != 1:
        p.append('</html>=%d' % html_c)
    if body_o != 1:
        p.append('body=%d' % body_o)
    if body_c != 1:
        p.append('</body>=%d' % body_c)
    if head_o != 1:
        p.append('head=%d' % head_o)
    if title_o != 1:
        p.append('title=%d' % title_o)
    if main_o != 1 or main_c != 1:
        p.append('main=%d/%d' % (main_o, main_c))
    if foot_o != 1:
        p.append('footer=%d' % foot_o)
    if art_o != art_c:
        p.append('article=%d/%d' % (art_o, art_c))
    div_o = count(r'<div[\s>]')
    div_c = text.count('</div>')
    if div_o != div_c:
        p.append('divs=%d/%d' % (div_o, div_c))
    hrefless = len(re.findall(r'<a\s+(?![^>]*\bhref\b)[^>]*>', text))
    if hrefless:
        p.append('anclas sin href=%d' % hrefless)
    banned = {
        '<html><body>': 'html/body incrustado',
        'webgl-canvas': 'script WebGL residual',
        'lang-selector': 'selector de idioma muerto',
        'react-root': 'react-root residual',
        '__PLATFORM__': 'config __PLATFORM__ residual',
        'index-CkYlgyHh': 'bundle React residual',
        'repo-cursor-superpowers': 'meta de generador residual',
        'repo-superpowers-audit': 'meta de generador residual',
        'WebGL listo': 'texto WebGL residual',
        'role="main"': 'landmark role=main duplicado',
        '<header class="site">': 'cabecera mini residual',
        'docs.html': 'enlace a docs.html residual',
        'omega-max': 'chattera omega-max',
        '.superpowers-badge': 'regla CSS badge residual',
    }
    for needle, label in banned.items():
        if needle in text:
            p.append(label)
    if re.search(r'C:\\+Users', text):
        p.append('ruta local residual')
    if 'assets/css/campus.css' not in text:
        p.append('falta campus.css')
    if 'assets/js/shell.js' not in text:
        p.append('falta shell.js')
    if family == 'uindex' and 'data-search-open' not in text:
        p.append('uindex sin botón de búsqueda')
    return p


def main() -> int:
    ap = argparse.ArgumentParser(
        prog='repair_pages.py',
        description='Repara la estructura HTML del campus Open School.',
    )
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument(
        '--check', action='store_true',
        help='dry-run: clasifica y verifica sin escribir archivos',
    )
    mode.add_argument(
        '--apply', action='store_true',
        help='escribe las páginas reparadas (solo si la verificación pasa)',
    )
    ap.add_argument(
        '--only', choices=['shell', 'typea', 'typeb', 'uindex'],
        help='limita la reparación a una familia',
    )
    args = ap.parse_args()

    from collections import Counter

    families: Counter[str] = Counter()
    repaired: Counter[str] = Counter()
    blocked: list[tuple[str, list[str]]] = []
    already = 0

    for path in sorted(ROOT.rglob('*.html')):
        if '.git' in path.parts:
            continue
        raw = path.read_text(encoding='utf-8')
        fam = classify(raw, path)
        if fam is None:
            already += 1
            continue
        if args.only and fam != args.only:
            continue
        families[fam] += 1
        new_text, fam, problems = repair_file(path)
        if problems:
            blocked.append((str(path.relative_to(ROOT)), problems))
            continue
        if new_text != raw:
            repaired[fam] += 1
            if args.apply:
                path.write_text(new_text, encoding='utf-8')

    verb = 'reparadas' if args.apply else 'reparables (dry-run)'
    total = sum(repaired.values())
    print(f'Clasificadas: {sum(families.values())} · ya limpias: {already}')
    for fam, n in sorted(repaired.items()):
        print(f'  {fam}: {n} {verb}')
    if blocked:
        print(f'BLOQUEADAS (verificación fallida): {len(blocked)}', file=sys.stderr)
        for rel, probs in blocked[:20]:
            print(f'  {rel}: {", ".join(probs)}', file=sys.stderr)
        return 1
    if args.apply:
        print(f'OK: {total} páginas reparadas y verificadas.')
    else:
        print(f'OK dry-run: {total} páginas reparables sin problemas.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

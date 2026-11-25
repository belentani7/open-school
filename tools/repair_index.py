#!/usr/bin/env python3
"""repair_index.py — Repara la portada index.html (idempotente).

Corrige de forma verificable:
  1. Restos de mojibake (â€¦) en textos y en el array `entries`.
  2. El regex de normalización roto /[Ì€-Í¯]/g —cuya orden fuera de rango
     lanza SyntaxError y mataba TODO el script de catálogo de la portada—
     por el rango correcto de marcas combinantes [\\u0300-\\u036f].
  3. Regenera `entries` desde catalog.json con títulos limpios (sin la
     basura de truncado "... ·... ·...") más los índices de sección.
  4. Metadatos y sección "Superpowers MCP" (chattera interna).
  5. El shader WebGL: respeta prefers-reduced-motion (un fotograma estático)
     y pausa el render cuando la pestaña no está visible.

Uso:
  python tools/repair_index.py --check
  python tools/repair_index.py --apply
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index.html'
CATALOG = ROOT / 'catalog.json'

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
    ('rutas/index.html', 'Rutas'),
    ('modulos/index.html', 'Módulos'),
    ('lecciones/index.html', 'Lecciones'),
    ('universal-rutas/index.html', 'Rutas universales'),
    ('universal-modulos/index.html', 'Módulos universales'),
    ('universal-lecciones/index.html', 'Lecciones universales'),
    ('universal-docs/index.html', 'Documentación'),
]

CHATTARA_META = re.compile(
    r'[ \t]*<meta name="(superpowers|omega-max)"[^>]*>\s*\n?'
)
MCP_SECTION = re.compile(
    r'\s*<section class="superpowers-mcp".*?</section>', re.S
)


def expected_entries() -> list[list[str]]:
    items = json.loads(CATALOG.read_text(encoding='utf-8'))
    entries = [list(p) for p in SECTION_INDEXES]
    for it in items:
        entries.append([it['url'], it['title'], SECTION_LABELS[it['type']]])
    return entries


def repair(text: str) -> str:
    # 1) mojibake restante
    text = text.replace('accesibilidadâ€¦', 'accesibilidad…')
    text = text.replace('catálogoâ€¦', 'catálogo…')
    text = text.replace('â€¦', '…')

    # 2) regex de normalización (la orden fuera de rango lanzaba SyntaxError)
    text = re.sub(r'replace\(/\[[^\]]*\]/g', r'replace(/[\\u0300-\\u036f]/g', text, count=1)

    # 3) entradas del catálogo con títulos limpios
    entries = expected_entries()
    payload = json.dumps(entries, ensure_ascii=False, separators=(',', ':'))
    text, n = re.subn(
        r'const entries=\[\[.*?\]\];',
        'const entries=' + payload + ';',
        text,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit('ERROR: no se encontró el array `entries`')

    # 4) chattera
    text = CHATTARA_META.sub('', text)
    text = MCP_SECTION.sub('', text)
    text = text.replace('<body class="superpowers-enabled">', '<body>')

    # 5) shader con reduced-motion y pausa por visibilidad
    old_loop = (
        'var t0=Date.now();\n'
        '    (function loop(){gl.uniform2f(ur,c.width,c.height);'
        'gl.uniform1f(ut,(Date.now()-t0)/1000);'
        'gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(loop);})();'
    )
    new_loop = (
        'var t0=Date.now();\n'
        '    var reduce=matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;\n'
        '    var running=false,raf=0;\n'
        '    function draw(t){gl.uniform2f(ur,c.width,c.height);'
        'gl.uniform1f(ut,t);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}\n'
        '    function loop(){draw((Date.now()-t0)/1000);'
        'if(running)raf=requestAnimationFrame(loop);}\n'
        '    function start(){if(running||reduce)return;running=true;'
        'raf=requestAnimationFrame(loop);}\n'
        '    function stop(){running=false;if(raf)cancelAnimationFrame(raf);}\n'
        '    if(reduce){draw(0);}else{start();\n'
        '      document.addEventListener("visibilitychange",function(){'
        'if(document.hidden)stop();else start();});}'
    )
    if old_loop in text:
        text = text.replace(old_loop, new_loop, 1)
    elif 'prefers-reduced-motion: reduce)' not in text:
        raise SystemExit('ERROR: no se encontró el bucle del shader')

    return text


def problems(text: str) -> list[str]:
    p: list[str] = []
    if 'â€' in text or 'Ã' in text or 'Â·' in text:
        p.append('mojibake residual')
    if re.search(r'replace\(/\[[^\]]*\]/g', text):
        m = re.search(r'replace\(/\[[^\]]*\]/g', text)
        if m and '\\u0300' not in m.group(0):
            p.append('regex de normalización roto')
    if 'superpowers' in text or 'omega-max' in text:
        p.append('chattera superpowers/omega')
    if 'const entries=' not in text:
        p.append('entries ausente')
    else:
        m = re.search(r'const entries=(\[\[.*?\]\]);', text, re.S)
        try:
            got = json.loads(m.group(1))
        except Exception:
            got = None
        if got != expected_entries():
            p.append('entries desactualizadas vs catalog.json')
    if 'prefers-reduced-motion: reduce)' not in text:
        p.append('shader sin reduced-motion')
    if 'visibilitychange' not in text:
        p.append('shader sin pausa por visibilidad')
    return p


def main() -> int:
    ap = argparse.ArgumentParser(
        prog='repair_index.py',
        description='Repara index.html (portada) de forma idempotente.',
    )
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check', action='store_true', help='dry-run')
    mode.add_argument('--apply', action='store_true', help='escribe si hay cambios')
    args = ap.parse_args()

    original = INDEX.read_text(encoding='utf-8')
    fixed = repair(original)
    probs = problems(fixed)
    if probs:
        print('VERIFICACIÓN FALLIDA tras reparar:', ', '.join(probs), file=sys.stderr)
        return 1

    before = problems(original)
    if fixed == original:
        print('OK: index.html ya está reparado (0 cambios).')
        return 0
    print(f'Problemas antes: {len(before)} → tras reparar: 0')
    for b in before:
        print(f'  - {b}')
    if args.apply:
        INDEX.write_text(fixed, encoding='utf-8')
        print('index.html escrito.')
    else:
        print('Dry-run: ejecuta con --apply para escribir.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

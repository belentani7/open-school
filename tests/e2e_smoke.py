#!/usr/bin/env python3
"""tests/e2e_smoke.py — camino feliz end-to-end sobre HTTP real.

Arranca un servidor estático (ThreadingHTTPServer) con el árbol del campus y
verifica, como lo haría un navegador:

  * la portada, la biblioteca y una lección responden 200;
  * assets de la cáscara (campus.css, shell.js) responden 200;
  * search-index.json responde 200 con el formato que espera la paleta y
    permite resolver una consulta ("null safety") de extremo a extremo;
  * las 413 páginas del catálogo responden 200;
  * las páginas eliminadas (docs.html, ampliacion.html, bundle React)
    responden 404;
  * ninguna página clave contiene mojibake ni duplica <main>.

Ejecutar:  python3 tests/e2e_smoke.py
"""

from __future__ import annotations

import json
import re
import sys
import threading
import urllib.error
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FAILURES: list[str] = []


def check(cond: bool, msg: str) -> None:
    if cond:
        print(f'  ok  {msg}')
    else:
        FAILURES.append(msg)
        print(f'FAIL  {msg}')


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):  # silencioso
        pass


def get(base: str, path: str) -> tuple[int, bytes, str]:
    url = base + path
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            return resp.status, resp.read(), resp.headers.get('Content-Type', '')
    except urllib.error.HTTPError as e:
        return e.code, e.read(), ''


def main() -> int:
    handler = partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_address[1]}'
    print(f'servidor: {base}')

    try:
        # --- páginas clave ---
        status, body, ctype = get(base, '/index.html')
        text = body.decode('utf-8')
        check(status == 200, 'index.html → 200')
        check('text/html' in ctype, 'index.html content-type html')
        check('const entries=' in text, 'portada con array de entradas')
        check('â€' not in text and 'Ã' not in text, 'portada sin mojibake')
        check('superpowers' not in text, 'portada sin chattera superpowers')

        status, body, _ = get(base, '/cursos.html')
        check(status == 200, 'cursos.html → 200')
        check(b'data-save' in body, 'biblioteca con guardado local')

        status, body, _ = get(base, '/lecciones/null-safety-y-let-run-android-platform.html')
        text = body.decode('utf-8')
        check(status == 200, 'lección → 200')
        check(text.count('<main ') + text.count('<main>') == 1, 'lección con un solo <main>')
        check('assets/css/campus.css' in text, 'lección enlaza campus.css')
        check('assets/js/shell.js' in text, 'lección carga shell.js')
        check('<html><body>' not in text, 'lección sin <html><body> incrustado')

        status, body, _ = get(base, '/sobre.html')
        check(status == 200, 'sobre.html → 200')
        check(b'react-root' not in body, 'sobre sin react-root')

        # --- assets ---
        for asset in ('/assets/css/campus.css', '/assets/js/shell.js'):
            status, _, _ = get(base, asset)
            check(status == 200, f'{asset} → 200')

        # --- search-index.json + consulta de extremo a extremo ---
        status, body, _ = get(base, '/search-index.json')
        check(status == 200, 'search-index.json → 200')
        items = json.loads(body.decode('utf-8'))
        check(isinstance(items, list) and len(items) >= 400,
              f'search-index con ≥400 entradas ({len(items)})')

        def normalize(s: str) -> str:
            return re.sub(r'[̀-ͯ]', '', s).lower()

        q = normalize('null safety')
        hits = [
            it for it in items
            if q in normalize(
                f"{it['title']} {it['description']} "
                f"{it['section']} {it['href']}"
            )
        ]
        check(len(hits) >= 1, f'consulta "null safety" → {len(hits)} resultados')
        if hits:
            status, page, _ = get(base, '/' + hits[0]['href'])
            check(status == 200, f'resultado de la paleta resuelve ({hits[0]["href"]})')

        # --- cobertura del catálogo ---
        catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
        broken = []
        for entry in catalog:
            status, _, _ = get(base, '/' + entry['url'])
            if status != 200:
                broken.append((entry['url'], status))
        check(not broken, f'las {len(catalog)} páginas del catálogo → 200')

        # --- eliminadas deben dar 404 ---
        for gone in ('/docs.html', '/ampliacion.html',
                     '/assets/index-CkYlgyHh.js', '/assets/index-lSU0YY1M.css',
                     '/locales/es.json', '/data/manifest.json'):
            status, _, _ = get(base, gone)
            check(status == 404, f'{gone} → 404 (eliminada)')

        # --- 404 institucional sigue funcionando ---
        status, body, _ = get(base, '/404.html')
        check(status == 200, '404.html → 200 (página de error servible)')

    finally:
        server.shutdown()

    if FAILURES:
        print(f'\nE2E FAIL: {len(FAILURES)} comprobaciones fallidas')
        for f in FAILURES:
            print(f'  - {f}')
        return 1
    print('\nE2E PASS: camino feliz completo')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

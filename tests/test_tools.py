#!/usr/bin/env python3
"""tests/test_tools.py — pruebas unitarias de las herramientas del campus.

Ejecutar:  python3 -m unittest discover -s tests -v
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))

import audit_site          # noqa: E402
import gen_search_index    # noqa: E402
import repair_index        # noqa: E402
import repair_pages        # noqa: E402


class TestContrast(unittest.TestCase):
    """La paleta clara declarada debe cumplir WCAG AA (4.5:1)."""

    def test_light_palette_meets_aa(self):
        m = re.search(
            r':root\[data-theme=light\]\{(.*?)\}', repair_pages.LIGHT_ROOT
        )
        self.assertIsNotNone(m)
        vars_ = dict(re.findall(r'(--[\w-]+):(#[0-9a-fA-F]{6})', m.group(1)))
        pairs = [
            ('--ink', '--bg'),
            ('--dim', '--bg'),
            ('--accent', '--bg'),
            ('--accent2', '--bg'),
            ('--text', '--surface-solid'),
            ('--muted', '--surface-solid'),
        ]
        for fg, bg in pairs:
            with self.subTest(fg=fg, bg=bg):
                self.assertIn(fg, vars_)
                self.assertIn(bg, vars_)
                ratio = audit_site.contrast(vars_[fg], vars_[bg])
                self.assertGreaterEqual(ratio, 4.5, f'{fg} sobre {bg}')

    def test_dark_template_values_still_contrast(self):
        # valores del :root oscuro de la plantilla compartida
        self.assertGreaterEqual(audit_site.contrast('#f4efe7', '#0b0a09'), 4.5)
        self.assertGreaterEqual(audit_site.contrast('#a89f92', '#0b0a09'), 4.5)
        self.assertGreaterEqual(audit_site.contrast('#e0a35c', '#0b0a09'), 4.5)


class TestStyleTransform(unittest.TestCase):
    def test_transform_removes_chattara_and_adds_theme(self):
        css = (
            ':root{--bg:#0b0a09;--ink:#f4efe7;--dim:#a89f92;'
            '--accent:#e0a35c;--accent2:#7fa88b;--line:rgba(0,0,0,.1);'
            '--bg2:#131110;--sans:sans-serif;--radius:14px}'
            '::selection{background:var(--accent)}'
            '.webgl-canvas{width:100%;height:400px}'
            '.superpowers-badge{display:inline-block}'
            '@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'
        )
        out = repair_pages.transform_style(css)
        self.assertNotIn('webgl-canvas', out)
        self.assertNotIn('superpowers-badge', out)
        self.assertIn('--text:var(--ink)', out)
        self.assertIn(':root[data-theme=light]', out)
        # idempotente
        self.assertEqual(repair_pages.transform_style(out), out)


class TestRepairIndex(unittest.TestCase):
    def test_index_problems_empty(self):
        text = (ROOT / 'index.html').read_text(encoding='utf-8')
        self.assertEqual(repair_index.problems(text), [])

    def test_detects_broken_normalize_regex(self):
        text = (ROOT / 'index.html').read_text(encoding='utf-8')
        broken = text.replace(
            'replace(/[\\u0300-\\u036f]/g', 'replace(/[Ì€-Í¯]/g', 1
        )
        self.assertNotEqual(broken, text)
        self.assertIn('regex de normalización roto', repair_index.problems(broken))

    def test_detects_stale_entries(self):
        text = (ROOT / 'index.html').read_text(encoding='utf-8')
        stale = text.replace('"Null safety', '"ZZZ Null safety', 1)
        self.assertIn(
            'entries desactualizadas vs catalog.json',
            repair_index.problems(stale),
        )

    def test_expected_entries_cover_catalog(self):
        entries = repair_index.expected_entries()
        catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
        urls = {e[0] for e in entries}
        for item in catalog:
            self.assertIn(item['url'], urls)


class TestSearchIndex(unittest.TestCase):
    def test_build_covers_catalog_and_files_exist(self):
        items = gen_search_index.build()
        hrefs = [i['href'] for i in items]
        self.assertEqual(len(hrefs), len(set(hrefs)), 'hrefs duplicados')
        catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
        missing = [c['url'] for c in catalog if c['url'] not in set(hrefs)]
        self.assertEqual(missing, [])
        for it in items:
            self.assertTrue((ROOT / it['href']).is_file(), it['href'])
            self.assertTrue(it['title'])
            self.assertTrue(it['section'])

    def test_written_file_is_current(self):
        r = subprocess.run(
            [sys.executable, str(ROOT / 'tools/gen_search_index.py'), '--check'],
            capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, r.stderr)


class TestVerifyCatalog(unittest.TestCase):
    def test_ci_script_passes(self):
        r = subprocess.run(
            [sys.executable, str(ROOT / 'scripts/verify_catalog.py')],
            capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn('PASS', r.stdout)


class TestAudit(unittest.TestCase):
    def test_full_audit_passes(self):
        r = subprocess.run(
            [sys.executable, str(ROOT / 'tools/audit_site.py'), '--quiet'],
            capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, r.stderr)


if __name__ == '__main__':
    unittest.main()

"""Comprueba en GitHub que la voz y el orden de idiomas quedaron bien.

Para cada repo educativo verifica:
  1. campus/voces/ contiene los 4 MP3 planos + las 4 subcarpetas + manifest.json.
  2. campus/index.html tiene el <select> en orden PT > ES > EN > CA.
  3. El audio por defecto es voces/bienvenida-pt.mp3.

Uso: python verify_voice.py
"""

from __future__ import annotations

import json
import re
import subprocess
import sys

REPOS = [
    "lingua-aberta",
    "linguaforge",
    "ManosAbiertas",
    "secure-t-university",
    "ux-academy-professional-program",
    "open-school",
]

PO = ["pt", "es", "en", "ca"]


def gh(*args: str) -> str:
    p = subprocess.run(
        ["gh", *args], capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    return p.stdout


def check(repo: str) -> tuple[bool, str]:
    items = json.loads(gh("api", f"repos/belentani7/{repo}/contents/campus/voces") or "[]")
    mp3 = sorted(i["name"] for i in items if i["name"].endswith(".mp3"))
    dirs = sorted(i["name"] for i in items if i["type"] == "dir")
    man = next((i["size"] for i in items if i["name"] == "manifest.json"), 0)

    html = gh(
        "api", "-H", "Accept: application/vnd.github.raw",
        f"repos/belentani7/{repo}/contents/campus/index.html",
    )
    order = re.findall(r'<option value="([a-z]{2})"', html)
    default = re.search(r'src="voces/bienvenida-([a-z]{2})\.mp3"', html)

    problemas = []
    if len(mp3) != 4:
        problemas.append(f"mp3={len(mp3)} (esperado 4)")
    if dirs != sorted(PO):
        problemas.append(f"dirs={dirs}")
    if man < 1500:
        problemas.append(f"manifest={man}B (viejo)")
    if order and order != PO:
        problemas.append(f"orden={order}")
    if not order:
        problemas.append("sin <select id=idioma>")
    if not default or default.group(1) != "pt":
        problemas.append(f"defecto={default.group(1) if default else None}")

    detalle = f"mp3={len(mp3)} dirs={len(dirs)} man={man}B orden={order} def={default.group(1) if default else None}"
    return (not problemas), (f"OK  {detalle}" if not problemas else f"FALLA {detalle} :: {'; '.join(problemas)}")


def main() -> int:
    fallos = 0
    for repo in REPOS:
        try:
            ok, msg = check(repo)
        except Exception as exc:  # noqa: BLE001
            ok, msg = False, f"ERROR {str(exc)[:140]}"
        fallos += 0 if ok else 1
        print(f"{repo:<34} {msg}", flush=True)
    print(f"\nrepos={len(REPOS)} fallos={fallos}")
    return 1 if fallos else 0


if __name__ == "__main__":
    raise SystemExit(main())

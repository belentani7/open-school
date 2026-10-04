"""Extrae los argumentos completos de root/publicDir/outDir (sin cortar en la coma)."""
from __future__ import annotations

import base64
import json
import re
import subprocess

REPOS = ["linguaforge", "lingua-aberta", "aprende-brasil",
         "ux-academy-professional-program", "open-school", "WILLIAMSCHOOL"]

RX = re.compile(r"(root|publicDir|outDir)\s*:\s*(path\.resolve\([^)]*\)|['\"][^'\"]+['\"])")

for repo in REPOS:
    raw = subprocess.run(
        ["gh", "api", f"repos/belentani7/{repo}/contents/vite.config.ts"],
        text=True, encoding="utf-8", errors="replace", capture_output=True).stdout
    try:
        txt = base64.b64decode(json.loads(raw)["content"]).decode("utf-8", "replace")
    except Exception:
        print(f"{repo:<36} sin vite.config.ts")
        continue
    print(f"=== {repo}")
    for m in RX.finditer(txt):
        val = re.sub(r"import\.meta\.dirname", "<ROOT>", m.group(2))
        print(f"    {m.group(1):<10} {val}")

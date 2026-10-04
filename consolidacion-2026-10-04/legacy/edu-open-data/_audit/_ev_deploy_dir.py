"""Evidencia: donde publica cada build. Que existe en el repo y que llega a la web."""
from __future__ import annotations

import json
import subprocess

REPOS = {
    "lingua-aberta": "duck",
    "linguaforge": "main",
    "ManosAbiertas": "main",
    "secure-t-university": "main",
    "ux-academy-professional-program": "main",
    "open-school": "main",
    "WILLIAMSCHOOL": "main",
    "aprende-brasil": "main",
}

CLAVES = ("public/", "dist/", "vite.config", "next.config", "open-data/", "campus/", "index.html")


def gh(*args: str) -> str:
    p = subprocess.run(["gh", *args], text=True, encoding="utf-8", errors="replace",
                       capture_output=True)
    return p.stdout or ""


for repo, branch in REPOS.items():
    raw = gh("api", f"repos/belentani7/{repo}/git/trees/{branch}?recursive=1")
    try:
        tree = json.loads(raw)
    except Exception:
        print(f"{repo}: sin arbol ({raw[:80]})")
        continue
    paths = [t["path"] for t in tree.get("tree", [])]
    print(f"=== {repo} ({branch}) archivos={len(paths)}")

    def hay(pref: str) -> list[str]:
        if pref.endswith("/"):
            return [p for p in paths if p.startswith(pref)]
        return [p for p in paths if p.startswith(pref)]

    for c in CLAVES:
        hits = hay(c)
        if c in ("public/", "open-data/", "campus/"):
            solo_dir = sorted({p.split("/")[1] for p in hits if "/" in p})[:12]
            print(f"   {c:<16} n={len(hits):<4} dirs={solo_dir}")
        else:
            print(f"   {c:<16} n={len(hits):<4} {hits[:3]}")
    # public/open-data ya presente?
    print(f"   public/open-data = {any(p.startswith('public/open-data/') for p in paths)}")
    print(f"   open-data/topics.json = {'open-data/topics.json' in paths}")
    print(f"   gh-pages? (solo ux) = {repo == 'ux-academy-professional-program'}")

"""Inyecta el pack y el campus dentro de la rama que sirve GitHub Pages.

Algunos repos publican Pages desde una rama de artefacto (`gh-pages`) que no
recibe los cambios de `main`. Su workflow "Build" no compila nada, asi que la
rama se queda congelada y ninguna web sirve el pack.

Esto lo arregla con solo git: copia `open-data/` del portal y `campus/` del clon
canonico dentro de la rama de Pages, commit y push.

Uso:
    python publish_pages_branch.py ux-academy            # dry-run
    python publish_pages_branch.py ux-academy --apply
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).parent
PORTALS = ROOT / "portals"

# portal -> (repo, rama de Pages, clon canonico que tiene campus/)
CONFIG: dict[str, tuple[str, str, str]] = {
    "ux-academy": (
        "belentani7/ux-academy-professional-program",
        "gh-pages",
        r"C:\Users\USER\belentani-repos-master\ux-academy-professional-program",
    ),
}


def run(args: list[str], cwd: Path | None = None, check: bool = True) -> str:
    p = subprocess.run(args, cwd=cwd, text=True, encoding="utf-8", errors="replace",
                       capture_output=True, check=False)
    if check and p.returncode != 0:
        raise RuntimeError(f"{' '.join(args)} -> {p.returncode}\n{(p.stderr or '')[-400:]}")
    return (p.stdout or "") + (p.stderr or "")


def inyecta(portal_id: str, apply: bool) -> str:
    repo, rama, canonico = CONFIG[portal_id]
    portal = PORTALS / portal_id
    campus_src = Path(canonico) / "campus"

    if not (portal / "topics.json").exists():
        return "sin topics.json"
    if not campus_src.is_dir():
        return f"clon canonico sin campus/: {campus_src}"

    n_temas = len(list((portal / "data").glob("*.json")))
    n_voces = len(list((campus_src / "voces").glob("*.mp3")))
    if not apply:
        return (f"DRY-RUN hacia {rama}: open-data/ ({n_temas} temas) + "
                f"campus/ ({n_voces} mp3)")

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / "repo"
        run(["git", "clone", "--depth", "1", "--branch", rama,
             f"https://github.com/{repo}.git", str(work)])

        od = work / "open-data"
        if od.exists():
            shutil.rmtree(od)
        shutil.copytree(portal, od, ignore=shutil.ignore_patterns("voces"))
        (od / "README.md").write_text(
            "# open-data\n\nContenido educativo desde APIs abiertas verificadas.\n"
            "Orden de idiomas del ecosistema: **PT > ES > EN > CA**.\n",
            encoding="utf-8")

        dst = work / "campus"
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(campus_src, dst)

        run(["git", "add", "open-data", "campus"], cwd=work)
        if not run(["git", "status", "--porcelain"], cwd=work).strip():
            return "sin cambios"
        run(["git", "commit", "-m",
             "feat(pages): pack open-data y campus en la rama de Pages\n\n"
             "La rama gh-pages es la fuente de GitHub Pages y no recibe los cambios\n"
             "de main. Sin esto la web no sirve ni el pack ni el audio.",
             ], cwd=work)
        run(["git", "pull", "--rebase", "origin", rama], cwd=work)
        out = run(["git", "push", "origin", rama], cwd=work)
        fallo = any(t in out.lower() for t in ("rejected", "error", "fatal"))
        return (f"publicado [{rama}] {n_temas} temas + {n_voces} mp3"
                if not fallo else f"push fallido: {out[-200:]}")


def main() -> int:
    apply = "--apply" in sys.argv
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    for pid in wanted or list(CONFIG):
        if pid not in CONFIG:
            print(f"{pid:<22} portal desconocido")
            continue
        try:
            print(f"{pid:<22} {inyecta(pid, apply)}", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"{pid:<22} ERROR {str(exc)[:220]}", flush=True)
    if not apply:
        print("\n(dry-run) ejecuta con --apply para escribir y publicar")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

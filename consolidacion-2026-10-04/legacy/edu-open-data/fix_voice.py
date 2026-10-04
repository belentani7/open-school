"""Instala la voz realista y corrige el orden de idiomas en cada campus.

Para cada repo educativo:
  1. Normaliza el <select id="idioma"> a PT > ES > EN > CA (regla del ecosistema).
  2. Deja PT como opcion por defecto (audio inicial = bienvenida-pt.mp3).
  3. Copia los clips pre-renderizados del portal a <repo>/campus/voces/.
  4. (--apply) commit + pull --rebase + push en la rama por defecto del repo.

Sin --apply hace dry-run: muestra que cambiaria y no escribe nada.

Uso:
    python fix_voice.py                 # dry-run
    python fix_voice.py --apply         # aplica y publica
    python fix_voice.py --apply lingua-aberta   # un solo portal
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
PORTALS = ROOT / "portals"

# portal -> (ruta del clon, rama por defecto real en GitHub)
REPOS: dict[str, tuple[str, str]] = {
    "lingua-aberta": (r"C:\Users\USER\belentani-repos-master\lingua-aberta", "duck"),
    "linguaforge": (r"C:\Users\USER\belentani-repos-master\linguaforge", "main"),
    "manosabiertas": (r"C:\Users\USER\belentani-repos-master\ManosAbiertas", "main"),
    "secure-t-university": (r"C:\Users\USER\belentani-repos-master\secure-t-university", "main"),
    "ux-academy": (r"C:\Users\USER\belentani-repos-master\ux-academy-professional-program", "main"),
    "open-school": (r"C:\Users\USER\belentani-repos-master\open-school", "main"),
}

PO = ["pt", "es", "en", "ca"]

SELECT_RX = re.compile(
    r"(<select id=\"idioma\"[^>]*>)(.*?)(</select>)", re.S
)
OPTION_RX = re.compile(r"<option value=\"(\w{2})\">([A-Z]{2})</option>")
SRC_RX = re.compile(r'(src=\"voces/bienvenida-)(\w{2})(\.mp3\")')


def run(args: list[str], cwd: Path, check: bool = False) -> str:
    p = subprocess.run(
        args, cwd=cwd, text=True, encoding="utf-8", errors="replace", capture_output=True
    )
    if check and p.returncode != 0:
        raise RuntimeError(f"{' '.join(args)} -> {p.returncode}\n{(p.stderr or '')[-300:]}")
    return (p.stdout or "") + (p.stderr or "")


def fix_select(html: str) -> tuple[str, list[str]]:
    notes: list[str] = []

    def _order(m: re.Match) -> str:
        found = {v.lower(): t for v, t in OPTION_RX.findall(m.group(2))}
        if not found:
            notes.append("select sin options reconocibles")
            return m.group(0)
        ordered = "\n".join(
            f'          <option value="{l}">{found[l]}</option>' for l in PO if l in found
        )
        for extra in sorted(set(found) - set(PO)):
            ordered += f'\n          <option value="{extra}">{found[extra]}</option>'
        if list(found) != [l for l in PO if l in found] + sorted(set(found) - set(PO)):
            notes.append("orden normalizado a PT > ES > EN > CA")
        return f"{m.group(1)}\n{ordered}\n        {m.group(3)}"

    html = SELECT_RX.sub(_order, html)

    def _src(m: re.Match) -> str:
        if m.group(2) != "pt":
            notes.append("audio por defecto -> PT")
        return f"{m.group(1)}pt{m.group(3)}"

    html = SRC_RX.sub(_src, html)
    return html, notes


def install(portal_id: str, apply: bool) -> str:
    repo_path, branch = REPOS[portal_id]
    repo = Path(repo_path)
    campus = repo / "campus"
    voces_src = PORTALS / portal_id / "voces"
    voces_dst = campus / "voces"

    if not campus.exists():
        return "sin campus/ — omitido"
    if not (voces_src / "manifest.json").exists():
        return "sin clips generados — ejecuta gen_voice.py primero"

    page = campus / "index.html"
    html = page.read_text(encoding="utf-8")
    fixed, notes = fix_select(html)

    clips = sorted(p for p in voces_src.glob("*.mp3"))
    msg = f"{len(clips)} clips + select ({', '.join(notes) or 'sin cambios'})"
    if not apply:
        return "DRY-RUN " + msg

    if fixed != html:
        page.write_text(fixed, encoding="utf-8")
    voces_dst.mkdir(parents=True, exist_ok=True)
    for p in clips:
        shutil.copy2(p, voces_dst / p.name)
    for sub in PO:
        src_dir = voces_src / sub
        if src_dir.is_dir():
            dst_dir = voces_dst / sub
            dst_dir.mkdir(parents=True, exist_ok=True)
            for p in src_dir.glob("*.mp3"):
                shutil.copy2(p, dst_dir / p.name)
    shutil.copy2(voces_src / "manifest.json", voces_dst / "manifest.json")

    run(["git", "add", "campus/index.html", "campus/voces"], repo, check=True)
    if not run(["git", "status", "--porcelain"], repo).strip():
        return "sin cambios"
    run(["git", "commit", "-m",
         "feat(voz): audio real PT>ES>EN>CA pre-renderizado + orden de idiomas corregido"],
        repo, check=True)
    run(["git", "pull", "--rebase", "origin", branch], repo)
    out = run(["git", "push", "origin", branch], repo)
    ok = "rejected" not in out.lower() and "error" not in out.lower()
    return ("publicado" if ok else f"push fallido: {out[-200:]}") + f" [{branch}] {msg}"


def main() -> int:
    apply = "--apply" in sys.argv
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    targets = wanted or list(REPOS)
    for portal_id in targets:
        if portal_id not in REPOS:
            print(f"{portal_id:<22} portal desconocido")
            continue
        try:
            print(f"{portal_id:<22} {install(portal_id, apply)}", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"{portal_id:<22} ERROR {str(exc)[:220]}", flush=True)
    if not apply:
        print("\n(dry-run) ejecuta con --apply para escribir y publicar")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

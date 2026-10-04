"""Publica los packs de portals/ dentro de cada repositorio educativo.

Escribe el pack en DOS sitios:
  1. `open-data/` en la raiz del repo  -> fuente canonica y lo que sirve
     GitHub Pages cuando publica desde la raiz (open-school, WILLIAMSCHOOL).
  2. El directorio de entrada estatico del build (`client/public` o `public`)
     -> asi el build lo copia a su salida y lo sirve Vercel/Netlify.

Sin el paso 2 el pack existe en el repo pero NINGUNA web lo sirve: es el fallo
que motivó este cambio.

Uso:
    python publish_packs.py                      # dry-run, todos los portales
    python publish_packs.py --apply              # publica todos
    python publish_packs.py --apply open-school  # solo uno
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

# repo -> (rama por defecto, directorio de entrada estatico del build o None)
# None = el build ya publica la raiz del repo, no hay que duplicar nada.
DESTINO: dict[str, tuple[str, str | None]] = {
    "belentani7/lingua-aberta": ("duck", "client/public"),
    "belentani7/linguaforge": ("main", "client/public"),
    "belentani7/ManosAbiertas": ("main", "public"),
    "belentani7/secure-t-university": ("main", None),
    "belentani7/ux-academy-professional-program": ("main", "client/public"),
    "belentani7/open-school": ("main", "client/public"),
    "belentani7/WILLIAMSCHOOL": ("main", None),
    "belentani7/aprende-brasil": ("main", "client/public"),
    "belentani7/lingua-aberta-empresa": ("main", "public"),
    "belentani7/Cruzando-el-charco": ("main", None),
    "belentani7/secure-t": ("main", "client/public"),
    "belentani7/manos-abiertas-2026": ("main", None),
}

README = """# open-data

Contenido educativo generado desde APIs abiertas verificadas (sin credenciales).

- `index.html` — portal de referencia con los temas completos y sus fuentes.
- `topics.json` — manifiesto: temas, fuentes usadas, estado de cada llamada.
- `data/<tema>.json` — datos crudos por tema, listos para renderizar.

Orden de idiomas del ecosistema: **PT > ES > EN > CA**.

Las fuentes y licencias de cada dato estan en `topics.json`. Revisa la licencia
concreta antes de uso comercial. Regeneracion: `python enrich_portals.py <portal>`
en el proyecto `edu-open-data`.
"""


def run(args: list[str], cwd: Path | None = None, check: bool = True) -> str:
    proc = subprocess.run(
        args, cwd=cwd, text=True, encoding="utf-8", errors="replace", capture_output=True, check=False
    )
    if check and proc.returncode != 0:
        raise RuntimeError(
            f"{' '.join(args)} -> {proc.returncode}\n"
            f"{(proc.stdout or '')[-400:]}{(proc.stderr or '')[-400:]}"
        )
    return (proc.stdout or "") + (proc.stderr or "")


def escribe_pack(portal: Path, dest: Path) -> int:
    """Escribe el pack completo en dest. Devuelve el numero de temas."""
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    shutil.copy2(portal / "index.html", dest / "index.html")
    shutil.copy2(portal / "topics.json", dest / "topics.json")
    shutil.copytree(portal / "data", dest / "data")
    (dest / "README.md").write_text(README, encoding="utf-8")
    return len(list((portal / "data").glob("*.json")))


def publica(portal: Path, apply: bool) -> tuple[str, str]:
    manifest = json.loads((portal / "topics.json").read_text(encoding="utf-8"))
    repo = manifest["repo"]
    branch, entrada = DESTINO.get(repo, ("main", None))
    nombre = repo.split("/")[-1]
    n_temas = len(list((portal / "data").glob("*.json")))

    if not apply:
        extra = f" + {entrada}/open-data/" if entrada else " (raiz ya publicada)"
        return nombre, f"DRY-RUN {n_temas} temas -> {nombre}/open-data/{extra}"

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / nombre
        run(["git", "clone", "--depth", "1", "--branch", branch,
             f"https://github.com/{repo}.git", str(work)])
        escribe_pack(portal, work / "open-data")
        tocados = ["open-data"]
        if entrada:
            escribe_pack(portal, work / entrada / "open-data")
            tocados.append(f"{entrada}/open-data")

        run(["git", "add", *tocados], cwd=work)
        if not run(["git", "status", "--porcelain"], cwd=work).strip():
            return nombre, "sin cambios"
        run(["git", "commit", "-m",
             f"feat(open-data): pack de {n_temas} temas desde APIs abiertas + copia servible en {entrada or 'raiz'}"],
            cwd=work)
        run(["git", "pull", "--rebase", "origin", branch], cwd=work)
        out = run(["git", "push", "origin", branch], cwd=work)
        fallo = "rejected" in out.lower() or "error" in out.lower() or "fatal" in out.lower()
        return nombre, (f"publicado [{branch}] {n_temas} temas" if not fallo else f"push fallido: {out[-200:]}")


def main() -> int:
    apply = "--apply" in sys.argv
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    portales = sorted(p for p in PORTALS.iterdir() if (p / "topics.json").exists())
    if wanted:
        portales = [p for p in portales if p.name in wanted]
    for portal in portales:
        try:
            nombre, estado = publica(portal, apply)
            print(f"{nombre:<36} {estado}", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"{portal.name:<36} ERROR {str(exc)[:220]}", flush=True)
    if not apply:
        print("\n(dry-run) ejecuta con --apply para publicar")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""Genera documento Markdown explicando que es y para que sirve cada repo de belentani7.

Uso:
    python gen_repo_catalog.py            # escribe BELENTANI-REPOS.md
    python gen_repo_catalog.py --json     # tambien exporta repos_catalog.json

Datos: gh CLI (name, description, language, pushedAt, isArchived, homepage, stars)
      + repos-triage.csv si existe (categoria).
Sin dependencias externas.
"""

from __future__ import annotations

import csv
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
HOME = Path.home()
TRIAGE = HOME / "repos-triage.csv"
OUT_MD = HOME / "Desktop" / "BELENTANI-REPOS.md"
OUT_JSON = ROOT / "repos_catalog.json"

GH_FIELDS = "name,description,primaryLanguage,pushedAt,isArchived,homepage,stargazerCount,repositoryTopics,diskUsage,visibility"
API_FIELDS = "name,description,language,pushed_at,archived,homepage,stargazers_count,topics,size,visibility,fork"

CATEGORY_TITLES = {
    "flagship": "Flagship (nucleo del negocio)",
    "edu": "Educacion y campus",
    "artista": "Artista / musica / portfolio",
    "pro": "Profesional / CV / fiscal",
    "tool": "Herramientas propias",
    "trash": "Sin categoria clara / duplicados / archivo",
}

# Pistas para inferir proposito cuando la descripcion falta.
GUESS = [
    ("-docs", "Documentacion de acompanamiento"),
    ("backup", "Copia de seguridad"),
    ("archive", "Archivo historico"),
    ("export", "Export de conversacion o entrega"),
    ("skills", "Pack de skills para agentes"),
    ("mcp", "Integracion MCP"),
    ("cli", "Herramienta de linea de comandos"),
    ("agent", "Agente autonomo"),
    ("dashboard", "Panel de control"),
    ("template", "Plantilla base"),
    ("starter", "Proyecto base reutilizable"),
    ("game", "Juego"),
    ("shop", "Tienda / ecommerce"),
    ("store", "Tienda / ecommerce"),
]


def gh_repos() -> list[dict]:
    """Todos los repos del propietario via API REST (paginado)."""
    repos: list[dict] = []
    page = 1
    while True:
        out = subprocess.run(
            [
                "gh",
                "api",
                f"/user/repos?per_page=100&affiliation=owner&page={page}",
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            check=True,
        ).stdout
        batch = json.loads(out)
        if not batch:
            break
        repos.extend({k: item.get(k) for k in API_FIELDS.split(",")} for item in batch)
        if len(batch) < 100:
            break
        page += 1
    return repos


def triage() -> dict[str, str]:
    if not TRIAGE.exists():
        return {}
    with TRIAGE.open(encoding="utf-8-sig", newline="") as fh:
        return {row["name"]: row.get("cat", "trash") for row in csv.DictReader(fh)}


def guess_purpose(name: str, description: str | None) -> str:
    if description and description.strip():
        return description.strip()
    low = name.lower()
    for needle, why in GUESS:
        if needle in low:
            return f"{why} (inferido del nombre)"
    return "SIN DESCRIPCION - revisar y completar"


def fmt_date(value: str | None) -> str:
    if not value:
        return "-"
    return value[:10]


def main() -> int:
    repos = gh_repos()
    cats = triage()
    rows = []
    for repo in repos:
        name = repo["name"]
        rows.append(
            {
                "name": name,
                "cat": cats.get(name, "trash"),
                "what": guess_purpose(name, repo.get("description")),
                "lang": repo.get("language") or "-",
                "pushed": fmt_date(repo.get("pushed_at")),
                "archived": bool(repo.get("archived")),
                "homepage": repo.get("homepage") or "",
                "stars": repo.get("stargazers_count") or 0,
                "kb": repo.get("size") or 0,
                "visibility": repo.get("visibility") or "public",
                "fork": bool(repo.get("fork")),
                "topics": list(repo.get("topics") or []),
            }
        )

    if "--json" in sys.argv:
        OUT_JSON.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")

    order = ["flagship", "edu", "artista", "pro", "tool", "trash"]
    by_cat: dict[str, list[dict]] = {key: [] for key in order}
    for row in rows:
        by_cat.setdefault(row["cat"], []).append(row)
    for bucket in by_cat.values():
        bucket.sort(key=lambda r: r["name"].lower())

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Catalogo de repositorios - belentani7",
        "",
        f"Generado: {now}  ",
        f"Total: {len(rows)} repos  |  "
        + "  ".join(f"{CATEGORY_TITLES.get(k, k)}: {len(v)}" for k, v in by_cat.items() if v),
        "",
        "Criterio de categorias: `flagship` = nucleo del negocio; `edu` = campus y",
        "formacion; `artista` = musica/arte/portfolio; `pro` = marca profesional;",
        "`tool` = herramientas propias; `trash` = archivo, duplicado o sin rumbo claro.",
        "Estado `archivado` = solo lectura, recuperable con",
        "`gh api -X PATCH repos/belentani7/<repo> -f archived=false`.",
        "",
    ]

    for cat in order:
        bucket = by_cat.get(cat) or []
        if not bucket:
            continue
        lines.append(f"## {CATEGORY_TITLES.get(cat, cat)} ({len(bucket)})")
        lines.append("")
        lines.append("| Repo | Que es y para que sirve | Lenguaje | Ultimo push | Enlace | Estado |")
        lines.append("|---|---|---|---|---|---|")
        for row in bucket:
            state = []
            if row["archived"]:
                state.append("archivado")
            if row["visibility"] != "public":
                state.append(row["visibility"])
            link = f"[web]({row['homepage']})" if row["homepage"] else "-"
            what = row["what"].replace("|", "/")
            lines.append(
                f"| `{row['name']}` | {what} | {row['lang']} | {row['pushed']} | {link} | "
                f"{', '.join(state) if state else 'activo'} |"
            )
        lines.append("")

    lines += [
        "## Como mantenerlo",
        "",
        "```powershell",
        "python gen_repo_catalog.py --json   # regenera este documento",
        "```",
        "",
        "Fuente de datos: GitHub API via `gh` + `repos-triage.csv` (categorias).",
        "Los repos con `SIN DESCRIPCION` necesitan una linea de descripcion en GitHub",
        "para que el catalogo sea util a terceros.",
        "",
    ]

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    missing = sum(1 for r in rows if r["what"].startswith("SIN DESCRIPCION"))
    archived = sum(1 for r in rows if r["archived"])
    print(f"Escrito {OUT_MD} ({len(rows)} repos, {archived} archivados, {missing} sin descripcion)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

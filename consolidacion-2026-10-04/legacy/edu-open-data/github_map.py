"""Mapa descriptivo del estado de GitHub de belentani7.

ALCANCE: perfil + ficha de repositorio (metadatos). NO lee ficheros, README,
commits, ramas, issues ni codigo. Todo sale de `gh repo list --json` (metadatos)
y `gh api user` (perfil).

Las conexiones entre repos son INFERIDAS de metadatos compartidos (topics,
lenguaje, raiz del nombre) y se declaran como inferencias, nunca como
dependencias tecnicas verificadas.

Salidas:
  _audit/mapa-github-belentani7.md
  _audit/mapa-github-belentani7.json
"""
from __future__ import annotations

import io
import json
import os
import re
import subprocess
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
AUDIT = os.path.join(ROOT, "_audit")
OUT_MD = os.path.join(AUDIT, "mapa-github-belentani7.md")
OUT_JSON = os.path.join(AUDIT, "mapa-github-belentani7.json")
OWNER = "belentani7"

FIELDS = ("name,description,primaryLanguage,isArchived,isPrivate,defaultBranchRef,"
          "updatedAt,pushedAt,url,repositoryTopics")

REPO_QUERY = ("user/repos?per_page=100&affiliation=owner&sort=pushed"
              "&direction=desc")

# Repos de cliente: solo lectura, jamas modificar. Se marcan en el mapa.
# OJO: este patron es MAS AMPLIO que la lista prohibida declarada por el usuario
# (incluye entrenador-jorge y rh-fiscal). Marcar de mas es seguro; marcar de menos no.
CLIENTES = re.compile(
    r"michelle|relayze|steven|natalia|carquide|carquidec|arte-que-veste|sabons|marcia|"
    r"cuidar|backup-no-tocar|entrenador-jorge|rh-fiscal", re.I)

# (cluster, patron) — el PRIMER patron que casa gana. Orden deliberado.
RULES: list[tuple[str, str]] = [
    ("duck", r"\bduck\b|duckzion|zion|\bduck-|heyduck|iDuck"),
    ("educacion_emocional", r"tender-words|abrazo|harmonia"),
    ("civico_acogida", r"cruzando-el-charco|manos-abiertas|manosabiertas|migra|"
                       r"acogida|arraigo|orientacion migratoria"),
    ("educacion", r"school|academy|univers|curso|educa|lingua|william|oculus|"
                  r"open-school|secure-t|ux-academy|aprend|profess|eduforge|"
                  r"vikidia|belentani-monorepo"),
    ("musica_audio", r"music|studio|audio|sonoro|sound|deck|beat|vocal|"
                     r"cinematic-prompt|comfyui|vfx|video-forge|temporal-artifact|"
                     r"latent-consistency|pbr-validator|fashion-stylist|gpu-cost"),
    ("ia_skills", r"skill|agent|qbp|pvc-u|protocol|meta-?skill|codex|claude|ollama|"
                  r"omniagent|proofmesh|evidence-ledger|oss-compass|registro-proyectos|"
                  r"gestalt|noiacore|belentani-infrastructure|alibaba|cli-coder|"
                  r"premium-effects|securetea|gpu-cost-optimizer"),
    ("creativo_portfolio", r"judas|portfolio|belentaniexperience|design-hub|omega|"
                           r"uijudas|\bui\b|hack-visual|nebula|alquitara|bros|3dfactory|"
                           r"belentani\.ux|slide|immersive|artista"),
    ("servicios", r"arte-que-veste|entrenador|rh-fiscal|steven|michelle|relayze|"
                  r"carquide|netlify|nebula-cosmos|workforce|\bclt\b|esocial"),
    ("industrial_3d", r"aurea3d|fazluiz3d|\b3d\b|\bcad\b|additive|manufactur|"
                      r"industria|belentani3dfactory"),
    ("contenido_media", r"vertical-content|reels|shorts|content-orchestr|storyboard|"
                        r"\bvideo\b|\bcine\b"),
    ("literario_ensayo", r"ensayo|relato|literar|obra\b|cassandra|enigma|mistico|"
                         r"cronica|poem|novela|conciencia|cognicion|filosof"),
    ("archivo_privado", r"archivo|archive|backup|preservaci|snapshot|export-|"
                        r"private|privado"),
    ("infra_so", r"os\b|workspace|openclaw|win11|\bpower\b|newbelentani|nexus|"
                 r"belentani-v2|local-agent|myopenhands|deepseek-fix|relayze|netlify"),
]

# Relevancia educativa: lo que el usuario pidio interconectar.
EDU_CLUSTERS = ("educacion", "civico_acogida", "educacion_emocional", "ia_skills")

STOP = {"de", "la", "el", "y", "en", "con", "para", "del", "los", "las", "a", "o",
        "the", "of", "and", "for", "to", "ai", "web", "app", "apps", "2026"}


def gh_json(args: list[str]):
    p = subprocess.run(["gh"] + args, capture_output=True, text=False)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.decode("utf-8", "replace")[:400])
    return json.loads(p.stdout.decode("utf-8", "replace"))


def list_repos() -> list[dict]:
    """REST paginado: trae has_pages, topics y default_branch que `repo list` no da."""
    pages = gh_json(["api", "--paginate", "--slurp",
                     "-H", "Accept: application/vnd.github+json", REPO_QUERY])
    flat = [r for page in pages for r in page]
    out = []
    for r in flat:
        out.append({
            "name": r["name"],
            "desc_raw": r.get("description"),
            "lang": r.get("language") or "—",
            "isArchived": bool(r.get("archived")),
            "isPrivate": bool(r.get("private")),
            "hasPages": bool(r.get("has_pages")),
            "isFork": bool(r.get("fork")),
            "url": r.get("html_url"),
            "branch": r.get("default_branch") or "—",
            "updatedAt": r.get("updated_at"),
            "pushedAt": r.get("pushed_at"),
            "topics": r.get("topics") or [],
        })
    return out


def slug(text: str) -> str:
    t = unicodedata.normalize("NFKD", text or "")
    t = t.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def tokens(text: str) -> set[str]:
    return {w for w in slug(text).split() if len(w) > 3 and w not in STOP}


def classify(name: str, desc: str, topics: list[str]) -> str:
    blob = " ".join([name, desc or "", " ".join(topics or [])])
    for cluster, pat in RULES:
        if re.search(pat, blob, re.I):
            return cluster
    return "otro"


def stem(name: str) -> str:
    """Raiz del nombre para agrupar variantes (belentani-judas-* -> belentani-judas)."""
    n = re.sub(r"-(v\d+|20\d\d(?:-\d\d-\d\d)?|backup\w*|public|premium|master|pro|"
               r"unified|static|template|portal|hub|lab|docs|web|omega)$", "", name, flags=re.I)
    return n.lower()


def main():
    os.makedirs(AUDIT, exist_ok=True)
    print("--- mapa github belentani7 (solo metadatos) ---")
    profile = gh_json(["api", "user"])
    repos = list_repos()
    print(f"  repos: {len(repos)}")

    for r in repos:
        r["desc"] = (r.pop("desc_raw") or "").strip()
        r["cluster"] = classify(r["name"], r["desc"], r["topics"])
        r["cliente"] = bool(CLIENTES.search(r["name"]))
        r["token_set"] = sorted(tokens(r["name"] + " " + r["desc"] + " " +
                                       " ".join(r["topics"])))

    by_cluster = defaultdict(list)
    for r in repos:
        by_cluster[r["cluster"]].append(r)
    for v in by_cluster.values():
        v.sort(key=lambda x: (x["isArchived"], x["name"]))

    # --- interconexiones educativas (inferidas de metadatos, no de dependencias) ---
    edu = [r for r in repos if r["cluster"] in EDU_CLUSTERS]
    edges = []
    for i, a in enumerate(edu):
        ta = set(a["token_set"])
        for b in edu[i + 1:]:
            tb = set(b["token_set"])
            shared = ta & tb
            topics_a, topics_b = set(a["topics"]), set(b["topics"])
            shared_topics = topics_a & topics_b
            weight = 3 * len(shared) + 4 * len(shared_topics)
            if a["lang"] == b["lang"] and a["lang"] != "—":
                weight += 1
            if stem(a["name"]) == stem(b["name"]):
                weight += 5
            if weight >= 8:
                edges.append({"a": a["name"], "b": b["name"], "peso": weight,
                              "palabras": sorted(shared)[:8],
                              "topics": sorted(shared_topics)[:6],
                              "misma_raiz": stem(a["name"]) == stem(b["name"]),
                              "mismo_lenguaje": a["lang"] == b["lang"]})
    edges.sort(key=lambda e: -e["peso"])

    # --- enlaces a Belentani (identidad) y a DUCK (nucleo creativo) ---
    duck = [r for r in repos if r["cluster"] == "duck"]
    links_belentani = [{"repo": r["name"], "señal": señal}
                       for r in repos
                       for señal in [(
                           "nombre lleva 'belentani'" if "belentani" in r["name"].lower()
                           else "descripción menciona Belentani"
                           if "belentani" in r["desc"].lower()
                           else "topic belentani"
                           if any("belentani" in t.lower() for t in r["topics"])
                           else None)] if señal]
    links_duck = [{"repo": r["name"], "señal": "cluster DUCK"} for r in duck]

    stats = {
        "generado_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "alcance": "perfil + ficha de repositorio; sin leer archivos, README, commits ni issues",
        "owner": OWNER,
        "perfil": {
            "name": profile.get("name"),
            "login": profile.get("login"),
            "bio": profile.get("bio"),
            "company": profile.get("company"),
            "location": profile.get("location"),
            "blog": profile.get("blog"),
            "public_repos": profile.get("public_repos"),
            "followers": profile.get("followers"),
            "following": profile.get("following"),
            "created_at": profile.get("created_at"),
            "updated_at": profile.get("updated_at"),
        },
        "totales": {
            "repos_visibles": len(repos),
            "publicos": sum(1 for r in repos if not r["isPrivate"]),
            "privados": sum(1 for r in repos if r["isPrivate"]),
            "activos": sum(1 for r in repos if not r["isArchived"]),
            "archivados": sum(1 for r in repos if r["isArchived"]),
            "con_pages": sum(1 for r in repos if r.get("hasPages")),
            "sin_descripcion": sum(1 for r in repos if not r["desc"]),
            "clientes": sum(1 for r in repos if r["cliente"]),
        },
        "por_lenguaje": dict(Counter(r["lang"] for r in repos).most_common()),
        "por_cluster": {k: len(v) for k, v in sorted(by_cluster.items(),
                                                     key=lambda kv: -len(kv[1]))},
        "educativos": {
            "total": len(edu),
            "por_cluster": {c: sum(1 for r in edu if r["cluster"] == c)
                            for c in EDU_CLUSTERS},
            "interconexiones": edges,
        },
        "duck": {"total": len(duck), "repos": [r["name"] for r in duck]},
        "enlaces_belentani": links_belentani,
        "repos": [{k: v for k, v in r.items() if k != "token_set"} for r in repos],
    }
    with io.open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(stats, fh, ensure_ascii=False, indent=1)

    # ------------------------------- Markdown -------------------------------
    P = stats["perfil"]
    T = stats["totales"]
    L = []
    A = L.append
    A("# Mapa descriptivo — GitHub `belentani7`")
    A("")
    A(f"Generado: **{stats['generado_utc']}**  ")
    A("**Alcance:** perfil y ficha de repositorio (nombre, descripción, lenguaje, "
      "topics, estado, rama por defecto, fechas, Pages, visibilidad). "
      "**No** se leyeron archivos, README, código, commits, ramas, ni issues.")
    A("")
    A("> Las relaciones entre repositorios son **inferidas de metadatos compartidos** "
      "(topics, palabras de la descripción, lenguaje, raíz del nombre). "
      "No son dependencias técnicas verificadas.")
    A("")
    A("---")
    A("")
    A("## 1. Nodo raíz — el perfil")
    A("")
    A("| Campo | Valor |")
    A("|---|---|")
    A(f"| Login | `{P['login']}` |")
    A(f"| Nombre visible | {P['name']} |")
    A(f"| Organización | {P['company'] or '—'} |")
    A(f"| Ubicación | {P['location'] or '—'} |")
    A(f"| Sitio | {P['blog'] or '—'} |")
    A(f"| Biografía | {P['bio'] or '—'} |")
    A(f"| Repos públicos (GitHub) | {P['public_repos']} |")
    A(f"| Seguidores / siguiendo | {P['followers']} / {P['following']} |")
    A(f"| Cuenta creada | {P['created_at']} |")
    A(f"| Perfil actualizado | {P['updated_at']} |")
    A("")
    A("## 2. Totales verificados")
    A("")
    A("| Indicador | Valor |")
    A("|---|---|")
    for k, v in T.items():
        A(f"| {k.replace('_', ' ')} | **{v}** |")
    A("")
    A("**Lenguajes declarados** (lenguaje principal del repo):")
    A("")
    A("| Lenguaje | Repos |")
    A("|---|---|")
    for k, v in list(stats["por_lenguaje"].items()):
        A(f"| {k} | {v} |")
    A("")
    A("## 3. Clusters")
    A("")
    A("| Cluster | Repos | Qué agrupa |")
    A("|---|---|---|")
    DESC_CL = {
        "duck": "Núcleo creativo-operativo DUCK/Zion: OS, estudio, audio, apps",
        "educacion": "Escuelas, universidades, cursos, idiomas, contenido abierto",
        "civico_acogida": "Información práctica y acogida (migrantes, derechos)",
        "educacion_emocional": "Comprensión emocional, vínculos, límites",
        "ia_skills": "Skills, agentes, protocolos, validación, infraestructura de IA",
        "musica_audio": "Producción musical, audio, VFX, generación de vídeo",
        "creativo_portfolio": "Portfolio, experiencias inmersivas, marca Judas",
        "servicios": "Servicios y trabajos para terceros (ver aviso de clientes)",
        "industrial_3d": "Fabricación aditiva, CAD, 3D e integración industrial",
        "contenido_media": "Contenido vertical, vídeo, storyboard y orquestación",
        "literario_ensayo": "Ensayo, literatura, obra editorial y pensamiento",
        "archivo_privado": "Archivos, snapshots y exports de preservación",
        "infra_so": "Entornos, workspaces, shells y sistemas operativos web",
        "otro": "Sin señal suficiente en los metadatos",
    }
    for c, n in sorted(stats["por_cluster"].items(), key=lambda kv: -kv[1]):
        A(f"| `{c}` | {n} | {DESC_CL.get(c, '—')} |")
    A("")
    A("## 4. Red educativa — interconexiones")
    A("")
    A(f"Repos con señal educativa: **{stats['educativos']['total']}**  ")
    A("Desglose: " + ", ".join(f"`{k}`={v}" for k, v in
                              stats["educativos"]["por_cluster"].items()))
    A("")
    A("### 4.1 Grafo")
    A("")
    A("```mermaid")
    A("graph TD")
    A("  BEL[\"BELENTANI / belentani7<br/>nodo de identidad\"]")
    A("  DUCK[\"DUCK<br/>núcleo creativo-operativo\"]")
    A("  BEL --> DUCK")
    for c in ("educacion", "civico_acogida", "educacion_emocional", "ia_skills"):
        A(f"  BEL --> {c.upper()}[{c}]")
        A(f"  DUCK -.-> {c.upper()}")
    ids = {}
    for i, r in enumerate(edu):
        nid = "R" + str(i)
        ids[r["name"]] = nid
        A(f'  {nid}["{r["name"]}<br/>{r["lang"]}"]')
        A(f"  {r['cluster'].upper()} --> {nid}")
    for e in edges[:40]:
        A(f"  {ids[e['a']]} ---|{e['peso']}| {ids[e['b']]}")
    A("```")
    A("")
    A("### 4.2 Aristas con más señal (peso ≥8)")
    A("")
    A("| Repo A | Repo B | Peso | Señal compartida |")
    A("|---|---|---|---|")
    for e in edges[:150]:
        señal = []
        if e["misma_raiz"]:
            señal.append("misma raíz de nombre")
        if e["topics"]:
            señal.append("topics: " + ", ".join(e["topics"]))
        if e["palabras"]:
            señal.append("palabras: " + ", ".join(e["palabras"][:5]))
        if e["mismo_lenguaje"]:
            señal.append("mismo lenguaje")
        A(f"| `{e['a']}` | `{e['b']}` | {e['peso']} | {'; '.join(señal)} |")
    A("")
    A("### 4.3 Interconexión textual")
    A("")
    A("```text")
    A("                        BELENTANI  (identidad)")
    A("                             │")
    A("        ┌────────────────────┼────────────────────┐")
    A("        │                    │                    │")
    A("   EDUCACIÓN ABIERTA   EDUCACIÓN EMOCIONAL   EDUCACIÓN TÉCNICA")
    A("   + CÍVICA            (vínculos/límites)    (skills/IA)")
    A("        │                    │                    │")
    for c in ("educacion", "civico_acogida", "educacion_emocional", "ia_skills"):
        rows = by_cluster.get(c, [])
        A(f"   [{c}] {len(rows)} repos")
        for r in rows[:14]:
            flag = " (archivado)" if r["isArchived"] else ""
            A(f"      · {r['name']}{flag}")
    A("")
    A("             └──────────────┬──────────────┘")
    A("                            ▼")
    A("                    DUCK  (núcleo creativo-operativo)")
    for r in duck:
        A(f"      · {r['name']}")
    A("```")
    A("")
    A("## 5. DUCK — núcleo creativo")
    A("")
    A(f"Repos en el cluster DUCK: **{len(duck)}**")
    A("")
    A("| Repo | Lenguaje | Rama | Estado | Descripción |")
    A("|---|---|---|---|---|")
    for r in duck:
        A(f"| [`{r['name']}`]({r['url']}) | {r['lang']} | `{r['branch']}` | "
          f"{'archivado' if r['isArchived'] else 'activo'} | {r['desc'][:90] or '—'} |")
    A("")
    A("## 6. Enlaces a Belentani (identidad)")
    A("")
    A("Repos cuyo **nombre, topics o descripción** llevan la marca Belentani/Noiacore. "
      "Es la señal observable de pertenencia al ecosistema, no una dependencia.")
    A("")
    A("| Tipo de señal | Repos |")
    A("|---|---|")
    cnt = Counter(x["señal"] for x in links_belentani)
    for k, v in cnt.most_common():
        A(f"| {k} | {v} |")
    A("")
    A("## 7. Repos sin descripción — hallazgo accionable")
    A("")
    sin = [r for r in repos if not r["desc"]]
    A(f"**{len(sin)} repos** ({round(100 * len(sin) / max(1, len(repos)), 1)}%) no tienen "
      f"descripción visible. Sin descripción, la ficha del repo no comunica nada y la "
      f"clasificación de este mapa es la más débil posible. Es el mayor hueco "
      f"reparable del perfil: `gh repo edit <repo> --description \"…\"`.")
    A("")
    A("| Repo | Cluster | Visibilidad | Estado | Lenguaje |")
    A("|---|---|---|---|---|")
    for r in sorted(sin, key=lambda x: (x["cluster"], x["isArchived"], x["name"])):
        A(f"| `{r['name']}` | `{r['cluster']}` | "
          f"{'privado' if r['isPrivate'] else 'público'} | "
          f"{'archivado' if r['isArchived'] else 'activo'} | {r['lang']} |")
    A("")
    A("## 8. Inventario completo")
    A("")
    A("| Repo | Cluster | Estado | Vis. | Lenguaje | Rama | Pages | Actualizado | "
      "Cliente | Descripción |")
    A("|---|---|---|---|---|---|---|---|---|---|")
    for r in sorted(repos, key=lambda x: (x["cluster"], x["isArchived"], x["name"])):
        A(f"| [`{r['name']}`]({r['url']}) | `{r['cluster']}` | "
          f"{'archivado' if r['isArchived'] else 'activo'} | "
          f"{'privado' if r['isPrivate'] else 'público'} | {r['lang']} | `{r['branch']}` | "
          f"{'sí' if r.get('hasPages') else '—'} | {(r.get('pushedAt') or '')[:10]} | "
          f"{'⚠️ cliente' if r['cliente'] else '—'} | {r['desc'][:80] or '—'} |")
    A("")
    A("## 9. Aviso — repos de clientes")
    A("")
    A("Detectados por patrón de nombre. **Solo lectura: no tocar.** "
      "El patrón de este script es más amplio que la lista prohibida declarada: "
      "marca de más a propósito.")
    A("")
    for r in sorted([x for x in repos if x["cliente"]], key=lambda x: x["name"]):
        A(f"- `{r['name']}` — {'archivado' if r['isArchived'] else 'activo'} — {r['desc'][:90] or '—'}")
    A("")
    A("## 10. Límites de este mapa")
    A("")
    A("- No se leyeron ficheros, README, código, commits, ramas adicionales, issues, "
      "workflows, releases ni colaboradores.")
    A("- Las clasificaciones por cluster salen de reglas sobre nombre/descripción/topics; "
      "un repo mal descrito puede caer en `otro`.")
    A("- Las aristas entre repos son **inferencias de metadatos**, no dependencias.")
    A("- Si un repo no tiene descripción, su clasificación es la más débil del mapa.")
    A("")
    with io.open(OUT_MD, "w", encoding="utf-8") as fh:
        fh.write("\n".join(L) + "\n")

    print("  por cluster:", stats["por_cluster"])
    print("  educativos:", stats["educativos"]["total"],
          "aristas:", len(edges), "duck:", len(duck))
    print("  clientes marcados:", T["clientes"])
    print("  ->", OUT_MD)
    print("  ->", OUT_JSON)


if __name__ == "__main__":
    sys.exit(main())

"""M1.3 - Clasifica por area (puntuacion de palabras clave) y deduplica.

Entrada : registry/_intake/raw_public_apis.json + raw_catalogs.json
Salida  : registry/_intake/approved_candidates.json     (union deduplicada)
          registry/_intake/sin_clasificar.json          (area no resuelta)
          registry/_intake/review_queue.md              (tabla revisable)
          registry/_intake/_stats.json

Regla: ESCUELAS PRIMERO. Empate de puntuacion -> gana el area mas educativa.
Las semillas curadas ganan el dedupe frente a public-apis.
"""
import io
import json
import os
import re
import sys
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.abspath(__file__))
INTAKE = os.path.join(ROOT, "registry", "_intake")
MERGED = os.path.join(ROOT, "registry", "_merged.json")

# (patron, peso). Puntuacion = suma de pesos de coincidencias.
AREA_KEYWORDS = {
    "academico": [
        (r"\beducation(al)?\b", 4), (r"\bschool(s)?\b", 4), (r"\buniversit(y|ies)\b", 4),
        (r"\bcollege\b", 3), (r"\bstudent(s)?\b", 3), (r"\bteacher(s)?\b", 3),
        (r"\bcourse(s)?\b", 3), (r"\btextbook(s)?\b", 3), (r"\bcurricul", 3),
        (r"\bacadem", 3), (r"\bcampus\b", 3), (r"\bclassroom\b", 3),
        (r"\boer\b", 4), (r"\bmooc\b", 4), (r"\blms\b", 3), (r"\bk-?12\b", 4),
        (r"\bthesis\b", 2), (r"\bdissertation\b", 2), (r"\bscholar", 3),
        (r"\bpreprint\b", 2), (r"\bcitation(s)?\b", 2), (r"\bdoi\b", 1),
        (r"\bpaper(s)?\b", 1), (r"\bjournal(s)?\b", 2), (r"\bencyclopedia\b", 3),
        (r"\blibrar(y|ies)\b", 2), (r"\bbook(s)?\b", 2), (r"\bexam(s)?\b", 3),
        (r"\bsyllabus\b", 3), (r"\bedtech\b", 3),
        (r"escola", 4), (r"universid", 4), (r"educa(c|ç)", 4),
        (r"\baprendiz", 3), (r"\bensino\b", 4), (r"\bprofessor", 3),
        (r"\baluno", 3), (r"\bcurso(s)?\b", 3),
        (r"\buniversity\s+of\b", 3), (r"\bresearch\b", 2), (r"\bscience\s*&\s*math\b", 3),
    ],
    "idiomas": [
        (r"\blanguag", 4), (r"\bdictionar", 4), (r"\btranslate\b", 4),
        (r"\btranslation\b", 4), (r"\bthesaurus\b", 4), (r"\bvocabular", 4),
        (r"\bgrammar\b", 4), (r"\bspell", 4), (r"\bpronunciation\b", 4),
        (r"\bcorpus\b", 3), (r"\bethymolog", 3), (r"\blinguist", 4),
        (r"\bwiktionar", 4), (r"\bword(s)?\b", 2), (r"\bidio?m(a|as)\b", 4),
        (r"\blengua\b", 4), (r"\bdicionario\b", 4), (r"\bfrase(s)?\b", 3),
        (r"\bfrequency\s*words\b", 4), (r"\bnlp\b", 2), (r"\btoken", 1),
        (r"\btransl", 4), (r"\bmultilingual\b", 3), (r"\blocale\b", 2),
    ],
    "civico_derechos": [
        (r"\bgovernment\b", 3), (r"\blaw(s|ful)?\b", 3), (r"\blegal\b", 3),
        (r"\blegislation\b", 4), (r"\bbill(s)?\b", 2), (r"\bcongress\b", 4),
        (r"\bparliament\b", 4), (r"\bsenate\b", 4), (r"\bcivic(s)?\b", 4),
        (r"\bvot(e|ing)\b", 3), (r"\belection(s)?\b", 4), (r"\bhuman\s*rights?\b", 5),
        (r"\btreat(y|ies)\b", 3), (r"\brefugee(s)?\b", 4), (r"\bjustice\b", 3),
        (r"\bcourt(s)?\b", 3), (r"\btransparency\b", 3), (r"\bdemocracy\b", 4),
        (r"\bpolitic", 3), (r"\bgovernance\b", 3), (r"\bhumanitarian\b", 3),
        (r"\bconstitution", 4), (r"\bopen\s*data\b", 2), (r"\beur-?lex\b", 4),
    ],
    "ciberseguridad": [
        (r"\bsecurity\b", 3), (r"\bcve\b", 5), (r"\bvulnerab", 5),
        (r"\bexploit", 4), (r"\bmalware\b", 5), (r"\bphish", 5), (r"\bthreat", 4),
        (r"\bcyber", 4), (r"\bfirewall\b", 4), (r"\bpentest", 5), (r"\bowasp\b", 5),
        (r"\bmitre\b", 5), (r"\bvirus\b", 4), (r"\banti-?malware\b", 5),
        (r"\bencryption\b", 3), (r"\bblocklist\b", 4), (r"\badvisor(y|ies)\b", 3),
        (r"\bransomware\b", 5), (r"\bbotnet\b", 5), (r"\bpassword\b", 3),
        (r"\bprivacy\b", 3), (r"\bhash\b", 2), (r"\bblacklist\b", 4),
        (r"\bcwe\b", 5), (r"\bcapec\b", 5), (r"\bepss\b", 5),
    ],
    "ux_diseno": [
        (r"\bdesign\b", 3), (r"\bicon(s)?\b", 5), (r"\bfont(s)?\b", 4),
        (r"\btypograph", 5), (r"\bcolou?r\b", 4), (r"\bpalette\b", 5),
        (r"\bui\b", 3), (r"\bux\b", 4), (r"\bimage(s)?\b", 2),
        (r"\bphoto(s)?\b", 2), (r"\billustration", 4), (r"\bwireframe", 5),
        (r"\baccessibilit", 4), (r"\bsvg\b", 4), (r"\bemoji\b", 5),
        (r"\bcss\b", 3), (r"\btheme(s)?\b", 3), (r"\bunsplash\b", 4),
        (r"\bmockup", 4), (r"\bavatar", 3), (r"\basset(s)?\b", 2),
    ],
    "patrimonio_arte": [
        (r"\bmuseum", 5), (r"\bart(s|ist)?\b", 3), (r"\bheritage\b", 5),
        (r"\bculture\b", 3), (r"\bhistor(y|ic)", 2), (r"\barchaeolog", 5),
        (r"\bpaint", 4), (r"\bsculpture\b", 5), (r"\bmusic\b", 4),
        (r"\baudio\b", 3), (r"\bsong(s)?\b", 3), (r"\balbum(s)?\b", 3),
        (r"\bliterature\b", 4), (r"\bmanuscript", 5), (r"\barchive(s)?\b", 3),
        (r"\bgaller(y|ies)\b", 5), (r"\bmuseo", 5), (r"\bpatrimoni", 5),
        (r"\bartist", 4), (r"\bpoetry\b", 4), (r"\bpublic\s*domain\b", 3),
    ],
    "ciencia_salud": [
        (r"\bhealth\b", 4), (r"\bmedic", 4), (r"\bdisease(s)?\b", 4),
        (r"\bdrug(s)?\b", 3), (r"\bclinical\b", 4), (r"\bbiology\b", 4),
        (r"\bgene(s|tic)", 4), (r"\bprotein", 4), (r"\bchemistr", 4),
        (r"\bphysics\b", 4), (r"\bastronom", 4), (r"\bspace\b", 4),
        (r"\bnutrition\b", 4), (r"\bfood\b", 3), (r"\bspecies\b", 4),
        (r"\bbiodiversit", 4), (r"\bweather\b", 3), (r"\bclimate\b", 3),
        (r"\bhospital", 3), (r"\bpatient", 3), (r"\benvironment", 2),
        (r"\bgeolog", 4), (r"\bplant(s)?\b", 3), (r"\banimal(s)?\b", 3),
        (r"\bearthquake", 4), (r"\bnasa\b", 4), (r"\bscience\b", 2),
    ],
    "datos_pais": [
        (r"\bcountr(y|ies)\b", 4), (r"\bgeocod", 5), (r"\bgeolocation\b", 5),
        (r"\bmap(s|ping)?\b", 4), (r"\bcit(y|ies)\b", 3), (r"\bplace(s)?\b", 3),
        (r"\bpopulation\b", 4), (r"\bstatistic", 3), (r"\beconom(y|ic)\b", 4),
        (r"\bgdp\b", 5), (r"\bcurrenc(y|ies)\b", 3), (r"\bcensus\b", 5),
        (r"\bboundar(y|ies)\b", 4), (r"\bregion(s)?\b", 2), (r"\btimezone", 4),
        (r"\bpostal\b", 4), (r"\bzip\s*code", 4), (r"\bgeograph", 3),
        (r"\bworld\s*bank\b", 5), (r"\beurostat\b", 5), (r"\boecd\b", 4),
        (r"\bip\s*(address|geoloc)", 4), (r"\biso\s*(code|3166)", 4),
        (r"\bholiday", 3), (r"\bexchange\s*rate", 4), (r"\bearthquake", 3),
    ],
}

# Empate -> gana antes en esta lista (escuelas arriba).
TIEBREAK = ["academico", "idiomas", "civico_derechos", "ciencia_salud",
            "datos_pais", "ciberseguridad", "ux_diseno", "patrimonio_arte"]

COMPILED = {
    area: [(re.compile(p, re.I), w) for p, w in rules]
    for area, rules in AREA_KEYWORDS.items()
}

SOURCE_PRIORITY = {"catalogs": 0, "public-apis": 1}


def load(path):
    if not os.path.exists(path):
        return []
    with io.open(path, encoding="utf-8") as fh:
        doc = json.load(fh)
    if isinstance(doc, list):
        return doc
    if "entries" in doc:
        return doc["entries"]
    # registry/_merged.json: {meta:..., <area>: [entradas...]}
    out = []
    for key, val in doc.items():
        if key == "meta" or not isinstance(val, list):
            continue
        out.extend(val)
    return out


def host_path(url):
    m = re.match(r"^[a-z]+://(?P<h>[^/:?#]+)(?P<p>[^?#]*)", url, re.I)
    if not m:
        return url.lower(), ""
    host = m.group("h").lower()
    if host.startswith("www."):
        host = host[4:]
    path = m.group("p").rstrip("/").lower()
    return host, path


def score_row(row):
    text = " ".join([
        row.get("name") or "",
        row.get("descripcion") or "",
        row.get("categoria_public_apis") or "",
        " ".join(row.get("topics") or []),
        row.get("url") or "",
    ])
    scores = {}
    for area, rules in COMPILED.items():
        total = sum(w for rx, w in rules if rx.search(text))
        if total:
            scores[area] = total
    if not scores:
        return "sin_clasificar", 0, {}
    best = max(scores.values())
    tied = [a for a, v in scores.items() if v == best]
    if len(tied) > 1:
        tied.sort(key=TIEBREAK.index)
    return tied[0], best, scores


def main():
    public = load(os.path.join(INTAKE, "raw_public_apis.json"))
    curated = load(os.path.join(INTAKE, "raw_catalogs.json"))
    existing = {r.get("id") for r in load(MERGED)}

    pool = curated + public                     # semillas primero en el dedupe
    pool.sort(key=lambda r: SOURCE_PRIORITY.get(r.get("source", ""), 9))

    kept, seen, stats = [], {}, Counter()
    reassigned = 0
    for row in pool:
        host, path = host_path(row["url"])
        key = host + path
        if key in seen:
            stats["dedupe_host_path"] += 1
            continue
        seen[key] = row["id"]

        area = row.get("area") or "sin_clasificar"
        if area == "sin_clasificar":
            area, sc, allc = score_row(row)
            row["_score"] = sc
            row["_score_all"] = allc
            if area != "sin_clasificar":
                reassigned += 1
        row["area"] = area
        row["already_registered"] = row["id"] in existing
        kept.append(row)

    kept.sort(key=lambda r: (TIEBREAK.index(r["area"]) if r["area"] in TIEBREAK else 99,
                             SOURCE_PRIORITY.get(r.get("source", ""), 9),
                             r["id"]))

    by_area = Counter(r["area"] for r in kept)
    by_q = Counter(r.get("quality", "?") for r in kept)
    unclassified = [r for r in kept if r["area"] == "sin_clasificar"]
    machine = [r for r in kept if r.get("kind") != "html"]

    os.makedirs(INTAKE, exist_ok=True)
    with io.open(os.path.join(INTAKE, "approved_candidates.json"), "w", encoding="utf-8") as fh:
        json.dump({"schema_version": 1, "total": len(kept), "entries": kept}, fh,
                  ensure_ascii=False, indent=1)
    with io.open(os.path.join(INTAKE, "sin_clasificar.json"), "w", encoding="utf-8") as fh:
        json.dump({"total": len(unclassified), "entries": unclassified}, fh,
                  ensure_ascii=False, indent=1)

    lines = ["# Cola de revision M1 - candidatas",
             "",
             f"Total candidatas deduplicadas: **{len(kept)}**  ",
             f"Maquina-legibles (kind != html): **{len(machine)}**  ",
             f"Portales solo-HTML: **{len(kept) - len(machine)}**  ",
             f"Sin clasificar: **{len(unclassified)}**  ",
             "",
             "| area | total | A | B | C | ya en registry |",
             "|---|---|---|---|---|---|"]
    for area in TIEBREAK + ["sin_clasificar"]:
        rows = [r for r in kept if r["area"] == area]
        if not rows:
            continue
        lines.append("| `{}` | {} | {} | {} | {} | {} |".format(
            area, len(rows),
            sum(1 for r in rows if r.get("quality") == "A"),
            sum(1 for r in rows if r.get("quality") == "B"),
            sum(1 for r in rows if r.get("quality") == "C"),
            sum(1 for r in rows if r.get("already_registered"))))
    lines += ["", "## Muestra por area (primeras 12)", ""]
    for area in TIEBREAK + ["sin_clasificar"]:
        rows = [r for r in kept if r["area"] == area]
        if not rows:
            continue
        lines.append(f"### {area} ({len(rows)})")
        lines.append("")
        lines.append("| id | nombre | kind | fuente | url |")
        lines.append("|---|---|---|---|---|")
        for r in rows[:12]:
            lines.append("| `{}` | {} | {} | {} | `{}` |".format(
                r["id"], r["name"][:48], r.get("kind"), r.get("source"),
                r["url"][:78]))
        lines.append("")
    with io.open(os.path.join(INTAKE, "review_queue.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    payload = {
        "candidatas_total": len(kept),
        "dedupe": dict(stats),
        "reclasificadas_por_palabras_clave": reassigned,
        "por_area": dict(by_area),
        "por_quality": dict(by_q),
        "maquina_legibles": len(machine),
        "solo_html": len(kept) - len(machine),
        "sin_clasificar": len(unclassified),
        "ya_en_registry": sum(1 for r in kept if r.get("already_registered")),
        "prioridad": TIEBREAK,
    }
    with io.open(os.path.join(INTAKE, "_stats.json"), "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)

    print("--- map_areas ---")
    print(f"  entradas union          {len(pool)}")
    print(f"  dedupe host+path        -{stats['dedupe_host_path']}")
    print(f"  CANDIDATAS              {len(kept)}")
    print(f"  maquina-legibles        {len(machine)}")
    print(f"  solo HTML (portales)    {len(kept) - len(machine)}")
    print(f"  reclasificadas          {reassigned}")
    print(f"  sin clasificar          {len(unclassified)}")
    print(f"  ya en registry(36)      {payload['ya_en_registry']}")
    print("  por area:")
    for a in TIEBREAK + ["sin_clasificar"]:
        if by_area.get(a):
            print(f"    {a:20s} {by_area[a]}")
    print("  ->", os.path.join(INTAKE, "approved_candidates.json"))


if __name__ == "__main__":
    sys.exit(main())

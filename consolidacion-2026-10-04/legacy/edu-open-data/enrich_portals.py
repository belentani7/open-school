"""Construye packs de contenido educativo a partir de las fuentes verificadas.

Cada portal define temas completos; cada tema se rellena con datos reales de las
APIs listadas en sources.json. Se genera JSON por tema, un manifiesto con
atribucion/licencia y un index.html autocontenido (portal de referencia).

Uso:
    python enrich_portals.py                 # todos los portales
    python enrich_portals.py manosabiertas   # uno concreto
Salida: portals/<portal>/{topics.json, index.html, data/<tema>.json}
"""

from __future__ import annotations

import gzip
import html
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / "portals"
UA = "BelentaniEduBot/1.0 (+https://belentani.eu; educational open-data sync)"
TIMEOUT = 30


def get(url: str, insecure: bool = False, attempts: int = 4):
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept": "*/*", "Accept-Encoding": "identity"}
    )
    ctx = ssl._create_unverified_context() if insecure else ssl.create_default_context()
    for intento in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                raw = resp.read()
                enc = resp.headers.get("Content-Encoding", "")
            break
        except urllib.error.HTTPError as exc:
            if not insecure and "CERTIFICATE_VERIFY_FAILED" in str(exc):
                return get(url, insecure=True, attempts=attempts)
            if exc.code in (429, 500, 502, 503, 504) and intento < attempts - 1:
                time.sleep(1.5 * (intento + 1))
                continue
            raise
        except Exception as exc:  # noqa: BLE001
            if not insecure and "CERTIFICATE_VERIFY_FAILED" in str(exc):
                return get(url, insecure=True, attempts=attempts)
            if intento < attempts - 1:
                time.sleep(1.5 * (intento + 1))
                continue
            raise
    if enc == "gzip" or raw[:2] == b"\x1f\x8b":
        raw = gzip.decompress(raw)
    return raw


def get_json(url: str):
    return json.loads(get(url).decode("utf-8", "replace"))


def enc(value: str) -> str:
    return urllib.parse.quote(value, safe="")


# ---------------------------------------------------------------- fetchers

def wikt_es(word: str) -> list[dict]:
    data = get_json(
        f"https://es.wiktionary.org/w/api.php?action=query&list=search&srsearch={enc(word)}&format=json&srlimit=5"
    )
    hits = data.get("query", {}).get("search", [])
    return [
        {"titulo": h["title"], "fragmento": re.sub(r"<[^>]+>", "", h.get("snippet", ""))}
        for h in hits[:5]
    ]


def wikt_en(word: str) -> list[dict]:
    data = get_json(f"https://en.wiktionary.org/api/rest_v1/page/definition/{enc(word)}")
    out = []
    for lang in data.values():
        if not isinstance(lang, list):
            continue
        for entry in lang:
            defs = [d.get("definition", "") for d in entry.get("definitions", [])][:3]
            out.append({"categoria": entry.get("partOfSpeech"), "definiciones": defs})
    return out[:4]


def wiki_summary(lang: str, title: str) -> dict:
    data = get_json(f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{enc(title)}")
    return {
        "titulo": data.get("title"),
        "resumen": data.get("extract"),
        "url": (data.get("content_urls", {}).get("desktop", {}) or {}).get("page"),
    }


def tatoeba(pair: str, seed_word: str) -> list[dict]:
    """pair: 'spa'|'por'|'eng' destino de traduccion."""
    data = get_json(
        f"https://tatoeba.org/en/api_v0/search?query={enc(seed_word)}&trans_filter=limit&trans_to={pair}"
    )
    out = []
    for s in data.get("results", [])[:6]:
        text = s.get("text", "")
        for tr in s.get("translations", [])[:1]:
            out.append({"origen": text, "traduccion": tr[0].get("text") if tr else ""})
    return out


def gutenberg(book_id: int) -> dict:
    raw = get(ENDPOINTS["gutenberg_direct"].format(book_id=book_id)).decode("utf-8", "replace")
    title = next((ln.strip() for ln in raw.splitlines() if ln.strip().startswith("The Project")), "")
    return {"id": book_id, "titulo": title, "caracteres": len(raw),
            "url": f"https://www.gutenberg.org/ebooks/{book_id}"}


def openstax(topic: str) -> list[dict]:
    # Wagtail solo devuelve meta.slug/html_url si se pide 'slug' en fields; con
    # 'fields=title' el slug llega como None y se generaba /books/None.
    # limit alto: con 40 solo se veian los primeros titulos alfabeticos y la
    # busqueda caia al fallback de libros sin relacion con el tema.
    data = get_json(
        "https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,slug&limit=300"
    )
    items = data.get("items", [])
    needle = topic.lower()
    hits = [i for i in items if needle in (i.get("title") or "").lower()]
    vacios = {"none", "null", "undefined", "", "nan"}
    libros: list[dict] = []
    for i in hits or items:
        meta = i.get("meta") or {}
        slug = str(meta.get("slug") or "").strip()
        url = meta.get("html_url") or (
            f"https://openstax.org/details/books/{slug}" if slug else ""
        )
        if not slug or slug.lower() in vacios:
            continue  # nunca emitir /books/None
        if url and i.get("title"):
            libros.append({"titulo": i["title"], "url": url})
    return libros[:8]


def openlibrary(topic: str) -> list[dict]:
    data = get_json(f"https://openlibrary.org/search.json?q={enc(topic)}&limit=5")
    return [
        {"titulo": d.get("title"), "autor": (d.get("author_name") or ["-"])[0],
         "anio": d.get("first_publish_year")}
        for d in data.get("docs", [])[:5]
    ]


def arxiv(topic: str) -> list[dict]:
    raw = get(f"https://export.arxiv.org/api/query?search_query=all:{enc(topic)}&max_results=5").decode("utf-8", "replace")
    out = []
    for entry in re.findall(r"<entry>(.*?)</entry>", raw, re.S)[:5]:
        title = re.search(r"<title>(.*?)</title>", entry, re.S)
        link = re.search(r"<id>(.*?)</id>", entry, re.S)
        out.append({"titulo": " ".join(title.group(1).split()) if title else "",
                    "url": link.group(1).strip() if link else ""})
    return out


def cisa_kev(limit: int = 10) -> list[dict]:
    data = get_json("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")
    return [
        {"cve": v["cveID"], "producto": v["product"], "nombre": v["vulnerabilityName"],
         "accion": v.get("requiredAction", ""), "fecha": v.get("dateAdded")}
        for v in data.get("vulnerabilities", [])[:limit]
    ]


def nvd_recent(limit: int = 10) -> list[dict]:
    data = get_json("https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10")
    out = []
    for item in data.get("vulnerabilities", [])[:limit]:
        cve = item["cve"]
        desc = next((d["value"] for d in cve.get("descriptions", []) if d["lang"] == "en"), "")
        out.append({"cve": cve["id"], "descripcion": desc[:220],
                    "publicado": cve.get("published", "")[:10]})
    return out


def mitre_techniques(limit: int = 12) -> list[dict]:
    data = get_json("https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json")
    techs = [
        {"id": o.get("external_references", [{}])[0].get("external_id"), "nombre": o.get("name"),
         "descripcion": (o.get("description") or "")[:200]}
        for o in data.get("objects", [])
        if o.get("type") == "attack-pattern" and not o.get("revoked") and not o.get("x_mitre_deprecated")
    ]
    return techs[:limit]


def datasgob_es(topic: str) -> list[dict]:
    data = get_json(f"https://datos.gob.es/apidata/catalog/dataset/title/{enc(topic)}?_pageSize=5")
    items = data.get("result", {}).get("items", [])
    return [{"titulo": i.get("title"), "url": i.get("_about"),
             "descripcion": ((i.get("description") or [{}])[0].get("_value") or "")[:160]}
            for i in items[:5]]


def eurostat_demo() -> list[dict]:
    data = get_json("http://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_gind?format=JSON&lang=EN")
    labels = data.get("dimension", {}).get("geo", {}).get("category", {}).get("label", {})
    return [{"pais": name, "codigo": code} for code, name in list(labels.items())[:12]]


def worldbank(indicator: str, label: str) -> list[dict]:
    data = get_json(f"https://api.worldbank.org/v2/country/ES;PT;BR/indicator/{indicator}?format=json&per_page=6")
    rows = data[1] if isinstance(data, list) and len(data) > 1 else []
    return [{"indicador": label, "pais": r.get("country", {}).get("value"),
             "anio": r.get("date"), "valor": r.get("value")} for r in rows[:6]]


def ibge_estados() -> list[dict]:
    data = get_json("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    return [{"uf": e.get("sigla"), "nome": e.get("nome"), "regiao": (e.get("regiao") or {}).get("nome")}
            for e in data[:27]]


def lucide_icons(topic: str) -> list[dict]:
    data = get_json("https://unpkg.com/lucide-static@latest/icon-nodes.json")
    hits = [k for k in data if topic.lower() in k][:16]
    return [{"icono": k, "svg": f"https://unpkg.com/lucide-static@latest/icons/{k}.svg"} for k in hits]


def open_color() -> list[dict]:
    """open-color.json: {"white": "#fff", "gray": ["#f8f9fa", ...], ...}"""
    data = get_json("https://raw.githubusercontent.com/yeun/open-color/master/open-color.json")
    out = []
    for familia, valor in list(data.items())[:14]:
        if isinstance(valor, str):
            out.append({"familia": familia, "hex": [valor], "nivel": 1})
        elif isinstance(valor, list):
            out.append({"familia": familia, "hex": valor[:10], "nivel": len(valor)})
    return out


def openverse(topic: str) -> list[dict]:
    data = get_json(f"https://api.openverse.org/v1/images/?q={enc(topic)}&page_size=6")
    return [{"titulo": r.get("title"), "licencia": r.get("license"), "url": r.get("url"),
             "origen": r.get("foreign_landing_url")} for r in data.get("results", [])[:6]]


def met_art(topic: str) -> list[dict]:
    search = get_json(f"https://collectionapi.metmuseum.org/public/collection/v1/search?q={enc(topic)}&hasImages=true")
    ids = (search.get("objectIDs") or [])[:4]
    out = []
    for oid in ids:
        obj = get_json(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}")
        out.append({"titulo": obj.get("title"), "autor": obj.get("artistDisplayName") or "-",
                    "imagen": obj.get("primaryImageSmall"), "url": obj.get("objectURL")})
    return out


def mediawiki(site: str, query: str, limit: int = 5) -> list[dict]:
    url = (f"https://{site}/w/api.php?action=query&list=search"
           f"&srsearch={enc(query)}&srlimit={limit}&format=json")
    data = get_json(url)
    return [
        {"titulo": h.get("title"),
         "url": f"https://{site}/wiki/{enc((h.get('title') or '').replace(' ', '_'))}",
         "fragmento": re.sub(r"<[^>]+>", "", h.get("snippet", ""))[:180]}
        for h in data.get("query", {}).get("search", [])[:limit]
    ]


def openalex(topic: str, limit: int = 5) -> list[dict]:
    data = get_json(
        f"https://api.openalex.org/works?search={enc(topic)}&per-page={limit}&mailto=belentani7@proton.me"
    )
    return [
        {"titulo": w.get("title"), "anio": w.get("publication_year"),
         "url": (w.get("primary_location") or {}).get("landing_page_url") or w.get("doi")}
        for w in data.get("results", [])[:limit]
    ]


def crossref(topic: str, limit: int = 5) -> list[dict]:
    data = get_json(
        f"https://api.crossref.org/works?query={enc(topic)}&rows={limit}&mailto=belentani7@proton.me"
    )
    items = data.get("message", {}).get("items", [])
    return [
        {"titulo": (i.get("title") or ["-"])[0],
         "anio": ((i.get("issued", {}).get("date-parts") or [[None]])[0] or [None])[0],
         "doi": i.get("DOI")}
        for i in items[:limit]
    ]


def gbif(topic: str, limit: int = 5) -> list[dict]:
    data = get_json(f"https://api.gbif.org/v1/species/search?q={enc(topic)}&limit={limit}")
    return [
        {"nombre": r.get("scientificName"), "rango": r.get("rank"), "clave": r.get("key"),
         "url": f"https://www.gbif.org/species/{r.get('key')}"}
        for r in data.get("results", [])[:limit]
    ]


def pubmed(topic: str, limit: int = 5) -> list[dict]:
    search = get_json(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        f"?db=pubmed&term={enc(topic)}&retmax={limit}&retmode=json"
    )
    ids = search.get("esearchresult", {}).get("idlist", [])[:limit]
    if not ids:
        return []
    summ = get_json(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
        f"?db=pubmed&id={','.join(ids)}&retmode=json"
    )
    out = []
    for pid in ids:
        r = summ.get("result", {}).get(pid, {})
        out.append({"titulo": r.get("title"), "revista": r.get("fulljournalname"),
                    "url": f"https://pubmed.ncbi.nlm.nih.gov/{pid}/"})
    return out


def gh_advisories(limit: int = 8) -> list[dict]:
    data = get_json(f"https://api.github.com/advisories?per_page={limit}")
    items = data if isinstance(data, list) else []
    return [
        {"id": a.get("ghsa_id"), "severidad": a.get("severity"),
         "resumen": (a.get("summary") or "")[:180], "url": a.get("html_url")}
        for a in items[:limit]
    ]


def artic(topic: str, limit: int = 5) -> list[dict]:
    data = get_json(
        "https://api.artic.edu/api/v1/artworks/search"
        f"?q={enc(topic)}&limit={limit}&fields=id,title,artist_display,image_id"
    )
    return [
        {"titulo": d.get("title"), "autor": (d.get("artist_display") or "-").split("\n")[0],
         "url": f"https://www.artic.edu/artworks/{d.get('id')}",
         "imagen": (f"https://www.artic.edu/iiif/2/{d.get('image_id')}/full/400,/0/default.jpg"
                    if d.get("image_id") else None)}
        for d in data.get("data", [])[:limit]
    ]


def restcountries(limit: int = 12) -> list[dict]:
    """Paises (clave ISO, region y nombre en PT) desde el dataset abierto mledoze.

    restcountries.com deprecó v1-v4 y exige API key en v5: eso rompe la regla del
    registro (endpoint sin credenciales). mledoze/countries es el dataset original,
    sin key y con licencia ODbL, y mantiene la forma que ya consumen los portales.
    Se priorizan los paises del publico del ecosistema (ES/PT/BR y America Latina).
    """
    data = get_json("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")
    filas = [c for c in (data if isinstance(data, list) else []) if isinstance(c, dict)]
    prioridad = ("ES", "PT", "BR", "AR", "CO", "MX", "PE", "CL", "VE", "EC", "UY", "PY", "BO", "DO", "CU")
    filas.sort(key=lambda c: (c.get("cca2") not in prioridad, c.get("name", {}).get("common") or ""))
    out = []
    for c in filas[:limit]:
        tr = c.get("translations") or {}
        out.append({"pais": (c.get("name") or {}).get("common"), "codigo": c.get("cca2"),
                    "region": c.get("region"), "pt": (tr.get("por") or {}).get("common")})
    return out


def google_fonts(query: str, limit: int = 12) -> list[dict]:
    data = get_json("https://fonts.google.com/metadata/fonts")
    fams = data.get("familyMetadataList", [])
    hits = [f for f in fams if query.lower() in (f.get("family") or "").lower()][:limit] or fams[:limit]
    return [{"familia": f.get("family"), "categoria": f.get("category"),
             "pesos": (f.get("fonts") or {}).get("weights") if isinstance(f.get("fonts"), dict) else None}
            for f in hits]


ENDPOINTS = {"gutenberg_direct": "https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.txt"}


# ---------------------------------------------------------------- portales

PORTALS: dict[str, dict] = {
    "lingua-aberta": {
        "repo": "belentani7/lingua-aberta",
        "dominio": "Idiomas (PT > ES > EN > CA)",
        "temas": {
            "vocabulario-basico": [
                ("Wiktionary ES", "wikt_es:casa"),
                ("Wiktionary EN", "wikt_en:house"),
                ("Tatoeba ES", "tatoeba:spa:obrigado"),
                ("Tatoeba EN", "tatoeba:eng:obrigado"),
            ],
            "lectura-graduada": [
                ("Project Gutenberg", "gutenberg:1342"),
                ("Open Library", "openlibrary:portuguese literature"),
            ],
            "cultura-y-contexto": [
                ("Wikipedia PT", "wiki:pt:Língua portuguesa"),
                ("Wikipedia ES", "wiki:es:Idioma portugués"),
            ],
            "media-para-clase": [("Openverse", "openverse:language learning classroom")],
            "practica-frases": [
                ("Tatoeba PT", "tatoeba:por:obrigado"),
                ("Tatoeba EN", "tatoeba:eng:thank you"),
            ],
            "gramatica-ca": [("Viccionari CA", "mediawiki:ca.wiktionary.org:casa")],
            "enciclopedia-infantil": [
                ("Vikidia PT", "mediawiki:pt.vikidia.org:escola"),
                ("Vikidia ES", "mediawiki:es.vikidia.org:escuela"),
            ],
        },
    },
    "linguaforge": {
        "repo": "belentani7/linguaforge",
        "dominio": "Idiomas (motor de practica)",
        "temas": {
            "lexico-comparado": [
                ("Wiktionary ES", "wikt_es:agua"),
                ("Wiktionary EN", "wikt_en:water"),
                ("Tatoeba ES", "tatoeba:spa:water"),
            ],
            "lectura-graduada": [("Project Gutenberg", "gutenberg:11")],
            "referencia-academica": [("arXiv", "arxiv:second language acquisition")],
            "falsos-amigos": [
                ("Wiktionary ES", "wikt_es:embarazada"),
                ("Wiktionary EN", "wikt_en:embarrassed"),
            ],
            "frases-ejemplo": [
                ("Tatoeba ES", "tatoeba:spa:water"),
                ("Tatoeba PT", "tatoeba:por:agua"),
            ],
            "textos-clasicos": [
                ("Wikisource PT", "mediawiki:pt.wikisource.org:literatura"),
                ("Project Gutenberg", "gutenberg:11"),
            ],
        },
    },
    "manosabiertas": {
        "repo": "belentani7/ManosAbiertas",
        "dominio": "Integracion, derechos y tramites (ES)",
        "temas": {
            "empleo-y-paro": [
                ("World Bank", "worldbank:SL.UEM.TOTL.ZS:Desempleo (% poblacion activa)"),
                ("datos.gob.es", "datosgob:empleo"),
            ],
            "educacion-y-formacion": [
                ("datos.gob.es", "datosgob:educacion"),
                ("OpenStax", "openstax:english"),
            ],
            "vivienda-y-servicios": [("datos.gob.es", "datosgob:vivienda")],
            "contexto-demografico-ue": [("Eurostat", "eurostat_demo")],
            "salud-publica": [
                ("PubMed", "pubmed:public health migration"),
                ("World Bank", "worldbank:SH.XPD.CHEX.GD.ZS:Gasto en salud (% PIB)"),
            ],
            "derechos-y-asilo": [
                ("Wikipedia ES", "mediawiki:es.wikipedia.org:derecho de asilo"),
                ("REST Countries", "restcountries"),
            ],
        },
    },
    "secure-t-university": {
        "repo": "belentani7/secure-t-university",
        "dominio": "Ciberseguridad y trust & safety",
        "temas": {
            "vulnerabilidades-explotadas": [("CISA KEV", "cisa_kev")],
            "cves-recientes": [("NVD NIST", "nvd_recent")],
            "tecnicas-de-adversario": [("MITRE ATT&CK", "mitre:12")],
            "media-y-casos": [("Openverse", "openverse:cybersecurity operations center")],
            "avisos-github": [("GitHub Advisories", "gh_advisories")],
            "investigacion-seguridad": [("OpenAlex", "openalex:cybersecurity vulnerability")],
            "normas-y-estandares": [("Wikilibros EN", "mediawiki:en.wikibooks.org:computer security")],
        },
    },
    "ux-academy": {
        "repo": "belentani7/ux-academy-professional-program",
        "dominio": "UX, producto y diseno",
        "temas": {
            "iconografia": [("Lucide", "lucide:arrow"), ("Iconify", "iconify:user")],
            "color-y-accesibilidad": [("Open Color", "open_color")],
            "tokens-de-diseno": [("Tailwind tokens", "tokens")],
            "referencias-visuales": [("Met Museum", "met:poster"), ("Openverse", "openverse:design")],
            "tipografia": [("Google Fonts", "google_fonts:roboto")],
            "arte-y-museos": [("Art Institute", "artic:poster"), ("Met Museum", "met:painting")],
        },
    },
    "open-school": {
        "repo": "belentani7/open-school",
        "dominio": "Instituto digital (ESO y bachillerato)",
        "temas": {
            "textos-por-asignatura": [("OpenStax", "openstax:physics"), ("OpenStax", "openstax:biology")],
            "lecturas-obligatorias": [("Open Library", "openlibrary:clasicos literatura")],
            "ciencia-y-actualidad": [("arXiv", "arxiv:climate education")],
            "datos-educativos": [("World Bank", "worldbank:SE.XPD.TOTL.GD.ZS:Gasto publico en educacion (% PIB)")],
            "libros-libres": [
                ("Wikilibros ES", "mediawiki:es.wikibooks.org:matematicas"),
                ("Wikiversidad ES", "mediawiki:es.wikiversity.org:ciencias"),
            ],
            "investigacion-escolar": [
                ("OpenAlex", "openalex:science education"),
                ("Crossref", "crossref:mathematics education"),
            ],
        },
    },
    "williamschool": {
        "repo": "belentani7/WILLIAMSCHOOL",
        "dominio": "ESO, tutoria cultural y refuerzo",
        "temas": {
            "textos-por-asignatura": [("OpenStax", "openstax:matemat"), ("OpenStax", "openstax:history")],
            "tutorias-y-cultura": [("Wikipedia ES", "wiki:es:Educación secundaria obligatoria")],
            "lecturas-obligatorias": [("Open Library", "openlibrary:young adult")],
            "refuerzo-idiomas": [
                ("Tatoeba EN", "tatoeba:eng:school"),
                ("Wiktionary ES", "wikt_es:escuela"),
            ],
            "ciencia-natural": [
                ("GBIF", "gbif:animales"),
                ("PubMed", "pubmed:adolescent health"),
            ],
            "datos-del-mundo": [("REST Countries", "restcountries")],
        },
    },
    "aprende-brasil": {
        "repo": "belentani7/aprende-brasil",
        "dominio": "Educacao PT-BR e cidadania",
        "temas": {
            "vocabulario-pt": [("Wiktionary ES", "wikt_es:escola"), ("Tatoeba EN", "tatoeba:eng:escola")],
            "territorio-e-cidadania": [("IBGE", "ibge_estados")],
            "lectura-en-portugues": [("Project Gutenberg", "gutenberg:55752")],
            "dados-abertos-br": [("IBGE", "ibge_estados"), ("REST Countries", "restcountries")],
            "ciencia-br": [("GBIF", "gbif:fauna"), ("OpenAlex", "openalex:Brazil education")],
            "cultura-e-historia": [
                ("Wikipedia PT", "wiki:pt:História do Brasil"),
                ("Wikisource PT", "mediawiki:pt.wikisource.org:historia"),
            ],
        },
    },
    "lingua-aberta-empresa": {
        "repo": "belentani7/lingua-aberta-empresa",
        "dominio": "Idiomas para empresa y empleo (PT > ES > EN > CA)",
        "temas": {
            "lexico-profesional": [
                ("Wiktionary ES", "wikt_es:empresa"),
                ("Wiktionary EN", "wikt_en:business"),
                ("Tatoeba ES", "tatoeba:spa:empresa"),
            ],
            "frases-de-reunion": [
                ("Tatoeba ES", "tatoeba:spa:trabajo"),
                ("Tatoeba EN", "tatoeba:eng:work"),
            ],
            "documentos-y-modelos": [
                ("Wikisource ES", "mediawiki:es.wikisource.org:contrato"),
                ("Open Library", "openlibrary:business writing"),
            ],
            "datos-de-mercado": [
                ("World Bank", "worldbank:SL.UEM.TOTL.ZS:Desempleo (% poblacion activa)"),
                ("REST Countries", "restcountries"),
            ],
            "investigacion-gestion": [
                ("OpenAlex", "openalex:business management"),
                ("Crossref", "crossref:human resources"),
            ],
            "cultura-empresarial": [
                ("Wikipedia ES", "wiki:es:Cultura empresarial"),
                ("Viccionari CA", "mediawiki:ca.wiktionary.org:empresa"),
            ],
            "tipografia-de-marca": [("Google Fonts", "google_fonts:inter")],
        },
    },
    "cruzando-el-charco": {
        "repo": "belentani7/Cruzando-el-charco",
        "dominio": "Acogida, arraigo y derechos (migrantes LGBT+)",
        "temas": {
            "derechos-y-asilo": [
                ("Wikipedia ES", "mediawiki:es.wikipedia.org:derecho de asilo"),
                ("REST Countries", "restcountries"),
            ],
            "salud-y-bienestar": [
                ("PubMed", "pubmed:LGBT migrant health"),
                ("World Bank", "worldbank:SH.XPD.CHEX.GD.ZS:Gasto en salud (% PIB)"),
            ],
            "vivienda-y-empleo": [
                ("datos.gob.es", "datosgob:vivienda"),
                ("World Bank", "worldbank:SL.UEM.TOTL.ZS:Desempleo (% poblacion activa)"),
            ],
            "contexto-demografico-ue": [("Eurostat", "eurostat_demo")],
            "comunidad-y-cultura": [
                ("Wikipedia ES", "mediawiki:es.wikipedia.org:diversidad sexual"),
                ("Wikilibros ES", "mediawiki:es.wikibooks.org:salud"),
            ],
            "tramites-y-datos": [
                ("datos.gob.es", "datosgob:empleo"),
                ("IBGE", "ibge_estados"),
            ],
        },
    },
    "secure-t": {
        "repo": "belentani7/secure-t",
        "dominio": "Ciberseguridad e IA (universidad publica)",
        "temas": {
            "vulnerabilidades-explotadas": [("CISA KEV", "cisa_kev")],
            "cves-recientes": [("NVD NIST", "nvd_recent")],
            "tecnicas-de-adversario": [("MITRE ATT&CK", "mitre:12")],
            "avisos-github": [("GitHub Advisories", "gh_advisories")],
            "investigacion-ia": [
                ("OpenAlex", "openalex:artificial intelligence security"),
                ("Crossref", "crossref:machine learning security"),
            ],
            "normas-y-estandares": [
                ("Wikilibros EN", "mediawiki:en.wikibooks.org:computer security"),
            ],
            "ia-y-etica": [("Wikipedia ES", "mediawiki:es.wikipedia.org:inteligencia artificial")],
        },
    },
    "manos-abiertas-2026": {
        "repo": "belentani7/manos-abiertas-2026",
        "dominio": "Instituto Universal William - competencias digitales y acogida (ES)",
        "temas": {
            "competencias-digitales": [
                ("OpenStax", "openstax:computer"),
                ("Wikilibros ES", "mediawiki:es.wikibooks.org:informatica"),
                ("OpenAlex", "openalex:digital literacy adult education"),
            ],
            "empleo-y-formacion": [
                ("World Bank", "worldbank:SL.UEM.TOTL.ZS:Desempleo (% poblacion activa)"),
                ("datos.gob.es", "datosgob:empleo"),
            ],
            "derechos-y-tramites": [
                ("Wikipedia ES", "mediawiki:es.wikipedia.org:derecho de asilo"),
                ("datos.gob.es", "datosgob:vivienda"),
            ],
            "salud-y-bienestar": [
                ("PubMed", "pubmed:public health migration"),
                ("World Bank", "worldbank:SH.XPD.CHEX.GD.ZS:Gasto en salud (% PIB)"),
            ],
            "contexto-demografico": [("Eurostat", "eurostat_demo")],
            "paises-y-comunidad": [("REST Countries", "restcountries")],
            "formacion-abierta": [
                ("OpenStax", "openstax:business"),
                ("Open Library", "openlibrary:adult education"),
            ],
        },
    },
}


def run_fetcher(spec: str):
    name, _, arg = spec.partition(":")
    if name == "wikt_es":
        return wikt_es(arg)
    if name == "wikt_en":
        return wikt_en(arg)
    if name == "wiki":
        lang, _, title = arg.partition(":")
        return wiki_summary(lang, title)
    if name == "tatoeba":
        pair, _, word = arg.partition(":")
        return tatoeba(pair, word)
    if name == "gutenberg":
        return gutenberg(int(arg))
    if name == "openstax":
        return openstax(arg)
    if name == "openlibrary":
        return openlibrary(arg)
    if name == "arxiv":
        return arxiv(arg)
    if name == "cisa_kev":
        return cisa_kev()
    if name == "nvd_recent":
        return nvd_recent()
    if name == "mitre":
        return mitre_techniques(int(arg))
    if name == "datosgob":
        return datasgob_es(arg)
    if name == "eurostat_demo":
        return eurostat_demo()
    if name == "worldbank":
        ind, _, label = arg.partition(":")
        return worldbank(ind, label)
    if name == "ibge_estados":
        return ibge_estados()
    if name == "lucide":
        return lucide_icons(arg)
    if name == "iconify":
        return get_json(f"https://api.iconify.design/search?query={enc(arg)}&limit=16").get("icons", [])
    if name == "open_color":
        return open_color()
    if name == "tokens":
        raw = get("https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css").decode("utf-8", "replace")
        return [{"variable": m} for m in re.findall(r"(--[\w-]+):", raw)[:30]]
    if name == "openverse":
        return openverse(arg)
    if name == "met":
        return met_art(arg)
    if name == "mediawiki":
        site, _, query = arg.partition(":")
        return mediawiki(site, query)
    if name == "openalex":
        return openalex(arg)
    if name == "crossref":
        return crossref(arg)
    if name == "gbif":
        return gbif(arg)
    if name == "pubmed":
        return pubmed(arg)
    if name == "gh_advisories":
        return gh_advisories()
    if name == "artic":
        return artic(arg)
    if name == "restcountries":
        return restcountries()
    if name == "google_fonts":
        return google_fonts(arg)
    raise ValueError(f"fetcher desconocido: {name}")


def build(portal_id: str) -> dict:
    cfg = PORTALS[portal_id]
    base = OUT / portal_id
    (base / "data").mkdir(parents=True, exist_ok=True)
    manifest = {
        "portal": portal_id,
        "repo": cfg["repo"],
        "dominio": cfg["dominio"],
        "generado_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "orden_idiomas": ["pt", "es", "en", "ca"],
        "fuentes": [],
    }
    temas_out = []
    for tema, calls in cfg["temas"].items():
        registros = []
        for etiqueta, spec in calls:
            try:
                payload = run_fetcher(spec)
                registros.append({"fuente": etiqueta, "spec": spec, "ok": True, "datos": payload})
                manifest["fuentes"].append({"tema": tema, "fuente": etiqueta, "spec": spec, "ok": True})
            except Exception as exc:  # noqa: BLE001
                registros.append({"fuente": etiqueta, "spec": spec, "ok": False, "error": str(exc)[:160]})
                manifest["fuentes"].append({"tema": tema, "fuente": etiqueta, "spec": spec, "ok": False,
                                            "error": str(exc)[:160]})
        pack = {"tema": tema, "portal": portal_id, "registros": registros}
        (base / "data" / f"{tema}.json").write_text(
            json.dumps(pack, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        ok = sum(1 for r in registros if r["ok"])
        temas_out.append({"tema": tema, "fuentes_ok": ok, "fuentes_total": len(registros)})
        print(f"  {portal_id:<24} {tema:<34} {ok}/{len(registros)}", flush=True)

    manifest["temas"] = temas_out
    (base / "topics.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_index(portal_id, cfg, temas_out, base)
    return {"portal": portal_id, "temas": len(temas_out),
            "fuentes_ok": sum(t["fuentes_ok"] for t in temas_out),
            "fuentes_total": sum(t["fuentes_total"] for t in temas_out)}


def _titulo_de(it: dict) -> str:
    """Primer texto humano del registro.

    datos.gob.es anida el titulo como [{"_value": ...}]; antes el template cogia
    el primer valor string del dict (la URL) y renderizaba la direccion como si
    fuera el titulo del recurso.
    """
    for clave in ("titulo", "title", "nombre", "name", "pais", "cve", "id", "familia"):
        valor = it.get(clave)
        if isinstance(valor, list) and valor:
            valor = valor[0]
        if isinstance(valor, dict):
            valor = valor.get("_value") or valor.get("value") or valor.get("common")
        if isinstance(valor, str) and valor.strip():
            return valor.strip()
    for valor in it.values():
        if isinstance(valor, str) and valor.strip():
            return valor.strip()
    return ""


def _enlace_de(it: dict) -> str:
    """URL utilizable del registro; convierte el DOI en enlace de resolucion."""
    doi = it.get("doi")
    if isinstance(doi, str) and doi.strip():
        return doi if doi.startswith("http") else f"https://doi.org/{doi}"
    for clave in ("url", "link", "enlace", "href", "about"):
        valor = it.get(clave)
        if isinstance(valor, str) and valor.startswith("http"):
            return valor
    for valor in it.values():
        if isinstance(valor, str) and valor.startswith("http"):
            return valor
    return ""


def write_index(portal_id: str, cfg: dict, temas: list[dict], base: Path) -> None:
    filas = []
    for t in temas:
        pack = json.loads((base / "data" / f"{t['tema']}.json").read_text(encoding="utf-8"))
        bloques = []
        for reg in pack["registros"]:
            if not reg["ok"]:
                bloques.append(f"<p class='err'>fuente no disponible: {html.escape(reg['fuente'])}</p>")
                continue
            items = reg["datos"]
            if isinstance(items, dict):
                items = [items]
            lis = []
            for it in items[:8]:
                if isinstance(it, dict):
                    texto = _titulo_de(it)
                    enlace = _enlace_de(it)
                else:
                    texto, enlace = str(it), ""
                if enlace:
                    lis.append(f"<li><a href='{html.escape(enlace)}' rel='noopener'>{html.escape(texto[:160])}</a></li>")
                else:
                    lis.append(f"<li>{html.escape(texto[:200])}</li>")
            bloques.append(
                f"<h3>{html.escape(reg['fuente'])}</h3><ul>{''.join(lis) or '<li>sin resultados</li>'}</ul>"
            )
        filas.append(
            f"<section id='{html.escape(t['tema'])}'><h2>{html.escape(t['tema'])}</h2>"
            f"<p class='meta'>{t['fuentes_ok']}/{t['fuentes_total']} fuentes con datos</p>"
            f"{''.join(bloques)}</section>"
        )
    nav = " ".join(f"<a href='#{html.escape(t['tema'])}'>{html.escape(t['tema'])}</a>" for t in temas)
    doc = f"""<!doctype html>
<html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(portal_id)} - portal de referencia</title>
<style>
:root{{color-scheme:light dark;--bg:#0b0c10;--fg:#eaeaea;--acc:#7dd3fc;--mut:#9ca3af}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);
font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}}
header,main,footer{{max-width:960px;margin:0 auto;padding:24px}}
header h1{{margin:0 0 4px}}.meta{{color:var(--mut);font-size:14px;margin:0 0 12px}}
nav a{{color:var(--acc);margin-right:14px;text-decoration:none;display:inline-block;padding:4px 0}}
section{{border-top:1px solid #1f2937;padding:20px 0}}h2{{margin:0 0 4px;font-size:22px}}
h3{{margin:16px 0 6px;font-size:15px;color:var(--acc);text-transform:uppercase;letter-spacing:.04em}}
ul{{margin:0;padding-left:20px}}li{{margin:4px 0}}a{{color:var(--acc)}}
.err{{color:#fca5a5;font-size:14px}}footer{{color:var(--mut);font-size:13px}}
</style></head><body>
<header>
<h1>{html.escape(portal_id)}</h1>
<p class="meta">{html.escape(cfg['dominio'])} &middot; fuentes abiertas verificadas &middot; reutilizable (CC/dominio publico)</p>
<nav>{nav}</nav>
</header>
<main>{''.join(filas)}</main>
<footer>
<p>Contenido generado desde APIs abiertas por <code>enrich_portals.py</code>.
Cada tema incluye la atribucion de fuente; revisa la licencia antes de uso comercial.</p>
</footer>
</body></html>"""
    (base / "index.html").write_text(doc, encoding="utf-8")


def main() -> int:
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]
    targets = wanted or list(PORTALS)
    results = []
    for portal_id in targets:
        if portal_id not in PORTALS:
            print(f"portal desconocido: {portal_id}")
            continue
        print(f"[{portal_id}]", flush=True)
        try:
            results.append(build(portal_id))
        except Exception as exc:  # noqa: BLE001
            print(f"  ERROR {portal_id}: {exc}")
    total_ok = sum(r["fuentes_ok"] for r in results)
    total = sum(r["fuentes_total"] for r in results)
    print(f"\nportales={len(results)} temas={sum(r['temas'] for r in results)} fuentes_ok={total_ok}/{total}")
    return 0 if total and total_ok == total else 1


if __name__ == "__main__":
    raise SystemExit(main())

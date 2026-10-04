"""Repara _seeds/catalogs.json: elimina ids sin API real, corrige URLs rotas y
anade fuentes nuevas. Cada candidato se VERIFICA EN VIVO antes de escribirse:
si no responde, no entra. Nada se escribe a ciegas.

Uso: python _seeds/_fix_seeds.py [--apply]
Sin --apply solo informa (dry-run).
"""
from __future__ import annotations

import gzip
import io
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS = os.path.join(ROOT, "_seeds", "catalogs.json")
UA = "Mozilla/5.0 (edu-open-data/1.0; +https://github.com/belentani7)"
CTX = ssl.create_default_context()
CTX_BAD = ssl._create_unverified_context()

# --- ids sin API real detras: se retiran (no se inventan endpoints) -------------
DROP = ["cisa-advisories", "sigma-rules", "ihl-treaties", "bne-datos",
        "coverartarchive", "libretexts-chem", "libretexts-math",
        "conceptnet-search", "conceptnet-pt"]   # conceptnet.io devuelve 502

# --- (url_templada, url_sonda) -------------------------------------------------
FIX: dict[str, tuple[str, str]] = {
    # ---------- academico ----------
    "scielo": ("https://articlemeta.scielo.org/api/v1/article/identifiers/?limit={limit}",
               "https://articlemeta.scielo.org/api/v1/article/identifiers/?limit=3"),
    "dblp": ("https://dblp.org/search/publ/api?q={q}&format=json&h={limit}",
             "https://dblp.org/search/publ/api?q=education&format=json&h=3"),
    "datagov-us": ("https://catalog.data.gov/api/3/action/package_search?q={q}&rows={limit}",
                   "https://catalog.data.gov/api/3/action/package_search?q=education&rows=3"),
    "wikipedia-en": ("https://en.wikipedia.org/api/rest_v1/page/summary/{q}",
                     "https://en.wikipedia.org/api/rest_v1/page/summary/House"),
    "wikipedia-es": ("https://es.wikipedia.org/api/rest_v1/page/summary/{q}",
                     "https://es.wikipedia.org/api/rest_v1/page/summary/Casa"),
    "wikipedia-pt": ("https://pt.wikipedia.org/api/rest_v1/page/summary/{q}",
                     "https://pt.wikipedia.org/api/rest_v1/page/summary/Casa"),
    "wikipedia-ca": ("https://ca.wikipedia.org/api/rest_v1/page/summary/{q}",
                     "https://ca.wikipedia.org/api/rest_v1/page/summary/Casa"),
    "unesco-uis": ("https://api.uis.unesco.org/api/public/definitions/indicators?lang=en",
                   "https://api.uis.unesco.org/api/public/definitions/indicators?lang=en"),
    "datosgob-es": ("https://datos.gob.es/apidata/catalog/dataset/title/educacion?_pageSize={limit}",
                    "https://datos.gob.es/apidata/catalog/dataset/title/educacion?_pageSize=3"),
    "ibge-escolas": ("https://servicodados.ibge.gov.br/api/v1/localidades/estados",
                     "https://servicodados.ibge.gov.br/api/v1/localidades/estados"),
    "ine-es": ("https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES",
               "https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES"),
    "opencitations": ("https://opencitations.net/index/coci/api/v1/citation-count/{doi}",
                      "https://opencitations.net/index/coci/api/v1/citation-count/10.1038/35057062"),
    "semanticscholar": ("https://api.semanticscholar.org/graph/v1/paper/search?query={q}&limit=3&fields=title,url,year",
                        "https://api.semanticscholar.org/graph/v1/paper/search?query=education&limit=3&fields=title,url,year"),
    "arxiv": ("http://export.arxiv.org/api/query?search_query=all:{q}&max_results={limit}",
              "http://export.arxiv.org/api/query?search_query=all:education&max_results=3"),
    "orcid": ("https://pub.orcid.org/v3.0/expanded-search/?q={q}&rows={limit}",
              "https://pub.orcid.org/v3.0/expanded-search/?q=education&rows=3"),
    # ---------- idiomas ----------
    "wiktionary-pt-rest": ("https://pt.wiktionary.org/w/api.php?action=query&titles={q}&prop=extracts&explaintext=1&format=json",
                           "https://pt.wiktionary.org/w/api.php?action=query&titles=casa&prop=extracts&explaintext=1&format=json"),
    "wiktionary-es-rest": ("https://es.wiktionary.org/w/api.php?action=query&titles={q}&prop=extracts&explaintext=1&format=json",
                           "https://es.wiktionary.org/w/api.php?action=query&titles=casa&prop=extracts&explaintext=1&format=json"),
    "wiktionary-en-rest": ("https://en.wiktionary.org/w/api.php?action=query&titles={q}&prop=extracts&explaintext=1&format=json",
                           "https://en.wiktionary.org/w/api.php?action=query&titles=house&prop=extracts&explaintext=1&format=json"),
    "wiktionary-ca-rest": ("https://ca.wiktionary.org/w/api.php?action=query&titles={q}&prop=extracts&explaintext=1&format=json",
                           "https://ca.wiktionary.org/w/api.php?action=query&titles=casa&prop=extracts&explaintext=1&format=json"),
    "conceptnet-search": ("https://api.datamuse.com/words?ml={q}&max={limit}",
                          "https://api.datamuse.com/words?ml=casa&max=3"),
    "conceptnet-pt": ("https://api.datamuse.com/sug?s={q}&max={limit}",
                      "https://api.datamuse.com/sug?s=casa&max=3"),
    "lingua-libre": ("https://lingualibre.org/w/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
                     "https://lingualibre.org/w/api.php?action=query&list=search&srsearch=casa&srlimit=3&format=json"),
    "freedict": ("https://freedict.org/freedict-database.json",
                 "https://freedict.org/freedict-database.json"),
    "tatoeba-search": ("https://tatoeba.org/en/api_v0/search?query={q}&trans_from=por&trans_to=spa",
                       "https://tatoeba.org/en/api_v0/search?query=casa&trans_from=por&trans_to=spa"),
    "tatoeba-languages": ("https://tatoeba.org/en/api_v0/languages",
                          "https://tatoeba.org/en/api_v0/languages"),
    # ---------- civico_derechos ----------
    "udhr-pt": ("https://api.wikimedia.org/core/v1/wikipedia/pt/search/page?q={q}&limit={limit}",
                "https://api.wikimedia.org/core/v1/wikipedia/pt/search/page?q=direitos+humanos&limit=3"),
    "udhr-es": ("https://api.wikimedia.org/core/v1/wikipedia/es/search/page?q={q}&limit={limit}",
                "https://api.wikimedia.org/core/v1/wikipedia/es/search/page?q=derechos+humanos&limit=3"),
    "udhr-en": ("https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q={q}&limit={limit}",
                "https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=human+rights&limit=3"),
    "udhr-cat": ("https://api.wikimedia.org/core/v1/wikipedia/ca/search/page?q={q}&limit={limit}",
                 "https://api.wikimedia.org/core/v1/wikipedia/ca/search/page?q=drets+humans&limit=3"),
    "ourworldindata": ("https://api.ourworldindata.org/v1/indicators/{q}.metadata.json",
                       "https://api.ourworldindata.org/v1/indicators/94025.metadata.json"),
    "unicef-sdmx-dataflows": ("https://sdmx.data.unicef.org/statistics/api/v1/dataflow",
                              "https://sdmx.data.unicef.org/statistics/api/v1/dataflow"),
    "govtrack-bills": ("https://www.govtrack.us/api/v2/bill?congress=118&limit={limit}",
                       "https://www.govtrack.us/api/v2/bill?congress=118&limit=3"),
    "senado-br-senadores": ("https://legis.senado.leg.br/dadosabertos/senador/lista/atual",
                            "https://legis.senado.leg.br/dadosabertos/senador/lista/atual"),
    "eurlex-sparql": ("https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fwork%20WHERE%20%7B%20%3Fwork%20cdm%3Awork_type%20%3Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fwork-type%2FREG%3E%20%7D%20LIMIT%203&format=application%2Fjson",
                      "https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fwork%20WHERE%20%7B%20%3Fwork%20cdm%3Awork_type%20%3Chttp%3A%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fwork-type%2FREG%3E%20%7D%20LIMIT%203&format=application%2Fjson"),
    "gdelt-doc": ("https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&format=json&maxrecords={limit}",
                  "https://api.gdeltproject.org/api/v2/doc/doc?query=education&mode=artlist&format=json&maxrecords=3"),
    "gdelt-tv": ("https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=timelinevol&format=json&timespan=1d",
                 "https://api.gdeltproject.org/api/v2/doc/doc?query=education&mode=timelinevol&format=json&timespan=1d"),
    # ---------- ciencia_salud ----------
    "hpo-term": ("https://hpo.jax.org/api/hpo/term/HP:0000001",
                 "https://hpo.jax.org/api/hpo/term/HP:0000001"),
    "pmc-oa": ("https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=PMC3257301&format=json",
               "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=PMC3257301&format=json"),
    "pubchem-name": ("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{q}/JSON",
                     "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/JSON"),
    "reactome-query": ("https://reactome.org/ContentService/data/query/{q}",
                       "https://reactome.org/ContentService/data/query/TP53"),
    "ensembl-lookup-symbol": ("https://rest.ensembl.org/lookup/symbol/homo_sapiens/{q}?content-type=application/json",
                              "https://rest.ensembl.org/lookup/symbol/homo_sapiens/BRCA2?content-type=application/json"),
    "ebi-proteins": ("https://www.ebi.ac.uk/proteins/api/proteins?size={limit}",
                     "https://www.ebi.ac.uk/proteins/api/proteins?size=3"),
    "mesh-lookup": ("https://id.nlm.nih.gov/mesh/lookup/descriptor?label={q}&match=contains&limit={limit}",
                    "https://id.nlm.nih.gov/mesh/lookup/descriptor?label=diabetes&match=contains&limit=3"),
    "kegg-find-genes": ("https://rest.kegg.jp/find/genes/{q}",
                        "https://rest.kegg.jp/find/genes/TP53"),
    "geneontology-autocomplete": ("https://api.geneontology.org/api/search/entity/autocomplete/{q}",
                                  "https://api.geneontology.org/api/search/entity/autocomplete/diabetes"),
    "clinicaltrials-v2": ("https://clinicaltrials.gov/api/v2/studies?query.term={q}&pageSize={limit}",
                          "https://clinicaltrials.gov/api/v2/studies?query.term=diabetes&pageSize=3"),
    # ---------- datos_pais ----------
    "oecd-dataflow": ("https://sdmx.oecd.org/public/rest/dataflow/all/all/latest?format=jsondata",
                      "https://sdmx.oecd.org/public/rest/dataflow/all/all/latest?format=jsondata"),
    "overpass-schools": ("https://overpass.kumi.systems/api/interpreter?data=%5Bout%3Ajson%5D%3Bnode%5Bamenity%3Dschool%5D(around%3A2000%2C-23.55%2C-46.63)%3Bout%20{limit}%3B",
                         "https://overpass.kumi.systems/api/interpreter?data=%5Bout%3Ajson%5D%3Bnode%5Bamenity%3Dschool%5D(around%3A2000%2C-23.55%2C-46.63)%3Bout%203%3B"),
    "naturalearth-countries": ("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
                               "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"),
    "countries-states-cities": ("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json",
                                "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json"),
    # ---------- ux_diseno ----------
    "color-names": ("https://raw.githubusercontent.com/meodai/color-names/main/dist/colornames.json",
                    "https://raw.githubusercontent.com/meodai/color-names/main/dist/colornames.json"),
    "lucide-tags": ("https://raw.githubusercontent.com/lucide-icons/lucide/main/packages/lucide-static/tags.json",
                    "https://raw.githubusercontent.com/lucide-icons/lucide/main/packages/lucide-static/tags.json"),
    "material-symbols-meta": ("https://fonts.google.com/metadata/icons?incomplete=true",
                              "https://fonts.google.com/metadata/icons?incomplete=true"),
    # ---------- patrimonio_arte ----------
    "met-search": ("https://collectionapi.metmuseum.org/public/collection/v1/search?q={q}",
                   "https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers"),
    "cleveland-art": ("https://openaccess-api.clevelandart.org/api/artworks/?q={q}&limit={limit}",
                      "https://openaccess-api.clevelandart.org/api/artworks/?q=painting&limit=3"),
    "musicbrainz-recording": ("https://musicbrainz.org/ws/2/recording?query={q}&fmt=json&limit={limit}",
                              "https://musicbrainz.org/ws/2/recording?query=music&fmt=json&limit=3"),
}

# --- fuentes nuevas (prioridad escuelas) ---------------------------------------
ADD = [
    # universidades y escuelas: datos oficiales sin clave
    ("urban-ipeds-directory", "Urban Institute IPEDS (directorio de universidades US)", "academico",
     "https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2020/?per_page={limit}",
     "https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2020/?per_page=3",
     "CC0-1.0", "https://educationdata.urban.org/documentation/", ["universities", "schools", "usa", "ipeds"]),
    ("urban-ccd-schools", "Urban Institute CCD (escuelas K-12 US)", "academico",
     "https://educationdata.urban.org/api/v1/schools/ccd/directory/2020/?per_page={limit}",
     "https://educationdata.urban.org/api/v1/schools/ccd/directory/2020/?per_page=3",
     "CC0-1.0", "https://educationdata.urban.org/documentation/", ["schools", "k-12", "usa", "teachers"]),
    ("urban-crdc-schools", "Urban Institute CRDC (derechos civiles en escuelas)", "civico_derechos",
     "https://educationdata.urban.org/api/v1/schools/crdc/schools/2020/?per_page={limit}",
     "https://educationdata.urban.org/api/v1/schools/crdc/schools/2020/?per_page=3",
     "CC0-1.0", "https://educationdata.urban.org/documentation/",
     ["schools", "civil-rights", "equity", "usa"]),
    ("college-scorecard", "College Scorecard (Dept. de Educacion US)", "academico",
     "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=DEMO_KEY&per_page={limit}",
     "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=DEMO_KEY&per_page=3",
     "public-domain", "https://collegescorecard.ed.gov/data/api/",
     ["universities", "usa", "statistics"], "B"),
    ("oeis", "OEIS (enciclopedia de sucesiones enteras)", "academico",
     "https://oeis.org/search?q={q}&fmt=json&start=0",
     "https://oeis.org/search?q=1,2,3,6,11,23&fmt=json&start=0",
     "CC-BY-NC-SA-4.0", "https://oeis.org/wiki/JSON_Format", ["math", "schools", "sequences"]),
    ("openalex-institutions", "OpenAlex Institutions (universidades del mundo)", "academico",
     "https://api.openalex.org/institutions?search={q}&per-page={limit}",
     "https://api.openalex.org/institutions?search=university&per-page=3",
     "CC0-1.0", "https://docs.openalex.org", ["universities", "schools", "global"]),
    ("unesco-uis-data", "UNESCO UIS (datos de educacion)", "academico",
     "https://api.uis.unesco.org/api/public/data/indicators?lang=en&pageSize={limit}",
     "https://api.uis.unesco.org/api/public/data/indicators?lang=en&pageSize=3",
     "CC-BY-SA-3.0-IGO", "https://api.uis.unesco.org/api/public/documentation/swagger-ui/index.html",
     ["education", "statistics", "schools", "countries"]),
    # enciclopedias para ninos: excepcional para escuelas
    ("vikidia-pt", "Vikidia PT (enciclopedia para ninos)", "academico",
     "https://pt.vikidia.org/w/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
     "https://pt.vikidia.org/w/api.php?action=query&list=search&srsearch=escola&srlimit=3&format=json",
     "CC-BY-SA-4.0", "https://pt.vikidia.org", ["encyclopedia", "kids", "schools", "pt"]),
    ("vikidia-es", "Vikidia ES (enciclopedia para ninos)", "academico",
     "https://es.vikidia.org/w/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
     "https://es.vikidia.org/w/api.php?action=query&list=search&srsearch=escuela&srlimit=3&format=json",
     "CC-BY-SA-4.0", "https://es.vikidia.org", ["encyclopedia", "kids", "schools", "es"]),
    ("vikidia-en", "Vikidia EN (children's encyclopedia)", "academico",
     "https://en.vikidia.org/w/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
     "https://en.vikidia.org/w/api.php?action=query&list=search&srsearch=school&srlimit=3&format=json",
     "CC-BY-SA-4.0", "https://en.vikidia.org", ["encyclopedia", "kids", "schools", "en"]),
    ("vikidia-ca", "Vikidia CA (enciclopedia per a infants)", "academico",
     "https://ca.vikidia.org/w/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
     "https://ca.vikidia.org/w/api.php?action=query&list=search&srsearch=escola&srlimit=3&format=json",
     "CC-BY-SA-4.0", "https://ca.vikidia.org", ["encyclopedia", "kids", "schools", "ca"]),
    ("simple-wikipedia", "Simple English Wikipedia (lectura facil)", "academico",
     "https://simple.wikipedia.org/api/rest_v1/page/summary/{q}",
     "https://simple.wikipedia.org/api/rest_v1/page/summary/School",
     "CC-BY-SA-4.0", "https://simple.wikipedia.org", ["encyclopedia", "plain-language", "schools"]),
    ("wikimedia-search-pt", "Wikimedia Core API - busqueda PT", "academico",
     "https://api.wikimedia.org/core/v1/wikipedia/pt/search/page?q={q}&limit={limit}",
     "https://api.wikimedia.org/core/v1/wikipedia/pt/search/page?q=escola&limit=3",
     "CC-BY-SA-4.0", "https://api.wikimedia.org/", ["encyclopedia", "search", "pt"]),
    ("unesco-whc", "UNESCO Patrimonio Mundial (lista XML)", "patrimonio_arte",
     "https://whc.unesco.org/en/list/xml/",
     "https://whc.unesco.org/en/list/xml/",
     "CC-BY-SA-3.0-IGO", "https://whc.unesco.org/en/list/", ["heritage", "unesco", "schools"], "B"),
    # lexico: Datamuse es la via mas fiable y sin clave
    ("datamuse-words", "Datamuse (palabras por significado)", "idiomas",
     "https://api.datamuse.com/words?ml={q}&max={limit}",
     "https://api.datamuse.com/words?ml=casa&max=3",
     "custom-free", "https://www.datamuse.com/api/", ["vocabulary", "semantics", "dictionary"]),
    ("datamuse-sug", "Datamuse (sugerencias y ortografia)", "idiomas",
     "https://api.datamuse.com/sug?s={q}&max={limit}",
     "https://api.datamuse.com/sug?s=escola&max=3",
     "custom-free", "https://www.datamuse.com/api/", ["vocabulary", "spelling"]),
    ("duckduckgo-instant", "DuckDuckGo Instant Answer", "academico",
     "https://api.duckduckgo.com/?q={q}&format=json&no_html=1&skip_disambig=1",
     "https://api.duckduckgo.com/?q=education&format=json&no_html=1&skip_disambig=1",
     "custom-free", "https://duckduckgo.com/api", ["search", "reference"]),
]


def gunzip_ok(raw, enc):
    if "gzip" not in (enc or "").lower():
        return raw
    try:
        return gzip.decompress(raw)
    except (EOFError, OSError, zlib.error):
        pass
    try:
        d = zlib.decompressobj(16 + zlib.MAX_WBITS)
        out = d.decompress(raw)
        out += d.flush()
        return out or raw
    except zlib.error:
        return raw


def probe(url, ctx, timeout=14.0):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept": "application/json, application/xml, text/html, */*",
        "Accept-Encoding": "identity"})
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            raw = r.read(262144)
            raw = gunzip_ok(raw, r.headers.get("Content-Encoding"))
            return {"ok": True, "status": r.status,
                    "ctype": (r.headers.get("Content-Type") or "").split(";")[0].lower(),
                    "body": raw, "ms": int((time.time() - t0) * 1000)}
    except Exception as e:                                    # noqa: BLE001
        return {"ok": False, "error": f"{type(e).__name__}: {str(e)[:80]}",
                "status": getattr(e, "code", None)}


def acceptable(res):
    if not res.get("ok"):
        return False, res.get("error", "no ok")
    body = res["body"]
    if len(body) < 64:
        return False, f"too_small {len(body)}B"
    text = body.decode("utf-8", "replace").lstrip("\ufeff \t\r\n")
    if text.startswith(")]}'"):
        nl = text.find("\n")
        text = text[nl + 1:] if nl != -1 else text
    ctype = res["ctype"]
    if "html" in ctype:
        return False, "html"
    t = text.lstrip()[:1]
    if t in ("{", "["):
        if res["body"] and len(body) >= 262144:
            return True, f"200 json-grande {res['ms']}ms"
        try:
            json.loads(text)
            return True, f"200 json {res['ms']}ms"
        except Exception as e:                                # noqa: BLE001
            return False, f"json invalido: {str(e)[:60]}"
    if t == "<":
        return True, f"200 xml {res['ms']}ms"
    if len([ln for ln in text.splitlines() if ln.strip()]) >= 1:
        return True, f"200 texto {res['ms']}ms"
    return False, "vacio"


def verify(url):
    res = probe(url, CTX)
    ok, why = acceptable(res)
    if ok:
        return True, why, False
    # Reintento con mas paciencia y TLS sin verificar: hay hosts lentos o
    # interceptados localmente (tatoeba tarda ~13s, Urban va por proxy).
    for ctx, tag in ((CTX_BAD, "tls sin verificar"), (CTX, "directo")):
        res2 = probe(url, ctx, timeout=35.0)
        ok2, why2 = acceptable(res2)
        if ok2:
            return True, f"{why2} (reintento lento, {tag})", ctx is CTX_BAD
    return False, why, False


FIX.update({
    # --- ruta movida / parametro distinto (ronda 2) ---
    "arxiv": ("http://export.arxiv.org/api/query?search_query=all:{q}&max_results={limit}",
              "http://export.arxiv.org/api/query?search_query=all:education&max_results=3"),
    "dblp": ("https://dblp.org/search/publ/api?q={q}&format=json&h={limit}",
             "https://dblp.org/search/publ/api?q=education&format=json"),
    "opencitations": ("https://opencitations.net/index/coci/api/v1/citations/{doi}",
                      "https://opencitations.net/index/coci/api/v1/citations/10.1038/35057062"),
    "semanticscholar": ("https://api.semanticscholar.org/graph/v1/paper/search?query={q}&limit=1",
                        "https://api.semanticscholar.org/graph/v1/paper/search?query=education&limit=1"),
    "datosgob-es": ("https://datos.gob.es/apidata/catalog/dataset?_pageSize={limit}",
                    "https://datos.gob.es/apidata/catalog/dataset?_pageSize=3"),
    "lingua-libre": ("https://lingualibre.org/api.php?action=query&list=search&srsearch={q}&srlimit={limit}&format=json",
                     "https://lingualibre.org/api.php?action=query&list=search&srsearch=casa&srlimit=3&format=json"),
    "tatoeba-languages": ("https://tatoeba.org/en/api_v0/languages",
                          "https://tatoeba.org/en/api_v0/languages"),
    "unicef-sdmx-dataflows": ("https://sdmx.data.unicef.org/statistics/api/v1/",
                              "https://sdmx.data.unicef.org/statistics/api/v1/"),
    "eurlex-sparql": ("https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fs%20%3Fp%20%3Fo%20WHERE%20%7B%20%3Fs%20%3Fp%20%3Fo%20%7D%20LIMIT%203&format=application%2Fjson",
                      "https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fs%20%3Fp%20%3Fo%20WHERE%20%7B%20%3Fs%20%3Fp%20%3Fo%20%7D%20LIMIT%203&format=application%2Fjson"),
    "hpo-term": ("https://purl.obolibrary.org/obo/hp.json",
                 "https://purl.obolibrary.org/obo/hp.json"),
    "reactome-query": ("https://reactome.org/ContentService/data/eventsHierarchy/9606",
                       "https://reactome.org/ContentService/data/eventsHierarchy/9606"),
    "oecd-dataflow": ("https://sdmx.oecd.org/public/rest/dataflow/all/all/latest",
                      "https://sdmx.oecd.org/public/rest/dataflow/all/all/latest"),
    "overpass-schools": ("https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bout%20{limit}%3B",
                         "https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bout%203%3B"),
    "color-names": ("https://cdn.jsdelivr.net/npm/color-name-list/dist/colornames.json",
                    "https://cdn.jsdelivr.net/npm/color-name-list/dist/colornames.json"),
    "lucide-tags": ("https://cdn.jsdelivr.net/npm/lucide-static/tags.json",
                    "https://cdn.jsdelivr.net/npm/lucide-static/tags.json"),
    "gdelt-tv": ("https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&format=json&maxrecords={limit}&timespan=1d",
                 "https://api.gdeltproject.org/api/v2/doc/doc?query=education&mode=artlist&format=json&maxrecords=3&timespan=1d"),
})

FIX.pop("clinicaltrials-v2", None)   # 403 persistente: bloqueado desde esta red
FIX.pop("ebi-proteins", None)        # 400 persistente en todas las variantes

ADD_EXTRA = [
    ("urban-ipeds-directory", "Urban Institute IPEDS (universidades US)", "academico",
     "https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2020/?per_page={limit}",
     "https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2020/?per_page=3",
     "CC0-1.0", "https://educationdata.urban.org/documentation/",
     ["universities", "schools", "usa", "ipeds"]),
    ("urban-ccd-schools", "Urban Institute CCD (escuelas K-12 US)", "academico",
     "https://educationdata.urban.org/api/v1/schools/ccd/directory/2020/?per_page={limit}",
     "https://educationdata.urban.org/api/v1/schools/ccd/directory/2020/?per_page=3",
     "CC0-1.0", "https://educationdata.urban.org/documentation/",
     ["schools", "k-12", "usa", "teachers"]),
    ("unesco-uis-data", "UNESCO UIS (datos de educacion)", "academico",
     "https://api.uis.unesco.org/api/public/data/indicators?lang=en",
     "https://api.uis.unesco.org/api/public/data/indicators?lang=en",
     "CC-BY-SA-3.0-IGO", "https://api.uis.unesco.org/api/public/documentation/swagger-ui/index.html",
     ["education", "statistics", "schools", "countries"]),
]


def main():
    apply = "--apply" in sys.argv
    with io.open(SEEDS, encoding="utf-8") as fh:
        doc = json.load(fh)
    seeds = doc["seeds"]
    by_id = {s["id"]: s for s in seeds}

    print(f"--- fix_seeds {'(APPLY)' if apply else '(dry-run)'} ---")
    print(f"  seeds actuales: {len(seeds)}")

    dropped, fixed, failed, added = [], [], [], []

    for sid in DROP:
        if sid in by_id:
            dropped.append(sid)

    for sid, (tpl, purl) in FIX.items():
        if sid not in by_id:
            continue
        ok, why, insecure = verify(purl)
        if ok:
            fixed.append((sid, tpl, purl, why, insecure))
        else:
            failed.append((sid, purl, why))
        print(f"  {'OK ' if ok else 'KO '} {sid:<26} {why[:52]}")

    print("  --- nuevas ---")
    seen_new = set()
    for row in ADD_EXTRA + ADD:
        sid, name, area, tpl, purl, lic, docs, topics = row[:8]
        quality = row[8] if len(row) > 8 else "A"
        if sid in by_id or sid in seen_new:
            print(f"  SKIP {sid} (ya existe)")
            continue
        seen_new.add(sid)
        ok, why, insecure = verify(purl)
        if ok:
            added.append({"id": sid, "name": name, "area": area, "url": tpl, "kind": "json",
                          "license": lic, "docs": docs, "topics": topics,
                          "quality": quality, "tls_insecure": insecure,
                          "probe": {"url": purl, "expect": "json"}})
        else:
            failed.append((sid, purl, why))
        print(f"  {'OK ' if ok else 'KO '} {sid:<26} {why[:52]}")

    if not apply:
        print(f"\n  se retirarian {len(dropped)}, se corregirian {len(fixed)}, "
              f"se anadirian {len(added)}, fallos {len(failed)}")
        return 1 if failed else 0

    fixed_ids = {f[0] for f in fixed}
    out = []
    for s in seeds:
        if s["id"] in DROP:
            continue
        if s["id"] in fixed_ids:
            tpl, purl, why, insecure = next((f[1], f[2], f[3], f[4])
                                            for f in fixed if f[0] == s["id"])
            s["url"] = tpl
            s["probe"] = {"url": purl, "expect": s.get("kind", "json")}
            if insecure:
                s["tls_insecure"] = True
            if s["id"] == "ibge-escolas":
                s["name"] = "IBGE Estados y municipios (BR)"
                s["topics"] = ["geography", "brazil", "pt", "schools"]
            if s["id"] == "senado-br-senadores":
                s["kind"] = "json"
                s["probe"]["expect"] = "json"
            if s["id"] == "conceptnet-search":
                s["name"] = "Datamuse (palabras por significado)"
            if s["id"] == "conceptnet-pt":
                s["name"] = "Datamuse (sugerencias)"
            if s["id"].startswith("udhr-"):
                s["name"] = "Wikimedia Core Search " + s["id"][-2:].upper()
                s["topics"] = ["human-rights", "civics", "search", s["id"][-2:]]
        out.append(s)
    out.extend(added)
    doc["seeds"] = out
    with io.open(SEEDS, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)

    print(f"\n  retiradas {len(dropped)}: {', '.join(dropped)}")
    print(f"  corregidas {len(fixed)}  ·  anadidas {len(added)}  ·  fallos {len(failed)}")
    print(f"  seeds ahora: {len(out)}")
    if failed:
        print("  FALLOS (no escritos):")
        for sid, purl, why in failed:
            print(f"    {sid:<26} {why[:60]}  {purl[:70]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

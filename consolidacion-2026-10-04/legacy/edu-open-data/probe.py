"""Prueba candidatos de reemplazo para las fuentes caidas. Solo diagnostico."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.parse
import urllib.request

UA = "BelentaniEduBot/1.0 (+https://belentani.eu; educational open-data sync)"
Q = "casa"

CANDIDATES = [
    ("wiktionary_es_mw", f"https://es.wiktionary.org/w/api.php?action=query&prop=extracts&explaintext=1&titles={Q}&format=json"),
    ("wiktionary_es_mw_ns0", f"https://es.wiktionary.org/w/api.php?action=query&list=search&srsearch={Q}&format=json&srlimit=3"),
    ("wiktionary_en_rest", "https://en.wiktionary.org/api/rest_v1/page/definition/house"),
    ("wikimedia_pt_mw", "https://pt.wikimedia.org/w/api.php?action=query&meta=siteinfo&format=json"),
    ("wikidata_sparql_get", "https://query.wikidata.org/sparql?format=json&query=" + urllib.parse.quote("SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 2")),
    ("wikidata_api_sitelinks", "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=agua&language=es&format=json&limit=3"),
    ("gutendex_http", "http://gutendex.com/books?languages=pt&page=1"),
    ("gutendex_books_slash", "https://gutendex.com/books/?languages=es"),
    ("eurostat_http", "http://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_gind?format=JSON&lang=EN"),
    ("eurostat_jsonstat", "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/nama_10_gdp?format=JSON"),
    ("datos_gob_titles", "https://datos.gob.es/apidata/catalog/dataset/title/educacion?_pageSize=5"),
    ("datos_gob_all", "https://datos.gob.es/apidata/catalog/dataset?_pageSize=5"),
    ("ibge_localidades", "https://servicodados.ibge.gov.br/api/v1/localidades/estados"),
    ("ibge_indicadores", "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores"),
    ("camara_br", "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=3&ordem=ASC&ordenarPor=nome"),
    ("ine_operaciones", "https://serviciodatos.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES"),
    ("ine_operaciones2", "https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES"),
    ("eu_hub_search", "https://data.europa.eu/api/hub/search/search?q=educacion&limit=3"),
    ("eu_hub_datasets", "https://data.europa.eu/api/hub/search/datasets?q=education&limit=3"),
    ("radix_colors", "https://raw.githubusercontent.com/radix-ui/colors/main/gray.css"),
    ("tailwind_theme", "https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/packages/tailwindcss/theme.css"),
    ("material_tokens2", "https://raw.githubusercontent.com/material-components/material-components-web/master/docs/design-tokens.json"),
    ("lucide_unpkg", "https://unpkg.com/lucide-static@latest/icon-nodes.json"),
    ("lucide_raw_dir", "https://api.github.com/repos/lucide-icons/lucide/contents/icons?per_page=5"),
    ("doaj_v3", "https://doaj.org/api/v3/search/journals/education?pageSize=3"),
    ("doaj_articles", "https://doaj.org/api/search/articles/education?pageSize=3"),
    ("openstax_wagtail", "https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title&limit=3"),
    ("openstax_books", "https://openstax.org/apps/cms/api/v2/pages/?fields=title&limit=3"),
    ("openstax_github_api", "https://api.github.com/repos/openstax/osbooks-college-physics-bundle/contents?per_page=5"),
    ("urlhaus_http", "http://urlhaus-api.abuse.ch/v1/urls/recent/"),
    ("nvd_headers", "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=2"),
]


def probe(url: str, insecure: bool = False) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    ctx = ssl._create_unverified_context() if insecure else ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=25, context=ctx) as resp:
            body = resp.read()
            head = body[:80].decode("utf-8", "replace").replace("\n", " ")
            return f"{resp.status} {len(body)}B {head}"
    except urllib.error.HTTPError as exc:
        detail = exc.read()[:90].decode("utf-8", "replace").replace("\n", " ")
        return f"HTTP {exc.code} {detail}"
    except Exception as exc:  # noqa: BLE001
        if not insecure and "SSL" in str(exc):
            return probe(url, insecure=True)
        return f"{type(exc).__name__}: {str(exc)[:70]}"


if __name__ == "__main__":
    for name, url in CANDIDATES:
        print(f"{name:<24} {probe(url)}", flush=True)

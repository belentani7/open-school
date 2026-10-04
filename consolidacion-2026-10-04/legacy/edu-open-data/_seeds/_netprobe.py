import ssl, sys, time, urllib.request, urllib.error, json, socket

UA = "Mozilla/5.0 (edu-open-data/1.0; +https://github.com/belentani7)"
CTX_OK = ssl.create_default_context()
CTX_BAD = ssl._create_unverified_context()

TARGETS = [
    ("github raw", "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"),
    ("openalex", "https://api.openalex.org/works?search=casa&per-page=1"),
    ("crossref", "https://api.crossref.org/works?query=casa&rows=1"),
    ("arxiv", "http://export.arxiv.org/api/query?search_query=all:casa&max_results=1"),
    ("tatoeba", "https://tatoeba.org/en/api_v0/search?query=obrigado&trans_from=por&trans_to=spa"),
    ("wikidata", "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=casa&language=pt&format=json"),
    ("worldbank", "https://api.worldbank.org/v2/country/BR/indicator/SE.PRM.ENRR?format=json&per_page=1"),
    ("nvd", "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1"),
    ("osv", "https://api.osv.dev/v1/vulns/OSV-2020-111"),
    ("europeana-noauth", "https://api.europeana.eu/record/v2/search.json?query=casa&rows=1&wskey=api2demo"),
    ("unesco-uis", "https://api.uis.unesco.org/api/public/definitions/indicators?lang=en"),
    ("iconify", "https://api.iconify.design/collection?prefix=mdi"),
    ("restcountries", "https://restcountries.com/v3.1/name/brasil"),
    ("openstax", "https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title&limit=1"),
    ("oercommons", "https://www.oercommons.org/api/v1/materials?limit=1"),
    ("datosgobes", "https://datos.gob.es/apidata/catalog/dataset?_pageSize=1"),
    ("dadosgovbr", "http://dados.gov.br/api/publico/conjuntos-dados"),
    ("wikiversity", "https://en.wikiversity.org/w/api.php?action=query&list=search&srsearch=casa&format=json"),
    ("gutendex", "https://gutendex.com/books?search=casa"),
    ("loc", "https://www.loc.gov/search/?q=casa&fo=json&c=1"),
    ("met", "https://collectionapi.metmuseum.org/public/collection/v1/objects/1"),
    ("smithsonian-noauth", "https://api.si.edu/openaccess/api/v1.0/search?q=casa&api_key=DEMO_KEY"),
    ("openfoodfacts", "https://world.openfoodfacts.org/api/v2/search?categories_tags=en:breakfast_cereals&page_size=1"),
    ("gbif", "https://api.gbif.org/v1/occurrence/search?limit=1"),
    ("openaire", "https://api.openaire.eu/search/publications?title=casa&size=1"),
    ("doab", "https://directory.doabooks.org/rest/search?query=casa"),
    ("openaq", "https://api.openaq.org/v2/countries?limit=1"),
]

def fetch(url, ctx, timeout=12):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
        body = r.read(700)
        return r.status, len(body), int((time.time() - t0) * 1000), r.headers.get("Content-Type")

print("python", sys.version.split()[0])
for name, url in TARGETS:
    for label, ctx in (("ver", CTX_OK), ("nover", CTX_BAD)):
        try:
            st, n, ms, ct = fetch(url, ctx)
            print(f"OK   {name:20s} {label:5s} {st} {n}B {ms}ms {ct}")
            break
        except Exception as e:
            print(f"FAIL {name:20s} {label:5s} {type(e).__name__}: {str(e)[:110]}")

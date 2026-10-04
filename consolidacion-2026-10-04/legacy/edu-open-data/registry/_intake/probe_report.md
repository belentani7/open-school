# M1 - Informe de sonda en vivo

Candidatas sondeadas: **765**  
Aceptadas: **391** (maquina-legibles **196**, solo portales **195**)  
Rechazadas: **374**  
Tiempo: **162s**

## Aceptadas por area (escuelas primero)

| area | aceptadas | maquina-legibles |
|---|---|---|
| `academico` | 66 | 50 |
| `idiomas` | 39 | 33 |
| `civico_derechos` | 64 | 15 |
| `ciencia_salud` | 50 | 19 |
| `datos_pais` | 40 | 19 |
| `ciberseguridad` | 27 | 22 |
| `ux_diseno` | 32 | 18 |
| `patrimonio_arte` | 19 | 14 |
| `sin_clasificar` | 54 | 6 |

## Rechazos por motivo

| motivo | n |
|---|---|
| `html_not_api` | 237 |
| `network_or_timeout` | 55 |
| `http_404` | 39 |
| `auth_required_or_blocked` | 10 |
| `too_small` | 9 |
| `not_html` | 8 |
| `rate_limited` | 4 |
| `json_parse_error` | 3 |
| `server_error_502` | 2 |
| `server_error_503` | 2 |
| `server_error_500` | 1 |
| `too_slow` | 1 |
| `not_xml` | 1 |
| `no_records` | 1 |
| `html_not_xml` | 1 |

## Aceptadas maquina-legibles (detalle)

| area | id | kind | recs | ms | bytes | url |
|---|---|---|---|---|---|---|
| `academico` | `archive-org` | json | 3 | 728 | 546 | `https://archive.org/advancedsearch.php?q=escola&fl%5B%5D=identifier&fl` |
| `academico` | `cdnjs-api` | json | 13 | 248 | 3787 | `https://api.cdnjs.com/libraries/jquery` |
| `academico` | `college-scorecard` | json | None | 2035 | >=262144 | `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=DEMO_KEY&p` |
| `academico` | `crossref` | json | 4 | 560 | 14347 | `https://api.crossref.org/works?query=escola&rows=3` |
| `academico` | `crossref-journals` | json | 4 | 459 | 10924 | `https://api.crossref.org/journals?query=escola&rows=3` |
| `academico` | `dadosgov-pt` | json | 3 | 271 | 38798 | `https://dados.gov.pt/api/1/datasets/?q=escola&page_size=3` |
| `academico` | `data-gov-uk` | json | 3 | 352 | 230 | `https://data.gov.uk/api/3/action/package_search?q=escola&rows=3` |
| `academico` | `datacite` | json | 3 | 365 | 11463 | `https://api.datacite.org/dois?query=escola&page%5Bsize%5D=3` |
| `academico` | `dataeuropa` | json | 1 | 269 | 45146 | `https://data.europa.eu/api/hub/search/search?q=escola&limit=3` |
| `academico` | `doab` | json | 100 | 2012 | 51178 | `https://directory.doabooks.org/rest/search?query=escola` |
| `academico` | `doaj-articles` | json | 3 | 183 | 10893 | `https://doaj.org/api/search/articles/escola?pageSize=3` |
| `academico` | `doaj-journals` | json | 3 | 152 | 7688 | `https://doaj.org/api/search/journals/escola?pageSize=3` |
| `academico` | `dryad` | json | 4 | 716 | 5572 | `https://datadryad.org/api/v2/search?q=escola&per_page=3` |
| `academico` | `duckduckgo-instant` | json | 21 | 211 | 2350 | `https://api.duckduckgo.com/?q=escola&format=json&no_html=1&skip_disamb` |
| `academico` | `eric` | json | 3 | 469 | 5416 | `https://api.ies.ed.gov/eric/?search=title%3Aescola&format=json&rows=3` |
| `academico` | `europepmc` | json | 6 | 314 | 2485 | `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=escola&f` |
| `academico` | `figshare` | json | 3 | 283 | 3236 | `https://api.figshare.com/v2/articles?search_for=escola&page_size=3` |
| `academico` | `govdata-de` | json | 3 | 110 | 215 | `https://www.govdata.de/ckan/api/3/action/package_search?q=escola&rows=` |
| `academico` | `ibge-localidades` | json | None | 1421 | >=262144 | `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=ni` |
| `academico` | `ine-es` | json | 112 | 1094 | 20963 | `https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES` |
| `academico` | `npm-registry-github` | text | 461 | 1032 | 262144 | `https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md` |
| `academico` | `open-library-openlibrary` | json | 9 | 550 | 12463 | `https://openlibrary.org/developers/api` |
| `academico` | `openaire-pubs` | xml | 1 | 4048 | 66425 | `https://api.openaire.eu/search/publications?title=escola&size=3` |
| `academico` | `openalex` | json | 3 | 515 | 42705 | `https://api.openalex.org/works?search=escola&per-page=3` |
| `academico` | `openalex-institutions` | json | 3 | 396 | 69050 | `https://api.openalex.org/institutions?search=escola&per-page=3` |
| `academico` | `opencitations` | json | None | 805 | >=262144 | `https://opencitations.net/index/coci/api/v1/citations/10.1038/nature12` |
| `academico` | `openlibrary` | json | 3 | 1871 | 1787 | `https://openlibrary.org/search.json?q=escola&limit=3` |
| `academico` | `openstax` | json | 3 | 124 | 1539 | `https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=tit` |
| `academico` | `orcid` | json | 2 | 810 | 1563 | `https://pub.orcid.org/v3.0/expanded-search/?q=escola&rows=3` |
| `academico` | `ror` | json | 20 | 308 | 20119 | `https://api.ror.org/organizations?query=escola` |
| `academico` | `scielo` | json | 3 | 1762 | 700 | `https://articlemeta.scielo.org/api/v1/article/identifiers/?limit=3` |
| `academico` | `unesco-uis` | json | None | 1767 | >=262144 | `https://api.uis.unesco.org/api/public/definitions/indicators?lang=en` |
| `academico` | `urban-ccd-schools` | json | None | 640 | >=262144 | `https://educationdata.urban.org/api/v1/schools/ccd/directory/2020/?per` |
| `academico` | `urban-ipeds-directory` | json | None | 696 | >=262144 | `https://educationdata.urban.org/api/v1/college-university/ipeds/direct` |
| `academico` | `vikidia-ca` | json | 3 | 369 | 1209 | `https://ca.vikidia.org/w/api.php?action=query&list=search&srsearch=esc` |
| `academico` | `vikidia-en` | json | 2 | 373 | 71 | `https://en.vikidia.org/w/api.php?action=query&list=search&srsearch=esc` |
| `academico` | `vikidia-es` | json | 3 | 382 | 1250 | `https://es.vikidia.org/w/api.php?action=query&list=search&srsearch=esc` |
| `academico` | `vikidia-pt` | json | 3 | 367 | 1126 | `https://pt.vikidia.org/w/api.php?action=query&list=search&srsearch=esc` |
| `academico` | `wikibooks-en` | json | 3 | 305 | 1241 | `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=e` |
| `academico` | `wikibooks-es` | json | 3 | 294 | 1259 | `https://es.wikibooks.org/w/api.php?action=query&list=search&srsearch=e` |
| `academico` | `wikibooks-pt` | json | 3 | 393 | 1280 | `https://pt.wikibooks.org/w/api.php?action=query&list=search&srsearch=e` |
| `academico` | `wikidata-search` | json | 4 | 310 | 1684 | `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=esco` |
| `academico` | `wikidata-sparql` | json | 2 | 1544 | 806 | `https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3FitemLabe` |
| `academico` | `wikipedia-ca` | json | 19 | 119 | 1772 | `https://ca.wikipedia.org/api/rest_v1/page/summary/escola` |
| `academico` | `wikipedia-pt` | json | 19 | 139 | 3361 | `https://pt.wikipedia.org/api/rest_v1/page/summary/escola` |
| `academico` | `wikipedia-search-pt` | json | 3 | 350 | 1302 | `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=e` |
| `academico` | `wikiversity-en` | json | 3 | 306 | 1305 | `https://en.wikiversity.org/w/api.php?action=query&list=search&srsearch` |
| `academico` | `wikiversity-es` | json | 2 | 276 | 133 | `https://es.wikiversity.org/w/api.php?action=query&list=search&srsearch` |
| `academico` | `wikiversity-pt` | json | 3 | 329 | 1268 | `https://pt.wikiversity.org/w/api.php?action=query&list=search&srsearch` |
| `academico` | `worldbank-edstats` | json | 2 | 89 | 733 | `https://api.worldbank.org/v2/country/BRA/indicator/SE.PRM.ENRR?format=` |
| `idiomas` | `ai-economics-tools-piszczek` | json | 9 | 229 | 7797 | `https://piszczek.pl/tools/api` |
| `idiomas` | `apertium-listpairs` | json | 3 | 121 | 7256 | `https://apertium.org/apy/listPairs` |
| `idiomas` | `apertium-translate-pt-es` | json | 3 | 131 | 95 | `https://apertium.org/apy/translate?langpair=pt%7Ces&q=escola` |
| `idiomas` | `cldr-annotations-ca` | json | None | 255 | >=262144 | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json` |
| `idiomas` | `cldr-annotations-en` | json | None | 328 | >=262144 | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json` |
| `idiomas` | `cldr-annotations-es` | json | None | 339 | >=262144 | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json` |
| `idiomas` | `cldr-annotations-pt` | json | None | 281 | >=262144 | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json` |
| `idiomas` | `cldr-likelysubtags` | json | 1 | 417 | 220093 | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json` |
| `idiomas` | `datamuse-sug` | json | 3 | 198 | 103 | `https://api.datamuse.com/sug?s=escola&max=3` |
| `idiomas` | `datamuse-words` | json | 3 | 205 | 167 | `https://api.datamuse.com/words?ml=escola&max=3` |
| `idiomas` | `freedict` | json | None | 489 | >=262144 | `https://freedict.org/freedict-database.json` |
| `idiomas` | `huggingface-datasets` | json | 3 | 235 | 2289 | `https://huggingface.co/api/datasets?search=escola&limit=3` |
| `idiomas` | `huggingface-models` | json | 3 | 211 | 708 | `https://huggingface.co/api/models?search=escola&limit=3` |
| `idiomas` | `languagetool-languages` | json | 62 | 296 | 3425 | `https://api.languagetool.org/v2/languages` |
| `idiomas` | `legal-sandbox-georgia-legal` | json | 6 | 205 | 13167 | `https://legal.ge/api/openapi.json` |
| `idiomas` | `nltk-data-index` | xml | 1 | 134 | 78939 | `https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/index.xml` |
| `idiomas` | `opus-api` | json | 1 | 572 | 328 | `https://opus.nlpl.eu/opusapi/?source=pt&target=es&corpus=OpenSubtitles` |
| `idiomas` | `ud-catalan` | text | 3504 | 443 | 262144 | `https://raw.githubusercontent.com/UniversalDependencies/UD_Catalan-AnC` |
| `idiomas` | `ud-english` | text | 4221 | 386 | 262144 | `https://raw.githubusercontent.com/UniversalDependencies/UD_English-EWT` |
| `idiomas` | `ud-portuguese` | text | 4893 | 371 | 262144 | `https://raw.githubusercontent.com/UniversalDependencies/UD_Portuguese-` |
| `idiomas` | `ud-spanish` | text | 3582 | 352 | 262144 | `https://raw.githubusercontent.com/UniversalDependencies/UD_Spanish-AnC` |
| `idiomas` | `wikiquote-pt` | json | 3 | 310 | 1201 | `https://pt.wikiquote.org/w/api.php?action=query&list=search&srsearch=e` |
| `idiomas` | `wikisource-en` | json | 3 | 303 | 1265 | `https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=` |
| `idiomas` | `wikisource-es` | json | 3 | 313 | 1220 | `https://es.wikisource.org/w/api.php?action=query&list=search&srsearch=` |
| `idiomas` | `wikisource-pt` | json | 3 | 317 | 1330 | `https://pt.wikisource.org/w/api.php?action=query&list=search&srsearch=` |
| `idiomas` | `wikiwords-frequency-ca` | text | 23839 | 290 | 262144 | `https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/con` |
| `idiomas` | `wikiwords-frequency-en` | text | 20590 | 312 | 262144 | `https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/con` |
| `idiomas` | `wikiwords-frequency-es` | text | 19515 | 365 | 262144 | `https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/con` |
| `idiomas` | `wikiwords-frequency-pt` | text | 20107 | 307 | 262144 | `https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/con` |
| `idiomas` | `wiktionary-ca-rest` | json | 2 | 344 | 1392 | `https://ca.wiktionary.org/w/api.php?action=query&titles=escola&prop=ex` |
| `idiomas` | `wiktionary-en-rest` | json | 2 | 321 | 5209 | `https://en.wiktionary.org/w/api.php?action=query&titles=escola&prop=ex` |
| `idiomas` | `wiktionary-es-rest` | json | 2 | 508 | 1052 | `https://es.wiktionary.org/w/api.php?action=query&titles=escola&prop=ex` |
| `idiomas` | `wiktionary-pt-rest` | json | 2 | 322 | 1545 | `https://pt.wiktionary.org/w/api.php?action=query&titles=escola&prop=ex` |
| `civico_derechos` | `camara-br-deputados` | json | 2 | 1221 | 1531 | `https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarP` |
| `civico_derechos` | `camara-br-proposicoes` | json | 2 | 8368 | 1874 | `https://dadosabertos.camara.leg.br/api/v2/proposicoes?ordem=DESC&orden` |
| `civico_derechos` | `eurlex-sparql` | json | 2 | 314 | 969 | `https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fs%2` |
| `civico_derechos` | `eurostat-catalogue` | text | 1775 | 586 | 262144 | `https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang` |
| `civico_derechos` | `eurostat-crime` | json | None | 596 | >=262144 | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/cr` |
| `civico_derechos` | `govtrack-bills` | json | 3 | 678 | 18881 | `https://www.govtrack.us/api/v2/bill?congress=118&limit=3` |
| `civico_derechos` | `onyx-bazaar-onyx-actions` | json | 3 | 423 | 31086 | `https://onyx-actions.onrender.com/bazaar` |
| `civico_derechos` | `senado-br-senadores` | json | 1 | 2090 | 129252 | `https://legis.senado.leg.br/dadosabertos/senador/lista/atual` |
| `civico_derechos` | `udhr-cat` | xml | 1 | 418 | 1966 | `https://api.wikimedia.org/core/v1/wikipedia/ca/search/page?q=escola&li` |
| `civico_derechos` | `udhr-en` | xml | 1 | 358 | 1423 | `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=escola&li` |
| `civico_derechos` | `udhr-es` | xml | 1 | 336 | 1790 | `https://api.wikimedia.org/core/v1/wikipedia/es/search/page?q=escola&li` |
| `civico_derechos` | `udhr-pt` | xml | 1 | 464 | 1870 | `https://api.wikimedia.org/core/v1/wikipedia/pt/search/page?q=escola&li` |
| `civico_derechos` | `unhcr-countries` | json | 232 | 330 | 76640 | `https://api.unhcr.org/population/v1/countries/` |
| `civico_derechos` | `unhcr-population` | json | 3 | 805 | 843 | `https://api.unhcr.org/population/v1/population/?yearFrom=2020&limit=3` |
| `civico_derechos` | `worldbank-wgi` | json | 1 | 76 | 128 | `https://api.worldbank.org/v2/country/all/indicator/GE.EST?format=json&` |
| `ciencia_salud` | `chembl-target-search` | json | 2 | 368 | 106 | `https://www.ebi.ac.uk/chembl/api/data/target/search?q=escola&format=js` |
| `ciencia_salud` | `gbif-occurrence` | json | 3 | 1388 | 18284 | `https://api.gbif.org/v1/occurrence/search?limit=3` |
| `ciencia_salud` | `gbif-species` | json | 3 | 240 | 2701 | `https://api.gbif.org/v1/species/search?q=escola&limit=3` |
| `ciencia_salud` | `hpo-term` | json | None | 975 | >=262144 | `https://purl.obolibrary.org/obo/hp.json` |
| `ciencia_salud` | `inaturalist-observations` | json | 3 | 1197 | 49593 | `https://api.inaturalist.org/v1/observations?q=escola&per_page=3` |
| `ciencia_salud` | `inaturalist-taxa` | json | 3 | 646 | 3511 | `https://api.inaturalist.org/v1/taxa?q=escola&per_page=3` |
| `ciencia_salud` | `longevity-world-cup-longevityworldcup` | json | None | 1093 | >=262144 | `https://longevityworldcup.com/api/data/athletes` |
| `ciencia_salud` | `openfoodfacts-product` | json | 4 | 275 | 36607 | `https://world.openfoodfacts.org/api/v2/product/737628064502.json` |
| `ciencia_salud` | `pdb-entry` | json | 28 | 429 | 9030 | `https://data.rcsb.org/rest/v1/core/entry/1CRN` |
| `ciencia_salud` | `pubchem-property` | json | 1 | 311 | 166 | `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/property/M` |
| `ciencia_salud` | `pubmed-esearch` | json | 2 | 289 | 317 | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&t` |
| `ciencia_salud` | `pubmed-esummary` | json | 2 | 389 | 1909 | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&` |
| `ciencia_salud` | `randomdog-random` | json | 2 | 552 | 92 | `https://random.dog/woof.json` |
| `ciencia_salud` | `reactome-pathways-top` | json | 29 | 439 | 12191 | `https://reactome.org/ContentService/data/pathways/top/9606` |
| `ciencia_salud` | `reactome-query` | json | None | 1189 | >=262144 | `https://reactome.org/ContentService/data/eventsHierarchy/9606` |
| `ciencia_salud` | `uniprot` | json | 3 | 443 | 112358 | `https://rest.uniprot.org/uniprotkb/search?query=escola&size=3&format=j` |
| `ciencia_salud` | `usda-fooddata` | json | 7 | 1049 | 267 | `https://api.nal.usda.gov/fdc/v1/foods/search?query=escola&api_key=DEMO` |
| `ciencia_salud` | `who-gho-indicators` | json | None | 259 | >=262144 | `https://ghoapi.azureedge.net/api/Indicator` |
| `ciencia_salud` | `who-gho-observation` | json | None | 163 | >=262144 | `https://ghoapi.azureedge.net/api/WHOSIS_000001` |
| `datos_pais` | `countries-states-cities` | json | None | 164 | >=262144 | `https://raw.githubusercontent.com/dr5hn/countries-states-cities-databa` |
| `datos_pais` | `eurostat-data` | json | None | 519 | >=262144 | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/pr` |
| `datos_pais` | `geoboundaries` | json | 32 | 504 | 1732 | `https://www.geoboundaries.org/api/current/gbOpen/BRA/ADM1/` |
| `datos_pais` | `geonames-search` | json | 1 | 114 | 190 | `http://api.geonames.org/searchJSON?q=escola&maxRows=3&username=demo` |
| `datos_pais` | `hdx-package-search` | json | 3 | 420 | 294 | `https://data.humdata.org/api/3/action/package_search?q=escola&rows=3` |
| `datos_pais` | `ilostat-indicator` | json | None | 378 | >=262144 | `https://rplumber.ilo.org/data/indicator/?id=UNE_2EAP_SEX_AGE_RT_A&form` |
| `datos_pais` | `imf-gdp` | json | 2 | 8606 | 157531 | `https://www.imf.org/external/datamapper/api/v1/NGDPD` |
| `datos_pais` | `imf-indicators` | json | 2 | 8498 | 48340 | `https://www.imf.org/external/datamapper/api/v1/indicators` |
| `datos_pais` | `iso-country-codes` | csv | 250 | 407 | 134003 | `https://raw.githubusercontent.com/datasets/country-codes/master/data/c` |
| `datos_pais` | `naturalearth-countries` | json | None | 151 | >=262144 | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/` |
| `datos_pais` | `nominatim-search` | json | 3 | 132 | 1352 | `https://nominatim.openstreetmap.org/search?q=escola&format=json&limit=` |
| `datos_pais` | `oecd-dataflow` | json | None | 158 | >=262144 | `https://sdmx.oecd.org/public/rest/dataflow/all/all/latest` |
| `datos_pais` | `restcountries-all` | json | 3 | 203 | 261 | `https://restcountries.com/v3.1/all?fields=name,cca3,capital,region,fla` |
| `datos_pais` | `restcountries-name` | json | 3 | 287 | 261 | `https://restcountries.com/v3.1/name/escola` |
| `datos_pais` | `slf-github` | text | 648 | 787 | 242657 | `https://github.com/slftool/slftool.github.io/blob/master/API.md` |
| `datos_pais` | `uk-bank-holidays-www` | json | 3 | 73 | 22207 | `https://www.gov.uk/bank-holidays.json` |
| `datos_pais` | `worldbank-countries` | json | 2 | 48 | 1226 | `https://api.worldbank.org/v2/country?format=json&per_page=3` |
| `datos_pais` | `worldbank-gdp` | json | 2 | 63 | 709 | `https://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD?form` |
| `datos_pais` | `worldbank-indicators` | json | 2 | 81 | 1287 | `https://api.worldbank.org/v2/indicator?format=json&per_page=3` |
| `ciberseguridad` | `cisa-kev` | json | None | 220 | >=262144 | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnera` |
| `ciberseguridad` | `disposable-emails` | text | 8813 | 163 | 125415 | `https://raw.githubusercontent.com/disposable-email-domains/disposable-` |
| `ciberseguridad` | `epss` | json | 3 | 51 | 389 | `https://api.first.org/data/v1/epss?limit=3` |
| `ciberseguridad` | `exploitdb` | csv | 1252 | 425 | 262144 | `https://gitlab.com/exploit-database/exploitdb/-/raw/main/files_exploit` |
| `ciberseguridad` | `feodo-blocklist` | csv | 15 | 224 | 940 | `https://feodotracker.abuse.ch/downloads/ipblocklist.csv` |
| `ciberseguridad` | `gh-advisories` | json | 3 | 532 | 28672 | `https://api.github.com/advisories?per_page=3` |
| `ciberseguridad` | `mitre-attack-cti` | json | None | 310 | >=262144 | `https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/e` |
| `ciberseguridad` | `mitre-attack-stix` | json | None | 333 | >=262144 | `https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master` |
| `ciberseguridad` | `mitre-capec` | xml | 1 | 1667 | 262144 | `https://capec.mitre.org/data/xml/capec_latest.xml` |
| `ciberseguridad` | `mitre-cwec` | xml | 1 | 1618 | 262144 | `https://cwe.mitre.org/data/xml/cwec_latest.xml` |
| `ciberseguridad` | `mozilla-http-scanner-github` | text | 503 | 1124 | 262144 | `https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/a` |
| `ciberseguridad` | `nist-oscal-800-53` | json | None | 304 | >=262144 | `https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.go` |
| `ciberseguridad` | `nuclei-templates-meta` | json | 12 | 289 | 9001 | `https://api.github.com/repos/projectdiscovery/nuclei-templates/content` |
| `ciberseguridad` | `nvd-cves` | json | 7 | 566 | 6406 | `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=3` |
| `ciberseguridad` | `openphish-feed` | text | 300 | 381 | 16078 | `https://openphish.com/feed.txt` |
| `ciberseguridad` | `osv-vuln` | json | 8 | 383 | 1066 | `https://api.osv.dev/v1/vulns/OSV-2020-111` |
| `ciberseguridad` | `owasp-asvs` | csv | 287 | 248 | 76927 | `https://raw.githubusercontent.com/OWASP/ASVS/master/4.0/docs_en/OWASP%` |
| `ciberseguridad` | `publicsuffix` | text | 11551 | 152 | 262144 | `https://publicsuffix.org/list/public_suffix_list.dat` |
| `ciberseguridad` | `ssl-labs-github` | text | 500 | 772 | 262144 | `https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v` |
| `ciberseguridad` | `sslbl-blacklist` | csv | 12 | 129 | 545 | `https://sslbl.abuse.ch/blacklist/sslipblacklist.csv` |
| `ciberseguridad` | `stevenblack-hosts` | text | 9367 | 158 | 262144 | `https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts` |
| `ciberseguridad` | `yara-rules` | text | 484 | 236 | 19945 | `https://raw.githubusercontent.com/Yara-Rules/rules/master/index.yar` |
| `ux_diseno` | `bootstrap-icons` | json | 2078 | 271 | 53043 | `https://raw.githubusercontent.com/twbs/icons/main/font/bootstrap-icons` |
| `ux_diseno` | `color-names` | json | None | 166 | >=262144 | `https://cdn.jsdelivr.net/npm/color-name-list/dist/colornames.json` |
| `ux_diseno` | `commons-search-images` | json | 3 | 1231 | 1310 | `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsea` |
| `ux_diseno` | `feather-icons` | text | 1 | 234 | 239 | `https://raw.githubusercontent.com/feathericons/feather/main/icons/acti` |
| `ux_diseno` | `google-fonts-meta` | json | None | 340 | >=262144 | `https://fonts.google.com/metadata/fonts` |
| `ux_diseno` | `heroicons-svg` | text | 3 | 239 | 683 | `https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimi` |
| `ux_diseno` | `iconify-collections` | json | 238 | 132 | 98125 | `https://api.iconify.design/collections` |
| `ux_diseno` | `iconify-mdi` | json | None | 137 | >=262144 | `https://api.iconify.design/collection?prefix=mdi` |
| `ux_diseno` | `iconify-search` | json | 6 | 158 | 562 | `https://api.iconify.design/search?query=escola&limit=3` |
| `ux_diseno` | `lucide-icon-svg` | text | 17 | 229 | 398 | `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/acces` |
| `ux_diseno` | `lucide-tags` | json | None | 197 | >=262144 | `https://cdn.jsdelivr.net/npm/lucide-static/tags.json` |
| `ux_diseno` | `material-symbols-meta` | json | None | 496 | >=262144 | `https://fonts.google.com/metadata/icons?incomplete=true` |
| `ux_diseno` | `noto-emoji` | text | 54 | 240 | 3952 | `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoj` |
| `ux_diseno` | `open-color` | json | 15 | 260 | 2213 | `https://raw.githubusercontent.com/yeun/open-color/master/open-color.js` |
| `ux_diseno` | `openmoji` | json | None | 279 | >=262144 | `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/data/open` |
| `ux_diseno` | `openverse-images` | json | 3 | 69 | 8846 | `https://api.openverse.org/v1/images/?q=escola&page_size=3` |
| `ux_diseno` | `simple-icons` | json | None | 310 | >=262144 | `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/da` |
| `ux_diseno` | `twemoji` | image | 1 | 273 | 806 | `https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/` |
| `patrimonio_arte` | `artic-artworks` | json | 3 | 395 | 1138 | `https://api.artic.edu/api/v1/artworks?limit=3&fields=id,title,artist_d` |
| `patrimonio_arte` | `artic-search` | json | 3 | 353 | 2384 | `https://api.artic.edu/api/v1/artworks/search?q=escola&limit=3` |
| `patrimonio_arte` | `europeana-search` | json | 3 | 406 | 7661 | `https://api.europeana.eu/record/v2/search.json?query=escola&rows=3&wsk` |
| `patrimonio_arte` | `gallica-sru` | xml | 1 | 640 | 8739 | `https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=` |
| `patrimonio_arte` | `getty-aat` | json | 2 | 656 | 776 | `https://vocab.getty.edu/sparql.json?query=SELECT%20%3Fs%20%3Flabel%20W` |
| `patrimonio_arte` | `met-object` | json | 57 | 242 | 1665 | `https://collectionapi.metmuseum.org/public/collection/v1/objects/1` |
| `patrimonio_arte` | `musicbrainz-artist` | json | 4 | 224 | 683 | `https://musicbrainz.org/ws/2/artist?query=escola&fmt=json&limit=3` |
| `patrimonio_arte` | `musicbrainz-recording` | json | 4 | 496 | 14240 | `https://musicbrainz.org/ws/2/recording?query=escola&fmt=json&limit=3` |
| `patrimonio_arte` | `musicbrainz-release` | json | 4 | 209 | 3413 | `https://musicbrainz.org/ws/2/release?query=escola&fmt=json&limit=3` |
| `patrimonio_arte` | `nasa-apod` | json | 7 | 882 | 1197 | `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY` |
| `patrimonio_arte` | `nasa-images` | json | 1 | 281 | 135 | `https://images-api.nasa.gov/search?q=escola&page_size=3` |
| `patrimonio_arte` | `sciencemuseum-uk` | json | 3 | 7435 | 19998 | `https://collection.sciencemuseumgroup.org.uk/search/objects?q=escola&p` |
| `patrimonio_arte` | `smithsonian-openaccess` | json | 3 | 1300 | 36057 | `https://api.si.edu/openaccess/api/v1.0/search?q=escola&api_key=DEMO_KE` |
| `patrimonio_arte` | `vam-museum` | json | 3 | 179 | 7657 | `https://api.vam.ac.uk/v2/objects/search?q=escola&page_size=3` |
| `sin_clasificar` | `changelogs-md-changelogs` | text | 1105 | 1739 | 161675 | `https://changelogs.md` |
| `sin_clasificar` | `license-api-github` | text | 643 | 702 | 251388 | `https://github.com/cmccandless/license-api/blob/master/README.md` |
| `sin_clasificar` | `strait-of-hormuz-ship-monitor-hormuz` | text | 33 | 424 | 2152 | `https://hormuz.data-tracking.net/llms.txt` |
| `sin_clasificar` | `transport-for-berlin-germany-github` | text | 469 | 752 | 262144 | `https://github.com/derhuerst/vbb-rest/blob/3/docs/index.md` |
| `sin_clasificar` | `wheelwise-cars` | json | 24 | 7361 | 9691 | `https://cars.limoja.ai/api/search?q=BMW&limit=1` |
| `sin_clasificar` | `yes-no-yesno` | json | 3 | 209 | 110 | `https://yesno.wtf/api` |

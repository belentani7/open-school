# Cola de revision M1 - candidatas

Total candidatas deduplicadas: **765**  
Maquina-legibles (kind != html): **521**  
Portales solo-HTML: **244**  
Sin clasificar: **166**  

| area | total | A | B | C | ya en registry |
|---|---|---|---|---|---|
| `academico` | 102 | 61 | 21 | 20 | 5 |
| `idiomas` | 55 | 34 | 12 | 9 | 0 |
| `civico_derechos` | 114 | 19 | 34 | 61 | 0 |
| `ciencia_salud` | 108 | 23 | 48 | 37 | 0 |
| `datos_pais` | 94 | 15 | 50 | 29 | 0 |
| `ciberseguridad` | 44 | 15 | 22 | 7 | 1 |
| `ux_diseno` | 46 | 17 | 13 | 16 | 0 |
| `patrimonio_arte` | 36 | 12 | 17 | 7 | 0 |
| `sin_clasificar` | 166 | 0 | 108 | 58 | 0 |

## Muestra por area (primeras 12)

### academico (102)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `archive-org` | Internet Archive | json | catalogs | `https://archive.org/advancedsearch.php?q={q}&fl%5B%5D=identifier&fl%5B%5D=titl` |
| `arxiv` | arXiv API | xml | catalogs | `http://export.arxiv.org/api/query?search_query=all:{q}&max_results={limit}` |
| `college-scorecard` | College Scorecard (Dept. de Educacion US) | json | catalogs | `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=DEMO_KEY&per_page=` |
| `crossref` | Crossref REST API | json | catalogs | `https://api.crossref.org/works?query={q}&rows={limit}` |
| `crossref-journals` | Crossref Journals | json | catalogs | `https://api.crossref.org/journals?query={q}&rows={limit}` |
| `dadosgov-pt` | dados.gov.pt | json | catalogs | `https://dados.gov.pt/api/1/datasets/?q={q}&page_size={limit}` |
| `data-gov-uk` | data.gov.uk | json | catalogs | `https://data.gov.uk/api/3/action/package_search?q={q}&rows={limit}` |
| `datacite` | DataCite DOIs | json | catalogs | `https://api.datacite.org/dois?query={q}&page%5Bsize%5D={limit}` |
| `dataeuropa` | data.europa.eu | json | catalogs | `https://data.europa.eu/api/hub/search/search?q={q}&limit={limit}` |
| `datagov-us` | data.gov (US) | json | catalogs | `https://catalog.data.gov/api/3/action/package_search?q={q}&rows={limit}` |
| `datosgob-es` | datos.gob.es | json | catalogs | `https://datos.gob.es/apidata/catalog/dataset?_pageSize={limit}&q={q}` |
| `dblp` | dblp computer science bibliography | json | catalogs | `https://dblp.org/search/publ/api?q={q}&format=json&h={limit}` |

### idiomas (55)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `apertium-listpairs` | Apertium (pares de idiomas) | json | catalogs | `https://apertium.org/apy/listPairs` |
| `apertium-translate-pt-es` | Apertium Traductor PT-ES | json | catalogs | `https://apertium.org/apy/translate?langpair=pt%7Ces&q={q}` |
| `cldr-annotations-ca` | Unicode CLDR anotaciones CA | json | catalogs | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-an` |
| `cldr-annotations-en` | Unicode CLDR anotaciones EN | json | catalogs | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-an` |
| `cldr-annotations-es` | Unicode CLDR anotaciones ES | json | catalogs | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-an` |
| `cldr-annotations-pt` | Unicode CLDR anotaciones PT | json | catalogs | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-an` |
| `cldr-likelysubtags` | Unicode CLDR likelySubtags | json | catalogs | `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-co` |
| `datamuse-sug` | Datamuse (sugerencias y ortografia) | json | catalogs | `https://api.datamuse.com/sug?s={q}&max={limit}` |
| `datamuse-words` | Datamuse (palabras por significado) | json | catalogs | `https://api.datamuse.com/words?ml={q}&max={limit}` |
| `freedict` | FreeDict (diccionarios libres) | json | catalogs | `https://freedict.org/freedict-database.json` |
| `huggingface-datasets` | Hugging Face Datasets | json | catalogs | `https://huggingface.co/api/datasets?search={q}&limit={limit}` |
| `huggingface-models` | Hugging Face Models | json | catalogs | `https://huggingface.co/api/models?search={q}&limit={limit}` |

### civico_derechos (114)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `camara-br-deputados` | Camara dos Deputados (BR) | json | catalogs | `https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome&` |
| `camara-br-proposicoes` | Camara dos Deputados - Proposicoes | json | catalogs | `https://dadosabertos.camara.leg.br/api/v2/proposicoes?ordem=DESC&ordenarPor=id` |
| `cepalstat-indicators` | CEPALSTAT (America Latina) | json | catalogs | `https://api-cepalstat.cepal.org/cepalstat/api/v1/indicator?lang=es/` |
| `eurlex-sparql` | EUR-Lex / CELLAR SPARQL | json | catalogs | `https://publications.europa.eu/webapi/rdf/sparql?query=SELECT%20%3Fs%20%3Fp%20` |
| `eurostat-catalogue` | Eurostat Catalogue | text | catalogs | `https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en` |
| `eurostat-crime` | Eurostat (delitos registrados) | json | catalogs | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/crim_off_c` |
| `gdelt-doc` | GDELT (noticias globales) | json | catalogs | `https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&format=json` |
| `gdelt-tv` | GDELT TV | json | catalogs | `https://api.gdeltproject.org/api/v2/tv/tv?query={q}&mode=clipgallery&format=js` |
| `govtrack-bills` | GovTrack (US Congress) | json | catalogs | `https://www.govtrack.us/api/v2/bill?congress=118&limit={limit}` |
| `ourworldindata` | Our World in Data | json | catalogs | `https://api.ourworldindata.org/v1/indicators/{q}.metadata.json` |
| `senado-br-senadores` | Senado Federal (BR) | json | catalogs | `https://legis.senado.leg.br/dadosabertos/senador/lista/atual` |
| `udhr-cat` | Wikimedia Core Search AT | xml | catalogs | `https://api.wikimedia.org/core/v1/wikipedia/ca/search/page?q={q}&limit={limit}` |

### ciencia_salud (108)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `chembl-target-search` | ChEMBL (dianas) | json | catalogs | `https://www.ebi.ac.uk/chembl/api/data/target/search?q={q}&format=json` |
| `clinicaltrials-v2` | ClinicalTrials.gov API v2 | json | catalogs | `https://clinicaltrials.gov/api/v2/studies?query.term={q}&pageSize={limit}` |
| `ebi-proteins` | EBI Proteins API | json | catalogs | `https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size={limit}` |
| `ensembl-lookup-symbol` | Ensembl (gen por simbolo) | json | catalogs | `https://rest.ensembl.org/lookup/symbol/homo_sapiens/{q}?content-type=applicati` |
| `gbif-occurrence` | GBIF (observaciones) | json | catalogs | `https://api.gbif.org/v1/occurrence/search?limit={limit}` |
| `gbif-species` | GBIF (especies) | json | catalogs | `https://api.gbif.org/v1/species/search?q={q}&limit={limit}` |
| `geneontology-autocomplete` | Gene Ontology (autocomplete) | json | catalogs | `https://api.geneontology.org/api/search/entity/autocomplete/{q}` |
| `hpo-term` | Human Phenotype Ontology | json | catalogs | `https://purl.obolibrary.org/obo/hp.json` |
| `inaturalist-observations` | iNaturalist (observaciones) | json | catalogs | `https://api.inaturalist.org/v1/observations?q={q}&per_page={limit}` |
| `inaturalist-taxa` | iNaturalist (taxones) | json | catalogs | `https://api.inaturalist.org/v1/taxa?q={q}&per_page={limit}` |
| `kegg-find-genes` | KEGG (busqueda de genes) | text | catalogs | `https://rest.kegg.jp/find/genes/{q}` |
| `mesh-lookup` | MeSH (descriptor) | json | catalogs | `https://id.nlm.nih.gov/mesh/lookup/descriptor?label={q}&match=contains&limit={` |

### datos_pais (94)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `countries-states-cities` | Countries States Cities DB | json | catalogs | `https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/maste` |
| `eurostat-data` | Eurostat (dataset JSON) | json | catalogs | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_m` |
| `faostat-data` | FAOSTAT (datos) | json | catalogs | `https://fenixservices.fao.org/faostat/api/v1/en/data/RL/?area=351&item=15&year` |
| `faostat-domains` | FAOSTAT (dominios) | json | catalogs | `https://fenixservices.fao.org/faostat/api/v1/en/definitions/domain/` |
| `geoboundaries` | geoBoundaries (fronteras) | json | catalogs | `https://www.geoboundaries.org/api/current/gbOpen/{iso3}/ADM1/` |
| `geonames-search` | GeoNames (demo) | json | catalogs | `http://api.geonames.org/searchJSON?q={q}&maxRows={limit}&username=demo` |
| `hdx-package-search` | HDX (datos humanitarios) | json | catalogs | `https://data.humdata.org/api/3/action/package_search?q={q}&rows={limit}` |
| `ilostat-indicator` | ILOSTAT (indicadores de trabajo) | json | catalogs | `https://rplumber.ilo.org/data/indicator/?id=UNE_2EAP_SEX_AGE_RT_A&format=.json` |
| `imf-gdp` | IMF DataMapper (PIB) | json | catalogs | `https://www.imf.org/external/datamapper/api/v1/NGDPD` |
| `imf-indicators` | IMF DataMapper (indicadores) | json | catalogs | `https://www.imf.org/external/datamapper/api/v1/indicators` |
| `iso-country-codes` | ISO Country Codes (dataset) | csv | catalogs | `https://raw.githubusercontent.com/datasets/country-codes/master/data/country-c` |
| `naturalearth-countries` | Natural Earth (paises GeoJSON) | json | catalogs | `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/` |

### ciberseguridad (44)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `cisa-kev` | CISA Known Exploited Vulnerabilities | json | catalogs | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities` |
| `disposable-emails` | Disposable Email Domains | text | catalogs | `https://raw.githubusercontent.com/disposable-email-domains/disposable-email-do` |
| `epss` | EPSS (probabilidad de explotacion) | json | catalogs | `https://api.first.org/data/v1/epss?limit={limit}` |
| `exploitdb` | ExploitDB (catalogo de exploits) | csv | catalogs | `https://gitlab.com/exploit-database/exploitdb/-/raw/main/files_exploits.csv` |
| `feodo-blocklist` | abuse.ch Feodo Tracker | csv | catalogs | `https://feodotracker.abuse.ch/downloads/ipblocklist.csv` |
| `gh-advisories` | GitHub Security Advisories | json | catalogs | `https://api.github.com/advisories?per_page={limit}` |
| `mitre-attack-cti` | MITRE ATT&CK (cti legacy) | json | catalogs | `https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterpris` |
| `mitre-attack-stix` | MITRE ATT&CK (STIX) | json | catalogs | `https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterpr` |
| `mitre-capec` | MITRE CAPEC (patrones de ataque) | xml | catalogs | `https://capec.mitre.org/data/xml/capec_latest.xml` |
| `mitre-cwec` | MITRE CWE (debilidades) | xml | catalogs | `https://cwe.mitre.org/data/xml/cwec_latest.xml` |
| `nist-oscal-800-53` | NIST SP 800-53 (OSCAL) | json | catalogs | `https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-` |
| `nuclei-templates-meta` | Nuclei Templates (meta) | json | catalogs | `https://api.github.com/repos/projectdiscovery/nuclei-templates/contents/README` |

### ux_diseno (46)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `bootstrap-icons` | Bootstrap Icons (catalogo) | json | catalogs | `https://raw.githubusercontent.com/twbs/icons/main/font/bootstrap-icons.json` |
| `color-names` | Color Names (nombre a hex) | json | catalogs | `https://cdn.jsdelivr.net/npm/color-name-list/dist/colornames.json` |
| `commons-search-images` | Wikimedia Commons (busqueda) | json | catalogs | `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={q}&` |
| `feather-icons` | Feather Icons (SVG) | text | catalogs | `https://raw.githubusercontent.com/feathericons/feather/main/icons/activity.svg` |
| `google-fonts-meta` | Google Fonts (metadata publica) | json | catalogs | `https://fonts.google.com/metadata/fonts` |
| `heroicons-svg` | Heroicons (SVG) | text | catalogs | `https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/o` |
| `iconify-collections` | Iconify Collections | json | catalogs | `https://api.iconify.design/collections` |
| `iconify-mdi` | Iconify Material Design Icons | json | catalogs | `https://api.iconify.design/collection?prefix=mdi` |
| `iconify-search` | Iconify Search | json | catalogs | `https://api.iconify.design/search?query={q}&limit={limit}` |
| `lucide-icon-svg` | Lucide (SVG individual) | text | catalogs | `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/accessibility` |
| `lucide-tags` | Lucide (catalogo de iconos) | json | catalogs | `https://cdn.jsdelivr.net/npm/lucide-static/tags.json` |
| `material-symbols-meta` | Material Symbols (metadata) | json | catalogs | `https://fonts.google.com/metadata/icons?incomplete=true` |

### patrimonio_arte (36)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `artic-artworks` | Art Institute of Chicago (obras) | json | catalogs | `https://api.artic.edu/api/v1/artworks?limit={limit}&fields=id,title,artist_dis` |
| `artic-search` | Art Institute of Chicago (busqueda) | json | catalogs | `https://api.artic.edu/api/v1/artworks/search?q={q}&limit={limit}` |
| `cleveland-art` | Cleveland Museum of Art | json | catalogs | `https://openaccess-api.clevelandart.org/api/artworks/?q={q}&limit={limit}` |
| `europeana-search` | Europeana (patrimonio europeo) | json | catalogs | `https://api.europeana.eu/record/v2/search.json?query={q}&rows={limit}&wskey=ap` |
| `gallica-sru` | Gallica / BnF (SRU) | xml | catalogs | `https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=gallica%` |
| `getty-aat` | Getty Art & Architecture Thesaurus | json | catalogs | `https://vocab.getty.edu/sparql.json?query=SELECT%20%3Fs%20%3Flabel%20WHERE%20%` |
| `met-object` | Met Museum (objeto) | json | catalogs | `https://collectionapi.metmuseum.org/public/collection/v1/objects/1` |
| `met-search` | Met Museum (busqueda) | json | catalogs | `https://collectionapi.metmuseum.org/public/collection/v1/search?q={q}` |
| `musicbrainz-artist` | MusicBrainz (artistas) | json | catalogs | `https://musicbrainz.org/ws/2/artist?query={q}&fmt=json&limit={limit}` |
| `musicbrainz-recording` | MusicBrainz (grabaciones) | json | catalogs | `https://musicbrainz.org/ws/2/recording?query={q}&fmt=json&limit={limit}` |
| `musicbrainz-release` | MusicBrainz (albumes) | json | catalogs | `https://musicbrainz.org/ws/2/release?query={q}&fmt=json&limit={limit}` |
| `nasa-apod` | NASA Astronomy Picture of the Day | json | catalogs | `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY` |

### sin_clasificar (166)

| id | nombre | kind | fuente | url |
|---|---|---|---|---|
| `24-pull-requests-24pullrequests` | 24 Pull Requests | json | public-apis | `https://24pullrequests.com/api` |
| `agify-io-agify` | Agify.io | json | public-apis | `https://agify.io` |
| `agpc-domain-check-guild` | AGPC Domain Check | json | public-apis | `https://guild.tradeuniquecapital.com/api` |
| `ai-dev-jobs-aidevboard` | AI Dev Jobs | json | public-apis | `https://aidevboard.com/openapi.yaml` |
| `airportsapi-airport-web` | airportsapi | html | public-apis | `https://airport-web.appspot.com/api/docs/` |
| `api-gratis-apigratis` | API Grátis | html | public-apis | `https://apigratis.com.br/` |
| `apicagent-www` | ApicAgent | json | public-apis | `https://www.apicagent.com` |
| `apis-guru-apis` | APIs.guru | html | public-apis | `https://apis.guru/api-doc/` |
| `apizone-apizone` | APIzone | json | public-apis | `https://apizone.io/api-docs` |
| `aquanode-docs` | Aquanode | json | public-apis | `https://docs.aquanode.io/docs/api/marketplace` |
| `arbeitnow-documenter` | Arbeitnow | json | public-apis | `https://documenter.getpostman.com/view/18545278/UVJbJdKh` |
| `arcnautical-arcnautical` | ArcNautical | html | public-apis | `https://arcnautical.com/developers/` |

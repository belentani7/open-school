# Alexandria — Biblioteca para Agentes (no para humanos)

**Esto no es una web. Es una base de conocimiento canónica para agentes.**

## Cómo me usan los agentes (lenguaje nativo)

```js
// 1. Cargar manifiesto canónico (216 páginas indexadas)
import manifest from './agent-library/manifest.json'
// manifest.pages[] -> cada HTML con id, type, tags, protocols, languages, source_canonical

// 2. RAG: cargar chunks
const chunks = await loadAll('./agent-library/chunks/*.json')
// chunk.text + chunk.metadata -> embedding

// 3. Grafo: traversar dependencias
import graph from './agent-library/graph/knowledge-graph.json'
// graph.nodes + graph.edges (contains, usesProtocol, writtenIn)

// 4. Ontología JSON-LD
import ontology from './agent-library/ontology/ontology.jsonld'
// RDF listo para reasoners

// 5. Skills invocables
import orchestrator from './agent-library/skills/orchestrator.skill.json'
// orchestrator.tools -> ejecutar

// 6. MCP tools
import mcp from './agent-library/tools/mcp-tools.json'
// mcp.tools[].name = alexandria_query | alexandria_generate_htmls
```

## Endpoints agente

- `POST /query {query, tags, level}` -> lecciones + citas oficiales
- `POST /generate {target, finalize}` -> 216 HTMLs
- `GET /validate` -> HTML5 + enlaces
- `GET /protocol/{https|grpc|ble|nfc|mqtt}` -> contrato canónico

## Principios

1. **Fuente canónica enlazada, no copiada**: cada lesson.source_canonical apunta a developer.android.com/source.android.com
2. **Estructura implícita**: el código (generate.js) ES la estructura, no un doc aparte
3. **HTML5 en todos los niveles**: validador bloquea si falta <header>/<nav>/<main>/<article>/<footer>
4. **Fitness functions**: architectural-guardian bloquea imports ilegales (Conway invertida)

## Estadísticas canónicas
- 216 HTMLs, 10 tracks, 50 módulos, 150 lecciones, 5 docs
- 9 lenguajes, 15 protocolos, 13 criterios bloqueantes
- 8 skills, 4 MCP tools, 1 ontología JSON-LD, 1 grafo 200+ nodos

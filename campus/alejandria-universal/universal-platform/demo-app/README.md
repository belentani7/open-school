# Cómo un agente usa Alejandría Universal — Demo en vivo

## 1. Descubrimiento (el agente se encuentra)

No scrapping HTML. Punto de entrada único para agentes:

```
GET http://localhost:3002/api/manifest
→ { stats:{pages:1006, tracks:20, lessons:800}, pages:[{id,type,title,path,tags}] }
```

Como `robots.txt` pero para IA. Cualquier agente (Cursor, Claude, tu app) lo carga y ya sabe TODO lo que existe.

## 2. Búsqueda (encuentra la información)

```
POST /api/query { "query": "Stripe checkout 3DS SCA" }
→ { results:[ {score, title, path, tags} ] } // 5 hits rankeados con cita
```

No vector DB externa. RAG léxico + tags sobre 800 lecciones. Cada hit trae `path` y `tags` para abrir HTML exacto.

## 3. Lectura (consume)

```
GET /tracks/06-pagos/modules/pagos-mod01-integracion-stripe-psp/lessons/...-l1.html
```

Cada lección es HTML5 + `definición + ejemplo vivo + protocolo + criterio bloqueante + fuente canónica`.

## 4. Aplicación (genera código citando fuente)

Ver `agent-workflow.js` — simula agente que recibe tarea y genera código usando plataforma.

Ejecuta:
```
node agent-workflow.js "Crea checkout con Stripe y 3DS para España"
```


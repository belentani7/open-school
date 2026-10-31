#!/usr/bin/env node
// Alexandria Query — motor semántico para agentes (sin API key, búsqueda léxica + grafo)
import fs from 'fs/promises';
import path from 'path';
const root = path.join(new URL('.', import.meta.url).pathname, '../..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'agent-library/manifest.json'),'utf8'));
const chunksDir = path.join(root, 'agent-library/chunks');
const query = process.argv.slice(2).join(' ') || 'WorkManager';

const files = await fs.readdir(chunksDir);
const chunks = [];
for(const f of files.filter(f=>f.endsWith('.json') && f!=='index.json')){
  const c = JSON.parse(await fs.readFile(path.join(chunksDir,f),'utf8'));
  const hay = (c.text + ' ' + c.metadata.title + ' ' + (c.metadata.tags||[]).join(' ')).toLowerCase();
  const score = query.toLowerCase().split(/\s+/).reduce((s,w)=> s + (hay.includes(w)?1:0), 0);
  if(score>0) chunks.push({score, ...c});
}
chunks.sort((a,b)=>b.score-a.score);
console.log(`\n🔍 Alexandria Query: "${query}" — ${chunks.length} resultados\n`);
for(const c of chunks.slice(0,5)){
  console.log(`· [${c.score}] ${c.metadata.title}\n  path: ${c.metadata.path}\n  tags: ${c.metadata.tags?.join(', ')}\n  source: ${c.metadata.source}\n`);
}
if(!chunks.length) console.log('Sin resultados. Prueba: "Compose", "Room", "BLE", "Keystore", "WorkManager"');

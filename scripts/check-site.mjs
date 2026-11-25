#!/usr/bin/env node
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert(/^<!doctype html>/i.test(html),"HTML5 doctype required");
assert(/<html\b[^>]*lang="es"/i.test(html),"Spanish source language required");
assert(/<main\b/i.test(html),"Main landmark required");
assert(/<title>[^<]+<\/title>/i.test(html),"Document title required");
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
assert.equal(scripts.length,1,"Expected one self-contained script");
new vm.Script(scripts[0][1],{filename:"open-school-inline.js"});
assert(!/navigator\.serviceWorker\.register/.test(html),"Project must be web-first, not offline-cached");
assert(!/div\.innerHTML\s*=\s*text\.replace/.test(html),"Untrusted chat text must not be HTML");
assert(/div\.textContent\s*=\s*String\(text\)/.test(html),"Chat must use textContent");
assert(/Tutor de demostración/.test(html),"Simulated chatbot must be identified");
assert(!/(?:sk-proj-|ghp_|github_pat_)[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(html),"Possible secret in static site");
const refs=[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(x=>x[1]);
for(const ref of refs){if(ref.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/i.test(ref))continue;const target=path.resolve(root,ref.split(/[?#]/,1)[0]);assert(target.startsWith(root+path.sep)&&fs.existsSync(target),"Missing local asset "+ref);}
console.log(JSON.stringify({ok:true,htmlBytes:html.length,scriptCount:scripts.length,sections:(html.match(/<section\b/gi)||[]).length,links:refs.length,mode:"web-first; simulated chat, no service worker"},null,2));

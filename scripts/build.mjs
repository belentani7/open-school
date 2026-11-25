#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const dist=path.join(root,"dist");
fs.rmSync(dist,{force:true,recursive:true});
fs.mkdirSync(dist,{recursive:true});
fs.copyFileSync(path.join(root,"index.html"),path.join(dist,"index.html"));
fs.writeFileSync(path.join(dist,"robots.txt"),"User-agent: *\nDisallow: /\n");
console.log("Open School web bundle ready in dist/ (no private docs or server runtime)");

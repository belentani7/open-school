import path from "path";
import { cpSync, existsSync, lstatSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "./client",
  plugins: [react(), tailwindcss(), { name:"publish-reviewed-course-content", apply:"build", closeBundle(){ const source=path.resolve(__dirname,"campus/cursos"); const destination=path.resolve(__dirname,"dist/client/itinerarios/cursos"); if(!existsSync(source)) throw Error("Missing course source"); cpSync(source,destination,{recursive:true,filter:(item)=>{const relative=path.relative(source,item).split(path.sep);if(relative.some(x=>x.startsWith(".")||x==="node_modules"))return false;if(lstatSync(item).isSymbolicLink())return false;return item===source||!path.extname(item)||[".json",".md"].includes(path.extname(item))}}); } }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  server: {
    allowedHosts: process.env.ARENA_PREVIEW_HOST
      ? [process.env.ARENA_PREVIEW_HOST]
      : [],
    proxy: {
      "/api": "http://127.0.0.1:8001",
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});

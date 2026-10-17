import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "./client",
  plugins: [react(), tailwindcss()],
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

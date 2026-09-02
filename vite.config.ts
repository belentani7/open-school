import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@/server': path.resolve(__dirname, './server'),
      '@/shared': path.resolve(__dirname, './shared')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});

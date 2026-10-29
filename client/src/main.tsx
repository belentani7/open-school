import React from 'react';
import ReactDOM from 'react-dom/client';

// Sin esta linea el bundle sale sin una sola regla de estilo. Era el
// segundo motivo por el que la app se renderizaba en crudo: el fichero
// existia y se documentaba como entry, pero nadie lo importaba.
import './index.css';

import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// El service worker solo en produccion: en dev serviria assets cacheados
// y romperia el hot reload. Se registra tras `load` para no competir con
// el primer render.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sin SW la app sigue funcionando: solo pierde el modo sin conexion.
    });
  });
}

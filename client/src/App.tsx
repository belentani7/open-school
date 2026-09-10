/* ===================================================================
   APP — raiz. Monta el chrome, los filtros SVG y el enrutado.
   =================================================================== */

import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';

import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { RefractionDefs } from './components/Refraction';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { CourseDetail } from './pages/CourseDetail';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { NotFound } from './pages/NotFound';

/**
 * Al navegar, el scroll se queda donde estaba y el foco sigue en el
 * enlace anterior — un lector de pantalla no se entera de que ha
 * cambiado de pagina. Esto arregla las dos cosas.
 */
function useRouteReset() {
  const [loc] = useLocation();

  useEffect(() => {
    // Si la URL trae un ancla, mandar al principio la anularia: al abrir
    // /#rutas el navegador salta a la seccion y este efecto lo deshacia.
    const { hash } = window.location;
    if (hash.length > 1) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [loc]);
}

export function App() {
  useRouteReset();

  return (
    <>
      <RefractionDefs />

      <a href="#main" className="skip btn btn--light">
        Saltar al contenido
      </a>

      <Nav />

      {/* tabIndex -1: destino programatico del foco, no tabulable. */}
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/chat" component={Chat} />
          <Route path="/courses/:id" component={CourseDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </>
  );
}

/* ===================================================================
   APP — raiz. Monta el chrome, los filtros SVG y el enrutado.
   =================================================================== */

import { lazy, Suspense, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';

import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { RefractionDefs } from './components/Refraction';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Escuelas } from './pages/Escuelas';
import { CourseDetail } from './pages/CourseDetail';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { NotFound } from './pages/NotFound';

/**
 * La Biblia son 219 terminos de datos: pesa mas que cualquier pagina y casi
 * nadie la abre desde la portada. Cargarla en diferido la saca del camino
 * critico — quien no entre en /biblia no descarga ni un byte de ella.
 */
const Biblia = lazy(() => import('./pages/Biblia').then((m) => ({ default: m.Biblia })));

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

/**
 * Lo que se ve mientras llega el chunk de la Biblia. Un hueco con la
 * palabra "cargando" y ya: si el chunk tarda, un esqueleto con la forma
 * del glosario prometeria una rejilla que aun no existe.
 */
function Cargando() {
  return (
    <section className="bay" style={{ paddingTop: 'clamp(8rem, 18vh, 12rem)' }}>
      <div className="shell stack stack--sm">
        <p className="t-label" aria-live="polite">
          Cargando la Biblia…
        </p>
      </div>
    </section>
  );
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
          {/* Ruta fija antes que /courses/:id. En wouter la primera que
              coincide gana, y asi un termino no puede ser tomado por
              un slug de curso. */}
          <Route path="/biblia">
            <Suspense fallback={<Cargando />}>
              <Biblia />
            </Suspense>
          </Route>
          <Route path="/escuelas" component={Escuelas} />
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

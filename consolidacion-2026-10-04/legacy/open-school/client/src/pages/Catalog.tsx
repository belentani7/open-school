/* ===================================================================
   CATALOG — busqueda y filtro sobre las rutas.

   Accesibilidad: los filtros son <button aria-pressed>, no divs con
   onClick. El recuento de resultados va en un live region para que un
   lector de pantalla anuncie el cambio sin mover el foco.
   =================================================================== */

import { useMemo, useState } from 'react';
import { Glass } from '../components/Glass';
import { RouteCase } from '../components/RouteCase';
import { ROUTES, LEVELS, TOTALS, type Level } from '../lib/catalog';

type Filter = Level | 'todas';

export function Catalog() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<Filter>('todas');
  const [offlineOnly, setOfflineOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROUTES.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.word.toLowerCase().includes(q) ||
        r.claim.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.stack.some((s) => s.toLowerCase().includes(q)) ||
        r.langs.some((l) => l.toLowerCase().includes(q));

      return (
        matchesQuery &&
        (level === 'todas' || r.level === level) &&
        (!offlineOnly || r.offline)
      );
    });
  }, [query, level, offlineOnly]);

  const clear = () => {
    setQuery('');
    setLevel('todas');
    setOfflineOnly(false);
  };

  return (
    <div className="bay" style={{ paddingTop: 'clamp(7rem, 16vh, 11rem)' }}>
      <div className="shell stack stack--lg">
        <header className="stack stack--sm">
          <p className="t-label">Catálogo</p>
          <h1 className="t-display" style={{ maxWidth: '15ch' }}>
            {TOTALS.routes} rutas, {TOTALS.modules} módulos
          </h1>
          <p className="t-lede">
            Todas gratuitas. Ninguna pide datos personales para empezar.
          </p>
        </header>

        {/* ───────── Controles ───────── */}
        <Glass style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
          <div className="stack">
            <div>
              <label htmlFor="q" className="sr-only">
                Buscar rutas por nombre, tema o tecnología
              </label>
              <input
                id="q"
                type="search"
                className="field"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar: privacidad, fonética, accesibilidad…"
              />
            </div>

            <div className="row" style={{ gap: '1.2rem' }}>
              <fieldset className="row" style={{ border: 0, padding: 0, margin: 0, gap: '0.35rem' }}>
                <legend className="sr-only">Filtrar por nivel</legend>
                <button
                  type="button"
                  className="btn btn--glass"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                  aria-pressed={level === 'todas'}
                  onClick={() => setLevel('todas')}
                >
                  Todas
                </button>
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className="btn btn--glass"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                    aria-pressed={level === l}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </fieldset>

              <button
                type="button"
                className="btn btn--glass"
                style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                aria-pressed={offlineOnly}
                onClick={() => setOfflineOnly((v) => !v)}
              >
                Sin conexión
              </button>
            </div>
          </div>
        </Glass>

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <p className="t-label" aria-live="polite">
            {results.length} de {TOTALS.routes} rutas
          </p>
          {(query || level !== 'todas' || offlineOnly) && (
            <button type="button" className="btn btn--quiet" onClick={clear}>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ───────── Resultados ───────── */}
        {results.length > 0 ? (
          <div className="bento">
            {results.map((r, i) => (
              <RouteCase key={r.id} route={r} index={i} />
            ))}
          </div>
        ) : (
          <Glass style={{ padding: 'clamp(2.5rem, 7vw, 4.5rem)', textAlign: 'center' }}>
            <div className="stack" style={{ justifyItems: 'center' }}>
              <p className="t-title">Nada coincide con esa búsqueda</p>
              <p className="t-body" style={{ textAlign: 'center' }}>
                Prueba con un término más general, o quita los filtros.
              </p>
              <button type="button" className="btn btn--glass" onClick={clear}>
                Ver las {TOTALS.routes} rutas
              </button>
            </div>
          </Glass>
        )}
      </div>
    </div>
  );
}

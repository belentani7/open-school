/* ===================================================================
   ESCUELAS — inventario real federado desde el registro unificado.

   El catálogo (Catalog.tsx) muestra las rutas curadas a mano; esta
   página muestra el inventario real de recursos que viven en los
   repositorios hermanos (ManosAbiertas, secure-t-university, …),
   catalogados en open-data/unified-campus-registry.json. Nada se
   copia: se federan rutas. Los repos originales quedan intactos.

   Accesibilidad: recuento en live region, filtros como botones
   aria-pressed, búsqueda con label accesible — mismo criterio que
   el resto del sitio.
   =================================================================== */

import { useEffect, useMemo, useState } from 'react';
import { Glass } from '../components/Glass';

type Recurso = {
  ruta: string;
  titulo: string;
  tipo: string;
  bytes: number;
};

type Escuela = {
  repo: string;
  total: number;
  recursos: Recurso[];
};

type Registro = {
  hub: string;
  generado: string;
  escuelas: Record<string, Escuela>;
};

const NOMBRES: Record<string, string> = {
  'manos-abiertas': 'Manos Abiertas',
  'ux-academy': 'UX Academy',
  linguaforge: 'Linguaforge',
  'lingua-aberta': 'Lingua Aberta',
  'secure-t-university': 'Secure-T University',
};

/** Máximo de resultados por búsqueda: la lista completa no aporta en pantalla. */
const LIMITE = 40;

export function Escuelas() {
  const [registro, setRegistro] = useState<Registro | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [escuela, setEscuela] = useState<string>('todas');

  useEffect(() => {
    let vivo = true;
    fetch('/open-data/unified-campus-registry.json')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Registro>;
      })
      .then((d) => vivo && setRegistro(d))
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, []);

  const slugs = useMemo(
    () => (registro ? Object.keys(registro.escuelas) : []),
    [registro],
  );

  const total = useMemo(
    () =>
      registro
        ? Object.values(registro.escuelas).reduce((n, e) => n + e.total, 0)
        : 0,
    [registro],
  );

  const resultados = useMemo(() => {
    if (!registro) return [] as { slug: string; r: Recurso }[];
    const q = query.trim().toLowerCase();
    const salida: { slug: string; r: Recurso }[] = [];
    for (const slug of slugs) {
      if (escuela !== 'todas' && escuela !== slug) continue;
      for (const r of registro.escuelas[slug].recursos) {
        if (
          !q ||
          r.titulo.toLowerCase().includes(q) ||
          r.ruta.toLowerCase().includes(q)
        ) {
          salida.push({ slug, r });
        }
      }
    }
    return salida;
  }, [registro, slugs, query, escuela]);

  return (
    <div className="bay" style={{ paddingTop: 'clamp(7rem, 16vh, 11rem)' }}>
      <div className="shell stack stack--lg">
        <header className="stack stack--sm">
          <p className="t-label">Escuelas federadas</p>
          <h1 className="t-display" style={{ maxWidth: '15ch' }}>
            {slugs.length} escuelas, {total.toLocaleString('es-ES')} recursos
          </h1>
          <p className="t-lede">
            El inventario real de los repositorios hermanos, unificado en un
            solo registro. Cada escuela conserva su repositorio: aquí se
            cataloga, no se duplica.
          </p>
        </header>

        {/* ───────── Carga / error ───────── */}
        {error && (
          <Glass style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="t-body">
              No se pudo cargar el registro unificado. Revisa
              <code> open-data/unified-campus-registry.json</code>.
            </p>
          </Glass>
        )}
        {!error && !registro && (
          <Glass style={{ padding: '2rem' }}>
            <p className="t-body" aria-live="polite">
              Cargando registro…
            </p>
          </Glass>
        )}

        {registro && (
          <>
            {/* ───────── Controles ───────── */}
            <Glass style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
              <div className="stack">
                <div>
                  <label htmlFor="q-esc" className="sr-only">
                    Buscar recursos por título o ruta
                  </label>
                  <input
                    id="q-esc"
                    type="search"
                    className="field"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar en las 5 escuelas: plantilla, derechos, fonética…"
                  />
                </div>

                <fieldset
                  className="row"
                  style={{ border: 0, padding: 0, margin: 0, gap: '0.35rem', flexWrap: 'wrap' }}
                >
                  <legend className="sr-only">Filtrar por escuela</legend>
                  <button
                    type="button"
                    className="btn btn--glass"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                    aria-pressed={escuela === 'todas'}
                    onClick={() => setEscuela('todas')}
                  >
                    Todas
                  </button>
                  {slugs.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="btn btn--glass"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                      aria-pressed={escuela === s}
                      onClick={() => setEscuela(s)}
                    >
                      {NOMBRES[s] ?? s} · {registro.escuelas[s].total}
                    </button>
                  ))}
                </fieldset>
              </div>
            </Glass>

            <p className="t-label" aria-live="polite">
              {resultados.length.toLocaleString('es-ES')} de{' '}
              {total.toLocaleString('es-ES')} recursos
              {resultados.length > LIMITE && ` — mostrando ${LIMITE}`}
            </p>

            {/* ───────── Resultados ───────── */}
            {resultados.length > 0 ? (
              <div className="stack">
                {resultados.slice(0, LIMITE).map(({ slug, r }) => (
                  <Glass
                    key={`${slug}/${r.ruta}`}
                    style={{ padding: '0.9rem 1.2rem' }}
                  >
                    <div className="row" style={{ justifyContent: 'space-between', gap: '1rem' }}>
                      <div className="stack" style={{ gap: '0.15rem' }}>
                        <p className="t-label" style={{ margin: 0 }}>
                          {NOMBRES[slug] ?? slug}
                        </p>
                        <p className="t-body" style={{ margin: 0, fontWeight: 600 }}>
                          {r.titulo || r.ruta}
                        </p>
                      </div>
                      <code
                        className="t-label"
                        style={{ opacity: 0.7, wordBreak: 'break-all' }}
                      >
                        {r.ruta}
                      </code>
                    </div>
                  </Glass>
                ))}
              </div>
            ) : (
              <Glass style={{ padding: 'clamp(2rem, 6vw, 3.5rem)', textAlign: 'center' }}>
                <p className="t-body">
                  Ningún recurso coincide. Prueba un término más general.
                </p>
              </Glass>
            )}

            <p className="t-label">
              Registro generado el {registro.generado} · hub:{' '}
              {registro.hub}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

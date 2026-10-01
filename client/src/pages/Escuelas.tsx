/* ===================================================================
   ESCUELAS — la biblioteca abierta real, servida desde open-data.

   Antes esta pagina federaba un inventario de repositorios hermanos
   que vivian en open-data/unified-campus-registry.json. Ese fichero no
   existe: generarlo habia supuesto volcar el arbol de ficheros de
   repos personales a un repositorio publico, asi que en su lugar esta
   pagina pinta lo que si esta publicado y verificado — los datos
   abiertos de open-data/, con su fuente y su licencia a la vista.

   La forma de cada fuente la resuelve `lib/openData.ts`; aqui solo se
   pinta. Mismo criterio de accesibilidad que el resto del sitio:
   recuento en live region, filtros como botones aria-pressed y
   busqueda con label accesible.
   =================================================================== */

import { useEffect, useMemo, useState } from 'react';
import { Glass } from '../components/Glass';
import { normalizar } from '../lib/biblia';
import { aplanar, etiquetaTema, fallos, type Manifiesto, type TemaCrudo } from '../lib/openData';

const BASE = '/open-data';

/** Maximo de resultados por busqueda: la lista completa no aporta en pantalla. */
const LIMITE = 40;

type Fila = { tema: string; titulo: string; fuente: string; detalle: string; meta: string; href: string | null; fragmento: string; id: string };

function cargar<T>(ruta: string): Promise<T> {
  return fetch(ruta).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<T>;
  });
}

export function Escuelas() {
  const [manifiesto, setManifiesto] = useState<Manifiesto | null>(null);
  const [temas, setTemas] = useState<TemaCrudo[]>([]);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [tema, setTema] = useState<string>('todas');

  useEffect(() => {
    let vivo = true;
    cargar<Manifiesto>(`${BASE}/topics.json`)
      .then((m) => {
        if (!vivo) return;
        setManifiesto(m);
        return Promise.all(m.temas.map(({ tema: t }) => cargar<TemaCrudo>(`${BASE}/data/${t}.json`)));
      })
      .then((cargados) => {
        if (vivo && cargados) setTemas(cargados);
      })
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, []);

  const filas = useMemo<Fila[]>(
    () =>
      temas.flatMap((t) =>
        aplanar(t).map((i) => ({ ...i, tema: t.tema })),
      ),
    [temas],
  );

  const rotos = useMemo(
    () => temas.flatMap((t) => fallos(t).map((f) => ({ ...f, tema: t.tema }))),
    [temas],
  );

  const resultados = useMemo(() => {
    const q = normalizar(query.trim());
    return filas.filter(({ tema: t, titulo, fuente, detalle, meta }) => {
      if (tema !== 'todas' && tema !== t) return false;
      if (!q) return true;
      return normalizar(`${titulo} ${fuente} ${detalle} ${meta}`).includes(q);
    });
  }, [filas, query, tema]);

  const cargando = !error && !manifiesto;

  return (
    <div className="bay" style={{ paddingTop: 'clamp(7rem, 16vh, 11rem)' }}>
      <div className="shell stack stack--lg">
        <header className="stack stack--sm">
          <p className="t-label">Contenido abierto</p>
          <h1 className="t-display" style={{ maxWidth: '18ch' }}>
            {filas.length.toLocaleString('es-ES')} recursos abiertos
          </h1>
          <p className="t-lede">
            Textos, artículos, lecturas y series estadísticas recogidos de
            APIs abiertas verificadas. Cada recurso conserva su fuente y su
            licencia; revisa la licencia concreta antes de uso comercial.
          </p>
        </header>

        {/* ───────── Carga / error ───────── */}
        {error && (
          <Glass style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="t-body">
              No se pudo cargar <code>open-data/topics.json</code>. El manifiesto
              es la raíz de esta página: sin él no hay nada que listar.
            </p>
          </Glass>
        )}
        {cargando && (
          <Glass style={{ padding: '2rem' }}>
            <p className="t-body" aria-live="polite">
              Cargando contenido abierto…
            </p>
          </Glass>
        )}

        {manifiesto && (
          <>
            {/* ───────── Controles ───────── */}
            <Glass style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
              <div className="stack">
                <div>
                  <label htmlFor="q-esc" className="sr-only">
                    Buscar recursos por título, autor o fuente
                  </label>
                  <input
                    id="q-esc"
                    type="search"
                    className="field"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar: matemáticas, Kafka, Crossref, gasto público…"
                  />
                </div>

                <fieldset
                  className="row"
                  style={{ border: 0, padding: 0, margin: 0, gap: '0.35rem', flexWrap: 'wrap' }}
                >
                  <legend className="sr-only">Filtrar por tema</legend>
                  <button
                    type="button"
                    className="btn btn--glass"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                    aria-pressed={tema === 'todas'}
                    onClick={() => setTema('todas')}
                  >
                    Todos
                  </button>
                  {manifiesto.temas.map((t) => (
                    <button
                      key={t.tema}
                      type="button"
                      className="btn btn--glass"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                      aria-pressed={tema === t.tema}
                      onClick={() => setTema(t.tema)}
                    >
                      {etiquetaTema(t.tema)} · {t.fuentes_ok}/{t.fuentes_total}
                    </button>
                  ))}
                </fieldset>
              </div>
            </Glass>

            <p className="t-label" aria-live="polite">
              {resultados.length.toLocaleString('es-ES')} de{' '}
              {filas.length.toLocaleString('es-ES')} recursos
              {resultados.length > LIMITE && ` — mostrando ${LIMITE}`}
            </p>

            {/* ───────── Fuentes que fallaron ───────── */}
            {rotos.length > 0 && (
              <Glass style={{ padding: '1rem 1.2rem' }}>
                <p className="t-body" style={{ margin: 0, fontSize: '0.86rem' }}>
                  {rotos.length}{' '}
                  {rotos.length === 1
                    ? 'fuente falló y no aporta datos'
                    : 'fuentes fallaron y no aportan datos'}
                  : {rotos.map((f) => `${f.fuente} (${etiquetaTema(f.tema)})`).join(', ')}
                </p>
              </Glass>
            )}

            {/* ───────── Resultados ───────── */}
            {resultados.length > 0 ? (
              <div className="stack">
                {resultados.slice(0, LIMITE).map((r) => (
                  <Glass key={r.id} style={{ padding: '0.9rem 1.2rem' }}>
                    <div className="stack" style={{ gap: '0.2rem' }}>
                      <div
                        className="row"
                        style={{ justifyContent: 'space-between', gap: '1rem' }}
                      >
                        <p className="t-label" style={{ margin: 0 }}>
                          {etiquetaTema(r.tema)} · {r.fuente}
                        </p>
                        {r.meta && (
                          <code className="t-label" style={{ opacity: 0.7 }}>
                            {r.meta}
                          </code>
                        )}
                      </div>

                      <p className="t-body" style={{ margin: 0, fontWeight: 600 }}>
                        {r.href ? (
                          <a
                            href={r.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit' }}
                          >
                            {r.titulo}
                          </a>
                        ) : (
                          r.titulo
                        )}
                      </p>

                      {r.detalle && (
                        <p className="t-label" style={{ margin: 0 }}>
                          {r.detalle}
                        </p>
                      )}

                      {r.fragmento && (
                        <p
                          className="t-label"
                          style={{
                            margin: 0,
                            opacity: 0.75,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {r.fragmento}
                        </p>
                      )}
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
              Generado el {manifiesto.generado_utc.slice(0, 10)} · manifiesto en{' '}
              <code>open-data/topics.json</code>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

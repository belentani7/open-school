/* ===================================================================
   BIBLIA — glosario navegable de los 219 términos.

   Página de referencia, no contenido de curso: aquí se entra a buscar
   una sigla concreta y se sale en treinta segundos. Por eso el buscador
   va arriba del todo y el foco entra en él solo.

   Lo que la hace útil y no un `<details>` por término:
     · el buscador ignora acentos, así que "contenedor" encuentra
       "contenedores" y "latino" encuentra "latina"
     · las siglas pesan más que el cuerpo: "api" saca API arriba
     · cada término enlaza con el curso donde se usa de verdad, para
       que el glosario sea una puerta y no una lista de palabras
     · el enlace es por teclado y funciona con prefers-reduced-motion
   =================================================================== */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';

import { Glass } from '../components/Glass';
import { PlasmaField } from '../components/PlasmaField';
import {
  BIBLIA_TOTAL,
  CATEGORIAS,
  CATEGORIA_TOTAL,
  RECUENTO,
  TODOS,
  buscar,
  getTermino,
  type TerminoIndexado,
} from '../lib/biblia';
import { getRoute } from '../lib/catalog';
import { tramos } from '../lib/highlight';

/** Cuántos resultados se pintan a la vez. 219 filas de golpe no aportan. */
const LIMITE = 60;

export function Biblia() {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState<string>('todas');
  const entrada = useRef<HTMLInputElement>(null);

  // El comentario de arriba prometía que el foco entra solo en el
  // buscador. Era mentira: el ref existía y no se usaba para nada.
  useEffect(() => {
    entrada.current?.focus();
  }, []);

  // La búsqueda corre sobre 219 filas, pero con `useDeferredValue` el
  // tecleo nunca se congela aunque se añada el doble de contenido.
  const consulta = useDeferredValue(texto);

  const resultados = useMemo(
    () => buscar(consulta, categoria === 'todas' ? undefined : categoria),
    [consulta, categoria],
  );

  const visibles = resultados.slice(0, LIMITE);

  return (
    <>
      <section
        className="bay"
        style={{ position: 'relative', paddingTop: 'clamp(8rem, 18vh, 12rem)', overflow: 'hidden' }}
      >
        <PlasmaField intensity={0.5} />

        <div className="shell stack stack--lg" style={{ position: 'relative', zIndex: 2 }}>
          <header className="stack stack--sm">
            <p className="case__word">GLOSARIO</p>
            <h1 className="t-display" style={{ maxWidth: '18ch' }}>
              Biblia del desarrollo
            </h1>
            <p className="t-lede">
              {BIBLIA_TOTAL} términos en {CATEGORIA_TOTAL} categorías. El
              vocabulario que hace falta para no estar perdido en una
              conversación sobre software — y para entender por qué alguien
              insiste en hablar de siglas en vez de cosas.
            </p>
            <p className="t-label" style={{ color: 'var(--color-ink-3)' }}>
              Fuente única: BIBLIA_TERMINOS_DESARROLLO.md
            </p>
          </header>

          {/* ── Buscador: el foco entra aquí solo ── */}
          <Glass style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
            <div className="stack">
              <div>
                <label htmlFor="q-biblia" className="sr-only">
                  Buscar un término por sigla, nombre o definición
                </label>
                <input
                  id="q-biblia"
                  ref={entrada}
                  type="search"
                  className="field"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Busca una sigla o una palabra: API, TDD, inmutabilidad…"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <fieldset
                className="row"
                style={{ border: 0, padding: 0, margin: 0, gap: '0.35rem' }}
              >
                <legend className="sr-only">Filtrar por categoría</legend>
                <button
                  type="button"
                  className="btn btn--glass"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                  aria-pressed={categoria === 'todas'}
                  onClick={() => setCategoria('todas')}
                >
                  Todas · {BIBLIA_TOTAL}
                </button>
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="btn btn--glass"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.76rem' }}
                    aria-pressed={categoria === c.id}
                    onClick={() => setCategoria(c.id)}
                  >
                    <span aria-hidden="true">{c.glifo} </span>
                    {c.id} · {RECUENTO.get(c.id)}
                  </button>
                ))}
              </fieldset>
            </div>
          </Glass>

          {/* El recuento va en live region: el lector de pantalla oye
              cuántos resultados hay sin que la vista cambie de foco. */}
          <p className="t-label" aria-live="polite" aria-atomic="true">
            {resultados.length.toLocaleString('es-ES')} de{' '}
            {BIBLIA_TOTAL.toLocaleString('es-ES')} términos
            {resultados.length > LIMITE && ` — mostrando ${LIMITE}`}
          </p>

          {resultados.length === 0 ? (
            <Glass style={{ padding: 'clamp(2rem, 6vw, 3.5rem)', textAlign: 'center' }}>
              <div className="stack" style={{ justifyItems: 'center' }}>
                <p className="t-title">Ningún término coincide</p>
                <p className="t-body">
                  La búsqueda ignora mayúsculas y acentos. Prueba con una
                  parte más corta: <code>cont</code> en lugar de
                  &nbsp;«contenedores».
                </p>
              </div>
            </Glass>
          ) : (
            <>
              <ul
                className="stack"
                style={{ listStyle: 'none', margin: 0, padding: 0 }}
              >
                {visibles.map((t) => (
                  <li key={`${t.categoria}/${t.abrev}`}>
                    <TerminoFila termino={t} busqueda={consulta} />
                  </li>
                ))}
              </ul>

              {resultados.length > LIMITE && (
                <Glass style={{ padding: '1.2rem', textAlign: 'center' }}>
                  <p className="t-body">
                    Hay {resultados.length - LIMITE} más. Afina la búsqueda
                    para verlos: los que más se parecen a lo que escribes van
                    primero, así que con añadir una letra suele bastar.
                  </p>
                </Glass>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/** Una fila del glosario. */
function TerminoFila({ termino, busqueda }: { termino: TerminoIndexado; busqueda: string }) {
  const { abrev, nombre, significado, curso } = termino;
  const ruta = curso ? getRoute(curso) : undefined;

  return (
    <Glass lift style={{ padding: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
      <div className="stack stack--sm">
        <div className="row" style={{ gap: '0.7rem', alignItems: 'baseline' }}>
          {/* Sigla en el mono del sistema, con la luz de la marca:
              legible de un vistazo sin competir con la definición.
              `ZeroText` es un h1 monumental del hero — aquí, repetido
              sesenta veces, sería justo lo contrario de legible. */}
          <span
            className="t-helio"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {abrev}
          </span>
          <span className="t-label" style={{ letterSpacing: '0.14em' }}>
            {termino.categoria}
          </span>
        </div>

        <p
          className="t-body"
          style={{ margin: 0, color: 'var(--color-ink)', fontWeight: 600, maxWidth: 'none' }}
        >
          {nombre}
        </p>

        <p className="t-body" style={{ margin: 0 }}>
          <Marcar texto={significado} consulta={busqueda} />
        </p>

        {ruta && (
          <p className="t-label" style={{ margin: 0 }}>
            <Link href={`/courses/${ruta.id}`} className="t-dim">
              Se usa en {ruta.title} →
            </Link>
          </p>
        )}
      </div>
    </Glass>
  );
}

/**
 * Resalta lo que coincide con la búsqueda. Si no hay búsqueda, devuelve
 * el texto tal cual: un `mark` sin motivo confunde más de lo que ayuda.
 *
 * La lógica de qué tramos se marcan está en `lib/highlight.ts`, donde se
 * prueba sin montar React. Aquí solo se pinta.
 */
function Marcar({ texto, consulta }: { texto: string; consulta: string }) {
  const partes = tramos(texto, consulta);

  if (partes.length === 1 && !partes[0].on) return <>{texto}</>;

  return (
    <>
      {partes.map((p, i) =>
        p.on ? (
          <mark key={i} style={{ background: 'rgba(158,134,255,0.3)', color: 'inherit' }}>
            {p.txt}
          </mark>
        ) : (
          <span key={i}>{p.txt}</span>
        ),
      )}
    </>
  );
}

/** Reexportado para los tests: el total declarado tiene que ser real. */
export const TOTAL_DECLARADO = TODOS.length;
export const getTerminoParaTest = getTermino;

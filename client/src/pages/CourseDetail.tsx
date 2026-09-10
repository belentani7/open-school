/* ===================================================================
   COURSE DETAIL — la ficha de una ruta.
   =================================================================== */

import { Link, useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { Glass } from '../components/Glass';
import { PlasmaField } from '../components/PlasmaField';
import { getRoute, STATUS_LABEL } from '../lib/catalog';
import { readProgress, setProgress } from '../lib/progress';

export function CourseDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const route = getRoute(id);
  const [done, setDone] = useState(0);

  useEffect(() => {
    setDone(readProgress()[id] ?? 0);
  }, [id]);

  if (!route) {
    return (
      <div className="bay shell" style={{ paddingTop: 'clamp(8rem, 18vh, 12rem)' }}>
        <Glass style={{ padding: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center' }}>
          <div className="stack" style={{ justifyItems: 'center' }}>
            <p className="t-label">404</p>
            <h1 className="t-display">Esa ruta no existe</h1>
            <Link href="/catalog" className="btn btn--light">Ver el catálogo</Link>
          </div>
        </Glass>
      </div>
    );
  }

  const start = () => {
    // Sin backend todavia: se marca el primer modulo para que la promesa
    // de "tu progreso se guarda en tu dispositivo" sea cierta desde ya.
    const next = Math.min(1, (done || 0) + 1 / route.modules);
    setProgress(route.id, next);
    setDone(next);
  };

  const pct = Math.round(done * 100);

  return (
    <>
      <section
        className="bay"
        style={{ position: 'relative', paddingTop: 'clamp(8rem, 18vh, 12rem)', overflow: 'hidden' }}
      >
        <PlasmaField intensity={0.6} />

        <div className="shell stack stack--lg" style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/catalog" className="btn btn--quiet" style={{ justifySelf: 'start' }}>
            ← Catálogo
          </Link>

          <header className="stack">
            <p className="case__word">{route.word}</p>
            <h1 className="t-display" style={{ maxWidth: '16ch' }}>{route.title}</h1>
            <p className="t-lede">{route.claim}</p>

            <div className="row" style={{ gap: '0.45rem', marginTop: '0.6rem' }}>
              <span className="chip chip--edge">Nivel {route.level}</span>
              {route.offline && <span className="chip">Sin conexión</span>}
              {route.certified && <span className="chip">Certificado verificable</span>}
              <span className="chip">
                <i className={`dot dot--${route.status}`} aria-hidden="true" style={{ marginRight: 6 }} />
                {STATUS_LABEL[route.status]}
              </span>
            </div>
          </header>
        </div>
      </section>

      <section className="shell stack stack--lg" style={{ paddingBottom: 'var(--bay)' }}>
        <div className="detail__grid">
          {/* ── Cuerpo ── */}
          <div className="stack stack--lg">
            <Glass refract style={{ padding: 'clamp(1.5rem, 3.5vw, 2.6rem)' }}>
              <div className="stack">
                <h2 className="t-title">De qué va</h2>
                <p className="t-body" style={{ maxWidth: '62ch' }}>{route.desc}</p>
              </div>
            </Glass>

            <Glass style={{ padding: 'clamp(1.5rem, 3.5vw, 2.6rem)' }}>
              <div className="stack">
                <h2 className="t-title">Con qué se trabaja</h2>
                <ul className="stack stack--sm" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {route.stack.map((s) => (
                    <li key={s} className="row" style={{ gap: '0.7rem' }}>
                      <i className="dot dot--produccion" aria-hidden="true" />
                      <span className="t-body" style={{ maxWidth: 'none' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Glass>
          </div>

          {/* ── Panel lateral, pegajoso en desktop ── */}
          <aside className="detail__aside">
            <Glass refract style={{ padding: 'clamp(1.4rem, 3vw, 2rem)' }}>
              <div className="stack">
                <div className="stack stack--sm">
                  <p className="t-label">Tu progreso</p>
                  <p className="t-num">{pct}%</p>
                  <div
                    className="meter"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progreso en ${route.title}`}
                  >
                    <span className="meter__fill" style={{ transform: `scaleX(${done})` }} />
                  </div>
                  <p className="t-label" style={{ color: 'var(--color-ink-3)' }}>
                    Guardado en este dispositivo
                  </p>
                </div>

                <hr className="horizon" />

                <dl className="stack stack--sm" style={{ margin: 0 }}>
                  {[
                    ['Módulos', String(route.modules)],
                    ['Duración', `${route.hours} h`],
                    ['Idiomas', route.langs.join(' · ')],
                    ['Precio', 'Gratuito'],
                  ].map(([k, v]) => (
                    <div key={k} className="row" style={{ justifyContent: 'space-between' }}>
                      <dt className="t-label">{k}</dt>
                      <dd className="t-body" style={{ margin: 0, color: 'var(--color-ink)', fontSize: '0.9rem' }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <button type="button" className="btn btn--light" onClick={start}>
                  {done > 0 ? 'Continuar' : 'Empezar ahora'}
                </button>

                <p className="t-label" style={{ textAlign: 'center', color: 'var(--color-ink-3)' }}>
                  Sin registro
                </p>
              </div>
            </Glass>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ===================================================================
   COURSE DETAIL — la ficha de una ruta.
   =================================================================== */

import { Link, useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { Glass } from '../components/Glass';
import { PlasmaField } from '../components/PlasmaField';
import { getRoute, STATUS_LABEL } from '../lib/catalog';
import { anonId, completeUnit, readCompletedUnits, setProgress } from '../lib/progress';
import { getRouteUnits } from '../lib/courseUnits';
import { publishedProgress } from '../lib/courseProgress';

export function CourseDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const route = getRoute(id);
  const units = getRouteUnits(id);
  const [unitIndex, setUnitIndex] = useState(0);
  const lesson = units[unitIndex];
  const [completedUnits, setCompletedUnits] = useState<number[]>([]);
  const [done, setDone] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    anonId(); // Establish retention identity before any progress writes.
    const saved = readCompletedUnits(id);
    setCompletedUnits(saved);
    setDone(publishedProgress(saved, units.length));
    setUnitIndex(0);
    setSelected(null);
    setFeedback('');
  }, [id, units.length]);

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

  const evaluate = () => {
    if (!lesson || selected === null) return;
    if (selected !== lesson.quiz.correctIndex) {
      setFeedback('Todavía no. Revisa la lección y prueba otra respuesta.');
      return;
    }
    // Solo se acredita una unidad después de contestar bien su evaluación.
    const recorded = completeUnit(route.id, unitIndex);
    const next = publishedProgress(recorded, units.length);
    setCompletedUnits(recorded);
    setProgress(route.id, next);
    setDone(next);
    setFeedback('¡Correcto! Has completado esta unidad. El avance se ha guardado en este dispositivo.');
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
              {route.certified && <span className="chip">Certificación indicada en catálogo; no emitida aquí</span>}
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

            {lesson ? (
              <Glass style={{ padding: 'clamp(1.5rem, 3.5vw, 2.6rem)' }}>
                <article id="leccion" className="stack stack--lg" aria-labelledby="lesson-title">
                  <div className="stack stack--sm">
                    <p className="t-label">Unidad {unitIndex + 1} de {units.length} publicadas · {lesson.estimatedMinutes} min</p>
                    <h2 id="lesson-title" className="t-title">{lesson.title}</h2>
                    <p className="t-body">{lesson.objective}</p>
                    <p className="t-label">{units.length} de {route.modules} módulos previstos disponibles aquí. El resto sigue en desarrollo.</p>
                    <nav className="row" aria-label="Elegir unidad para estudiar" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
                      {units.map((unit, index) => (
                        <button
                          key={unit.title}
                          type="button"
                          className={`btn ${index === unitIndex ? 'btn--light' : 'btn--quiet'}`}
                          aria-pressed={index === unitIndex}
                          onClick={() => { setUnitIndex(index); setSelected(null); setFeedback(''); }}
                          title={unit.title}
                        >
                          {completedUnits.includes(index) ? '✓ ' : ''}Unidad {index + 1}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {lesson.steps.map((step) => (
                    <section key={step.title} className="stack stack--sm">
                      <h3 className="t-subtitle">{step.title}</h3>
                      <p className="t-body">{step.explanation}</p>
                      <p className="t-body"><strong>Practica:</strong> {step.practice}</p>
                    </section>
                  ))}

                  <form className="stack stack--sm" onSubmit={(event) => { event.preventDefault(); evaluate(); }}>
                    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend className="t-title" style={{ marginBottom: '1rem' }}>Comprueba lo aprendido</legend>
                      <p className="t-body" style={{ marginBottom: '0.75rem' }}>{lesson.quiz.question}</p>
                      <div className="stack stack--sm">
                        {lesson.quiz.choices.map((choice, index) => (
                          <label key={choice} className="row" style={{ gap: '0.7rem', alignItems: 'start', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`answer-${route.id}`}
                              checked={selected === index}
                              onChange={() => { setSelected(index); setFeedback(''); }}
                              style={{ marginTop: '0.4rem' }}
                            />
                            <span className="t-body">{choice}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <button type="submit" className="btn btn--light" disabled={selected === null}>
                      Comprobar respuesta
                    </button>
                    <p role="status" aria-live="polite" className="t-body">{feedback}</p>
                    {feedback.startsWith('¡Correcto!') && <p className="t-body">{lesson.quiz.explanation}</p>}
                  </form>
                </article>
              </Glass>
            ) : (
              <Glass style={{ padding: 'clamp(1.5rem, 3.5vw, 2.6rem)' }}>
                <div className="stack stack--sm">
                  <h2 className="t-title">Contenido en preparación</h2>
                  <p className="t-body">
                    Esta ficha describe una ruta prevista. Aquí todavía no hay lecciones evaluables:
                    no simularemos su progreso ni emitiremos certificados.
                  </p>
                </div>
              </Glass>
            )}
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
                    aria-label={`Progreso de unidades publicadas en ${route.title}`}
                  >
                    <span className="meter__fill" style={{ transform: `scaleX(${done})` }} />
                  </div>
                  <p className="t-label" style={{ color: 'var(--color-ink-3)' }}>
                    Progreso de las unidades publicadas, guardado en este dispositivo
                  </p>
                </div>

                <hr className="horizon" />

                <dl className="stack stack--sm" style={{ margin: 0 }}>
                  {[
                    ['Unidades disponibles', `${units.length} de ${route.modules} previstas`],
                    ['Duración prevista', `${route.hours} h`],
                    ['Idiomas previstos', route.langs.join(' · ')],
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

                {lesson ? (
                  <a className="btn btn--light" href="#leccion">
                    {done > 0 ? 'Repasar unidades publicadas' : 'Estudiar unidades publicadas'}
                  </a>
                ) : (
                  <p className="t-label">No hay unidades que completar todavía.</p>
                )}

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

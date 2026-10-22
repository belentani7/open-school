import { useState } from 'react';
import { Link } from 'wouter';
import { Glass } from '../components/Glass';
import { findTrack, PLAZA_NEEDS, PLAZA_TRACKS, recommendTrack } from '../lib/plazaContent';
import { completePlazaLesson, readPlazaCompleted } from '../lib/plazaProgress';

/**
 * Plaza Educativa: 20 unidades redactadas, ejercicios, evaluación y progreso.
 * Orientación por reglas; no se presenta como diagnóstico clínico ni IA generativa.
 */
export function Plaza() {
  const [trackId, setTrackId] = useState(PLAZA_TRACKS[0].id);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [needId, setNeedId] = useState<string>(PLAZA_NEEDS[0].id);
  const [completed, setCompleted] = useState<string[]>(readPlazaCompleted);

  const track = findTrack(trackId) ?? PLAZA_TRACKS[0];
  const lesson = track.lessons[lessonIndex] ?? track.lessons[0];
  const key = `${track.id}/${lesson.id}`;
  const doneCount = track.lessons.filter((unit) => completed.includes(`${track.id}/${unit.id}`)).length;
  const pct = Math.round((100 * doneCount) / track.lessons.length);
  const recommended = recommendTrack(needId);

  function selectTrack(id: string) {
    if (!findTrack(id)) return;
    setTrackId(id);
    setLessonIndex(0);
    setChoice(null);
    setFeedback('');
  }

  function selectLesson(index: number) {
    if (index < 0 || index >= track.lessons.length) return;
    setLessonIndex(index);
    setChoice(null);
    setFeedback('');
  }

  function evaluate() {
    if (choice === null) return;
    if (choice !== lesson.quiz.correctIndex) {
      setFeedback('Aún no. Revisa el ejemplo, lee la explicación y vuelve a intentarlo.');
      return;
    }
    const next = [...new Set([...completed, key])];
    completePlazaLesson(key);
    setCompleted(next);
    setFeedback('Respuesta correcta. Unidad completada en este dispositivo.');
  }

  return (
    <>
      <section className="bay" style={{ paddingTop: 'clamp(8rem, 18vh, 12rem)' }}>
        <div className="shell stack stack--lg">
          <p className="case__word">OPEN SCHOOL / PLAZA</p>
          <h1 className="t-display" style={{ maxWidth: '15ch' }}>Tu plaza de aprendizaje</h1>
          <p className="t-lede" style={{ maxWidth: '65ch' }}>
            Cinco itinerarios con veinte unidades reales. Teoría clara, caso práctico,
            actividad y comprobación por unidad. Gratis, sin registro y sin publicidad.
          </p>
          <div className="row" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
            <span className="chip chip--edge">5 itinerarios</span>
            <span className="chip">20 unidades evaluables</span>
            <span className="chip">Progreso local</span>
            <span className="chip">Sin certificados simulados</span>
          </div>
        </div>
      </section>

      <section className="shell stack stack--lg" style={{ paddingBottom: 'var(--bay)' }}>
        <Glass refract style={{ padding: 'clamp(1.4rem, 3.5vw, 2.6rem)' }}>
          <div className="stack stack--sm">
            <p className="t-label">ORIENTACIÓN PEDAGÓGICA · DOCTOR DE APRENDIZAJE</p>
            <h2 className="t-title">¿Qué necesitas aprender ahora?</h2>
            <p className="t-body">
              Este orientador selecciona contenidos mediante reglas transparentes; no analiza
              datos personales ni es una IA clínica. No diagnostica enfermedades o dificultades
              de aprendizaje. Puedes cambiar de itinerario en cualquier momento.
            </p>
            <label htmlFor="plaza-need" className="t-label">Elige tu objetivo</label>
            <select
              id="plaza-need"
              className="field"
              value={needId}
              onChange={(event) => setNeedId(event.target.value)}
              style={{ maxWidth: '38rem', minHeight: '44px' }}
            >
              {PLAZA_NEEDS.map((need) => (
                <option key={need.id} value={need.id}>{need.label}</option>
              ))}
            </select>
            <div className="row" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className="btn btn--light" onClick={() => { if (recommended) selectTrack(recommended.id); }}>
                Empezar itinerario recomendado
              </button>
              <span className="t-body" aria-live="polite">
                Recomendación: <strong>{recommended?.name ?? 'Sin coincidencia'}</strong>
              </span>
            </div>
            <p className="t-body">
              ¿Quieres hacer preguntas al tutor? <Link href="/chat">Abrir tutor educativo</Link>.
              Su modo local funciona sin enviar tus mensajes a un modelo; cualquier modelo
              externo requiere activación explícita desde esa pantalla.
            </p>
          </div>
        </Glass>

        <div className="stack">
          <h2 className="t-title">Explorar itinerarios</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(16rem, 100%), 1fr))', gap: '1rem' }}>
            {PLAZA_TRACKS.map((item) => {
              const isActive = item.id === track.id;
              return (
                <Glass key={item.id} style={{ padding: '1.35rem' }}>
                  <div className="stack stack--sm">
                    <span className="case__word">{item.tag} · {item.level}</span>
                    <h3 className="t-subtitle">{item.name}</h3>
                    <p className="t-body">{item.description}</p>
                    <span className="t-label">{item.lessons.length} unidades · {item.minutes} min orientativos</span>
                    <button
                      type="button"
                      className={isActive ? 'btn btn--light' : 'btn btn--glass'}
                      onClick={() => selectTrack(item.id)}
                      aria-pressed={isActive}
                      aria-label={`Estudiar ${item.name}`}
                    >
                      {isActive ? 'Estudiando' : 'Elegir itinerario'}
                    </button>
                  </div>
                </Glass>
              );
            })}
          </div>
        </div>

        <Glass refract style={{ padding: 'clamp(1.4rem, 3.5vw, 2.8rem)' }}>
          <div className="stack stack--lg">
            <header className="stack stack--sm">
              <p className="case__word">{track.tag} / {track.level}</p>
              <h2 className="t-title">{track.name}</h2>
              <p className="t-body">{track.description}</p>
              <p className="t-body"><strong>Meta observable:</strong> {track.outcome}</p>
              <div
                className="meter"
                role="progressbar"
                aria-label={`Unidades completadas en ${track.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <span className="meter__fill" style={{ transform: `scaleX(${pct / 100})` }} />
              </div>
              <p className="t-label">{doneCount} de {track.lessons.length} unidades completadas en este dispositivo</p>
            </header>

            <nav className="row" aria-label="Unidades del itinerario" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
              {track.lessons.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === lessonIndex ? 'btn btn--light' : 'btn btn--glass'}
                  aria-pressed={index === lessonIndex}
                  onClick={() => selectLesson(index)}
                >
                  {completed.includes(`${track.id}/${item.id}`) ? '✓ ' : ''}Unidad {index + 1}
                </button>
              ))}
            </nav>

            <article className="stack stack--lg" aria-labelledby="plaza-lesson-title">
              <div className="stack stack--sm">
                <p className="t-label">UNIDAD {lessonIndex + 1} DE {track.lessons.length}</p>
                <h3 id="plaza-lesson-title" className="t-title">{lesson.title}</h3>
                <p className="t-body"><strong>Al terminar sabrás:</strong> {lesson.objective}</p>
              </div>
              <section className="stack stack--sm">
                <h4 className="t-subtitle">Comprende</h4><p className="t-body">{lesson.concept}</p>
              </section>
              <section className="stack stack--sm">
                <h4 className="t-subtitle">Caso realista, sin datos reales</h4><p className="t-body">{lesson.example}</p>
              </section>
              <section className="stack stack--sm">
                <h4 className="t-subtitle">Practica</h4><p className="t-body">{lesson.practice}</p>
              </section>
              <form
                className="stack stack--sm"
                onSubmit={(event) => { event.preventDefault(); evaluate(); }}
              >
                <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend className="t-subtitle" style={{ marginBottom: '0.6rem' }}>Comprueba lo aprendido</legend>
                  <p className="t-body" style={{ marginBottom: '1rem' }}>{lesson.quiz.question}</p>
                  <div className="stack stack--sm">
                    {lesson.quiz.choices.map((option, index) => (
                      <label key={option} className="row" style={{ cursor: 'pointer', alignItems: 'start', gap: '0.7rem' }}>
                        <input
                          type="radio"
                          name="plaza-answer"
                          checked={choice === index}
                          onChange={() => { setChoice(index); setFeedback(''); }}
                          style={{ marginTop: '0.35rem' }}
                        />
                        <span className="t-body">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="row" style={{ flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn--light" disabled={choice === null}>Comprobar</button>
                  {lessonIndex < track.lessons.length - 1 && (
                    <button className="btn btn--quiet" type="button" onClick={() => selectLesson(lessonIndex + 1)}>
                      Siguiente unidad →
                    </button>
                  )}
                </div>
                <p role="status" aria-live="polite" className="t-body">{feedback}</p>
                {(feedback.startsWith('Respuesta correcta') || completed.includes(key)) && (
                  <p className="t-body"><strong>Por qué:</strong> {lesson.quiz.explanation}</p>
                )}
              </form>
            </article>

            <Glass style={{ padding: 'clamp(1rem, 2vw, 1.6rem)' }}>
              <div className="stack stack--sm">
                <p className="case__word">PROYECTO FINAL</p>
                <h3 className="t-subtitle">Entrega aplicable</h3>
                <p className="t-body">{track.capstone}</p>
                <p className="t-label">Criterios de revisión</p>
                <ul className="stack stack--sm">
                  {track.rubric.map((criterion) => <li key={criterion} className="t-body">{criterion}</li>)}
                </ul>
                <p className="t-label">
                  {doneCount === track.lessons.length
                    ? 'Todas las unidades evaluadas. El proyecto final es autoevaluado: esta plataforma no emite títulos.'
                    : 'Completa las cuatro unidades antes de autoevaluar el proyecto final. No se emiten certificados.'}
                </p>
              </div>
            </Glass>
          </div>
        </Glass>
        <p className="t-body" style={{ maxWidth: '70ch' }}>
          Este material es educativo y no sustituye asesoramiento jurídico, médico ni
          profesional. No se solicitan identificadores, documentos ni datos clínicos.
          El progreso se conserva solo en este navegador y puede borrarse junto con
          los datos del sitio.
        </p>
      </section>
    </>
  );
}

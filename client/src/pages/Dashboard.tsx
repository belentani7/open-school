/* ===================================================================
   DASHBOARD — el panel de la persona, sin persona identificada.

   Muestra exactamente lo que la plataforma sabe: un UUID local, su
   caducidad y el progreso guardado en el dispositivo. Nada mas, porque
   no hay nada mas. El boton "Borrar todo" cumple lo que dice.
   =================================================================== */

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'wouter';
import { Glass } from '../components/Glass';
import { ROUTES, TOTALS } from '../lib/catalog';
import { getRouteUnits } from '../lib/courseUnits';
import { countCompletedPublishedUnits, publishedProgress } from '../lib/courseProgress';
import { anonId, completeUnit, daysLeft, forgetMe, readCompletedUnits, setProgress } from '../lib/progress';
import { getPlazaProgress, readPlazaCompleted } from '../lib/plazaProgress';
import { exportProgressBackup, importProgressBackup } from '../lib/progressTransfer';

export function Dashboard() {
  const [id, setId] = useState('');
  const [days, setDays] = useState(0);
  const [completedByRoute, setCompletedByRoute] = useState<Record<string, number[]>>({});
  const [plazaCompleted, setPlazaCompleted] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [transferMessage, setTransferMessage] = useState('');
  const [transferError, setTransferError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setId(anonId());
    setDays(daysLeft());
    setCompletedByRoute(Object.fromEntries(ROUTES.map((route) => [route.id, readCompletedUnits(route.id)])));
    setPlazaCompleted(readPlazaCompleted());
  }, []);

  const plaza = getPlazaProgress(plazaCompleted);
  const publishedCount = (routeId: string) => getRouteUnits(routeId).length;
  const earnedCount = (routeId: string) =>
    countCompletedPublishedUnits(completedByRoute[routeId] ?? [], publishedCount(routeId));
  const started = ROUTES.filter((route) => earnedCount(route.id) > 0);
  const completed = started.filter((route) => earnedCount(route.id) === publishedCount(route.id)).length;
  const unitsDone = started.reduce((total, route) => total + earnedCount(route.id), 0);

  const unitCounts = () => Object.fromEntries(ROUTES.map((route) => [route.id, publishedCount(route.id)]));

  const exportBackup = () => {
    try {
      const completed = Object.fromEntries(ROUTES.map((route) => [route.id, readCompletedUnits(route.id).filter((index) => index < publishedCount(route.id))]));
      const json = exportProgressBackup(completed, unitCounts());
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'open-school-progreso.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setTransferError(false);
      setTransferMessage('Respaldo generado sin tu identificador personal.');
    } catch {
      setTransferError(true);
      setTransferMessage('No se pudo generar el archivo de progreso.');
    }
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > 64 * 1024) throw new Error('El archivo supera 64 KB.');
      // Validate the entire file before any local write. Import merges evidence
      // rather than replacing existing progress or an anonymous identity.
      const incoming = importProgressBackup(await file.text(), unitCounts());
      for (const [routeId, indexes] of Object.entries(incoming)) {
        for (const index of indexes) completeUnit(routeId, index);
      }
      const updated = Object.fromEntries(ROUTES.map((route) => [
        route.id, readCompletedUnits(route.id),
      ])) as Record<string, number[]>;
      for (const [routeId, indexes] of Object.entries(incoming)) {
        if (!indexes.every((index) => updated[routeId]?.includes(index))) {
          throw new Error('Tu navegador no ha guardado el progreso.');
        }
      }
      for (const route of ROUTES) {
        setProgress(route.id, publishedProgress(updated[route.id] ?? [], publishedCount(route.id)));
      }
      setCompletedByRoute(updated);
      setTransferError(false);
      setTransferMessage('Progreso importado. Tus unidades anteriores también se han conservado.');
    } catch (error) {
      setTransferError(true);
      setTransferMessage(error instanceof Error ? error.message : 'No se pudo importar el respaldo.');
    } finally {
      input.value = '';
    }
  };

  const wipe = () => {
    forgetMe();
    setCompletedByRoute({});
    setPlazaCompleted([]);
    setId(anonId());
    setDays(daysLeft());
    setConfirming(false);
    setTransferMessage('');
  };

  return (
    <div className="bay shell stack stack--lg" style={{ paddingTop: 'clamp(7rem, 16vh, 11rem)' }}>
      <header className="stack stack--sm">
        <p className="t-label">Panel</p>
        <h1 className="t-display" style={{ maxWidth: '14ch' }}>Tu progreso</h1>
      </header>

      {/* ── Identidad anonima ── */}
      <Glass refract style={{ padding: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
        <div className="dash__id">
          <div className="stack stack--sm">
            <p className="t-label">Identificador anónimo</p>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--color-helio)',
                wordBreak: 'break-all',
              }}
            >
              {id || '···'}
            </code>
            <p className="t-body" style={{ fontSize: '0.86rem' }}>
              Generado en tu dispositivo. Caduca en {days} días. No está
              asociado a ningún correo, teléfono ni dirección IP.
            </p>
          </div>

          <div className="stack stack--sm" style={{ justifyItems: 'start' }}>
            {confirming ? (
              <>
                <p className="t-body" style={{ fontSize: '0.86rem' }}>
                  Se borrará tu identificador y todo el progreso. No se puede deshacer.
                </p>
                <div className="row">
                  <button type="button" className="btn btn--light" onClick={wipe}>
                    Sí, borrar todo
                  </button>
                  <button type="button" className="btn btn--quiet" onClick={() => setConfirming(false)}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="btn btn--glass" onClick={() => setConfirming(true)}>
                Borrar todo
              </button>
            )}
          </div>
        </div>
      </Glass>

      {/* ── Exportación e importación sin identidad ── */}
      <Glass style={{ padding: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
        <section className="stack stack--sm" aria-labelledby="progress-transfer-title">
          <p className="t-label">Tu progreso te pertenece</p>
          <h2 className="t-title" id="progress-transfer-title">Conservar o trasladar mis unidades</h2>
          <p className="t-body" style={{ maxWidth: '58ch' }}>
            Descarga un archivo JSON que contiene solo los números de las unidades completadas por ruta.
            No incluye identificadores, respuestas ni datos de contacto. Al importarlo se conservan
            las unidades que ya hayas completado en este dispositivo.
          </p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--light" onClick={exportBackup}>Descargar progreso</button>
            <button type="button" className="btn btn--glass" onClick={() => fileInputRef.current?.click()}>
              Importar progreso
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              aria-label="Archivo JSON de progreso"
              style={{ display: 'none' }}
              onChange={importBackup}
            />
          </div>
          {transferMessage && <p role={transferError ? 'alert' : 'status'} className="t-body">{transferMessage}</p>}
        </section>
      </Glass>

      {/* ── Cifras ── */}
      <dl className="bento" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(10rem,1fr))' }}>
        {[
          ['Rutas empezadas', `${started.length}`],
          ['Rutas al día (unidades publicadas)', `${completed}`],
          ['Unidades aprobadas', `${unitsDone}`],
          ['Unidades disponibles', `${TOTALS.availableUnits}`],
        ].map(([k, v]) => (
          <Glass key={k} style={{ padding: '1.4rem' }}>
            <div className="stack stack--sm">
              <dd className="t-num" style={{ margin: 0 }}>{v}</dd>
              <dt className="t-label">{k}</dt>
            </div>
          </Glass>
        ))}
      </dl>

      {/* Plaza shares the same local identity, expiry and delete-all action. */}
      <section className="stack stack--sm">
        <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end' }}>
          <div className="stack stack--sm">
            <p className="t-label">Plaza de aprendizaje · progreso comprobado</p>
            <h2 className="t-title">{plaza.doneUnits} de {plaza.availableUnits} unidades evaluadas</h2>
            <p className="t-body">
              {plaza.startedTracks} itinerarios empezados · {plaza.completeTracks} con sus cuatro unidades respondidas correctamente.
              Los proyectos finales se autoevalúan y no emiten certificados.
            </p>
          </div>
          <Link href="/plaza" className="btn btn--light">Continuar en la Plaza →</Link>
        </div>
        <div
          className="meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={plaza.availableUnits}
          aria-valuenow={plaza.doneUnits}
          aria-label="Unidades completadas en la Plaza Educativa"
        >
          <span className="meter__fill" style={{ transform: `scaleX(${plaza.availableUnits ? plaza.doneUnits / plaza.availableUnits : 0})` }} />
        </div>
      </section>

      {/* ── Rutas en curso ── */}
      <section className="stack stack--lg">
        <h2 className="t-title">En curso · unidades publicadas</h2>

        {started.length === 0 ? (
          <Glass style={{ padding: 'clamp(2rem, 6vw, 3.5rem)', textAlign: 'center' }}>
            <div className="stack" style={{ justifyItems: 'center' }}>
              <p className="t-body" style={{ textAlign: 'center' }}>
                Todavía no has empezado ninguna ruta.
              </p>
              <Link href="/catalog" className="btn btn--light">Elegir una ruta</Link>
            </div>
          </Glass>
        ) : (
          <div className="stack">
            {started.map((r) => {
              const pct = Math.round(publishedProgress(completedByRoute[r.id] ?? [], publishedCount(r.id)) * 100);
              return (
                <Glass key={r.id} lift style={{ padding: '1.3rem 1.6rem' }}>
                  <Link href={`/courses/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="stack stack--sm">
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span className="t-title" style={{ fontSize: '1.05rem' }}>{r.title}</span>
                        <span className="t-label" style={{ color: 'var(--color-helio)' }}>{pct}%</span>
                      </div>
                      <div
                        className="meter"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progreso de unidades publicadas en ${r.title}`}
                      >
                        <span className="meter__fill" style={{ transform: `scaleX(${pct / 100})` }} />
                      </div>
                    </div>
                  </Link>
                </Glass>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ===================================================================
   ROUTE CASE — P6: cada ruta es una pieza expuesta, no una "card".

   Las preguntas del manual, respondidas para esta pieza:
     foco      -> la palabra + el titulo
     respiro   -> el bloque de metricas se separa con una linea, no una caja
     primero   -> la palabra   segundo -> el claim
     ignorable -> el halo de la esquina
     que vende -> que la ruta existe y en que estado esta
     que sobra -> el rating y el numero de matriculados: se eliminaron
   =================================================================== */

import { Link } from 'wouter';
import { Glass } from './Glass';
import { STATUS_LABEL, type Route } from '../lib/catalog';

const GLOW: Record<Route['status'], string> = {
  produccion: 'rgba(107,231,243,0.20)',
  beta: 'rgba(158,134,255,0.20)',
  construccion: 'rgba(120,120,140,0.14)',
};

export function RouteCase({ route, index = 0 }: { route: Route; index?: number }) {
  return (
    <Link href={`/courses/${route.id}`} className="m-rise" style={{ '--d': `${index * 70}ms`, textDecoration: 'none' } as React.CSSProperties}>
      <Glass
        as="article"
        lift
        className="case"
        style={{ '--case-glow': GLOW[route.status], height: '100%' } as React.CSSProperties}
      >
        <p className="case__word">{route.word}</p>

        <div className="stack stack--sm">
          <h3 className="t-title">{route.title}</h3>
          <p className="t-body" style={{ color: 'var(--color-ink-2)', fontSize: '0.92rem' }}>
            {route.claim}
          </p>
        </div>

        <div className="row" style={{ gap: '0.4rem' }}>
          <span className="chip chip--edge">{route.level}</span>
          {route.offline && <span className="chip">Sin conexión</span>}
          {route.certified && <span className="chip">Certifica</span>}
        </div>

        <div className="case__meta">
          <span className="case__stat">
            <b>{route.modules}</b>
            <span className="t-label">Módulos</span>
          </span>
          <span className="case__stat">
            <b>{route.hours}h</b>
            <span className="t-label">Duración</span>
          </span>
          <span className="case__stat">
            <b>{route.langs.join(' · ')}</b>
            <span className="t-label">Idiomas</span>
          </span>
          <span className="case__stat" style={{ marginLeft: 'auto' }}>
            <span className="row" style={{ gap: '0.45rem' }}>
              <i className={`dot dot--${route.status}`} aria-hidden="true" />
              <span className="t-label" style={{ color: 'var(--color-ink-2)' }}>
                {STATUS_LABEL[route.status]}
              </span>
            </span>
          </span>
        </div>
      </Glass>
    </Link>
  );
}

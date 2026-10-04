/* ===================================================================
   HOME — escaparate cinematografico (P1 · P6)

   Estructura: una sola experiencia dominante arriba (la palabra), y
   despues capitulos que se leen en orden. Nada de rejilla de tarjetas
   generica en la primera pantalla.
   =================================================================== */

import { Link } from 'wouter';
import { PlasmaField } from '../components/PlasmaField';
import { ZeroText } from '../components/ZeroText';
import { Glass } from '../components/Glass';
import { RouteCase } from '../components/RouteCase';
import { ROUTES, TOTALS } from '../lib/catalog';

const PILLARS = [
  {
    k: 'Anónimo por diseño',
    v: 'No hay registro. Un identificador local de 365 días guarda tu progreso en tu propio dispositivo. Sin correo, sin teléfono, sin rastreo.',
  },
  {
    k: 'Funciona sin datos',
    v: `La aplicación se instala en el móvil y abre sin conexión. ${TOTALS.offline} de las ${TOTALS.routes} rutas están diseñadas para completarse sin gastar plan de datos.`,
  },
  {
    k: 'El certificado se verifica',
    v: 'Cada certificado lleva un código comprobable por terceros. No depende de que esta plataforma siga existiendo.',
  },
];

export function Home() {
  return (
    <>
      {/* ───────────── Capitulo 0: la palabra ───────────── */}
      <section className="hero" id="top">
        <PlasmaField />

        <div className="hero__content">
          <span className="chip chip--edge m-rise">Instituto abierto · Gratuito</span>

          <ZeroText
            word="APRENDER"
            sub="Formación seria para quien empieza de cero en un país nuevo. Sin matrícula, sin datos personales, sin letra pequeña."
          />

          <div className="row m-rise" style={{ '--d': '340ms', justifyContent: 'center' } as React.CSSProperties}>
            <Link href="/catalog" className="btn btn--light">
              Ver las {TOTALS.routes} rutas
            </Link>
            <a href="#sistema" className="btn btn--glass">
              Cómo funciona
            </a>
          </div>
        </div>

        <div className="hero__hint m-breathe" aria-hidden="true">
          <span className="hero__hint-line" />
          <span className="t-label">Desliza</span>
        </div>
      </section>

      {/* ───────────── Capitulo 1: el sistema ───────────── */}
      <section className="bay" id="sistema">
        <div className="shell stack stack--lg">
          <div className="stack stack--sm">
            <p className="t-label">01 — El sistema</p>
            <h2 className="t-display" style={{ maxWidth: '18ch' }}>
              Tres decisiones que lo cambian todo
            </h2>
          </div>

          <div className="bento">
            {PILLARS.map((p, i) => (
              <Glass
                key={p.k}
                className="m-rise"
                refract
                style={{ padding: 'clamp(1.4rem, 3vw, 2.2rem)', '--d': `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="stack stack--sm">
                  <p className="t-num t-helio">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="t-title">{p.k}</h3>
                  <p className="t-body" style={{ fontSize: '0.94rem' }}>{p.v}</p>
                </div>
              </Glass>
            ))}
          </div>

          <hr className="horizon" />

          {/* Cifras estructurales: se calculan del catalogo, no se inventan. */}
          <dl className="bento" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(9rem,1fr))', gap: '1.6rem' }}>
            {[
              ['Rutas', TOTALS.routes],
              ['Módulos', TOTALS.modules],
              ['Horas de contenido', `${TOTALS.hours}`],
              ['Idiomas', TOTALS.langs],
            ].map(([label, value]) => (
              <div key={String(label)} className="stack stack--sm">
                <dd className="t-num" style={{ margin: 0 }}>{value}</dd>
                <dt className="t-label">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────── Capitulo 2: el escaparate ───────────── */}
      <section className="bay" id="rutas" style={{ paddingTop: 0 }}>
        <div className="shell stack stack--lg">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'end' }}>
            <div className="stack stack--sm">
              <p className="t-label">02 — Las rutas</p>
              <h2 className="t-display" style={{ maxWidth: '16ch' }}>
                Cada una resuelve algo concreto
              </h2>
            </div>
            <Link href="/catalog" className="btn btn--quiet">
              Ver todas →
            </Link>
          </div>

          <div className="bento">
            {ROUTES.map((r, i) => (
              <RouteCase key={r.id} route={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Capitulo 3: cierre ───────────── */}
      <section className="bay" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Glass
            refract
            className="m-breathe"
            style={{
              padding: 'clamp(2.2rem, 6vw, 4.5rem)',
              textAlign: 'center',
              display: 'grid',
              gap: '1.6rem',
              justifyItems: 'center',
            }}
          >
            <h2 className="t-display" style={{ maxWidth: '17ch' }}>
              Empieza sin dar un solo dato
            </h2>
            <p className="t-lede" style={{ textAlign: 'center' }}>
              No hay formulario de registro. Eliges una ruta y empiezas;
              el progreso se guarda en tu dispositivo.
            </p>
            <Link href="/catalog" className="btn btn--light">
              Elegir mi ruta
            </Link>
          </Glass>
        </div>
      </section>
    </>
  );
}

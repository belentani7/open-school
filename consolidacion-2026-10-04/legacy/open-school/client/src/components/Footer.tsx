/* ===================================================================
   FOOTER — cierre. Claim del design system + hechos verificables.
   =================================================================== */

import { Link } from 'wouter';

import { TOTALS } from '../lib/catalog';

export function Footer() {
  return (
    <footer className="bay" style={{ paddingBottom: 'calc(var(--bay) * 0.5)' }}>
      <div className="shell stack stack--lg">
        <hr className="horizon" />

        <p
          className="t-display"
          style={{ color: 'var(--color-ink-3)', letterSpacing: '0.02em' }}
        >
          APRENDE.&nbsp; PROTEGE.&nbsp; TRANSFORMA.
        </p>

        <div className="footer__grid">
          <div className="stack stack--sm">
            <p className="t-label">Proyecto</p>
            <p className="t-body" style={{ fontSize: '0.9rem' }}>
              Instituto abierto y gratuito. Sin matrícula, sin publicidad,
              sin venta de datos. {TOTALS.offline} de {TOTALS.routes} rutas
              funcionan sin conexión.
            </p>
          </div>

          <div className="stack stack--sm">
            <p className="t-label">Licencia</p>
            <p className="t-body" style={{ fontSize: '0.9rem' }}>
              Código bajo licencia MIT. Puedes copiarlo, modificarlo y
              desplegarlo, también en proyectos institucionales.
            </p>
          </div>

          <div className="stack stack--sm">
            <p className="t-label">Enlaces</p>
            <ul className="footer__links">
              <li>
                <a href="https://github.com/belentani7/open-school" className="footer__link">
                  Repositorio
                </a>
              </li>
              <li><a href="/catalog" className="footer__link">Rutas</a></li>
              <li>
                {/* Sin el numero de terminos a proposito: importar
                    BIBLIA_TOTAL arrastraria las 219 entradas al bundle
                    principal para pintar un contador en el pie. El total
                    vive en la propia pagina, que es donde se busca. */}
                <Link href="/biblia" className="footer__link">
                  Biblia del desarrollo
                </Link>
              </li>
              <li><a href="#top" className="footer__link">Volver arriba</a></li>
            </ul>
          </div>
        </div>

        <p className="t-label" style={{ opacity: 0.6 }}>
          © 2026 Pedro Belentani · Barcelona / São Paulo
        </p>
      </div>
    </footer>
  );
}

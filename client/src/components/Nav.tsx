/* ===================================================================
   NAV — cabecera en desktop, barra inferior en movil (P5).

   En movil la navegacion va abajo: es donde llega el pulgar. Se declara
   una sola vez y se reposiciona por CSS; duplicar el marcado duplicaria
   los landmarks para un lector de pantalla.
   =================================================================== */

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

const LINKS = [
  { href: '/', label: 'Inicio', glyph: '◈' },
  { href: '/catalog', label: 'Rutas', glyph: '▤' },
  { href: '/dashboard', label: 'Progreso', glyph: '◐' },
  { href: '/chat', label: 'Tutor', glyph: '◉' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [loc] = useLocation();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--solid' : ''}`} aria-label="Navegacion principal">
      <div className="nav__inner shell">
        <Link href="/" className="nav__mark" aria-label="Open School, inicio">
          <span className="nav__glyph" aria-hidden="true">◆</span>
          <span className="nav__word">OPEN&nbsp;SCHOOL</span>
        </Link>

        <ul className="nav__list">
          {LINKS.map((l) => {
            const active = l.href === '/' ? loc === '/' : loc.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nav__link ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="nav__link-glyph" aria-hidden="true">{l.glyph}</span>
                  <span className="nav__link-text">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/catalog" className="btn btn--light nav__cta">
          Empezar
        </Link>
      </div>
    </nav>
  );
}

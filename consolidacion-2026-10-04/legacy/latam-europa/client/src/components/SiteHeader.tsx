import { Link } from "wouter";
import { ArrowRight, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/#rutas", label: "Rutas esenciales" },
  { href: "/#guias", label: "Guías" },
  { href: "/#directorio", label: "Directorio" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="LATAM Europa, inicio">
          <span className="brand-mark"><span /></span>
          <span>LATAM <em>Europa</em></span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>

        <a className="header-cta" href="/#explorar">
          Explorar ahora <ArrowRight aria-hidden="true" size={16} />
        </a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav">
          <Menu aria-hidden="true" size={21} /> <span className="sr-only">Abrir navegación</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav container" aria-label="Navegación principal móvil">
          <div className="mobile-nav-note"><ShieldCheck aria-hidden="true" size={17} /> Fuentes oficiales trazables</div>
          {links.map(link => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
        </nav>
      )}
    </header>
  );
}

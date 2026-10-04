import { ArrowRight, CalendarDays, Crown, Mail } from "lucide-react";

const posts = [
  {
    category: "Presencia y representación",
    date: "17 agosto 2026",
    title: "La visibilidad también se construye en comunidad",
    excerpt: "Una mirada a la presencia pública como una práctica de cuidado, claridad y responsabilidad compartida.",
    tone: "gold",
  },
  {
    category: "Barcelona · Cultura",
    date: "Próxima publicación",
    title: "Barcelona como escenario para nuevas voces",
    excerpt: "Ideas y conversaciones sobre mujeres visibles, cultura y los espacios donde una ciudad decide a quién escucha.",
    tone: "dark",
  },
  {
    category: "Activismo cotidiano",
    date: "Próxima publicación",
    title: "Vestirse también puede ser una declaración",
    excerpt: "El estilo como lenguaje: cómo ocupar una sala sin borrar la historia que te trajo hasta ella.",
    tone: "cream",
  },
];

export default function Blog() {
  return (
    <div className="blog-shell">
      <header className="blog-header">
        <a href="/" className="brand-mark"><span className="brand-monogram">NM</span><span>Natalia<br />Marinho</span></a>
        <nav><a href="/">Casa Natalia</a><a href="#manifiesto">Manifiesto</a><a href="#articulos">Artículos</a><a href="/prensa">Prensa</a></nav>
        <a href="/metodo" className="blog-header-cta">Trabajar con Natalia <ArrowRight size={15} /></a>
      </header>
      <main>
        <section className="blog-hero">
          <div className="section-label">Casa Natalia / Barcelona · Internacional</div>
          <h1>Una voz visible.<br /><em>Una conversación que importa.</em></h1>
          <p>El diario de Natty sobre presencia, representación, cultura y activismo cotidiano. Una plataforma para abrir conversaciones con elegancia, criterio y responsabilidad.</p>
          <div className="blog-hero-meta"><span><Crown size={15} /> Natalia Marinho</span><span><CalendarDays size={15} /> Edición Barcelona</span></div>
        </section>

        <section id="manifiesto" className="manifesto-section">
          <div className="section-label">01 / Manifiesto</div>
          <div className="manifesto-grid"><h2>La relevancia no se pide.<br /><em>Se cultiva.</em></h2><div><p>Natty utiliza su presencia para conectar imagen, historia y acción. Este espacio no pretende hablar por una comunidad: pretende abrir el micrófono, amplificar conversaciones y crear colaboraciones con sentido.</p><a href="mailto:nataliafalcon@icloud.com" className="text-link">Proponer una conversación <ArrowRight size={16} /></a></div></div>
        </section>

        <section id="articulos" className="blog-posts-section">
          <div className="section-heading"><div><div className="section-label">02 / El diario</div><h2>Ideas para ocupar espacio<br /><em>sin pedir permiso.</em></h2></div><p>Contenido para mujeres visibles, proyectos con propósito y marcas que quieren participar en una representación más amplia.</p></div>
          <div className="blog-post-grid">{posts.map((post, index) => <article className={`blog-post-card ${post.tone}`} key={post.title}><div className="blog-post-number">0{index + 1}</div><span className="blog-post-category">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><div className="blog-post-ctas"><a href="/#carta">Carta</a><a href="/metodo">Método</a><a href="/prensa">Colaborar</a></div><div className="blog-post-footer"><span>{post.date}</span><a href={index === 0 ? "#articulo-presencia" : "mailto:nataliafalcon@icloud.com"} aria-label={`Leer ${post.title}`}><ArrowRight size={17} /></a></div></article>)}</div>
        </section>

        <article id="articulo-presencia" className="featured-article">
          <div><div className="section-label">03 / Nota editorial</div><h2>La visibilidad también se construye en comunidad.</h2></div>
          <div className="featured-article-copy"><p className="lead-paragraph">Hay una diferencia entre ser vista y ser reconocida. La primera puede ocurrir por accidente; la segunda nace de una relación constante con tu historia, tu voz y las personas con las que decides construir.</p><p>En Barcelona, la presencia se cruza con la cultura, la migración, la moda, la lengua y la vida cotidiana. Por eso este diario empieza aquí: para mirar con atención, compartir preguntas y convertir la elegancia en una forma de participación.</p><p>La invitación es sencilla: llegar a los espacios con más verdad, abrir lugar para otras voces y entender que una marca personal también puede ser una responsabilidad pública.</p><a href="/metodo" className="gold-button">Construir tu propia presencia <ArrowRight size={16} /></a></div>
        </article>

        <section className="blog-newsletter">
          <div><div className="section-label">04 / Carta privada</div><h2>Recibe ideas para tu próxima etapa.</h2><p>Una carta breve sobre presencia, oportunidades y conversaciones que merecen más espacio.</p></div>
          <a href="/#carta" className="gold-button"><Mail size={16} /> Suscribirme a la carta</a>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-brand"><span className="brand-monogram">NM</span><p>Elegancia · Fuerza · Representación</p></div><div className="footer-links"><a href="mailto:nataliafalcon@icloud.com"><Mail size={15} /> nataliafalcon@icloud.com</a><a href="/">Volver a Casa Natalia <ArrowRight size={15} /></a></div><div className="footer-bottom"><span>© 2026 Natalia Marinho</span><span>Barcelona · Recife · Internacional</span></div></footer>
    </div>
  );
}

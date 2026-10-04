import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Filter,
  Globe2,
  Heart,
  Languages,
  Library,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

type Category = "Todos" | "Idiomas" | "Asignaturas" | "Vídeos" | "Escolarización";
type Resource = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  category: Exclude<Category, "Todos">;
  tags: string[];
  color: string;
  icon: string;
  official: string;
  appStore?: string;
  playStore?: string;
  free: string;
  level: string;
  detail: string;
  featured?: boolean;
};

const resources: Resource[] = [
  {
    id: "parla-cat",
    name: "Parla.cat",
    eyebrow: "Catalán · curso estructurado",
    description: "Aprende catalán paso a paso con niveles, prueba inicial y materiales oficiales.",
    category: "Idiomas",
    tags: ["Catalán", "A2 → C1", "Web"],
    color: "mint",
    icon: "Aa",
    official: "https://parla.cat/login/home.php?lang=es&id=0",
    free: "Gratis en modalidad libre",
    level: "Desde A2",
    detail: "Cuatro niveles y grados de unas 45 horas. La modalidad con tutoría es de pago.",
    featured: true,
  },
  {
    id: "duolingo",
    name: "Duolingo",
    eyebrow: "Idiomas · hábito diario",
    description: "Lecciones breves para practicar vocabulario, frases y comprensión cada día.",
    category: "Idiomas",
    tags: ["Español", "Inglés", "iOS + Android"],
    color: "lime",
    icon: "DL",
    official: "https://www.duolingo.com/courses",
    appStore: "https://apps.apple.com/us/app/duolingo-language-lessons/id570060128",
    playStore: "https://play.google.com/store/apps/details?id=com.duolingo",
    free: "Gratis + funciones premium",
    level: "Inicial → intermedio",
    detail: "Mejor como complemento diario. Revisar el idioma de partida y las compras dentro de la app.",
    featured: true,
  },
  {
    id: "khan",
    name: "Khan Academy",
    eyebrow: "Matemáticas · ciencias",
    description: "Vídeos, ejercicios y pistas para recuperar bases y avanzar con autonomía.",
    category: "Asignaturas",
    tags: ["Matemáticas", "Ciencias", "Português + Español"],
    color: "blue",
    icon: "K",
    official: "https://es.khanacademy.org/",
    appStore: "https://apps.apple.com/us/app/khan-academy/id469863705",
    playStore: "https://play.google.com/store/apps/details?id=org.khanacademy.android",
    free: "Gratis",
    level: "ESO y más",
    detail: "La cobertura cambia según el idioma. Usar portugués para entender y español para fijar vocabulario.",
    featured: true,
  },
  {
    id: "edu365",
    name: "Edu365",
    eyebrow: "Currículo catalán · Generalitat",
    description: "Un punto de entrada a recursos de secundaria, lenguas, ciencias, tecnología y más.",
    category: "Asignaturas",
    tags: ["ESO", "Català", "Recursos"],
    color: "coral",
    icon: "365",
    official: "https://www.edu365.cat/",
    free: "Gratis",
    level: "Primaria → Bachillerato",
    detail: "Selecciona contenidos por etapa y asignatura. Incluye recursos interactivos y SuperCampus.",
  },
  {
    id: "bbc",
    name: "BBC Learning English",
    eyebrow: "Inglés · escucha real",
    description: "Programas, podcasts, gramática y vocabulario organizados por nivel.",
    category: "Idiomas",
    tags: ["English", "Audio + vídeo", "Web"],
    color: "ink",
    icon: "BBC",
    official: "https://www.bbc.co.uk/learningenglish/",
    free: "Gratis",
    level: "Easy → Hard",
    detail: "Empieza con Real Easy English y 6 Minute English. La antigua app oficial ya no está activa.",
  },
  {
    id: "procomun",
    name: "Procomún",
    eyebrow: "Recursos abiertos · INTEF",
    description: "Busca materiales por curso —incluido 2.º, 3.º y 4.º ESO—, materia y dificultad.",
    category: "Asignaturas",
    tags: ["ESO", "REA", "Todas las materias"],
    color: "violet",
    icon: "P",
    official: "https://procomun.intef.es/",
    appStore: "https://itunes.apple.com/us/app/procom%C3%BAn-educaci%C3%B3n/id1081307565?mt=8",
    playStore: "https://play.google.com/store/apps/details?id=com.innopro.procomun",
    free: "Gratis y abierto",
    level: "12 → 16 años",
    detail: "Hay muchos materiales: conviene filtrar por edad, curso y objetivo concreto.",
  },
  {
    id: "supercampus",
    name: "SuperCampus · SX3",
    eyebrow: "Vídeos · aprender en catalán",
    description: "Vídeos y podcasts para descubrir, entender y repasar contenidos escolares.",
    category: "Vídeos",
    tags: ["Català", "Vídeos", "Podcasts"],
    color: "sun",
    icon: "▶",
    official: "https://www.3cat.cat/tv3/sx3/supercampus/",
    free: "Gratis",
    level: "Escolar",
    detail: "Ideal para escuchar catalán oral y conectar conceptos con explicaciones audiovisuales.",
  },
  {
    id: "cine",
    name: "Cine para estudiantes",
    eyebrow: "Películas · fichas didácticas",
    description: "Catálogo clasificado por edad, curso, idioma, tema y asignatura.",
    category: "Vídeos",
    tags: ["1.º–4.º ESO", "Cine", "Fichas"],
    color: "rose",
    icon: "CINE",
    official: "https://www.cinemaperaestudiants.cat/es/recursos-red/",
    free: "Catálogo y fichas online",
    level: "12 → 18 años",
    detail: "Comprueba siempre la edad, el idioma y la disponibilidad legal de cada película.",
  },
  {
    id: "xtec",
    name: "Acollida · XTEC",
    eyebrow: "Llegada a Cataluña · apoyo",
    description: "Materiales para el aprendizaje intensivo del catalán y la incorporación al aula.",
    category: "Escolarización",
    tags: ["Alumnado nuevo", "Català", "Familias"],
    color: "teal",
    icon: "X",
    official: "https://xtec.gencat.cat/ca/projectes/alumnat-origen-estranger/alumnatnou/acollida/",
    free: "Gratis",
    level: "Apoyo escolar",
    detail: "Incluye orientaciones de acogida, adaptación curricular y comunicación con familias.",
  },
  {
    id: "schooling",
    name: "Escolarización de recién llegados",
    eyebrow: "Trámite · Barcelona",
    description: "Información oficial para solicitar plaza en una escuela pública durante el curso.",
    category: "Escolarización",
    tags: ["3 → 16 años", "ESO", "Familias"],
    color: "slate",
    icon: "↗",
    official: "https://www.barcelona.cat/internationalwelcome/en/procedure/schooling-newly-arrived-students",
    free: "Trámite informativo",
    level: "3 → 16 años",
    detail: "La página explica el procedimiento para alumnado recién llegado cuando el curso ya ha empezado.",
  },
];

const quickLinks = [
  { label: "Català", id: "parla-cat", tone: "mint" },
  { label: "English", id: "bbc", tone: "ink" },
  { label: "Español", id: "duolingo", tone: "lime" },
  { label: "Matemáticas", id: "khan", tone: "blue" },
];

function ResourceCard({ resource, onOpen, favorite, onFavorite }: { resource: Resource; onOpen: (resource: Resource) => void; favorite: boolean; onFavorite: () => void }) {
  return (
    <article className={`resource-card ${resource.color}`}>
      <div className="card-topline">
        <span className="resource-icon" aria-hidden="true">{resource.icon}</span>
        <button className={`favorite ${favorite ? "active" : ""}`} aria-label={`${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}: ${resource.name}`} onClick={onFavorite}>
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-content">
        <p className="eyebrow">{resource.eyebrow}</p>
        <h3>{resource.name}</h3>
        <p className="resource-description">{resource.description}</p>
        <div className="tag-row">{resource.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </div>
      <div className="card-footer">
        <span className="price"><Check size={15} /> {resource.free}</span>
        <button className="open-link" onClick={() => onOpen(resource)}>Ver acceso <ArrowUpRight size={16} /></button>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem("william-favorites") || "[]"));
  const [selected, setSelected] = useState<Resource | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => resources.filter((resource) => {
    const matchesCategory = activeCategory === "Todos" || resource.category === activeCategory;
    const haystack = `${resource.name} ${resource.description} ${resource.tags.join(" ")} ${resource.eyebrow}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [activeCategory, query]);

  const visible = showAll ? filtered : filtered.slice(0, 6);
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("william-favorites", JSON.stringify(next));
  };

  const goToResources = () => document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Ruta de Aprendizaje, inicio">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span><strong>ruta de</strong><b>aprendizaje</b></span>
        </a>
        <nav className={mobileMenu ? "nav-links open" : "nav-links"} aria-label="Navegación principal">
          <a href="#recursos" onClick={() => setMobileMenu(false)}>Recursos</a>
          <a href="#ruta" onClick={() => setMobileMenu(false)}>Mi ruta</a>
          <a href="#familia" onClick={() => setMobileMenu(false)}>Para la familia</a>
        </nav>
        <div className="header-actions">
          <span className="saved-count"><Heart size={16} fill="currentColor" /> {favorites.length} guardados</span>
          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menú">{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="kicker"><span className="pulse-dot" /> Portal personal para William Danilo · 14 años</p>
            <h1>Aprender una nueva vida, <em>paso a paso.</em></h1>
            <p className="hero-lead">Un lugar sencillo para que William avance desde hoy en catalán, español, inglés y las materias de la ESO mientras la familia tramita su escolarización.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={goToResources}>Explorar recursos <ArrowUpRight size={18} /></button>
              <a className="text-button" href="#ruta">Ver la ruta semanal <ChevronDown size={17} /></a>
            </div>
          </div>
          <div className="hero-art" aria-label="Ilustración decorativa">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="sun-shape"><span>hola</span><strong>hello</strong><i>hola</i></div>
            <div className="floating-note note-one"><Languages size={18} /><span>3 idiomas</span></div>
            <div className="floating-note note-two"><BookOpen size={17} /><span>ESO · 14 años</span></div>
            <div className="floating-star"><Star size={20} fill="currentColor" /></div>
          </div>
        </section>

        <section className="quick-strip" aria-label="Accesos rápidos">
          <div><span className="strip-label">Empezar por</span><strong>elige un objetivo</strong></div>
          {quickLinks.map((link) => <button className={`quick-chip ${link.tone}`} key={link.id} onClick={() => { setActiveCategory(link.id === "khan" ? "Asignaturas" : "Idiomas"); setQuery(""); setTimeout(goToResources, 0); }}>{link.label}<ArrowUpRight size={15} /></button>)}
        </section>

        <section className="section-block" id="recursos">
          <div className="section-heading">
            <div><p className="section-number">01 / BIBLIOTECA</p><h2>Todo lo que necesita,<br /><em>en un solo lugar.</em></h2></div>
            <p className="section-intro">Recursos reales, accesibles y seleccionados para empezar hoy. Todos los enlaces llevan a la web oficial o a la tienda de aplicaciones correspondiente.</p>
          </div>
          <div className="toolbar">
            <div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por materia, idioma…" aria-label="Buscar recursos" />{query && <button onClick={() => setQuery("")} aria-label="Borrar búsqueda"><X size={15} /></button>}</div>
            <div className="filter-row"><Filter size={16} /><span className="filter-label">Filtrar:</span>{(["Todos", "Idiomas", "Asignaturas", "Vídeos", "Escolarización"] as Category[]).map((category) => <button key={category} className={activeCategory === category ? "filter active" : "filter"} onClick={() => { setActiveCategory(category); setShowAll(false); }}>{category}</button>)}</div>
          </div>
          <div className="resource-grid">
            {visible.map((resource) => <ResourceCard key={resource.id} resource={resource} onOpen={setSelected} favorite={favorites.includes(resource.id)} onFavorite={() => toggleFavorite(resource.id)} />)}
          </div>
          {visible.length === 0 && <div className="empty-state"><Search size={24} /><p>No encontramos recursos con ese filtro.</p><button onClick={() => { setQuery(""); setActiveCategory("Todos"); }}>Limpiar filtros</button></div>}
          {filtered.length > 6 && <button className="load-more" onClick={() => setShowAll(!showAll)}>{showAll ? "Ver menos" : `Ver todos los recursos (${filtered.length})`} <ChevronDown className={showAll ? "rotate" : ""} size={18} /></button>}
        </section>

        <section className="route-section" id="ruta">
          <div className="route-header"><div><p className="section-number">02 / MI RUTA</p><h2>Una semana que <em>sí se puede</em> mantener.</h2></div><span className="route-badge"><Clock3 size={16} /> 2 h 45 min / semana</span></div>
          <div className="week-grid">
            <div className="week-card day-monday"><span className="day">LUNES</span><strong>Parla.cat</strong><p>Catalán estructurado</p><span className="duration">25 min</span></div>
            <div className="week-card day-tuesday"><span className="day">MARTES</span><strong>Khan Academy</strong><p>Matemáticas</p><span className="duration">30 min</span></div>
            <div className="week-card day-wednesday"><span className="day">MIÉRCOLES</span><strong>Duolingo</strong><p>Español + inglés</p><span className="duration">20 min</span></div>
            <div className="week-card day-thursday"><span className="day">JUEVES</span><strong>BBC Learning</strong><p>Escucha en inglés</p><span className="duration">20 min</span></div>
            <div className="week-card day-friday"><span className="day">VIERNES</span><strong>Edu365</strong><p>Una asignatura ESO</p><span className="duration">30 min</span></div>
            <div className="week-card day-weekend"><span className="day">FIN DE SEMANA</span><strong>SuperCampus</strong><p>Vídeo + explicar lo aprendido</p><span className="duration">40 min</span></div>
          </div>
        </section>

        <section className="family-section" id="familia">
          <div className="family-icon"><ShieldCheck size={28} /></div>
            <div><p className="section-number">03 / PARA LA FAMILIA</p><h2>La web ayuda. <em>El instituto organiza.</em></h2><p>Este portal reúne herramientas ya existentes para aprender mientras llega la escolarización. No sustituye el instituto ni una evaluación de nivel. Solicita plaza, pregunta por el aula d’acollida o el apoyo lingüístico y revisa las cuentas, la publicidad, las compras y la privacidad con William.</p></div>
          <a className="family-link" href="https://www.barcelona.cat/internationalwelcome/en/procedure/schooling-newly-arrived-students" target="_blank" rel="noreferrer">Ver información oficial <ExternalLink size={16} /></a>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark"><Sparkles size={15} /></span><strong>ruta de aprendizaje</strong></div><p>Selección de recursos oficiales y abiertos · Actualizado para empezar</p><a href="https://xtec.gencat.cat/ca/projectes/alumnat-origen-estranger/alumnatnou/acollida/" target="_blank" rel="noreferrer">Fuentes y acogida XTEC <ExternalLink size={14} /></a></footer>

      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><div className="resource-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar"><X size={18} /></button><div className={`modal-icon ${selected.color}`}>{selected.icon}</div><p className="eyebrow">{selected.eyebrow}</p><h2 id="modal-title">{selected.name}</h2><p className="modal-description">{selected.description}</p><div className="modal-meta"><div><span>Acceso</span><strong>{selected.level}</strong></div><div><span>Coste</span><strong>{selected.free}</strong></div></div><p className="detail-note"><Check size={16} /> {selected.detail}</p><div className="access-links"><a href={selected.official} target="_blank" rel="noreferrer" className="primary-button">Abrir web oficial <ExternalLink size={16} /></a>{selected.appStore && <a href={selected.appStore} target="_blank" rel="noreferrer" className="store-link">App Store <ExternalLink size={14} /></a>}{selected.playStore && <a href={selected.playStore} target="_blank" rel="noreferrer" className="store-link">Google Play <ExternalLink size={14} /></a>}</div></div></div>}
    </div>
  );
}

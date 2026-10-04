import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "wouter";
import { type Topic, TOPICS, topicMeta } from "@shared/latam-data";
import { trpc } from "@/lib/trpc";
import { SiteHeader } from "@/components/SiteHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { LegalNotice } from "@/components/LegalNotice";
import { SourceStatus } from "@/components/SourceStatus";
import { EmptyState, ErrorState, LoadingState } from "@/components/CatalogStates";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const routeCopy: Record<Topic, { title: string; text: string }> = {
  documentacion: { title: "Documentación", text: "NIE, TIE y trámites de identidad." },
  residencia: { title: "Residencia", text: "Autorizaciones, renovaciones y oficina competente." },
  trabajo: { title: "Trabajo", text: "Orientación, empleo público y demanda." },
  vivienda: { title: "Vivienda", text: "Recursos públicos y cautelas esenciales." },
  salud: { title: "Salud", text: "Acceso orientativo al sistema sanitario." },
  educacion: { title: "Educación", text: "Homologación, convalidación y estudios." },
  integracion: { title: "Integración", text: "Acogida, territorio y redes de apoyo." },
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateString));
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<Topic | undefined>();
  const deferredSearch = useDeferredValue(search);
  const filters = useMemo(() => ({ query: deferredSearch || undefined, topic }), [deferredSearch, topic]);
  const catalog = trpc.catalog.list.useQuery(filters, { retry: 1, staleTime: 60_000 });

  const resetFilters = () => { setSearch(""); setTopic(undefined); };

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Módulo inicial <strong>España</strong></div>
              <h1>Tu ruta hacia España,<br /><i>con fuentes que puedes comprobar.</i></h1>
              <p className="hero-lede">Orientación clara para personas latinoamericanas que llegan, viven o planean migrar. Sin ruido, sin promesas vacías y con enlaces directos a las instituciones responsables.</p>
              <div className="hero-actions">
                <a href="#explorar" className="button-primary">Encontrar mi ruta <ArrowRight aria-hidden="true" size={18} /></a>
                <a href="#directorio" className="button-text">Ver fuentes verificadas <ArrowUpRight aria-hidden="true" size={17} /></a>
              </div>
              <div className="hero-trust"><ShieldCheck aria-hidden="true" size={19} /><span>Directorio con fecha de comprobación y estado visible</span></div>
            </div>

            <div className="hero-panel" aria-label="Resumen de la propuesta de LATAM Europa">
              <div className="panel-topline"><span>01 / España</span><span>Información viva</span></div>
              <div className="path-visual" aria-hidden="true">
                <span className="path-node path-node--start">LATAM</span>
                <span className="path-line path-line--a" />
                <span className="path-node path-node--middle">RUTA</span>
                <span className="path-line path-line--b" />
                <span className="path-node path-node--end">ES</span>
              </div>
              <div className="panel-statement"><Sparkles aria-hidden="true" size={18} /><p>Lo importante no es acumular enlaces. Es saber <strong>cuál consultar, cuándo y por qué.</strong></p></div>
              <div className="panel-footer"><span className="pulse-dot" /> Última revisión inicial · 27 ago 2026</div>
            </div>
          </div>
          <div className="hero-bottom container"><span>Un punto de partida para decidir con más claridad.</span><ChevronDown aria-hidden="true" size={18} /></div>
        </section>

        <section className="notice-band"><div className="container"><LegalNotice compact /></div></section>

        <section id="rutas" className="routes-section section-pad">
          <div className="container">
            <div className="section-intro section-intro--split">
              <div><p className="section-kicker">Empieza por lo esencial</p><h2>Una ruta para cada<br /><i>momento de tu llegada.</i></h2></div>
              <p>Selecciona un tema y encuentra el punto de entrada oficial. Las guías organizan la información para que sepas qué revisar antes de actuar.</p>
            </div>
            <div className="route-grid">
              {TOPICS.map((item, index) => (
                <a className="route-card" href={`#explorar`} onClick={() => setTopic(item)} key={item}>
                  <span className="route-number">0{index + 1}</span>
                  <div className="route-icon"><TopicIcon topic={item} size={21} /></div>
                  <h3>{routeCopy[item].title}</h3><p>{routeCopy[item].text}</p>
                  <span className="route-arrow"><ArrowRight aria-hidden="true" size={17} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="explorar" className="explorer-section section-pad">
          <div className="container">
            <div className="explorer-heading"><div><p className="section-kicker section-kicker--light">Explorador práctico</p><h2>Encuentra una guía<br />o una fuente.</h2></div><p>Filtra por necesidad o escribe una palabra clave. El resultado conserva el enlace de la entidad responsable.</p></div>
            <div className="search-shell">
              <Search aria-hidden="true" size={20} />
              <label className="sr-only" htmlFor="catalog-search">Buscar guías y recursos</label>
              <input id="catalog-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Ej. NIE, contrato, estudios, salud…" autoComplete="off" />
              {(search || topic) && <button type="button" onClick={resetFilters}>Limpiar</button>}
            </div>
            <div className="filter-row" aria-label="Filtrar por tema">
              <button className={!topic ? "filter-chip is-active" : "filter-chip"} type="button" onClick={() => setTopic(undefined)}>Todos</button>
              {TOPICS.map(item => <button className={topic === item ? "filter-chip is-active" : "filter-chip"} type="button" key={item} onClick={() => setTopic(item)}>{topicMeta[item].shortLabel}</button>)}
            </div>
          </div>
        </section>

        <section id="guias" className="guide-section section-pad">
          <div className="container">
            <div className="content-heading"><div><p className="section-kicker">Guías accionables</p><h2>Antes de iniciar<br /><i>un trámite.</i></h2></div><p>Pasos de orientación, requisitos que debes contrastar y el aviso de alcance correspondiente.</p></div>
            {catalog.isLoading ? <LoadingState /> : catalog.isError ? <ErrorState /> : catalog.data?.guides.length ? (
              <div className="guide-grid">
                {catalog.data.guides.map(guide => (
                  <article className="guide-card" key={guide.slug}>
                    <div className="guide-card-top"><div className="topic-tag"><TopicIcon topic={guide.topic} size={15} />{topicMeta[guide.topic].label}</div><span>{guide.eyebrow}</span></div>
                    <h3>{guide.title}</h3><p>{guide.description}</p>
                    <div className="guide-card-foot"><span><CheckCircle2 aria-hidden="true" size={15} /> {guide.steps.length} pasos</span><Link href={`/guias/${guide.slug}`} className="inline-link">Abrir guía <ArrowRight aria-hidden="true" size={16} /></Link></div>
                  </article>
                ))}
              </div>
            ) : <EmptyState />}
          </div>
        </section>

        <section id="directorio" className="directory-section section-pad">
          <div className="container">
            <div className="directory-header"><div><p className="section-kicker">Directorio de confianza</p><h2>Fuentes <i>trazables.</i></h2></div><div className="directory-proof"><ShieldCheck aria-hidden="true" size={19} /><span>Cada ficha indica responsable, estado y fecha de revisión.</span></div></div>
            {catalog.isLoading ? <LoadingState /> : catalog.isError ? <ErrorState /> : catalog.data?.sources.length ? (
              <div className="directory-table-wrap" role="region" aria-label="Fuentes y recursos verificados" tabIndex={0}>
                <table className="directory-table">
                  <thead><tr><th>Fuente responsable</th><th>Área</th><th>Comprobación</th><th>Estado</th><th><span className="sr-only">Abrir enlace</span></th></tr></thead>
                  <tbody>{catalog.data.sources.map(source => (
                    <tr key={source.slug}>
                      <td><div className="source-entity"><strong>{source.title}</strong><span>{source.entity}</span></div></td>
                      <td><span className="topic-label"><TopicIcon topic={source.category} size={14} />{topicMeta[source.category].label}</span></td>
                      <td><time dateTime={source.lastCheckedAt}>{formatDate(source.lastCheckedAt)}</time></td>
                      <td><SourceStatus status={source.status} /></td>
                      <td><a className="external-source" href={source.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${source.title} en una nueva pestaña`}><ExternalLink aria-hidden="true" size={17} /></a></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <EmptyState />}
            <p className="directory-caption"><CircleHelp aria-hidden="true" size={16} /> El estado «Revisión necesaria» indica que una comprobación técnica reciente requiere contrastar el acceso antes de usarlo.</p>
          </div>
        </section>

        <section className="closing-section"><div className="container closing-grid"><div><p className="section-kicker section-kicker--light">Decisiones informadas</p><h2>Menos incertidumbre.<br /><i>Más próximos pasos.</i></h2></div><div><p>LATAM Europa organiza el acceso a información pública, no decide por ti. Verifica siempre la fuente original y consulta apoyo especializado si tu situación lo requiere.</p><a href="#explorar" className="button-light">Empezar a explorar <ArrowRight aria-hidden="true" size={18} /></a></div></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><span className="brand brand--footer"><span className="brand-mark"><span /></span>LATAM <em>Europa</em></span><p>Información pública organizada para migrar a España.</p><a href="#rutas">Volver a las rutas <ArrowUpRight aria-hidden="true" size={15} /></a></div></footer>
    </div>
  );
}

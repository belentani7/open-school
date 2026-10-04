import { courses, trackLabels, type Locale, type Track } from "@shared/dictCatalog";
import { ArrowUpRight, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import PublicShell from "@/components/PublicShell";
import { useLanguage } from "@/contexts/LanguageContext";

const copy: Record<Locale, { eyebrow: string; title: string; lead: string; search: string; all: string; course: string; prerequisite: string; open: string }> = {
  es: { eyebrow: "Oferta académica", title: "Catálogo de asignaturas", lead: "Treinta unidades articuladas en una progresión de cinco años. Las rutas avanzadas se desbloquean mediante evidencias de competencia, no por antigüedad.", search: "Buscar por código, título o concepto", all: "Todos los ámbitos", course: "Asignatura", prerequisite: "Prerrequisitos", open: "Ver ficha" },
  pt: { eyebrow: "Oferta académica", title: "Catálogo de disciplinas", lead: "Trinta unidades articuladas numa progressão de cinco anos. As rotas avançadas são desbloqueadas por evidência de competência, não por antiguidade.", search: "Procurar por código, título ou conceito", all: "Todas as áreas", course: "Disciplina", prerequisite: "Pré-requisitos", open: "Ver ficha" },
  en: { eyebrow: "Academic offering", title: "Course catalog", lead: "Thirty units arranged in a five-year progression. Advanced paths unlock through evidence of competence, not time served.", search: "Search code, title or concept", all: "All domains", course: "Course", prerequisite: "Prerequisites", open: "Open brief" },
};

export default function Catalog() {
  const { locale } = useLanguage(); const text = copy[locale];
  const [query, setQuery] = useState(""); const [track, setTrack] = useState("all");
  const results = useMemo(() => courses.filter(course => {
    const needle = `${course.code} ${course.title[locale]} ${course.summary[locale]}`.toLocaleLowerCase();
    return needle.includes(query.toLocaleLowerCase()) && (track === "all" || course.track === track);
  }), [locale, query, track]);
  const tracks = Array.from(new Set(courses.map(course => course.track))) as Track[];
  return <PublicShell><section className="page-intro"><div><span className="eyebrow">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.lead}</p></div><div className="intro-stat"><b>30</b><span>{text.course}s · 300 CA</span></div></section>
    <section className="catalog-tools"><label className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={text.search} /></label><label className="select-field"><Filter size={16} /><select value={track} onChange={event => setTrack(event.target.value)}><option value="all">{text.all}</option>{tracks.map(item => <option key={item} value={item}>{trackLabels[item][locale]}</option>)}</select></label></section>
    <section className="course-grid" aria-live="polite">{results.map(course => <article className="course-card" key={course.code}><div className="course-card-top"><span>{course.code}</span><span>S{course.semester} · {course.credits} CA</span></div><div><p className="track-label">{trackLabels[course.track][locale]}</p><h2>{course.title[locale]}</h2><p>{course.summary[locale]}</p></div><div className="course-card-meta"><span>{text.prerequisite}: {course.prerequisites.length ? course.prerequisites.join(", ") : "—"}</span><span>{course.entry} → {course.exit}</span></div><Link href={`/catalog/${course.code}`} className="course-open">{text.open}<ArrowUpRight size={16} /></Link></article>)}</section>
  </PublicShell>;
}

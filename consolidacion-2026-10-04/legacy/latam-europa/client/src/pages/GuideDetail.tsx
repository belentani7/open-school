import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalNotice } from "@/components/LegalNotice";
import { TopicIcon } from "@/components/TopicIcon";
import { LoadingState, ErrorState } from "@/components/CatalogStates";
import { SourceStatus } from "@/components/SourceStatus";
import { topicMeta } from "@shared/latam-data";

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const catalog = trpc.catalog.list.useQuery(undefined, { retry: 1, staleTime: 60_000 });
  const guide = useMemo(() => catalog.data?.guides.find(item => item.slug === slug), [catalog.data, slug]);
  const sources = useMemo(() => catalog.data?.sources.filter(source => guide?.sourceSlugs.includes(source.slug)) ?? [], [catalog.data, guide]);

  return <div className="site-shell guide-detail-shell"><SiteHeader /><main className="detail-main"><div className="container detail-container">
    <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" size={17} /> Todas las guías</Link>
    {catalog.isLoading ? <LoadingState /> : catalog.isError ? <ErrorState /> : !guide ? (
      <div className="not-found-guide"><h1>Esta guía no está disponible.</h1><p>Puede haber cambiado o no formar parte del módulo inicial.</p><Link href="/" className="button-primary">Volver al inicio <ArrowRight aria-hidden="true" size={17} /></Link></div>
    ) : <article>
      <div className="detail-hero"><div className="topic-tag"><TopicIcon topic={guide.topic} size={15} />{topicMeta[guide.topic].label}</div><p className="section-kicker">{guide.eyebrow}</p><h1>{guide.title}</h1><p>{guide.description}</p></div>
      <LegalNotice />
      <div className="detail-layout"><div className="detail-body"><section><p className="section-kicker">Ruta orientativa</p><h2>Pasos para empezar</h2><ol className="step-list">{guide.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section><section className="requirements-box"><p className="section-kicker">Antes de continuar</p><h2>Qué debes contrastar</h2><ul>{guide.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ul></section><section className="scope-box"><ShieldCheck aria-hidden="true" size={21} /><div><h2>Alcance de esta guía</h2><p>{guide.scope}</p></div></section></div>
      <aside className="detail-sources"><p className="section-kicker">Fuentes vinculadas</p><h2>Consulta el original</h2>{sources.map(source => <a key={source.slug} href={source.url} target="_blank" rel="noreferrer" className="detail-source"><div><strong>{source.title}</strong><span>{source.entity}</span></div><ExternalLink aria-hidden="true" size={17} /><SourceStatus status={source.status} /></a>)}</aside></div>
    </article>}
  </div></main></div>;
}

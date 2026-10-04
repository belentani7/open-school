import PublicShell from "@/components/PublicShell";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRoute } from "wouter";
import { ExternalLink, FolderGit2, ShieldAlert } from "lucide-react";

const copy = {
  es: { loading: "Cargando portfolio público…", eyebrow: "PORTFOLIO", unavailable: "Portfolio no disponible.", unavailableBody: "Este perfil es privado, ya no está disponible o no existe.", fallbackTitle: "Portfolio técnico de aprendizaje", fallbackBio: "Proyectos basados en evidencia publicados por el estudiante.", repository: "Repositorio", notice: "Las entradas del portfolio son evidencias de proyecto controladas por el estudiante. No representan un título universitario, una credencial oficial ni ECTS." },
  pt: { loading: "A carregar portfólio público…", eyebrow: "PORTFÓLIO", unavailable: "Portfólio indisponível.", unavailableBody: "Este perfil é privado, já não está disponível ou não existe.", fallbackTitle: "Portfólio técnico de aprendizagem", fallbackBio: "Projetos baseados em evidência publicados pelo estudante.", repository: "Repositório", notice: "As entradas do portfólio são evidências de projeto controladas pelo estudante. Não representam um diploma universitário, credencial oficial ou ECTS." },
  en: { loading: "Loading public portfolio…", eyebrow: "PORTFOLIO", unavailable: "Portfolio unavailable.", unavailableBody: "This profile is private, no longer available or does not exist.", fallbackTitle: "Technical learning portfolio", fallbackBio: "Evidence-led projects published by the learner.", repository: "Repository", notice: "Portfolio entries are learner-controlled project evidence. They do not represent a university degree, an official credential or ECTS." },
};

export default function PublicPortfolio() {
  const [, params] = useRoute("/portfolio/:slug"); const slug = params?.slug ?? "unavailable";
  const portfolio = trpc.portfolio.getPublic.useQuery({ slug }, { enabled: Boolean(params?.slug) });
  const { locale } = useLanguage(); const text = copy[locale];
  return <PublicShell><section className="public-portfolio">{portfolio.isLoading && <p>{text.loading}</p>}{!portfolio.isLoading && !portfolio.data && <><span className="eyebrow">{text.eyebrow}</span><h1>{text.unavailable}</h1><p>{text.unavailableBody}</p></>}{portfolio.data && <><span className="eyebrow">D.I.C.T. · {text.eyebrow}</span><h1>{portfolio.data.profile.headline || text.fallbackTitle}</h1><p>{portfolio.data.profile.bio || text.fallbackBio}</p><section className="public-projects">{portfolio.data.projects.map(project => <article key={project.id}><FolderGit2 size={19}/><h2>{project.title}</h2><p>{project.summary}</p><div>{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">{text.repository} <ExternalLink size={14}/></a>}</article>)}</section></>}<aside><ShieldAlert size={18}/><p>{text.notice}</p></aside></section></PublicShell>;
}

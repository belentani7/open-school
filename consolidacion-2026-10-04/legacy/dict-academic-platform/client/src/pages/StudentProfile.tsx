import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Globe2, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const copy = {
  es: { eyebrow: "Identidad profesional", title: "Tu perfil académico interno.", lead: "Describe el foco de tu aprendizaje y controla si tu portfolio de proyectos puede mostrarse públicamente.", headline: "Titular profesional", bio: "Biografía académica", visibility: "Hacer visible mi portfolio", save: "Guardar perfil", saved: "Perfil actualizado", note: "El perfil no modifica calificaciones ni emite una acreditación oficial." },
  pt: { eyebrow: "Identidade profissional", title: "O teu perfil académico interno.", lead: "Descreve o foco da tua aprendizagem e controla se o portfólio de projetos pode ser mostrado publicamente.", headline: "Título profissional", bio: "Biografia académica", visibility: "Tornar o meu portfólio visível", save: "Guardar perfil", saved: "Perfil atualizado", note: "O perfil não altera classificações nem emite uma acreditação oficial." },
  en: { eyebrow: "Professional identity", title: "Your internal academic profile.", lead: "Describe your learning focus and control whether your project portfolio may be shown publicly.", headline: "Professional headline", bio: "Academic biography", visibility: "Make my portfolio visible", save: "Save profile", saved: "Profile updated", note: "The profile does not alter grades or issue official accreditation." },
};

export default function StudentProfile() {
  const { locale } = useLanguage(); const text = copy[locale]; const { isAuthenticated } = useAuth();
  const dashboard = trpc.student.dashboard.useQuery(undefined, { enabled: isAuthenticated });
  const update = trpc.student.updateProfile.useMutation({ onSuccess: () => dashboard.refetch() });
  const [headline, setHeadline] = useState(""); const [bio, setBio] = useState(""); const [portfolioPublic, setPortfolioPublic] = useState(false);
  useEffect(() => { const profile = dashboard.data?.profile; if (profile) { setHeadline(profile.headline ?? ""); setBio(profile.bio ?? ""); setPortfolioPublic(Boolean(profile.portfolioPublic)); } }, [dashboard.data?.profile]);
  return <DashboardLayout><section className="profile-page"><span className="eyebrow">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.lead}</p><form onSubmit={event => { event.preventDefault(); update.mutate({ headline: headline || null, bio: bio || null, portfolioPublic }); }}><label><span>{text.headline}</span><input value={headline} maxLength={180} onChange={event => setHeadline(event.target.value)} placeholder={locale === "es" ? "Estudiante de sistemas de IA y cloud" : locale === "pt" ? "Estudante de sistemas de IA e cloud" : "Cloud & AI systems learner"} /></label><label><span>{text.bio}</span><textarea value={bio} maxLength={1600} onChange={event => setBio(event.target.value)} placeholder={locale === "es" ? "¿Qué estás construyendo, aprendiendo y documentando?" : locale === "pt" ? "O que estás a construir, aprender e documentar?" : "What are you building, learning and documenting?"} rows={6}/></label><label className="visibility-row"><input type="checkbox" checked={portfolioPublic} onChange={event => setPortfolioPublic(event.target.checked)}/><Globe2 size={17}/><span>{text.visibility}</span></label><button disabled={update.isPending}><Save size={16}/>{text.save}</button>{update.isSuccess && <small>{text.saved}</small>}</form><aside><UserRound size={18}/><p>{text.note}</p></aside></section></DashboardLayout>;
}

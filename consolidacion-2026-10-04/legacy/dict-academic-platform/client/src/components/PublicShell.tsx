import { program, type Locale } from "@shared/dictCatalog";
import { BookOpen, GraduationCap, Menu, Network, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const labels: Record<Locale, { catalog: string; curriculum: string; library: string; labs: string; student: string; verify: string; notice: string; menu: string; home: string; lowBandwidth: string; languageSelector: string; brand: string }> = {
  es: { catalog: "Catálogo", curriculum: "Plan de estudios", library: "Biblioteca", labs: "Laboratorios", student: "Área del estudiante", verify: "Verificar registro interno", notice: "Transparencia académica", menu: "Navegación", home: "Inicio", lowBandwidth: "BANDA BAJA", languageSelector: "Selector de idioma", brand: "Inteligencia Digital y Tecnología Cibernética" },
  pt: { catalog: "Catálogo", curriculum: "Plano de estudos", library: "Biblioteca", labs: "Laboratórios", student: "Área do estudante", verify: "Verificar registo interno", notice: "Transparência académica", menu: "Navegação", home: "Início", lowBandwidth: "BAIXA BANDA", languageSelector: "Seletor de idioma", brand: "Inteligência Digital e Tecnologia Cibernética" },
  en: { catalog: "Catalog", curriculum: "Study plan", library: "Library", labs: "Labs", student: "Student area", verify: "Verify internal record", notice: "Academic transparency", menu: "Navigation", home: "Home", lowBandwidth: "LOW BANDWIDTH", languageSelector: "Language selector", brand: "Digital Intelligence & Cyber Technology" },
};

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  return <div className="language-switch" aria-label={labels[locale].languageSelector}>{(["es", "pt", "en"] as Locale[]).map(item => <button key={item} onClick={() => setLocale(item)} aria-pressed={locale === item} className={locale === item ? "active" : ""}>{item.toUpperCase()}</button>)}</div>;
}

export function AcademicNotice() {
  const { locale } = useLanguage();
  return <aside className="academic-notice" aria-label={labels[locale].notice}><ShieldCheck size={16} /><span><strong>{labels[locale].notice}.</strong> {program.disclaimer[locale]}</span></aside>;
}

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const [lowBandwidth, setLowBandwidth] = useState(() => localStorage.getItem("dict-low-bandwidth") === "true");
  useEffect(() => { document.body.classList.toggle("low-bandwidth", lowBandwidth); localStorage.setItem("dict-low-bandwidth", String(lowBandwidth)); }, [lowBandwidth]);
  const [location] = useLocation();
  const text = labels[locale];
  const links = [{ href: "/catalog", label: text.catalog, icon: BookOpen }, { href: "/curriculum", label: text.curriculum, icon: Network }, { href: "/labs", label: text.labs, icon: ShieldCheck }, { href: "/library", label: text.library, icon: GraduationCap }];
  return <div className="site-shell">
    <header className="public-header">
      <Link href="/" className="brand" aria-label={`D.I.C.T. · ${text.home}`}><span className="brand-mark">D</span><span><b>D.I.C.T.</b><small>{text.brand}</small></span></Link>
      <nav aria-label={text.menu}>{links.map(link => <Link key={link.href} href={link.href} className={location === link.href ? "active" : ""}><link.icon size={15} />{link.label}</Link>)}</nav>
      <div className="header-actions"><button className={`bandwidth-switch ${lowBandwidth ? "active" : ""}`} onClick={() => setLowBandwidth(value => !value)} aria-label={text.lowBandwidth} aria-pressed={lowBandwidth}>{text.lowBandwidth}</button><LanguageSwitch /><Link href="/student" className="student-link">{text.student}</Link></div>
      <Menu className="mobile-menu" aria-hidden="true" />
    </header>
    <AcademicNotice />
    <main>{children}</main>
    <footer className="site-footer"><div><b>D.I.C.T.</b><span>{program.creditName[locale]} · 300 CA · {program.version}</span></div><p>{program.disclaimer[locale]} <Link href="/verify">{text.verify}</Link></p></footer>
  </div>;
}

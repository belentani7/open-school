import { InstitutionShell } from "@/components/InstitutionShell";
import { Button } from "@/components/ui/button";
import { STORY_SCENARIOS } from "@shared/content";
import { LANGUAGE_CATALOG, LEARNING_GOALS, type LearningGoalId } from "@shared/institution";
import { ArrowRight, BookOpen, BrainCircuit, BriefcaseBusiness, Code2, FlaskConical, Globe2, Landmark, Languages, Mic, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const icons: Record<LearningGoalId, LucideIcon> = { everyday: Languages, technology: Globe2, coding: Code2, "ai-literacy": BrainCircuit, "digital-citizenship": Landmark, "professional-pathways": BriefcaseBusiness };

export default function Home() {
  const [languageQuery, setLanguageQuery] = useState("");
  const visibleLanguages = useMemo(() => LANGUAGE_CATALOG.filter((language) => `${language.name} ${language.nativeName}`.toLocaleLowerCase().includes(languageQuery.toLocaleLowerCase())), [languageQuery]);
  return <InstitutionShell>
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow"><span /> Instituto digital internacional</p>
        <h1>Aprender también es <em>abrir una puerta.</em></h1>
        <p className="hero-lead">Maos Abertas + LinguaForge es una institución para comunicar, participar, crear, usar tecnología, comprender IA y hacer visible lo que ya sabes.</p>
        <div className="hero-actions"><Link href="/diagnostico"><Button className="primary-cta">Diseñar mi recorrido <ArrowRight size={17} /></Button></Link><Link href="/programas" className="text-cta">Explorar facultades <ArrowRight size={16} /></Link></div>
        <div className="hero-proof"><span><strong>6</strong> facultades conectadas</span><i /><span><strong>39</strong> idiomas de estudio</span><i /><span><strong>1</strong> recorrido propio</span></div>
      </div>
      <div className="hero-art" aria-label="Una red de aprendizaje conectada entre lenguas y tecnología">
        <div className="orb orb-one" /><div className="orb orb-two" /><div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="hero-card card-language"><span className="card-kicker">RUTA ACTIVA</span><strong>Español → Inglés</strong><div><span>A2</span><b /><em>38%</em></div></div>
        <div className="hero-card card-signal"><Sparkles size={17} /><span>Explica. Practica. Verifica.</span></div>
        <div className="hero-symbol">A<span>+</span></div>
      </div>
    </section>
    <section className="signal-band"><p><span>Una institución, seis facultades conectadas.</span> Empieza por una necesidad real y convierte cada sesión en una evidencia de aprendizaje.</p></section>
    <section className="section-wrap story-section"><div className="story-heading"><p className="eyebrow">Aprender empieza fuera de la pantalla</p><h2>Una decisión pequeña puede abrir un recorrido.</h2><p>La institución no inventa historias de éxito. Propone escenarios que te permiten reconocer una necesidad, practicar una acción y elegir cómo continuar.</p></div><div className="story-grid">{STORY_SCENARIOS.map((story, index) => <article className="story-card" key={story.id}><span>0{index + 1}</span><h3>{story.title}</h3><p>{story.context}</p><div><strong>Primer paso</strong><p>{story.decision}</p></div><Link className="text-cta" href={story.id === "show-your-work" ? "/empleo" : `/programas?ruta=${story.routeId}`}>{story.actionLabel} <ArrowRight size={16} /></Link><small>{story.disclosure}</small></article>)}</div></section>
    <section className="section-wrap programs-section">
      <div className="section-heading"><div><p className="eyebrow">Programas de aprendizaje</p><h2>Rutas diseñadas para lo que quieres hacer.</h2></div><Link href="/programas" className="text-cta">Ver metodología <ArrowRight size={16} /></Link></div>
      <div className="program-grid">{LEARNING_GOALS.map((goal, index) => { const Icon = icons[goal.id]; return <Link href={`/programas?ruta=${goal.id}`} className={`program-card ${goal.color}`} key={goal.id}><div className="program-number">0{index + 1}</div><div className="program-icon"><Icon size={23} /></div><h3>{goal.title}</h3><p>{goal.description}</p><span>Explorar ruta <ArrowRight size={16} /></span></Link>; })}</div>
    </section>
    <section className="section-wrap language-feature">
      <div className="language-feature-copy"><p className="eyebrow">Núcleo LinguaForge</p><h2>Elige el idioma que te acerca a tu próximo paso.</h2><p>Lenguas y comunicación es una facultad central de la institución. El catálogo mantiene idioma de apoyo e idioma de estudio separados para aprender con contexto y autonomía.</p><Link href="/idiomas"><Button variant="outline" className="soft-button">Ver perfiles de idiomas <ArrowRight size={16} /></Button></Link></div>
      <div className="language-browser"><div className="language-browser-head"><span><Globe2 size={17} /> 39 idiomas</span><input value={languageQuery} onChange={(event) => setLanguageQuery(event.target.value)} placeholder="Buscar idioma" aria-label="Buscar un idioma" /></div><div className="language-list">{visibleLanguages.slice(0, 9).map((language) => <Link key={language.code} href={`/idiomas?estudio=${language.code}`}><span className={language.direction === "rtl" ? "language-chip rtl" : "language-chip"}>{language.nativeName.slice(0, 2).toUpperCase()}</span><span><strong>{language.name}</strong><small>{language.nativeName}</small></span><ArrowRight size={15} /></Link>)}</div><Link href="/idiomas" className="language-browser-foot">Ver los 39 idiomas <ArrowRight size={15} /></Link></div>
    </section>
    <section className="section-wrap methodology-section"><div className="methodology-visual"><div className="method-step"><span>01</span><strong>Elige</strong><small>una necesidad y meta</small></div><div className="method-line" /><div className="method-step active"><span>02</span><strong>Practica</strong><small>en un contexto real</small></div><div className="method-line" /><div className="method-step"><span>03</span><strong>Comprueba</strong><small>tu siguiente paso</small></div></div><div className="methodology-copy"><p className="eyebrow">Metodología</p><h2>Una secuencia breve, visible y adaptada.</h2><p>El diagnóstico propone una entrada lingüística CEFR y una competencia complementaria. Las lecciones combinan objetivo, práctica y reflexión; el tutor acompaña sin reemplazar la revisión humana ni certificar niveles.</p><Link href="/diagnostico" className="text-cta">Empezar diagnóstico <ArrowRight size={16} /></Link></div></section>
    <section className="section-wrap home-labs-callout"><div><FlaskConical size={23} /><p className="eyebrow">Laboratorios abiertos</p><h2>Experimenta con herramientas que explican lo que hacen.</h2><p>Detecta señales de idioma localmente, estructura una petición para IA o inicia una sesión de foco. Los límites de cada experimento están a la vista.</p></div><Link href="/labs"><Button variant="outline" className="soft-button">Abrir laboratorios <ArrowRight size={16} /></Button></Link></section>
    <section className="section-wrap trust-grid"><article><BookOpen size={22} /><h3>Objetivos verificables</h3><p>Cada lección aclara qué puedes hacer al terminar y cómo demostrarlo.</p></article><article><Mic size={22} /><h3>Práctica oral voluntaria</h3><p>Graba, transcribe y contrasta tu respuesta con el objetivo de la actividad.</p></article><article><ShieldCheck size={22} /><h3>IA con límites claros</h3><p>Apoyo educativo contextual, con verificación y protección de datos como principios.</p></article></section>
  </InstitutionShell>;
}

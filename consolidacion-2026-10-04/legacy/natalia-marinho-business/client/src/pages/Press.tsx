import { useState } from "react";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Press() {
  const collaborationMutation = trpc.collaborations.request.useMutation();
  const [form, setForm] = useState({ name: "", email: "", organization: "", proposalType: "Colaboración B2B", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    collaborationMutation.mutate({ ...form, city: "Barcelona" }, { onSuccess: () => { setSubmitted(true); setForm({ name: "", email: "", organization: "", proposalType: "Colaboración B2B", message: "" }); }, onError: () => { setSubmitted(false); setError("No hemos podido registrar la propuesta. Revisa los datos e inténtalo de nuevo."); } });
  };
  return (
    <div className="press-page-shell">
      <header className="press-page-header"><a href="/" className="brand-mark"><span className="brand-monogram">NM</span><span>Natalia<br />Marinho</span></a><a href="/" className="press-back">Volver a la web oficial</a></header>
      <main>
        <section className="press-page-hero"><div className="section-label">Natty / Prensa & activismo</div><h1>Presencia con<br /><em>propósito público.</em></h1><p>Información oficial para medios, instituciones, iniciativas culturales y marcas que quieran construir una colaboración relevante desde Barcelona.</p><div className="press-location"><MapPin size={16} /> Barcelona · Recife · Internacional</div></section>
        <section className="press-page-grid"><div><div className="section-label">01 / Ángulos editoriales</div><h2>Conversaciones que merecen espacio.</h2></div><div className="press-angle-list"><div><strong>Representación</strong><span>Visibilidad, identidad y mujeres que ocupan espacios de decisión.</span></div><div><strong>Presencia</strong><span>Imagen, comunicación y autoridad sin abandonar la autenticidad.</span></div><div><strong>Barcelona</strong><span>Cultura, comunidad y nuevas voces que conectan territorios.</span></div><div><strong>Colaboración</strong><span>Proyectos con marcas e instituciones que quieran aportar valor real.</span></div></div></section>
        <section className="press-contact-panel"><div><div className="section-label">02 / Contacto oficial</div><h2>Hablemos de una propuesta con sentido.</h2><p>Para entrevistas, editoriales, galas, campañas, charlas o colaboraciones B2B, escribe al correo operativo de Natalia.</p></div><div className="press-contact-actions"><form className="collaboration-form" onSubmit={submit}><input aria-label="Nombre" placeholder="Tu nombre" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /><input aria-label="Email" type="email" placeholder="Tu email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required /><input aria-label="Organización" placeholder="Organización o proyecto" value={form.organization} onChange={event => setForm({ ...form, organization: event.target.value })} /><select aria-label="Tipo de propuesta" value={form.proposalType} onChange={event => setForm({ ...form, proposalType: event.target.value })}><option>Colaboración B2B</option><option>Entrevista o prensa</option><option>Editorial o campaña</option><option>Charla o activismo</option></select><textarea aria-label="Propuesta" placeholder="Cuéntanos la idea y el impacto que buscas crear" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} required minLength={10} /><button className="gold-button" type="submit" disabled={collaborationMutation.isPending}><Mail size={16} /> {collaborationMutation.isPending ? "Enviando…" : "Enviar propuesta"}</button>{submitted && <span className="form-success">Propuesta recibida. Natalia responderá desde nataliafalcon@icloud.com.</span>}{error && <span className="form-error" role="alert">{error}</span>}</form><a className="text-link" href="/blog">Leer el diario de activismo <ArrowRight size={16} /></a></div></section>
        <section className="press-dossier"><div><div className="section-label">03 / Dossier</div><h2>Material oficial en preparación.</h2><p>El dossier definitivo se publicará cuando Natalia confirme biografía, fotografías, logros y colaboraciones autorizadas. Hasta entonces, esta página funciona como punto oficial de contacto y no presenta datos no verificados.</p></div><div className="dossier-placeholder"><Download size={24} /><span>Dossier oficial<br />Próximamente</span></div></section>
      </main>
      <footer className="site-footer"><div className="footer-brand"><span className="brand-monogram">NM</span><p>Elegancia · Fuerza · Representación</p></div><div className="footer-links"><a href="mailto:nataliafalcon@icloud.com"><Mail size={15} /> Contacto oficial</a><a href="/metodo">Método de Presencia <ArrowRight size={15} /></a></div></footer>
    </div>
  );
}

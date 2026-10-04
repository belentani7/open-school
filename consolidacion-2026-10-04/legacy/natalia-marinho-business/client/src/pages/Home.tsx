import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Crown, Instagram, Mail, Menu, Play, ShoppingBag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AVAILABLE_BOOKING_TIMES } from "@shared/availability";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@shared/commerce/types";

const heroImage = "/manus-storage/natalia-1-web_6cb36a43.png";
const leadMagnetUrl = "/manus-storage/carta-de-presencia-es-pt_05928fc1.pdf";
const editorialImage = "/manus-storage/natalia-2-web_ba37b969.png";

type Language = "ES" | "PT";

const copy = {
  ES: {
    nav: ["Historia", "Experiencias", "Tienda", "Blog", "Prensa"],
    eyebrow: "Natty / Web oficial · Barcelona — Internacional",
    title: "La elegancia también es una forma de poder.",
    intro: "La casa oficial de Natty en Barcelona: presencia, activismo y oportunidades para mujeres que quieren construir una historia visible y propia.",
    explore: "Explorar la tienda",
    book: "Solicitar una experiencia",
    signature: "Elegancia · Fuerza · Representación",
    storyEyebrow: "La historia detrás de la corona",
    storyTitle: "De Recife a Barcelona, abriendo conversación.",
    story: "Natalia Marinho convierte su trayectoria en una invitación pública: ocupar espacio con gracia, defender la autenticidad y abrir conversaciones entre Barcelona, Brasil y el mundo.",
    read: "Conocer su historia",
    offerEyebrow: "La casa Natalia",
    offerTitle: "Herramientas para convertir presencia en legado.",
    offers: [
      ["01", "Imagen con intención", "Guías y experiencias digitales para refinar tu estilo, tu postura y tu lenguaje visual."],
      ["02", "Escenarios extraordinarios", "Apariciones, eventos y colaboraciones donde la presencia de Natalia eleva la conversación."],
      ["03", "Mentoría de representación", "Una mirada cercana para mujeres que quieren comunicar autoridad sin dejar de ser ellas mismas."],
    ],
    shopEyebrow: "Selección editorial",
    shopTitle: "Empieza por tu próxima versión.",
    shopIntro: "Experiencias digitales creadas para acompañarte cuando nadie más está mirando.",
    businessEyebrow: "El método de presencia",
    businessTitle: "No cambies quién eres. Eleva cómo te perciben.",
    businessIntro: "Una escalera de experiencias para pasar de la inspiración a una presencia preparada, coherente y visible.",
    businessOffers: [["La Firma Natalia", "39 €", "Tu primer ritual de imagen, postura y narrativa."], ["Círculo de Presencia", "249 €", "Cuatro semanas para construir una presencia que puedas sostener."], ["Presencia Privada", "690 €", "Un acompañamiento estratégico para tu próxima etapa de visibilidad."], ["Natalia en escena", "Desde 1.200 €", "Apariciones, charlas y colaboraciones para marcas y eventos." ]],
    apply: "Aplicar a una experiencia",
    buy: "Añadir al carrito",
    unavailable: "No disponible",
    servicesEyebrow: "Experiencias privadas",
    servicesTitle: "La presencia que imaginas, llevada a la realidad.",
    services: [
      ["Consultoría de imagen", "90 min · online", "Una sesión estratégica para alinear estilo, escenario y mensaje."],
      ["Apariciones & eventos", "A medida", "Presencia editorial para galas, marcas y conversaciones que importan."],
      ["Mentoría de representación", "Programa privado", "Acompañamiento para construir una identidad pública con propósito."],
    ],
    request: "Solicitar disponibilidad",
    leadEyebrow: "Carta privada",
    leadTitle: "Recibe el ritual de presencia.",
    leadText: "Una guía breve de Natalia para preparar tu próxima aparición con más intención, elegancia y calma.",
    placeholder: "Tu email",
    join: "Quiero recibirla",
    consent: "Al suscribirte aceptas recibir novedades y recursos de Natalia.",
    footer: "Una vida con intención. Una presencia que permanece.",
    formTitle: "Solicita tu experiencia",
    formText: "Cuéntanos qué quieres construir y el equipo de Natalia responderá con la propuesta adecuada.",
    name: "Nombre",
    email: "Email",
    message: "Cuéntanos brevemente tu proyecto",
    send: "Enviar solicitud",
    close: "Cerrar",
    cart: "Tu selección",
    emptyCart: "Tu selección está esperando una primera pieza.",
    checkout: "Continuar al pago",
  },
  PT: {
    nav: ["História", "Experiências", "Loja", "Blog", "Imprensa"],
    eyebrow: "Natty / Site oficial · Barcelona — Internacional",
    title: "A elegância também é uma forma de poder.",
    intro: "A casa oficial de Natty em Barcelona: presença, ativismo e oportunidades para mulheres que querem construir uma história visível e própria.",
    explore: "Explorar a loja",
    book: "Solicitar uma experiência",
    signature: "Elegância · Força · Representação",
    storyEyebrow: "A história por trás da coroa",
    storyTitle: "Do Recife a Barcelona, abrindo conversas.",
    story: "Natalia Marinho transforma sua trajetória em um convite público: ocupar espaço com graça, defender a autenticidade e abrir conversas entre Barcelona, Brasil e o mundo.",
    read: "Conhecer sua história",
    offerEyebrow: "A casa Natalia",
    offerTitle: "Ferramentas para transformar presença em legado.",
    offers: [
      ["01", "Imagem com intenção", "Guias e experiências digitais para refinar seu estilo, sua postura e sua linguagem visual."],
      ["02", "Cenários extraordinários", "Aparições, eventos e colaborações onde a presença de Natalia eleva a conversa."],
      ["03", "Mentoria de representação", "Um olhar próximo para mulheres que querem comunicar autoridade sem deixar de ser elas mesmas."],
    ],
    shopEyebrow: "Seleção editorial",
    shopTitle: "Comece pela sua próxima versão.",
    shopIntro: "Experiências digitais criadas para acompanhar você quando ninguém mais está olhando.",
    businessEyebrow: "O método de presença",
    businessTitle: "Não mude quem você é. Eleve como é percebida.",
    businessIntro: "Uma escada de experiências para passar da inspiração a uma presença preparada, coerente e visível.",
    businessOffers: [["A Assinatura Natalia", "39 €", "Seu primeiro ritual de imagem, postura e narrativa."], ["Círculo de Presença", "249 €", "Quatro semanas para construir uma presença que você consiga sustentar."], ["Presença Privada", "690 €", "Um acompanhamento estratégico para sua próxima etapa de visibilidade."], ["Natalia em cena", "A partir de 1.200 €", "Aparições, palestras e colaborações para marcas e eventos." ]],
    apply: "Aplicar para uma experiência",
    buy: "Adicionar ao carrinho",
    unavailable: "Indisponível",
    servicesEyebrow: "Experiências privadas",
    servicesTitle: "A presença que você imagina, levada à realidade.",
    services: [
      ["Consultoria de imagem", "90 min · online", "Uma sessão estratégica para alinhar estilo, cenário e mensagem."],
      ["Aparições & eventos", "Sob medida", "Presença editorial para galas, marcas e conversas que importam."],
      ["Mentoria de representação", "Programa privado", "Acompanhamento para construir uma identidade pública com propósito."],
    ],
    request: "Solicitar disponibilidade",
    leadEyebrow: "Carta privada",
    leadTitle: "Receba o ritual de presença.",
    leadText: "Um guia breve de Natalia para preparar sua próxima aparição com mais intenção, elegância e calma.",
    placeholder: "Seu email",
    join: "Quero receber",
    consent: "Ao se inscrever, você aceita receber novidades e recursos de Natalia.",
    footer: "Uma vida com intenção. Uma presença que permanece.",
    formTitle: "Solicite sua experiência",
    formText: "Conte-nos o que deseja construir e a equipe de Natalia responderá com a proposta adequada.",
    name: "Nome",
    email: "Email",
    message: "Conte brevemente seu projeto",
    send: "Enviar solicitação",
    close: "Fechar",
    cart: "Sua seleção",
    emptyCart: "Sua seleção espera por uma primeira peça.",
    checkout: "Continuar para o pagamento",
  },
};

function money(product: Product) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: product.priceRange.min.currencyCode }).format(Number(product.priceRange.min.amount));
}

function ProductCard({ product, t }: { product: Product; t: typeof copy.ES }) {
  const { addItem, loading } = useCart();
  const variant = product.variants[0];
  return (
    <article className="product-card group">
      <div className="product-image-wrap">
        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].altText ?? product.title} className="product-image" loading="lazy" decoding="async" /> : <div className="product-image-fallback"><Crown size={34} /></div>}
        <div className="product-overlay"><Button onClick={() => addItem(variant.id)} disabled={!variant?.availableForSale || loading} className="gold-button">{variant?.availableForSale ? t.buy : t.unavailable}<ArrowRight size={16} /></Button></div>
      </div>
      <div className="product-copy"><div className="product-kicker">{product.productType}</div><h3>{product.title}</h3><p>{product.description}</p><span className="price">{money(product)}</span></div>
    </article>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ES");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadDelivered, setLeadDelivered] = useState(false);
  const [booking, setBooking] = useState({ name: "", email: "", message: "" });
  const [selectedService, setSelectedService] = useState("Consultoría de imagen");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [cartOpen, setCartOpen] = useState(false);
  const t = copy[language];
  const { data: products = [], isLoading } = trpc.commerce.products.list.useQuery({ first: 6 });
  const leadMutation = trpc.leads.subscribe.useMutation();
  const bookingMutation = trpc.bookings.request.useMutation();
  const { data: bookedTimes = [] } = trpc.bookings.availability.useQuery({ date: preferredDate }, { enabled: Boolean(preferredDate) });
  const availableTimes: string[] = AVAILABLE_BOOKING_TIMES.filter(time => !bookedTimes.includes(time));
  const { cart, itemCount, updateQuantity, removeItem, proceedToCheckout } = useCart();
  const visibleProducts = useMemo(() => products.slice(0, 4), [products]);

  const submitLead = (event: React.FormEvent) => {
    event.preventDefault();
    if (!leadEmail.includes("@")) return toast.error(language === "ES" ? "Introduce un email válido." : "Insira um email válido.");
    leadMutation.mutate({ email: leadEmail, language, source: "carta-privada" }, { onSuccess: () => { toast.success(language === "ES" ? "Tu carta privada está en camino." : "Sua carta privada está a caminho."); window.open(leadMagnetUrl, "_blank", "noopener,noreferrer"); setLeadDelivered(true); setLeadEmail(""); }, onError: () => toast.error(language === "ES" ? "No hemos podido registrar tu suscripción." : "Não foi possível registrar sua inscrição.") });
  };

  const submitBooking = (event: React.FormEvent) => {
    event.preventDefault();
    bookingMutation.mutate({ ...booking, service: selectedService, preferredDate: preferredDate || undefined, preferredTime }, { onSuccess: () => { toast.success(language === "ES" ? "Solicitud recibida. Te contactaremos pronto." : "Solicitação recebida. Entraremos em contato em breve."); setBookingOpen(false); setBooking({ name: "", email: "", message: "" }); }, onError: () => toast.error(language === "ES" ? "No hemos podido enviar tu solicitud." : "Não foi possível enviar sua solicitação.") });
  };

  return (
    <div className="site-shell">
      <header className="site-header"><a href="#top" className="brand-mark"><span className="brand-monogram">NM</span><span>Natalia<br />Marinho</span></a><nav className={menuOpen ? "main-nav open" : "main-nav"}>{t.nav.map((item, index) => <a key={item} href={["#historia", "#experiencias", "#tienda", "/blog", "/prensa"][index]} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><div className="header-actions"><div className="language-switch"><button className={language === "ES" ? "active" : ""} onClick={() => setLanguage("ES")}>ES</button><span>/</span><button className={language === "PT" ? "active" : ""} onClick={() => setLanguage("PT")}>PT</button></div><button className="icon-button" onClick={() => setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={19} /><span className="cart-count">{itemCount}</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>

      <main id="top">
        <section className="hero-section"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</p><h1>{t.title}</h1><p className="hero-intro">{t.intro}</p><div className="hero-actions"><a href="#tienda" className="gold-button">{t.explore}<ArrowRight size={16} /></a><button className="text-link" onClick={() => setBookingOpen(true)}>{t.book}<span>↗</span></button></div><p className="signature">{t.signature}</p></div><div className="hero-visual"><div className="hero-frame"><img src={heroImage} alt="Natalia Marinho en retrato editorial" fetchPriority="high" decoding="async" /></div><div className="hero-stamp"><Crown size={17} /><span>NM<br />2025</span></div><p className="vertical-caption">A PRESENCE THAT REMAINS</p></div></section>

        <section id="historia" className="story-section section-padding"><div className="section-label">01 / {t.storyEyebrow}</div><div className="story-grid"><div className="story-photo"><img src={editorialImage} alt="Natalia Marinho en una composición de alta moda" loading="lazy" decoding="async" /></div><div className="story-copy"><p className="gold-kicker">{t.storyEyebrow}</p><h2>{t.storyTitle}</h2><p>{t.story}</p><a className="text-link" href="/prensa">{t.read}<ArrowRight size={16} /></a><div className="story-facts"><div><strong>Recife</strong><span>Origen</span></div><div><strong>España</strong><span>Hogar</span></div><div><strong>2025</strong><span>Coronación</span></div></div></div></div></section>

        <section id="experiencias" className="offer-section section-padding"><div className="offer-intro"><div className="section-label">02 / {t.offerEyebrow}</div><h2>{t.offerTitle}</h2></div><div className="offer-list">{t.offers.map(([num, title, text]) => <div className="offer-row" key={num}><span className="offer-number">{num}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="offer-arrow" size={22} /></div>)}</div></section>

        <section id="tienda" className="shop-section section-padding"><div className="section-heading"><div><div className="section-label">03 / {t.shopEyebrow}</div><h2>{t.shopTitle}</h2></div><p>{t.shopIntro}</p></div>{isLoading ? <div className="shop-loading"><Sparkles size={20} /> Cargando la selección...</div> : <div className="product-grid">{visibleProducts.map(product => <ProductCard key={product.id} product={product} t={t} />)}</div>}</section>

        <section className="business-section section-padding"><div className="section-label">04 / {t.businessEyebrow}</div><div className="business-header"><div><h2>{t.businessTitle}</h2><p>{t.businessIntro}</p></div><button className="text-link" onClick={() => setBookingOpen(true)}>{t.apply}<ArrowRight size={16} /></button></div><div className="business-grid">{t.businessOffers.map(([title, price, text], index) => <div className={index === 2 ? "business-card featured" : "business-card"} key={title}><span className="business-index">0{index + 1}</span><h3>{title}</h3><strong>{price}</strong><p>{text}</p><button className="round-arrow" onClick={() => setBookingOpen(true)}><ArrowRight size={17} /></button></div>)}</div></section>\n\n        <section className="private-section section-padding"><div className="private-panel"><div><div className="section-label">04 / {t.servicesEyebrow}</div><h2>{t.servicesTitle}</h2></div><div className="service-list">{t.services.map(([title, meta, text]) => <div className="service-row" key={title}><div className="service-icon"><CalendarDays size={20} /></div><div><h3>{title}</h3><span>{meta}</span><p>{text}</p></div><button className="round-arrow" onClick={() => setBookingOpen(true)}><ArrowRight size={18} /></button></div>)}</div><button className="gold-button" onClick={() => setBookingOpen(true)}>{t.request}<ArrowRight size={16} /></button></div></section>

        <section id="prensa" className="press-section section-padding"><div className="section-label">05 / Prensa & colaboraciones</div><div className="press-grid"><div><h2>Una voz que abre conversaciones.</h2><p>Disponible para editoriales, entrevistas, galas y colaboraciones con marcas que creen en una representación más amplia y más elegante.</p></div><div className="press-links"><a href="mailto:nataliafalcon@icloud.com">Solicitar dossier de prensa <ArrowRight size={16} /></a><a href="mailto:nataliafalcon@icloud.com">Proponer una colaboración <ArrowRight size={16} /></a><span>Recife · España · Internacional</span></div></div><div className="editorial-gallery"><div><img src={heroImage} alt="Retrato editorial de Natalia con corona" loading="lazy" decoding="async" /></div><div><img src={editorialImage} alt="Natalia en vestido verde de alta moda" loading="lazy" decoding="async" /></div><div className="gallery-caption"><Crown size={16} /><span>Archivo editorial<br />Natalia Marinho</span></div></div></section>\n\n      <section id="carta" className="lead-section section-padding"><div className="lead-art"><div className="lead-ring"><Crown size={35} /></div></div><div className="lead-copy"><div className="section-label">05 / {t.leadEyebrow}</div><h2>{t.leadTitle}</h2><p>{t.leadText}</p><form onSubmit={submitLead}><div className="lead-input"><Mail size={17} /><Input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} type="email" placeholder={t.placeholder} required /><button type="submit" aria-label={t.join}><ArrowRight size={18} /></button></div><small>{t.consent}</small></form>{leadDelivered && <a className="lead-download" href={leadMagnetUrl} target="_blank" rel="noreferrer"><Check size={14} /> {language === "ES" ? "Descargar ahora la Carta de Presencia" : "Baixar agora a Carta de Presença"}</a>}</div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-monogram">NM</span><p>{t.footer}</p></div><div className="footer-links"><a href="mailto:nataliafalcon@icloud.com"><Mail size={15} /> Email</a><a href="https://www.instagram.com/nati_natalia_marinho_/" target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><a href="#top">Back to top <ChevronDown size={15} className="rotate-180" /></a></div><div className="footer-bottom"><span>© 2026 Natalia Marinho</span><span>Miss T Supranational 2025</span></div></footer>

      {bookingOpen && <div className="modal-backdrop" onClick={() => setBookingOpen(false)}><div className="booking-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label={t.close}><X size={20} /></button><div className="section-label">{t.servicesEyebrow}</div><h2>{t.formTitle}</h2><p>{t.formText}</p><div className="service-picker">{t.services.map(([title]) => <button type="button" className={selectedService === title ? "selected" : ""} onClick={() => setSelectedService(title)} key={title}>{title}<Check size={14} /></button>)}</div><div className="booking-slots"><label>Fecha preferida<Input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} /></label><label>Hora preferida<select value={availableTimes.includes(preferredTime) ? preferredTime : (availableTimes[0] ?? "")} onChange={e => setPreferredTime(e.target.value)} disabled={availableTimes.length === 0}>{availableTimes.length ? availableTimes.map(time => <option key={time}>{time}</option>) : <option>No disponible</option>}</select></label></div><form onSubmit={submitBooking}><Input placeholder={t.name} value={booking.name} onChange={e => setBooking({ ...booking, name: e.target.value })} required /><Input type="email" placeholder={t.email} value={booking.email} onChange={e => setBooking({ ...booking, email: e.target.value })} required /><Textarea placeholder={t.message} value={booking.message} onChange={e => setBooking({ ...booking, message: e.target.value })} /><Button type="submit" className="gold-button">{t.send}<ArrowRight size={16} /></Button></form><div className="modal-note"><Clock3 size={15} /> Respondemos en 48 horas hábiles.</div></div></div>}
      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="cart-head"><div><div className="section-label">Natalia Marinho</div><h2>{t.cart}</h2></div><button className="modal-close" onClick={() => setCartOpen(false)}><X size={20} /></button></div>{!cart?.items.length ? <div className="cart-empty"><ShoppingBag size={30} /><p>{t.emptyCart}</p></div> : <><div className="cart-items">{cart.items.map(item => <div className="cart-item" key={item.lineId}><div><strong>{item.productTitle}</strong><span>{item.unitPrice.amount} {item.unitPrice.currencyCode}</span></div><div className="cart-item-actions"><button onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button><button onClick={() => removeItem(item.lineId)}><X size={14} /></button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>{cart.total.amount} {cart.total.currencyCode}</strong></div><button className="gold-button checkout-button" onClick={proceedToCheckout}>{t.checkout}<ArrowRight size={16} /></button></>}</aside></div>}
    </div>
  );
}

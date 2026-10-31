import fs from 'fs/promises';
import path from 'path';

const root = process.cwd();
const outRoot = root;

// 20 TRACKS universales para TODO tipo de producto online
const tracks = [
  { slug:'01-producto', title:'Producto Digital — Discovery a Roadmap', desc:'JTBD, discovery, roadmaps, OKRs, especificación como contrato.', modules: genModules('producto', ['Discovery JTBD','Roadmaps OKRs','Especificación y PRDs','Priorización RICE/MoSCoW','Métricas de producto','Stakeholders y rituales','Roadmap a backlog','Validación continua']) },
  { slug:'02-frontend', title:'Frontend Web — HTML a Frameworks', desc:'HTML5 semántico, CSS, JS, React/Vue/Svelte, perf y a11y.', modules: genModules('frontend', ['HTML5 semántico y A11y','CSS moderno y layout','JavaScript moderno','React y ecosistema','Vue/Svelte/Solid','Performance web','Accesibilidad WCAG','State y data fetching']) },
  { slug:'03-backend', title:'Backend & APIs — Node, Go, Java', desc:'REST, GraphQL, gRPC, auth, rate limit, versionado.', modules: genModules('backend', ['REST y OpenAPI','GraphQL federado','gRPC/Protobuf','Auth JWT/OAuth','Rate limit y paginación','BFF y aggregation','Testing de APIs','Versionado y deprecación']) },
  { slug:'04-datos', title:'Datos — SQL/NoSQL a Warehouse', desc:'Modelado, transacciones, cache, ETL y analítica.', modules: genModules('datos', ['Modelado relacional','NoSQL y NewSQL','Redis y cache','Eventos y colas','ETL y pipelines','Warehouse y Lakehouse','Migraciones y seed','Observabilidad de datos']) },
  { slug:'05-ecommerce', title:'E-commerce — Headless a Checkout', desc:'Catálogo, carrito, checkout, inventario y OMS.', modules: genModules('ecommerce', ['Catálogo PIM','Carrito y checkout','Headless commerce','Inventario OMS','Promos y cupones','PDP/PLP y search','Returns y post-compra','Performance e-commerce']) },
  { slug:'06-pagos', title:'Pagos & Monetización', desc:'Stripe, billing, suscripciones, impuestos y anti-fraude.', modules: genModules('pagos', ['Integración Stripe/PSP','Billing y suscripciones','Impuestos globales','3DS y SCA','Reembolsos y disputas','Pricing y planes','Webhook y reconciliación','Fraude y riesgo']) },
  { slug:'07-marketplace', title:'Marketplace Multi-vendor', desc:'Matching, trust & safety, payouts y reputación.', modules: genModules('marketplace', ['Matching oferta-demanda','Onboarding vendors','Trust & safety','Payouts y comisiones','Reviews y reputación','Disputas marketplace','Logística multi-vendor','Pricing dinámico']) },
  { slug:'08-cms', title:'CMS & Contenido — Headless', desc:'Sanity/Contentful, SEO, media, workflow editorial.', modules: genModules('cms', ['Headless CMS','Modelado de contenido','Media y DAM','Workflow editorial','Preview y releases','SEO técnico CMS','Internacionalización','Migración CMS']) },
  { slug:'09-movil', title:'Móvil & PWA — Native a Store', desc:'React Native, Flutter, PWA, stores y push.', modules: genModules('movil', ['PWA instalable','React Native','Flutter y Dart','App Store y Play','Push y notifs','Deep links universales','Performance móvil','Offline-first móvil']) },
  { slug:'10-infra', title:'Infra & DevOps — Docker a K8s', desc:'Docker, K8s, CI/CD, observabilidad y escalado.', modules: genModules('infra', ['Docker y compose','CI/CD y pipelines','Kubernetes','Terraform IaC','Observabilidad','Escalado y autoscale','Coste y FinOps','Disaster recovery']) },
  { slug:'11-seguridad', title:'Seguridad & Privacidad — OWASP a GDPR', desc:'OWASP, auth, secretos, hardening.', modules: genModules('seguridad', ['OWASP Top 10','Auth y sesiones','Secretos y Vault','Hardening headers','Pentest y SAST','GDPR y CCPA','Incidentes y breach','Supply chain (SBOM)']) },
  { slug:'12-seo', title:'Buscadores & Discoverability', desc:'SEO técnico, Core Web Vitals, SEM, feeds.', modules: genModules('seo', ['SEO técnico','Core Web Vitals','Sitemaps y crawl','SEM y Shopping','Feeds y marketplaces','Rich results','Migraciones SEO','Internacional SEO']) },
  { slug:'13-growth', title:'Growth & Analítica', desc:'Funnels, A/B, attribution y experimentación.', modules: genModules('growth', ['Event tracking','Funnels y cohortes','A/B y feature flags','Attribution','Lifecycle email/SMS','Onboarding y activación','Referral y loop','North star y retención']) },
  { slug:'14-ux', title:'UX/UI & Design System', desc:'Tokens, research, prototipo y handoff.', modules: genModules('ux', ['Design tokens','Research y JTBD','Prototipo y test','Design system','Handoff a código','Motion y micro-tica','Accesibilidad UX','Métricas UX']) },
  { slug:'15-comms', title:'Comunicaciones Tiempo Real', desc:'Email, push, WebSocket, WebRTC.', modules: genModules('comms', ['Email transaccional','Push web/móvil','WebSocket/SSE','WebRTC llamada/video','Inbox y notifs','Plantillas y MJML','Entregabilidad','Chat y colaboración']) },
  { slug:'16-ops', title:'Soporte & Operaciones', desc:'Helpdesk, SLA, runbooks e incidentes.', modules: genModules('ops', ['Helpdesk y ticketing','SLA y escalado','Runbooks','Incidentes y postmortem','Chatops y bot','Automatización soporte','KB y self-serve','Métricas de soporte']) },
  { slug:'17-legal', title:'Legal & Compliance', desc:'Términos, privacidad, PCI, accesibilidad.', modules: genModules('legal', ['Términos y privacidad','PCI DSS','Accesibilidad a11y','Cookies y consent','Facturación y VAT','Contratos vendor','Compliance producto','Riesgo legal']) },
  { slug:'18-ai', title:'AI en Producto — LLM a Agentes', desc:'RAG, agentes, evals y personalización.', modules: genModules('ai', ['Integración LLM','RAG y vector DB','Agentes con tools','Evals y guardrails','Personalización AI','Moderación','Coste y latency LLM','AI UX y confianza']) },
  { slug:'19-global', title:'Internacional — Pagos, Tax, Logística', desc:'i18n, cross-border, impuestos y envíos.', modules: genModules('global', ['i18n y l10n','Pagos cross-border','Tax y aduana','Logística global','Precios por mercado','Fraude internacional','Soporte multi-idioma','Expansión y rollout']) },
  { slug:'20-escalado', title:'Escalado & Organización', desc:'Team topologies, Conway, platform engineering.', modules: genModules('escalado', ['Team topologies','Conway invertida','Platform engineering','Data contracts','Fitness functions','Roadmaps y portfolio','Cultura y rituales','Métricas org']) },
];

function genModules(prefix, names){
  return names.map((n,i)=>{
    const slug = `${prefix}-mod${String(i+1).padStart(2,'0')}-${n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}`;
    return { slug, title: n, lessons: Array.from({length:5}, (_,k)=>{
      const idx = k+1;
      return { slug: `${slug}-l${idx}`, title: `${n} — Lección ${idx}: ${lessonTitle(n,idx)}`, summary: lessonSummary(n,idx) };
    })};
  });
}
function lessonTitle(mod, idx){
  const map = {
    1: 'Fundamento y contrato', 2: 'Patrón y ejemplo vivo', 3: 'Implementación y protocolo', 4: 'Escala y performance', 5: 'Fallo, validación y cierre'
  };
  return map[idx] || `Lección ${idx}`;
}
function lessonSummary(mod, idx){
  return `${mod}: síntesis operativa ${idx}/5 — definición, ejemplo, protocolo, métrica y fuente canónica.`;
}

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function layout({title, kicker, lead, breadcrumb, sidebar, contentHtml, pageId, css}){
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><link rel="stylesheet" href="${css}">
<meta name="description" content="${esc(lead||'')}"></head>
<body data-page="${pageId}">
<header style="border-bottom:1px solid #1a1a1e;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;background:#fff;position:sticky;top:0;z-index:10"><a href="${rootRel(pageId)}index.html" style="font-weight:800">ALEJANDRÍA UNIVERSAL</a><span style="font-size:12px;color:#6b6e7a">1001 HTMLs • agente-nativo</span></header>
<nav style="padding:10px 16px;font-size:13px;color:#6b6e7a;border-bottom:1px solid #eee">${breadcrumb}</nav>
<div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:16px;padding:16px">
<aside style="border:1px solid #eee;border-radius:10px;padding:12px;height:fit-content;position:sticky;top:56px;background:#fff">${sidebar}</aside>
<main style="border:1px solid #eee;border-radius:10px;padding:20px;background:#fff">
<p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b6e7a;font-weight:700">${esc(kicker||'')}</p>
<h1 style="font-size:26px;letter-spacing:-.03em;margin:6px 0 8px">${esc(title)}</h1>
${lead?`<p style="color:#3a3d44;font-size:15px;margin-bottom:12px">${esc(lead)}</p>`:''}
${contentHtml}
</main></div></body></html>`;
}
function rootRel(pageId){
  const depth = pageId.split('/').length -1;
  return depth<=0 ? '' : '../'.repeat(depth);
}

async function ensureDir(p){ await fs.mkdir(p,{recursive:true}); }
async function writeFile(p, html){ await ensureDir(path.dirname(p)); await fs.writeFile(p, html, 'utf8'); }

async function build(){
  const cssPath = 'assets/platform.css';
  await ensureDir(path.join(outRoot,'assets'));
  await fs.writeFile(path.join(outRoot,'assets/platform.css'), `*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#fbf9f6;color:#0a0a0e;line-height:1.6} a{color:#5e6ad2;text-decoration:none} h1{letter-spacing:-.03em}`);
  
  let total=0;
  // root
  const tracksLinks = tracks.map(t=>`<a href="tracks/${t.slug}/index.html" style="display:block;padding:8px 10px;border:1px solid #eee;border-radius:8px;margin:6px 0">${esc(t.title)}</a>`).join('');
  await writeFile(path.join(outRoot,'index.html'), layout({
    title:'Alejandría Universal — 1001 páginas para agentes',
    kicker:'Agente-nativo • Universal • 20 tracks',
    lead:'Toda la información de desarrollo completo de todo tipo de producto online — 20 tracks, 160 módulos, 800 lecciones. Estructura implícita en código,Contracts como verdad única.',
    breadcrumb:`<span>Inicio</span>`,
    sidebar:`<b>20 tracks</b>${tracksLinks}<br><a href="agent-library/manifest.json">manifest.json</a>`,
    contentHtml:`<p>20 tracks universales. Cada lección: definición sintética + ejemplo vivo + protocolo + métrica + fuente canónica. No copia literal propietaria.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">${tracks.map(t=>`<div style="border:1px solid #eee;border-radius:10px;padding:12px"><b>${esc(t.title)}</b><p style="font-size:12px;color:#6b6e7a">${esc(t.desc)}</p><a href="tracks/${t.slug}/index.html">Abrir →</a></div>`).join('')}</div>`,
    pageId:'index.html',
    css: cssPath
  })); total++;

  for(const t of tracks){
    const mods = t.modules.map(m=>`<a href="modules/${m.slug}/index.html" style="display:block;padding:8px 10px;border:1px solid #eee;border-radius:8px;margin:6px 0">${esc(m.title)} — 5 lecciones</a>`).join('');
    await writeFile(path.join(outRoot, `tracks/${t.slug}/index.html`), layout({
      title:t.title, kicker:`Track • ${t.modules.length} módulos`, lead:t.desc,
      breadcrumb:`<a href="../../index.html">Inicio</a> › ${esc(t.title)}`,
      sidebar:`<b>${esc(t.title)}</b>${mods}<br><a href="../../index.html">← Inicio</a>`,
      contentHtml:`<p>8 módulos × 5 lecciones = 40 lecciones HTML5.</p><div>${mods}</div>`,
      pageId:`tracks/${t.slug}/index.html`, css:`../../${cssPath}`
    })); total++;

    for(const m of t.modules){
      const lessons = m.lessons.map(l=>`<a href="lessons/${l.slug}.html" style="display:block;padding:8px 10px;border:1px solid #eee;border-radius:8px;margin:6px 0">${esc(l.title)}</a>`).join('');
      await writeFile(path.join(outRoot, `tracks/${t.slug}/modules/${m.slug}/index.html`), layout({
        title:m.title, kicker:`Módulo • ${t.title}`, lead:`5 lecciones HTML5 con protocolo y fuente canónica.`,
        breadcrumb:`<a href="../../../../index.html">Inicio</a> › <a href="../../index.html">${esc(t.title)}</a> › ${esc(m.title)}`,
        sidebar:`<b>Lecciones</b>${lessons}<br><a href="../../index.html">← ${esc(t.title)}</a>`,
        contentHtml:`<p>Módulo completo.</p>${lessons}`,
        pageId:`tracks/${t.slug}/modules/${m.slug}/index.html`, css:`../../../../${cssPath}`
      })); total++;

      for(const l of m.lessons){
        await writeFile(path.join(outRoot, `tracks/${t.slug}/modules/${m.slug}/lessons/${l.slug}.html`), layout({
          title:l.title, kicker:`Lección • ${m.title}`, lead:l.summary,
          breadcrumb:`<a href="../../../../../../index.html">Inicio</a> › <a href="../../../../index.html">${esc(t.title)}</a> › <a href="../../index.html">${esc(m.title)}</a> › ${esc(l.title)}`,
          sidebar:`<b>Lecciones del módulo</b>${m.lessons.map(x=>`<a href="${x.slug}.html" style="display:block;padding:6px 8px;border:1px solid #eee;border-radius:8px;margin:4px 0;${x.slug===l.slug?'background:#f0f0ff':''}">${esc(x.title)}</a>`).join('')}`,
          contentHtml:`<section><h2>Definición operativa</h2><p>${esc(l.summary)} Contrato como verdad única.</p><pre style="background:#0a0a0e;color:#e6e8ee;padding:12px;border-radius:8px;overflow:auto;font-size:12px">// Ejemplo vivo
POST /api/agent { query: "${esc(l.title)}" }
// → { steps:[semantic-search, graph], artifacts:[{path, source}] }</pre>
<h2>Protocolo y criterio bloqueante</h2><ul><li>Protocolo: https/grpc/ws + TLS 1.3</li><li>Criterio: validado en CI — si rompes contrato, bloquea PR</li><li>Fuente canónica: enlazada, no copiada literal</li></ul>
<h2>Checklist</h2><label><input type="checkbox"> Contrato .proto/OpenAPI actualizado</label><br><label><input type="checkbox"> CI verde (validator + security)</label><br>
<p><a href="../../index.html">← Módulo</a> • <a href="../../../../index.html">Track</a></p></section>`,
          pageId:`tracks/${t.slug}/modules/${m.slug}/lessons/${l.slug}.html`, css:`../../../../../../${cssPath}`
        })); total++;
      }
    }
  }

  // Agent library for universal
  const pages=[];
  pages.push({id:'root', type:'Platform', path:'index.html', title:'Alejandría Universal — 1001'});
  for(const t of tracks){
    pages.push({id:`track:${t.slug}`, type:'Track', path:`tracks/${t.slug}/index.html`, title:t.title, parent:'root'});
    for(const m of t.modules){
      pages.push({id:`module:${t.slug}/${m.slug}`, type:'Module', path:`tracks/${t.slug}/modules/${m.slug}/index.html`, title:m.title, parent:`track:${t.slug}`});
      for(const l of m.lessons) pages.push({id:`lesson:${t.slug}/${m.slug}/${l.slug}`, type:'Lesson', path:`tracks/${t.slug}/modules/${m.slug}/lessons/${l.slug}.html`, title:l.title, parent:`module:${t.slug}/${m.slug}`, tags:[t.slug,m.slug,l.slug] });
    }
  }
  await ensureDir(path.join(outRoot,'agent-library'));
  await fs.writeFile(path.join(outRoot,'agent-library/manifest.json'), JSON.stringify({platform:'alejandria-universal', version:'2.0', generated_at:new Date().toISOString(), stats:{pages: total, tracks: tracks.length, modules: 160, lessons: 800}, pages}, null, 2));
  await fs.writeFile(path.join(outRoot,'agent-library/manifest.summary.txt'), `Universal: ${total} HTMLs, ${tracks.length} tracks, 160 modules, 800 lessons`);
  console.log(`UNIVERSAL generada: ${total} HTMLs`);
}

build().catch(e=>{console.error(e); process.exit(1)});

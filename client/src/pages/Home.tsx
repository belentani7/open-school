// Open School — Landing Page (Home)
// Neo-Neoglass styled landing page
import { Link } from 'wouter';
import { useEffect, useState } from 'react';

export function Home() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  
  useEffect(() => {
    // Animate counters on mount
    let frame = 0;
    const dur = 1500;
    const tick = () => {
      const t = Math.min(frame / dur * 1000, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setCount1(Math.round(10000 * e));
      setCount2(Math.round(850 * e));
      if (frame < dur + 1000) requestAnimationFrame(() => frame++);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="ncl-glass inline-block px-8 py-4 mb-8">
          <span className="text-xs font-mono tracking-[0.2em] text-nclr-red-dim">
            ◆ INSTITUTO UNIVERSAL GRATUITO PARA JÓVENES
          </span>
        </div>
        <h1 className="ncl-heading-1 mb-4">OPEN SCHOOL</h1>
        <p className="ncl-text-body max-w-xl mx-auto mb-2">
          Aprende sin límites. Cursos modulares, certificaciones verificables, IA educativa local.
        </p>
        <p className="ncl-text-muted text-sm">Multilingual · WCAG 2.1+ · Offline-first PWA · Ollama-powered AI</p>
        
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/dashboard">
            <button className="ncl-btn ncl-btn--primary">
              ACCEDER AL CAMPUS →
            </button>
          </Link>
          <a href="#courses">
            <button className="ncl-btn ncl-btn--glass">
              EXPLORAR CURSOS
            </button>
          </a>
        </div>
      </section>

      {/* Telemetry Counters */}
      <section className="py-12 px-6">
        <div className="ncl-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="ncl-glass p-6 text-center ncl-anim-beat">
              <div className="text-3xl font-mono font-bold text-nclr-red" style={{textShadow: '0 0 12px rgba(255,7,58,0.5)'}}>
                {count1.toLocaleString()}
              </div>
              <div className="text-xs text-nclr-muted tracking-[0.15em] mt-1">RECURSOS DISPONIBLES</div>
            </div>
            <div className="ncl-glass p-6 text-center">
              <div className="text-3xl font-mono font-bold text-nclr-red" style={{textShadow: '0 0 12px rgba(255,7,58,0.5)'}}>
                {count2.toLocaleString()}
              </div>
              <div className="text-xs text-nclr-muted tracking-[0.15em] mt-1">ESTUDIANTES ACTIVOS</div>
            </div>
            <div className="ncl-glass p-6 text-center">
              <div className="text-3xl font-mono font-bold text-white">11</div>
              <div className="text-xs text-nclr-muted tracking-[0.15em] mt-1">ROLES RBAC</div>
            </div>
            <div className="ncl-glass p-6 text-center">
              <div className="text-3xl font-mono font-bold text-white">4</div>
              <div className="text-xs text-nclr-muted tracking-[0.15em] mt-1">IDIOMAS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="py-16 px-6">
        <div className="ncl-container">
          <div className="ncl-section-title">◆ CURSOS PRINCIPALES</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCards.map((card, i) => (
              <Link key={i} href={`/courses/${card.id}`} className="block">
                <div className="ncl-glass p-6 h-full hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{card.icon}</span>
                    <span className="ncl-tag">{card.level}</span>
                  </div>
                  <h3 className="ncl-heading-3 mb-2">{card.title}</h3>
                  <p className="ncl-text-muted text-sm leading-relaxed">{card.desc}</p>
                  <div className="mt-4 flex gap-2">
                    {card.tags.slice(0,3).map(t => <span key={t} className="ncl-chip">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="ncl-glass max-w-2xl mx-auto p-10 ncl-anim-float">
          <div className="ncl-section-title">¿LISTO PARA EMPEZAR?</div>
          <p className="ncl-text-body mb-6">Plataforma gratuita, abierta y accesible. Sin barreras. Sin costos.</p>
          <button className="ncl-btn ncl-btn--primary ncl-btn--lg">
            CREAR CUENTA GRATIS →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-nclr-border/30">
        <div className="ncl-container flex flex-col md:flex-row items-center justify-between text-nclr-muted text-xs gap-4">
          <span>NOIACORE LAB · 2026 · INSTITUTO UNIVERSAL GRATUITO</span>
          <div className="flex gap-6">
            <span className="hover:text-nclr-red cursor-pointer transition-colors">DOC</span>
            <span className="hover:text-nclr-red cursor-pointer transition-colors">API</span>
            <span className="hover:text-nclr-red cursor-pointer transition-colors">GITHUB</span>
            <span className="hover:text-nclr-red cursor-pointer transition-colors">CONTACTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const courseCards = [
  { id: 1, icon: '🌐', title: 'Lingua Aberta', level: 'A1-B2', desc: 'Aprende idiomas con IA educativa local. Traducción adaptativa, speaking con Web Speech API, gramática interactiva.', tags: ['PT·ES·EN·CA', 'Ollama', 'Web Speech'] },
  { id: 2, icon: '⚡', title: 'UX Academy', level: 'B1-C1', desc: 'Evaluación formativa con capstone trilingüe. Portafolio digital, feedback por pares, certificaciones QR.', tags: ['Capstone', 'QR Verify', 'Portfolio'] },
  { id: 3, icon: '🔒', title: 'Cybersecurity Foundations', level: 'A2-B1', desc: 'Fundamentos de seguridad informática para jóvenes. Ciberdefensa, privacidad digital, ética hacker.', tags: ['Ethics', 'OWASP', 'Privacy'] },
  { id: 4, icon: '🎨', title: 'Creative Tech', level: 'A1-B2', desc: 'Tecnología creativa para expresarte. Generación procedimental, audio-reactive visuals, arte generativo.', tags: ['Canvas', 'WebGL', 'Audio'] },
  { id: 5, icon: '🤖', title: 'AI & Agent Systems', level: 'B1-C1', desc: 'Construye tus propios agentes de IA. Multi-agent orchestration, MCP, tool-use patterns.', tags: ['Agents', 'MCP', 'Python'] },
  { id: 6, icon: '📊', title: 'Data Science Basic', level: 'A2-B1', desc: 'Análisis de datos desde cero. Visualización, estadística aplicada, machine learning introductorio.', tags: ['JS', 'D3.js', 'ML Intro'] },
];

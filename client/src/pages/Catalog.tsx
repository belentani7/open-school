// Open School — Course Catalog Page
import { useState } from 'react';
import { Link } from 'wouter';

interface Course {
  id: string;
  title: string;
  desc: string;
  level: string;
  icon: string;
  tags: string[];
  modules: number;
  students: string;
  rating: number;
}

const allCourses: Course[] = [
  { id: '1', title: 'Lingua Aberta', desc: 'Aprende idiomas con IA educativa local. Traducción adaptativa y speaking con Web Speech API.', level: 'A1-B2', icon: '🌐', tags: ['PT·ES·EN·CA', 'Ollama', 'Web Speech'], modules: 24, students: '2,847', rating: 4.8 },
  { id: '2', title: 'UX Academy', desc: 'Evaluación formativa con capstone trilingüe. Portafolio digital y certificaciones QR verificables.', level: 'B1-C1', icon: '⚡', tags: ['Capstone', 'QR Verify', 'Portfolio'], modules: 12, students: '1,923', rating: 4.6 },
  { id: '3', title: 'Cybersecurity Foundations', desc: 'Fundamentos de ciberdefensa para jóvenes. Ciberdefensa, privacidad digital y ética hacker.', level: 'A2-B1', icon: '🔒', tags: ['Ethics', 'OWASP', 'Privacy'], modules: 16, students: '3,102', rating: 4.7 },
  { id: '4', title: 'Creative Tech', desc: 'Tecnología creativa para expresarte. Generación procedimental, audio-reactive visuals y arte generativo.', level: 'A1-B2', icon: '🎨', tags: ['Canvas', 'WebGL', 'Audio'], modules: 18, students: '1,456', rating: 4.5 },
  { id: '5', title: 'AI & Agent Systems', desc: 'Construye tus propios agentes de IA. Multi-agent orchestration, MCP y tool-use patterns.', level: 'B1-C1', icon: '🤖', tags: ['Agents', 'MCP', 'Python'], modules: 20, students: '2,105', rating: 4.9 },
  { id: '6', title: 'Data Science Basic', desc: 'Análisis de datos desde cero. Visualización, estadística aplicada y machine learning introductorio.', level: 'A2-B1', icon: '📊', tags: ['JS', 'D3.js', 'ML Intro'], modules: 14, students: '1,678', rating: 4.4 },
  { id: '7', title: 'Music Production Digital', desc: 'Producción musical con código. Tone.js, Web Audio API, síntesis procedural y beats generativos.', level: 'A1-B1', icon: '🎵', tags: ['Tone.js', 'WebAudio', 'Synth'], modules: 16, students: '892', rating: 4.8 },
  { id: '8', title: 'Full-Stack Development', desc: 'React, Node, tRPC, Drizzle ORM. Construye apps completas desde zero a deploy.', level: 'B1-C1', icon: '💻', tags: ['React', 'tRPC', 'Drizzle'], modules: 28, students: '4,321', rating: 4.9 },
  { id: '9', title: '3D & WebGL Immersion', desc: 'Three.js, React Three Fiber, GLSL shaders. Experiencias 3D interactivas en el navegador.', level: 'B1-C1', icon: '🧊', tags: ['Three.js', 'R3F', 'GLSL'], modules: 22, students: '1,234', rating: 4.7 },
];

export function Catalog() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const filtered = allCourses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.desc.toLowerCase().includes(search.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || c.level.toLowerCase().replace('-', '').includes(levelFilter.toLowerCase());
    return matchesSearch && matchesLevel;
  });

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="ncl-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="ncl-heading-1 mb-2">CATÁLOGO DE CURSOS</h1>
          <p className="ncl-text-muted max-w-lg mx-auto">Explora todos los recursos del Instituto Universal Gratuito.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cursos, temas, tecnologías..." 
              className="ncl-input pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nclr-muted">
              🔍
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setLevelFilter('all')} className={`ncl-btn ${levelFilter === 'all' ? 'ncl-btn--primary' : 'ncl-btn--glass'} text-xs`}>
              TODOS
            </button>
            {levels.map(l => (
              <button key={l} onClick={() => setLevelFilter(l)} className={`ncl-btn ${levelFilter === l ? 'ncl-btn--primary' : 'ncl-btn--glass'} text-xs`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-nclr-muted font-mono mb-4 tracking-wider">
          {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''} · {allCourses.length} total disponible
        </div>

        {/* Course Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="block group cursor-pointer">
                <div className="ncl-glass p-6 h-full hover:-translate-y-1 transition-all duration-300" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{course.icon}</span>
                    <span className="ncl-tag">{course.level}</span>
                  </div>
                  <h3 className="ncl-heading-3 mb-2">{course.title}</h3>
                  <p className="ncl-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{course.desc}</p>
                  
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {course.tags.slice(0, 3).map(t => (
                      <span key={t} className="ncl-chip">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-4 text-[11px] nclr-muted">
                      <span>{course.modules} módulos</span>
                      <span>{course.students} estudiantes</span>
                    </div>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(course.rating))}{course.rating % 1 > 0 ? '½' : ''} {course.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔎</div>
            <p className="nclr-muted">No se encontraron cursos que coincidan con tu búsqueda.</p>
            <button onClick={() => { setSearch(''); setLevelFilter('all'); }} className="ncl-btn ncl-btn--glass mt-4">
              LIMPIAR FILTROS
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 ncl-glass p-8 text-center">
          <div className="ncl-section-title inline-block mb-6">ESTADÍSTICAS DEL CAMPUS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {[
              { val: allCourses.length.toString(), label: 'CURSOS' },
              { val: '168', label: 'MÓDULOS TOTALES' },
              { val: '18.5K+', label: 'ESTUDIANTES' },
              { val: '4.7★', label: 'RATING PROMEDIO' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-mono font-bold text-nclr-red" style={{textShadow: '0 0 12px rgba(255,7,58,0.4)'}}>{s.val}</div>
                <div className="text-[10px] nclr-muted tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

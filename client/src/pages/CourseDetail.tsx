// Open School — Course Detail Page (Generic)
import { Link, useParams } from 'wouter';

const courses = {
  '1': { name: 'Lingua Aberta', desc: 'Aprende idiomas con IA educativa local', modules: ['Fonética y pronunciación', 'Gramática interactiva', 'Conversación con Ollama', 'Traducción adaptativa', 'Speaking con Web Speech API'] },
  '2': { name: 'UX Academy', desc: 'Evaluación formativa + Capstone trilingüe', modules: ['Diseño UX básico', 'Prototipado Figma', 'Testing usuarios', 'Capstone proyecto real'] },
  '3': { name: 'Cybersecurity Foundations', desc: 'Fundamentos de ciberdefensa y privacidad', modules: ['Principios de seguridad', 'OWASP Top 10', 'Privacidad digital', 'Ética hacker'] },
  '4': { name: 'Creative Tech', desc: 'Tecnología creativa y arte generativo', modules: ['Canvas API', 'WebGL intro', 'Audio-reactive visuals', 'Generative art'] },
  '5': { name: 'AI & Agent Systems', desc: 'Construye tus propios agentes de IA', modules: ['Agent patterns', 'MCP protocol', 'Tool-use', 'Multi-agent orchestration'] },
  '6': { name: 'Data Science Basic', desc: 'Análisis de datos desde cero', modules: ['Estadística aplicada', 'Visualización D3.js', 'Machine learning intro', 'Proyecto final'] },
};

export function CourseDetail() {
  const params = useParams();
  const course = courses[params.id as string] || null;
  
  if (!course) return <NotFound />;

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="ncl-container">
        {/* Back button */}
        <Link href="/">
          <button className="ncl-btn ncl-btn--glass mb-6">← Volver al campus</button>
        </Link>

        {/* Course Header */}
        <div className="ncl-glass p-8 mb-8">
          <h1 className="ncl-heading-1 mb-2">{course.name}</h1>
          <p className="ncl-text-body max-w-lg">{course.desc}</p>
          <div className="flex gap-3 mt-4">
            <button className="ncl-btn ncl-btn--primary">COMENZAR CURSO →</button>
            <button className="ncl-btn ncl-btn--glass">GUARDAR EN FAVORITOS</button>
          </div>
        </div>

        {/* Modules List */}
        <div className="ncl-glass p-8">
          <div className="ncl-section-title">◆ MÓDULOS DEL CURSO</div>
          <div className="space-y-3">
            {course.modules.map((mod, i) => (
              <div key={i} className="bg-black/20 rounded-lg p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <span className="text-nclr-red font-mono text-sm font-bold w-8">0{i + 1}</span>
                <span className="flex-1 font-mono text-sm group-hover:text-white transition-colors">{mod}</span>
                <span className="ncl-tag">LECCIÓN {i + 1}/{course.modules.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8 ncl-glass p-8">
          <div className="ncl-section-title">◆ RECURSOS ADICIONALES</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['📄 PDF Guía de estudio', '🎥 Video tutorial', '💻 Ejercicio práctico', '🔗 Links externos', '👥 Foro comunidad', '📊 Quiz'].map((r, i) => (
              <button key={i} className="ncl-btn ncl-btn--glass justify-start">
                <span>{r.split(' ')[0]}</span>
                <span>{r.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

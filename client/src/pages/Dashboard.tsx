// Open School — Dashboard Page
import { Link } from 'wouter';

export function Dashboard() {
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="ncl-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ncl-heading-2 mb-1">DASHBOARD</h1>
            <p className="ncl-text-muted text-sm">Tu espacio de aprendizaje · NOIACORE LAB</p>
          </div>
          <Link href="/">
            <button className="ncl-btn ncl-btn--glass">← Volver</button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'CURSOS ACTIVOS', val: '3/6' },
            { label: 'CERTIFICADOS', val: '07' },
            { label: 'HORAS APRENDIDAS', val: '142' },
            { label: 'XP TOTAL', val: '4,850' },
          ].map((s, i) => (
            <div key={i} className={`ncl-glass p-4 text-center ${i === 0 ? 'ncl-anim-beat' : ''}`}>
              <div className="text-2xl font-mono font-bold text-nclr-red">{s.val}</div>
              <div className="text-[10px] text-nclr-muted tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid: Progress + Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress Panel */}
          <div className="lg:col-span-2 ncl-glass p-6">
            <div className="ncl-section-title">◆ MI PROGRESO</div>
            <div className="space-y-4">
              {[
                { name: 'Lingua Aberta — Nivel B1', pct: 72, total: 24, done: 17 },
                { name: 'UX Academy — Capstone', pct: 45, total: 12, done: 5 },
                { name: 'Creative Tech — Visuals', pct: 90, total: 16, done: 14 },
              ].map((item, i) => (
                <div key={i} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{item.name}</span>
                    <span className="ncl-tag">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded h-2 overflow-hidden">
                    <div 
                      className="h-full rounded transition-all"
                      style={{
                        width: `${item.pct}%`,
                        background: 'linear-gradient(90deg, #3d0012, #ff073a, #ff4466)',
                        boxShadow: '0 0 8px rgba(255,7,58,0.4)'
                      }}
                    />
                  </div>
                  <div className="text-xs text-nclr-muted mt-1">{item.done}/{item.total} lecciones</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="ncl-glass p-6">
            <div className="ncl-section-title">◆ ACCIONES RÁPIDAS</div>
            <div className="space-y-3">
              {[
                { label: '▶ Continuar curso', icon: '▶', href: '/courses/1' },
                { label: '📝 Examen pendiente', icon: '📝', href: '/courses/2' },
                { label: '🎯 Nuevo desafío diario', icon: '🎯', href: '#challenge' },
                { label: '👥 Unirse comunidad', icon: '👥', href: '#community' },
                { label: '📊 Ver reportes', icon: '📊', href: '#reports' },
              ].map((action, i) => (
                <Link key={i} href={action.href as string}>
                  <button className="ncl-btn ncl-btn--glass w-full justify-start">
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                </Link>
              ))}
            </div>

            {/* Achievement badges */}
            <div className="mt-6 pt-6 border-t border-nclr-border">
              <div className="text-xs text-nclr-muted tracking-wider mb-3">LOGROS RECIENTES</div>
              <div className="flex gap-3">
                {['🔥','⚡','🎯','💎'].map((e, i) => (
                  <div key={i} className="ncl-gem" style={{width:48,height:48}}>
                    <span style={{fontSize:18}}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-8 ncl-glass p-6">
          <div className="ncl-section-title">◆ ASISTENTE IA EDUCATIVA</div>
          <div className="flex gap-4 items-center bg-black/20 rounded-lg p-4">
            <div className="pulse-dot"></div>
            <div className="flex-1">
              <p className="font-mono text-sm text-nclr-muted">Ollama local activo · ¿Qué necesitas aprender hoy?</p>
              <input 
                placeholder="Escribe tu pregunta..." 
                className="ncl-input mt-3 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

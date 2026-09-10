// Open School — 404 Page
import { Link } from 'wouter';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="ncl-glass ncl-anim-beat inline-block p-8 mb-6">
          <div className="text-6xl font-mono font-bold text-nclr-red" style={{textShadow: '0 0 30px rgba(255,7,58,0.6)'}}>404</div>
        </div>
        <h1 className="ncl-heading-2 mb-2">NODE NOT FOUND</h1>
        <p className="ncl-text-muted mb-6">El recurso que buscas no existe en esta dimensión del campus.</p>
        <Link href="/">
          <button className="ncl-btn ncl-btn--primary">← VOLVER AL CAMPUS</button>
        </Link>
      </div>
    </div>
  );
}

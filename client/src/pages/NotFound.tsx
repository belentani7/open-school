import { Link } from 'wouter';
import { Glass } from '../components/Glass';
import { PlasmaField } from '../components/PlasmaField';
import { ZeroText } from '../components/ZeroText';

export function NotFound() {
  return (
    <section className="hero">
      <PlasmaField intensity={0.5} />
      <div className="hero__content">
        <ZeroText word="404" sub="Esta página no existe. Lo demás sí." />
        <Glass style={{ padding: '1rem 1.4rem' }}>
          <div className="row">
            <Link href="/" className="btn btn--light">Inicio</Link>
            <Link href="/catalog" className="btn btn--glass">Ver rutas</Link>
          </div>
        </Glass>
      </div>
    </section>
  );
}

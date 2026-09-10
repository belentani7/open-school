/* ===================================================================
   ZERO TEXT SCREEN — P1: una palabra monumental por proyecto.

   La palabra de open-school es APRENDER. No es decoracion: es la unica
   experiencia dominante de la primera pantalla. 65% de espacio negativo
   alrededor. Si compite con algo, ese algo sobra.

   AJUSTE AL ANCHO: estimar el tamaño por numero de letras (`Nvw / chars`)
   no basta — el avance por caracter depende de la fuente, y mientras
   Sora no ha cargado el fallback del sistema es mas ancho, con lo que la
   palabra se salia del viewport. Aqui el CSS da la primera aproximacion
   (evita el salto visual) y despues se mide el ancho REAL y se corrige.
   Se recalcula cuando la fuente termina de cargar y al redimensionar.
   =================================================================== */

import { useCallback, useEffect, useRef } from 'react';
import { usePointerDrift, useRafLoop, useReducedMotion } from '../lib/motion';

/** Holgura para que la ultima letra no roce el borde de la caja. */
const SLACK = 0.99;

/**
 * Ancho real del texto.
 *
 * No sirve `scrollWidth`: con `text-align: center` el texto desborda por
 * los dos lados y `scrollWidth` ignora el desbordamiento izquierdo, asi
 * que devuelve menos de lo que ocupa. Un Range sobre el contenido mide
 * la caja tipografica de verdad.
 */
function textWidth(el: HTMLElement): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

export function ZeroText({ word, sub }: { word: string; sub?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const drift = usePointerDrift(3);
  const reduced = useReducedMotion();

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Volver al valor del CSS antes de medir: si no, cada pasada
    // encogeria sobre el resultado de la anterior.
    el.style.fontSize = '';

    // La caja del h1, no el viewport: con `background-clip: text` el
    // relleno solo existe DENTRO de la caja, asi que lo que sobresale se
    // vuelve invisible en vez de simplemente desbordar.
    const avail = el.clientWidth;
    const width = textWidth(el);
    if (!avail || !width || width <= avail) return;

    const size = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = `${Math.floor(size * (avail / width) * SLACK)}px`;
  }, []);

  useEffect(() => {
    fit();

    // Las metricas cambian cuando Sora sustituye al fallback.
    document.fonts?.ready.then(fit).catch(() => {});

    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        fit();
      });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [fit, word]);

  useRafLoop(() => {
    const el = ref.current;
    if (!el) return;
    const { x, y } = drift.current;
    // Recorrido corto (±14%): la luz insinua, no persigue al cursor.
    el.style.setProperty('--lx', `${50 + x * 14}%`);
    el.style.setProperty('--ly', `${50 + y * 14}%`);
  }, !reduced);

  return (
    // `width: 100%` en vez de `justify-items: center`: cuando un item de
    // grid es MAS ANCHO que su area, la alineacion `center` degrada a
    // `start` para no perder contenido por la izquierda — y la palabra
    // desbordaba entera hacia la derecha. Con el h1 estirado al ancho del
    // contenedor, el centrado lo hace `text-align`, que sí reparte el
    // desbordamiento a ambos lados.
    <div className="stack" style={{ width: '100%', textAlign: 'center' }}>
      <h1
        ref={ref}
        className="t-monument m-rise"
        style={{
          '--lx': '50%',
          '--ly': '50%',
          // Primera aproximacion en CSS; la medida real la afina.
          '--chars': word.length,
          backgroundImage:
            'radial-gradient(60% 120% at var(--lx) var(--ly), #ffffff 0%, #c3b3ff 32%, #9e86ff 58%, #3b2f78 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          whiteSpace: 'nowrap',
        } as React.CSSProperties}
      >
        {word}
      </h1>

      {sub && (
        <p
          className="t-lede m-rise"
          style={{ '--d': '180ms', textAlign: 'center', marginInline: 'auto' } as React.CSSProperties}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

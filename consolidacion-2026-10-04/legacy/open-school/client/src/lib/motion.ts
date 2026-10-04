/* ===================================================================
   MOTION — P4 (fisica) + P7 (60 FPS, rAF controlado, DPR adaptativo,
   reduced-motion, pausa por visibilidad).

   Todo lo que anima en la app pasa por aqui. Un solo bucle rAF
   compartido: N canvas != N bucles.
   =================================================================== */

import { useEffect, useRef, useState } from 'react';

/** ¿El usuario pidio menos movimiento? Reactivo: escucha cambios. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return reduced;
}

/** La pestaña esta visible. Pausar fuera de pantalla es gratis y ahorra bateria. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );

  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  return visible;
}

/**
 * Bucle rAF con dt acotado.
 *
 * El clamp de dt es lo que impide el "salto" al volver de una pestaña
 * en segundo plano: sin el, el primer frame tras reanudar trae un dt de
 * varios segundos y la simulacion se teletransporta.
 */
export function useRafLoop(
  fn: (dt: number, t: number) => void,
  active = true
): void {
  const cb = useRef(fn);
  cb.current = fn;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      cb.current(dt, now / 1000);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/**
 * DPR adaptativo: nitidez en pantallas densas sin pagar 4x de fill-rate
 * en moviles modestos. Tope 2 — por encima el ojo no lo distingue y el
 * coste crece al cuadrado.
 */
export function resolveDpr(cap = 2): number {
  if (typeof window === 'undefined') return 1;
  const cores = navigator.hardwareConcurrency ?? 4;
  const budget = cores <= 4 ? 1.5 : cap;
  return Math.min(window.devicePixelRatio || 1, budget);
}

/** Interpolacion exponencial independiente del framerate. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

/**
 * Entra en el viewport una sola vez. Base de la cascada de entrada y del
 * lazy de todo lo caro (canvas, media).
 */
export function useInView<T extends Element>(
  rootMargin = '0px 0px -12% 0px'
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);

  return [ref, seen];
}

/**
 * Puntero normalizado a [-1,1] con inercia (P4: micro-distorsion de cursor).
 * Devuelve un ref, no estado: no provoca re-render por cada movimiento.
 */
export function usePointerDrift(lambda = 4) {
  const drift = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const on = (e: PointerEvent) => {
      drift.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      drift.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  useRafLoop((dt) => {
    const d = drift.current;
    d.x = damp(d.x, d.tx, lambda, dt);
    d.y = damp(d.y, d.ty, lambda, dt);
  });

  return drift;
}

/** Progreso de scroll 0→1 sobre un elemento, suavizado. Para parallax. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height + window.innerHeight;
      progress.current = clamp((window.innerHeight - r.top) / span, 0, 1);
    };

    // rAF-throttle: el handler de scroll no debe leer layout en cada evento.
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, progress] as const;
}

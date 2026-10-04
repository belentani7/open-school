/* ===================================================================
   PLASMA FIELD — atmosfera viva (P3 luz 3% · P7 60 FPS)

   Tecnica: los degradados radiales se pre-renderizan UNA vez a sprites
   fuera de pantalla; cada frame solo hace drawImage con transform.
   Crear gradientes en el bucle de dibujo es el error clasico que
   hunde el framerate en moviles — aqui el coste por frame es de blits.

   Presupuesto de luz: alpha total <= 3% (P3). Es atmosfera, no un foco.
   =================================================================== */

import { useEffect, useRef } from 'react';
import { useRafLoop, useReducedMotion, usePageVisible, resolveDpr, useInView } from '../lib/motion';

type Blob = {
  x: number; y: number;      // posicion normalizada 0..1
  vx: number; vy: number;    // deriva
  r: number;                 // radio relativo al lado menor
  sprite: number;
  phase: number;
};

const PALETTE = [
  'rgba(158,134,255,',  // heliotropo HBO
  'rgba(107,231,243,',  // aula (acento open-school)
  'rgba(93,75,184,',    // heliotropo profundo
];

function makeSprite(color: string, size: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Curva suave: sin escalones el degradado no produce banding en OLED.
  grad.addColorStop(0, color + '0.55)');
  grad.addColorStop(0.35, color + '0.22)');
  grad.addColorStop(0.68, color + '0.06)');
  grad.addColorStop(1, color + '0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function PlasmaField({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hostRef, inView] = useInView<HTMLDivElement>('200px');
  const reduced = useReducedMotion();
  const visible = usePageVisible();

  const state = useRef<{
    ctx: CanvasRenderingContext2D | null;
    sprites: HTMLCanvasElement[];
    blobs: Blob[];
    w: number; h: number; dpr: number;
  }>({ ctx: null, sprites: [], blobs: [], w: 0, h: 0, dpr: 1 });

  // --- init + resize ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s = state.current;
    s.ctx = canvas.getContext('2d', { alpha: true });
    s.dpr = resolveDpr();
    s.sprites = PALETTE.map((c) => makeSprite(c, 256));

    s.blobs = Array.from({ length: 5 }, (_, i) => ({
      x: 0.5 + Math.cos((i / 5) * Math.PI * 2) * 0.3,
      y: 0.5 + Math.sin((i / 5) * Math.PI * 2) * 0.26,
      vx: (i % 2 ? 1 : -1) * (0.012 + i * 0.003),
      vy: (i % 3 ? -1 : 1) * (0.009 + i * 0.002),
      r: 0.42 + (i % 3) * 0.16,
      sprite: i % PALETTE.length,
      phase: i * 1.7,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = Math.round(rect.width * s.dpr);
      canvas.height = Math.round(rect.height * s.dpr);
      s.ctx?.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // El bucle solo corre si: esta en pantalla, la pestaña esta visible
  // y el usuario no pidio menos movimiento.
  const running = inView && visible && !reduced;

  useRafLoop((dt, t) => {
    const s = state.current;
    const ctx = s.ctx;
    if (!ctx || !s.w) return;

    ctx.clearRect(0, 0, s.w, s.h);
    ctx.globalCompositeOperation = 'lighter';

    const min = Math.min(s.w, s.h);

    for (const b of s.blobs) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Rebote suave en los bordes ampliados: la masa nunca sale del todo.
      if (b.x < -0.15 || b.x > 1.15) b.vx *= -1;
      if (b.y < -0.15 || b.y > 1.15) b.vy *= -1;

      // Respiracion: escala lenta, desfasada por blob.
      const breath = 1 + Math.sin(t * 0.22 + b.phase) * 0.13;
      const size = min * b.r * breath;

      ctx.globalAlpha = 0.4 * intensity;
      ctx.drawImage(
        s.sprites[b.sprite],
        b.x * s.w - size / 2,
        b.y * s.h - size / 2,
        size,
        size
      );
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, running);

  // Con reduced-motion se pinta UN frame estatico: la atmosfera sigue
  // existiendo, simplemente no se mueve.
  useEffect(() => {
    if (!reduced) return;
    const s = state.current;
    const ctx = s.ctx;
    if (!ctx || !s.w) return;

    ctx.clearRect(0, 0, s.w, s.h);
    ctx.globalCompositeOperation = 'lighter';
    const min = Math.min(s.w, s.h);
    for (const b of s.blobs) {
      const size = min * b.r;
      ctx.globalAlpha = 0.34 * intensity;
      ctx.drawImage(s.sprites[b.sprite], b.x * s.w - size / 2, b.y * s.h - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, [reduced, intensity, inView]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        // El blur del contenedor funde los sprites entre si: de 5 manchas
        // discretas a un campo continuo, sin coste por frame.
        filter: 'blur(52px)',
        opacity: 0.5,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

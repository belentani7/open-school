import { describe, expect, it } from 'vitest';
import { LEVELS, ROUTES, STATUS_LABEL, TOTALS, getRoute } from './catalog';

/* El catalogo declara en su cabecera que la prueba social inventada se quito.
   Estos tests convierten esa promesa en algo que el CI comprueba. */

describe('catalog — invariantes', () => {
  it('los id son unicos', () => {
    const ids = ROUTES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('TOTALS se derivan de ROUTES', () => {
    expect(TOTALS.routes).toBe(ROUTES.length);
    expect(TOTALS.modules).toBe(ROUTES.reduce((n, r) => n + r.modules, 0));
    expect(TOTALS.hours).toBe(ROUTES.reduce((n, r) => n + r.hours, 0));
    expect(TOTALS.langs).toBe(new Set(ROUTES.flatMap((r) => r.langs)).size);
    expect(TOTALS.offline).toBe(ROUTES.filter((r) => r.offline).length);
    expect(TOTALS.certified).toBe(ROUTES.filter((r) => r.certified).length);
  });

  it('cada ruta esta completa y bien tipada en tiempo de ejecucion', () => {
    for (const r of ROUTES) {
      expect(r.word.trim(), r.id).not.toBe('');
      expect(r.title.trim(), r.id).not.toBe('');
      expect(r.claim.trim(), r.id).not.toBe('');
      expect(r.desc.trim(), r.id).not.toBe('');
      expect(LEVELS, r.id).toContain(r.level);
      expect(Object.keys(STATUS_LABEL), r.id).toContain(r.status);
      expect(r.modules, r.id).toBeGreaterThan(0);
      expect(r.hours, r.id).toBeGreaterThan(0);
      expect(r.langs.length, r.id).toBeGreaterThan(0);
      expect(r.stack.length, r.id).toBeGreaterThan(0);
    }
  });

  it('la palabra de cada ruta es una sola palabra', () => {
    for (const r of ROUTES) {
      expect(r.word.trim().split(/\s+/).length, r.id).toBe(1);
    }
  });

  it('idiomas en dos letras mayusculas y sin duplicados', () => {
    for (const r of ROUTES) {
      for (const l of r.langs) expect(l, r.id).toMatch(/^[A-Z]{2}$/);
      expect(new Set(r.langs).size, r.id).toBe(r.langs.length);
    }
  });

  it('el catalogo no contiene prueba social inventada', () => {
    const plano = JSON.stringify(ROUTES).toLowerCase();
    for (const prohibido of ['estudiante', 'alumno', 'estrella', 'rating', 'reseña']) {
      expect(plano).not.toContain(prohibido);
    }
  });

  it('getRoute resuelve por id y no inventa rutas', () => {
    expect(getRoute(ROUTES[0].id)?.id).toBe(ROUTES[0].id);
    expect(getRoute('ruta-inexistente')).toBeUndefined();
  });
});

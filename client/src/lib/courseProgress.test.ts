import { describe, expect, it } from 'vitest';
import { countCompletedPublishedUnits, publishedProgress } from './courseProgress';

describe('progreso de unidades realmente publicadas', () => {
  it('dos evaluaciones aprobadas de dos unidades publicadas equivalen al 100 % de lo disponible', () => {
    expect(countCompletedPublishedUnits([0, 1], 2)).toBe(2);
    expect(publishedProgress([0, 1], 2)).toBe(1);
  });

  it('ignora índices futuros, duplicados o corruptos en almacenamiento local', () => {
    expect(countCompletedPublishedUnits([0, 0, -1, 99, 1, Number.NaN], 2)).toBe(2);
    expect(publishedProgress([0, 0, 99], 2)).toBe(0.5);
  });

  it('una ruta sin unidades publicadas nunca aparece completada', () => {
    expect(countCompletedPublishedUnits([0], 0)).toBe(0);
    expect(publishedProgress([0], 0)).toBe(0);
  });

  it('los módulos planificados no inflan créditos aprobados', () => {
    const plannedModules = 69;
    const earnedUnits = countCompletedPublishedUnits([0], 2);
    expect(earnedUnits).toBe(1);
    expect(earnedUnits).toBeLessThan(plannedModules);
  });
});

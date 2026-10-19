import { describe, expect, it } from 'vitest';
import { INTRO_LESSONS, getIntroLesson } from './introLesson';
import { getRoute } from './catalog';

describe('intro lessons — contenido real y progreso honesto', () => {
  it('todas las lecciones pertenecen a una ruta existente y no se duplican', () => {
    const ids = INTRO_LESSONS.map((lesson) => lesson.routeId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const lesson of INTRO_LESSONS) {
      expect(getRoute(lesson.routeId)).toBeDefined();
    }
  });

  it('cada lección ofrece contenido, práctica y una evaluación válida', () => {
    for (const lesson of INTRO_LESSONS) {
      expect(lesson.title.length).toBeGreaterThan(10);
      expect(lesson.objective.length).toBeGreaterThan(20);
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
      for (const step of lesson.steps) {
        expect(step.explanation.length).toBeGreaterThan(30);
        expect(step.practice.length).toBeGreaterThan(20);
      }
      expect(lesson.quiz.choices.length).toBeGreaterThanOrEqual(2);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.choices.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
    }
  });

  it('las rutas sin clase publicada no simulan progreso', () => {
    expect(INTRO_LESSONS).toHaveLength(6);
    for (const routeId of ['manos-abiertas','secure-t','lingua-aberta','ux-academy','creative-tech','agent-systems']) {
      expect(getIntroLesson(routeId)).toBeDefined();
    }
    expect(INTRO_LESSONS.every(lesson => new Set(lesson.quiz.choices).size === lesson.quiz.choices.length)).toBe(true);
    expect(getIntroLesson('ruta-falsa')).toBeUndefined();
  });
});

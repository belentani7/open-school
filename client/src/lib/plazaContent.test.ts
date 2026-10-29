import { describe, it, expect } from 'vitest';
import { findTrack, PLAZA_NEEDS, PLAZA_TRACKS, recommendTrack } from './plazaContent';

describe('plaza educativa — integridad y límites', () => {
  it('contiene cinco cursos con veinte lecciones y proyectos finales completos', () => {
    expect(PLAZA_TRACKS).toHaveLength(5);
    const ids = PLAZA_TRACKS.flatMap((track) => track.lessons.map((lesson) => `${track.id}/${lesson.id}`));
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(ids.length);
    for (const track of PLAZA_TRACKS) {
      expect(track.lessons).toHaveLength(4);
      expect(track.outcome.length).toBeGreaterThan(25);
      expect(track.capstone.length).toBeGreaterThan(50);
      expect(track.rubric).toHaveLength(3);
      expect(track.minutes).toBeGreaterThan(0);
    }
  });

  it('cada unidad incluye material, tarea y una evaluación utilizable', () => {
    for (const course of PLAZA_TRACKS) {
      for (const lesson of course.lessons) {
        expect(lesson.objective.length).toBeGreaterThan(20);
        expect(lesson.concept.length).toBeGreaterThan(100);
        expect(lesson.example.length).toBeGreaterThan(75);
        expect(lesson.practice.length).toBeGreaterThan(50);
        expect(lesson.quiz.question.length).toBeGreaterThan(20);
        expect(lesson.quiz.choices).toHaveLength(3);
        expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.choices.length);
        expect(new Set(lesson.quiz.choices).size).toBe(3);
        expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      }
    }
  });

  it('la recomendación es determinista y solo devuelve itinerarios existentes', () => {
    for (const need of PLAZA_NEEDS) {
      expect(recommendTrack(need.id)?.id).toBe(need.trackId);
      expect(findTrack(need.trackId)).toBeDefined();
    }
    expect(recommendTrack('necesidad-desconocida')).toBeUndefined();
    expect(findTrack('curso-falso')).toBeUndefined();
  });

  it('el módulo de salud comunica límites y no declara diagnosticar', () => {
    const health = findTrack('salud-ciudadana');
    expect(health).toBeDefined();
    expect(health?.description).toContain('No diagnostica');
    expect(health?.lessons.some((unit) => unit.id === 'decidir')).toBe(true);
  });
});

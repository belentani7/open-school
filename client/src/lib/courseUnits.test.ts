import { describe, expect, it } from 'vitest';
import { ROUTES, TOTALS } from './catalog';
import { ADDITIONAL_UNITS, PUBLISHED_UNITS, getRouteUnits } from './courseUnits';

describe('Open School: 12 published assessable units', () => {
  it('contains exactly two original-or-new lessons per route', () => {
    expect(ROUTES).toHaveLength(6);
    expect(ADDITIONAL_UNITS).toHaveLength(6);
    expect(PUBLISHED_UNITS).toHaveLength(12);
    expect(TOTALS.availableUnits).toBe(12);
    for (const route of ROUTES) {
      const units = getRouteUnits(route.id);
      expect(units).toHaveLength(2);
      expect(units[0].title).not.toBe(units[1].title);
      expect(units.length).toBeLessThan(route.modules);
    }
    expect(getRouteUnits('unknown-route')).toEqual([]);
  });

  it('every new unit includes readable theory, meaningful practice and an evaluable answer', () => {
    for (const unit of ADDITIONAL_UNITS) {
      expect(unit.title.length).toBeGreaterThan(20);
      expect(unit.objective.length).toBeGreaterThan(50);
      expect(unit.steps).toHaveLength(3);
      expect(unit.estimatedMinutes).toBeGreaterThanOrEqual(15);
      for (const step of unit.steps) {
        expect(step.title.length).toBeGreaterThan(10);
        expect(step.explanation.length).toBeGreaterThan(100);
        expect(step.practice.length).toBeGreaterThan(75);
        expect(step.explanation).not.toMatch(/lorem ipsum|coming soon|\bTODO\b/i);
      }
      expect(unit.quiz.question.length).toBeGreaterThan(55);
      expect(unit.quiz.choices.length).toBeGreaterThanOrEqual(3);
      expect(new Set(unit.quiz.choices).size).toBe(unit.quiz.choices.length);
      expect(unit.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(unit.quiz.correctIndex).toBeLessThan(unit.quiz.choices.length);
      expect(unit.quiz.explanation.length).toBeGreaterThan(100);
    }
  });
});

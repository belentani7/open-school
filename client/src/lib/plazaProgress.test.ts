import { beforeEach, describe, expect, it } from 'vitest';
import { completePlazaLesson, getPlazaProgress, readPlazaCompleted } from './plazaProgress';
import { anonId, forgetMe, PLAZA_STORAGE_KEY } from './progress';

let data: Map<string, string>;
beforeEach(() => {
  data = new Map();
  const localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
    removeItem: (key: string) => { data.delete(key); },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage } });
});

describe('Plaza: same privacy contract as the main campus', () => {
  it('persists only known units and ignores malformed entries', () => {
    const first = completePlazaLesson('autonomia-digital/archivos');
    expect(first).toEqual(['autonomia-digital/archivos']);
    expect(completePlazaLesson('autonomia-digital/archivos')).toEqual(first);
    expect(() => completePlazaLesson('not-a-track/hidden-unit')).toThrow(/Unknown plaza/);
    data.set(PLAZA_STORAGE_KEY, JSON.stringify([
      'autonomia-digital/archivos', 'autonomia-digital/archivos', 'not-a-track/hidden-unit'
    ]));
    expect(readPlazaCompleted()).toEqual(['autonomia-digital/archivos']);
    expect(getPlazaProgress(readPlazaCompleted())).toMatchObject({
      doneUnits: 1, availableUnits: 20, startedTracks: 1, completeTracks: 0
    });
  });

  it('deletes Plaza results when the user chooses Borrar todo', () => {
    const oldId = anonId();
    completePlazaLesson('salud-ciudadana/fuentes');
    expect(readPlazaCompleted()).toEqual(['salud-ciudadana/fuentes']);
    forgetMe();
    expect(data.has(PLAZA_STORAGE_KEY)).toBe(false);
    expect(readPlazaCompleted()).toEqual([]);
    expect(anonId()).not.toBe(oldId);
  });

  it('drops Plaza progress with an expired anonymous identity', () => {
    const oldId = anonId();
    completePlazaLesson('ia-responsable/preguntar');
    data.set('os.anon.exp', '1');
    expect(readPlazaCompleted()).toEqual([]);
    expect(anonId()).not.toBe(oldId);
  });

  it('handles inaccessible storage without disclosing learner data', () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        get localStorage() { throw new Error('blocked'); }
      }
    });
    expect(readPlazaCompleted()).toEqual([]);
    expect(() => completePlazaLesson('lengua-cotidiana/presentacion')).not.toThrow();
  });
});

import { PLAZA_TRACKS } from './plazaContent';
import { anonId, PLAZA_STORAGE_KEY } from './progress';

const allowedKeys = new Set(
  PLAZA_TRACKS.flatMap(track => track.lessons.map(lesson => `${track.id}/${lesson.id}`))
);

/** Enforce the same 365-day local identity and wipe cycle as the main campus. */
export function readPlazaCompleted(): string[] {
  anonId();
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(PLAZA_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item): item is string =>
      typeof item === 'string' && allowedKeys.has(item)
    ))];
  } catch {
    return [];
  }
}

/** Called only on a correctly answered unit, never on opening a lesson. */
export function completePlazaLesson(key: string): string[] {
  if (!allowedKeys.has(key)) throw new Error('Unknown plaza unit');
  const next = [...new Set([...readPlazaCompleted(), key])];
  try {
    window.localStorage.setItem(PLAZA_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // In private mode the React component retains progress during this session.
  }
  return next;
}

export function getPlazaProgress(completed: readonly string[]) {
  const verified = new Set(completed.filter(key => allowedKeys.has(key)));
  return {
    doneUnits: verified.size,
    availableUnits: allowedKeys.size,
    startedTracks: PLAZA_TRACKS.filter(track =>
      track.lessons.some(unit => verified.has(`${track.id}/${unit.id}`))
    ).length,
    completeTracks: PLAZA_TRACKS.filter(track =>
      track.lessons.every(unit => verified.has(`${track.id}/${unit.id}`))
    ).length,
  };
}

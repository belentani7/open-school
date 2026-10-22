/** Portable, privacy-preserving backup for locally completed published units.
 * Does not export the anonymous identifier, free text, cookies or browsing history.
 */
export type PublishedUnitCounts = Record<string, number>;
export type CompletedByRoute = Record<string, number[]>;

export type ProgressBackup = {
  format: "open-school-progress";
  version: 1;
  exportedAt: string;
  completed: CompletedByRoute;
};

const MAX_BACKUP_BYTES = 64 * 1024;

function validateRoutes(value: unknown, counts: PublishedUnitCounts): CompletedByRoute {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("El respaldo no contiene rutas válidas.");
  }
  const completed: CompletedByRoute = Object.create(null) as CompletedByRoute;
  for (const [route, raw] of Object.entries(value)) {
    const published = Object.hasOwn(counts, route) ? counts[route] : undefined;
    if (typeof published !== "number" || !Number.isSafeInteger(published) || published < 0 || !Array.isArray(raw)) {
      throw new Error("El respaldo contiene una ruta desconocida.");
    }
    if (raw.length > published) throw new Error("El respaldo contiene demasiadas unidades.");
    const numbers: number[] = [];
    for (const index of raw) {
      if (!Number.isSafeInteger(index) || index < 0 || index >= published) {
        throw new Error("El respaldo contiene una unidad no publicada.");
      }
      numbers.push(index);
    }
    if (new Set(numbers).size !== numbers.length) {
      throw new Error("El respaldo contiene unidades repetidas.");
    }
    completed[route] = numbers.sort((a, b) => a - b);
  }
  return completed;
}

export function exportProgressBackup(
  completed: CompletedByRoute,
  counts: PublishedUnitCounts,
  now: Date = new Date()
): string {
  if (!Number.isFinite(now.getTime())) throw new Error("Fecha inválida.");
  const payload: ProgressBackup = {
    format: "open-school-progress",
    version: 1,
    exportedAt: now.toISOString(),
    completed: validateRoutes(completed, counts),
  };
  return JSON.stringify(payload, null, 2);
}

export function importProgressBackup(
  json: string,
  counts: PublishedUnitCounts
): CompletedByRoute {
  if (new TextEncoder().encode(json).length > MAX_BACKUP_BYTES) {
    throw new Error("El archivo supera el límite de 64 KB.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("El archivo no contiene JSON válido.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Formato de respaldo desconocido.");
  }
  const input = parsed as Partial<ProgressBackup>;
  if (input.format !== "open-school-progress" || input.version !== 1 ||
      typeof input.exportedAt !== "string" || !Number.isFinite(Date.parse(input.exportedAt))) {
    throw new Error("Versión de respaldo incompatible.");
  }
  return validateRoutes(input.completed, counts);
}

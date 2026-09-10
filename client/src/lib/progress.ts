/* ===================================================================
   PROGRESO ANONIMO — la promesa "sin datos personales", implementada.

   Modelo Secure-T: un UUID local con caducidad de 365 dias. No hay
   correo, ni telefono, ni IP, ni cookie de terceros. Si el identificador
   caduca o el usuario borra el almacenamiento, no queda nada — y eso es
   el comportamiento correcto, no un fallo.

   Todo lo que se escribe aqui vive en localStorage del propio
   dispositivo y nunca sale de el.
   =================================================================== */

const KEY_ID = 'os.anon.id';
const KEY_EXP = 'os.anon.exp';
const KEY_PROGRESS = 'os.progress';
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/** localStorage lanza en modo privado de Safari y con cookies bloqueadas. */
function safeStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__os__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function newId(): string {
  // Alias sin estrechar: `crypto.randomUUID` solo existe en contextos
  // seguros, pero los tipos del DOM lo declaran siempre presente. Sin
  // este alias, TS da por inalcanzable la rama de respaldo.
  const c: Crypto | undefined = typeof crypto !== 'undefined' ? crypto : undefined;

  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  if (!c) return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  // Respaldo para contextos no seguros (http://, WebViews antiguos).
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Identificador anonimo vigente. Se renueva solo si caduco. */
export function anonId(): string {
  const s = safeStorage();
  if (!s) return 'sesion-temporal';

  const id = s.getItem(KEY_ID);
  const exp = Number(s.getItem(KEY_EXP) ?? 0);

  if (id && exp > Date.now()) return id;

  const fresh = newId();
  s.setItem(KEY_ID, fresh);
  s.setItem(KEY_EXP, String(Date.now() + YEAR_MS));
  // Identificador nuevo = persona nueva. El progreso anterior no le pertenece.
  s.removeItem(KEY_PROGRESS);
  return fresh;
}

/** Dias que le quedan al identificador antes de caducar. */
export function daysLeft(): number {
  const s = safeStorage();
  if (!s) return 0;
  const exp = Number(s.getItem(KEY_EXP) ?? 0);
  return Math.max(0, Math.ceil((exp - Date.now()) / (24 * 60 * 60 * 1000)));
}

export type Progress = Record<string, number>; // routeId -> 0..1

export function readProgress(): Progress {
  const s = safeStorage();
  if (!s) return {};
  try {
    const raw = s.getItem(KEY_PROGRESS);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    // Sanear: un valor corrupto no debe romper la barra de progreso.
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter(([, v]) => typeof v === 'number' && Number.isFinite(v))
        .map(([k, v]) => [k, Math.min(1, Math.max(0, v as number))])
    );
  } catch {
    return {};
  }
}

export function setProgress(routeId: string, value: number): Progress {
  const s = safeStorage();
  const next = { ...readProgress(), [routeId]: Math.min(1, Math.max(0, value)) };
  s?.setItem(KEY_PROGRESS, JSON.stringify(next));
  return next;
}

/** Borrado real: no queda rastro en el dispositivo. */
export function forgetMe(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(KEY_ID);
  s.removeItem(KEY_EXP);
  s.removeItem(KEY_PROGRESS);
}

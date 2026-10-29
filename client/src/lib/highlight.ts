/* ===================================================================
   RESALTADO — partir un texto en tramos, unos marcados y otros no.

   Vive aparte de `Biblia.tsx` para poder probarlo como funcion pura,
   sin montar React. La logica de indices es justo donde se colaba el
   fallo de "buscar api borra el resto de la definicion": con los tests
   de aqui eso no puede volver a pasar sin que salte.
   =================================================================== */

import { normalizar } from './biblia';

export type Tramo = { txt: string; on: boolean };

/**
 * Divide `texto` en tramos contiguos segun coincida o no con `consulta`.
 *
 * Garantia: la concatenacion de todos los `txt` es exactamente `texto`,
 * sin perder ni un caracter ni reordenarlo. Si no hay nada que marcar,
 * devuelve un unico tramo sin marcar con el texto entero.
 */
export function tramos(texto: string, consulta: string): Tramo[] {
  const tokens = normalizar(consulta).split(/\s+/).filter(Boolean);
  const entero: Tramo[] = [{ txt: texto, on: false }];

  if (tokens.length === 0 || texto.length === 0) return entero;

  const plano = normalizar(texto);
  const marcado = new Array<boolean>(texto.length).fill(false);

  for (const tk of tokens) {
    let desde = 0;
    for (;;) {
      const i = plano.indexOf(tk, desde);
      if (i < 0) break;
      for (let k = i; k < i + tk.length && k < marcado.length; k += 1) {
        marcado[k] = true;
      }
      desde = i + tk.length;
    }
  }

  if (!marcado.some(Boolean)) return entero;

  const partes: Tramo[] = [];
  let txt = texto[0];
  let on = marcado[0];

  for (let i = 1; i < texto.length; i += 1) {
    if (marcado[i] === on) {
      txt += texto[i];
    } else {
      partes.push({ txt, on });
      txt = texto[i];
      on = marcado[i];
    }
  }
  partes.push({ txt, on });

  return partes;
}

/** El texto plano de los tramos. Para tests y para depurar. */
export const unir = (tramos: Tramo[]): string => tramos.map((t) => t.txt).join('');

/** Lo que quedaria marcado, en orden. */
export const resaltado = (tramos: Tramo[]): string =>
  tramos
    .filter((t) => t.on)
    .map((t) => t.txt)
    .join('');

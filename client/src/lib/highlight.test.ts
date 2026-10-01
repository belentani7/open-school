/* ===================================================================
   Test del resaltado.

   El fallo que motivo este archivo: `Marcar` recorria solo las
   posiciones coincidentes, asi que buscar "api" en una definicion
   pintaba unicamente "api" y borraba el resto del texto. La garantia
   que lo impide es `unir(tramos(x)) === x`, y se comprueba en cada caso.
   =================================================================== */

import { describe, expect, it } from 'vitest';

import { resaltado, tramos, unir } from './highlight';

describe('invariante: nunca se pierde texto', () => {
  const casos = [
    ['Interfaz de programacion de aplicaciones', 'api'],
    ['diseño de la experiencia', 'diseno'],
    ['API', 'api'],
    ['', 'api'],
    ['algo', ''],
    ['a', 'a'],
    ['aaa', 'aa'],
    ['El diseño y la lógica del diseño', 'diseno logica'],
    ['ñandú', 'nandu'],
  ] as const;

  for (const [texto, consulta] of casos) {
    it(`unir(tramos(${JSON.stringify(texto)}, ${JSON.stringify(consulta)})) === texto`, () => {
      expect(unir(tramos(texto, consulta))).toBe(texto);
    });
  }
});

describe('marca lo que debe y solo lo que debe', () => {
  it('marca la coincidencia exacta y conserva el resto', () => {
    const t = tramos('Interfaz de programacion', 'programacion');
    expect(unir(t)).toBe('Interfaz de programacion');
    expect(resaltado(t)).toBe('programacion');
    // El texto anterior sigue ahi, sin marcar.
    expect(t[0]).toEqual({ txt: 'Interfaz de ', on: false });
  });

  it('sin coincidencia devuelve el texto entero sin marcar', () => {
    const t = tramos('hola mundo', 'zzz');
    expect(t).toEqual([{ txt: 'hola mundo', on: false }]);
  });

  it('sin consulta devuelve el texto entero sin marcar', () => {
    expect(tramos('hola', '')).toEqual([{ txt: 'hola', on: false }]);
    expect(tramos('hola', '   ')).toEqual([{ txt: 'hola', on: false }]);
  });

  it('marca todas las apariciones, no solo la primera', () => {
    const t = tramos('diseño del diseño', 'diseno');
    // Se resalta el texto ORIGINAL, con sus tildes: "diseñodiseño"
    // (la " del " de en medio no coincide con el token).
    expect(resaltado(t)).toBe('diseñodiseño');
    expect(unir(t)).toBe('diseño del diseño');
  });

  it('cruza el acento: resalta "diseño" al buscar "diseno"', () => {
    // Justo el caso que fallaba en silencio: el resultado salia, el
    // resaltado no.
    const t = tramos('diseño', 'diseno');
    expect(resaltado(t)).toBe('diseño');
  });

  it('cruza la enye al reves: buscar "año" resalta "ano"', () => {
    expect(resaltado(tramos('ano', 'año'))).toBe('ano');
  });

  it('exige todos los tokens', () => {
    const t = tramos('api rest', 'api rest');
    // El espacio entre ambas palabras no coincide con ningun token, asi
    // que no se marca: el resaltado pega "apirest" pero el texto visible
    // conserva el espacio intacto.
    expect(resaltado(t)).toBe('apirest');
    expect(unir(t)).toBe('api rest');
  });

  it('los tramos se alternan on/off y nunca hay dos seguidos iguales', () => {
    const t = tramos('Interfaz de programacion de aplicaciones', 'de api');
    for (let i = 1; i < t.length; i += 1) {
      expect(t[i].on, `tramos ${i - 1} y ${i} iguales`).not.toBe(t[i - 1].on);
    }
  });

  it('texto vacio no revienta', () => {
    expect(tramos('', 'x')).toEqual([{ txt: '', on: false }]);
    expect(tramos('', '')).toEqual([{ txt: '', on: false }]);
  });
});

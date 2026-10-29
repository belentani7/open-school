/* ===================================================================
   Tests de open-data.

   No se prueban solo funciones con objetos inventados: se cargan los
   ficheros reales de client/public/open-data. Asi el test ata las dos
   cosas que se pueden romper por separado — la forma del item y el
   contenido publicado — y un `tema` sin fichero o una fuente que
   vuelve con otra clave salen aqui y no en la pagina.
   =================================================================== */

import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { aplanar, enlace, etiquetaTema, fallos, humanizar, type TemaCrudo } from './openData';

const BASE = new URL('../../public/open-data/', import.meta.url);

function leerJson<T>(...partes: string[]): T {
  return JSON.parse(readFileSync(new URL(partes.join(''), BASE), 'utf8')) as T;
}

const manifiesto = leerJson<{ generado_utc: string; temas: { tema: string }[] }>(
  'topics.json',
);

const temas = manifiesto.temas.map(({ tema }) =>
  leerJson<TemaCrudo>('data/', `${tema}.json`),
);

const todos = temas.flatMap(aplanar);

describe('open-data: ficheros publicados', () => {
  it('cada tema del manifiesto tiene su fichero de datos', () => {
    const publicados = readdirSync(new URL('data/', BASE));
    for (const { tema } of manifiesto.temas) {
      expect(publicados).toContain(`${tema}.json`);
    }
  });

  it('el manifiesto declara al menos un tema', () => {
    expect(manifiesto.temas.length).toBeGreaterThan(0);
  });

  it('los datos son del portal open-school', () => {
    expect(manifiesto.generado_utc).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    for (const t of temas) expect(t.tema).toBeTruthy();
  });
});

describe('open-data: aplanado', () => {
  it('aplana los temas reales a items con id unico', () => {
    expect(todos.length).toBeGreaterThan(0);
    const ids = new Set(todos.map((i) => i.id));
    // 1 id por item: si se repiten, React reutiliza la fila equivocada.
    expect(ids.size).toBe(todos.length);
  });

  it('ningun item queda sin titulo', () => {
    for (const i of todos) expect(i.titulo.length).toBeGreaterThan(0);
  });

  it('todo item declara su fuente', () => {
    for (const i of todos) expect(i.fuente.length).toBeGreaterThan(0);
  });

  it('los enlaces son http(s) o doi resuelto, nuncaundefined', () => {
    for (const i of todos) {
      if (i.href === null) continue;
      expect(i.href).toMatch(/^https:\/\//);
    }
  });

  it('el tema sin datos aporta cero items y reporta el fallo', () => {
    const vacios = temas.filter((t) => aplanar(t).length === 0);
    // debe existir al menos el caso conocido: arXiv devolvio 429.
    expect(vacios.length).toBeGreaterThan(0);
    for (const t of vacios) {
      expect(fallos(t).length).toBeGreaterThan(0);
      expect(fallos(t)[0].error.length).toBeGreaterThan(0);
    }
  });
});

describe('open-data: formas heterogeneas', () => {
  it('usa `indicador` como titulo cuando no hay `titulo`', () => {
    const tema: TemaCrudo = {
      tema: 'datos',
      registros: [
        { fuente: 'Banco Mundial', ok: true, datos: [{ indicador: 'Gasto', pais: 'Brazil' }] },
      ],
    };
    const [item] = aplanar(tema);
    expect(item.titulo).toBe('Gasto');
    expect(item.detalle).toBe('Brazil');
  });

  it('usa `autor` como detalle y `anio` como meta', () => {
    const tema: TemaCrudo = {
      tema: 'lecturas',
      registros: [
        {
          fuente: 'Open Library',
          ok: true,
          datos: [{ titulo: 'La Regenta', autor: 'Leopoldo Alas', anio: 1884 }],
        },
      ],
    };
    const [item] = aplanar(tema);
    expect(item.detalle).toBe('Leopoldo Alas');
    expect(item.meta).toBe('1884');
    expect(item.href).toBeNull();
  });

  it('resuelve el doi a enlace y no lo duplica en la meta', () => {
    const tema: TemaCrudo = {
      tema: 'papers',
      registros: [
        { fuente: 'Crossref', ok: true, datos: [{ titulo: 'Politicising', anio: null, doi: '10.1/x' }] },
      ],
    };
    const [item] = aplanar(tema);
    expect(item.href).toBe('https://doi.org/10.1/x');
    // anio null no aparece y el doi ya es el enlace del titulo: meta vacia.
    expect(item.meta).toBe('');
  });

  it('ignora los nulos en lugar de pintar "null"', () => {
    const tema: TemaCrudo = {
      tema: 'x',
      registros: [
        { fuente: 'WB', ok: true, datos: [{ indicador: 'I', anio: null, valor: null }] },
      ],
    };
    expect(aplanar(tema)[0].meta).toBe('');
  });

  it('redondea el valor a dos decimales', () => {
    const tema: TemaCrudo = {
      tema: 'x',
      registros: [
        { fuente: 'WB', ok: true, datos: [{ indicador: 'I', anio: '2022', valor: 5.61920976638794 }] },
      ],
    };
    expect(aplanar(tema)[0].meta).toBe('2022 · 5.62');
  });

  it('no lanza con `datos` ausente ni con un `registros` roto', () => {
    expect(() => aplanar({ tema: 'a', registros: [{ fuente: 'X', ok: false }] })).not.toThrow();
    expect(aplanar({ tema: 'a', registros: [{ fuente: 'X', ok: false }] })).toEqual([]);
    expect(aplanar({ tema: 'a' } as unknown as TemaCrudo)).toEqual([]);
  });
});

describe('open-data: auxiliares', () => {
  it('enlace prefiere url y cae a doi', () => {
    expect(enlace({ url: 'https://a.test', doi: '10.1/y' })).toBe('https://a.test');
    expect(enlace({ doi: '10.1/y' })).toBe('https://doi.org/10.1/y');
    expect(enlace({})).toBeNull();
  });

  it('humanizar parte el slug', () => {
    expect(humanizar('investigacion-escolar')).toBe('Investigacion Escolar');
    expect(humanizar('libros-libres')).toBe('Libros Libres');
    expect(humanizar('')).toBe('');
  });

  it('etiquetaTopic da la tilde y solo capitaliza la primera palabra', () => {
    expect(etiquetaTema('investigacion-escolar')).toBe('Investigación escolar');
    expect(etiquetaTema('libros-libres')).toBe('Libros libres');
    expect(etiquetaTema('textos-por-asignatura')).toBe('Textos por asignatura');
  });

  it('etiquetaTema cae al generico para un tema desconocido', () => {
    expect(etiquetaTema('tema-nuevo')).toBe('Tema Nuevo');
  });

  it('ningun tema publicado cae al generico (que ademas pondria Title Case)', () => {
    for (const { tema } of manifiesto.temas) {
      // Si faltara la etiqueta manual, etiquetaTema devolveria humanizar(),
      // que capitaliza cada palabra: "Libros Libres", "Textos Por Asignatura".
      expect(etiquetaTema(tema)).not.toBe(humanizar(tema));
    }
  });
});

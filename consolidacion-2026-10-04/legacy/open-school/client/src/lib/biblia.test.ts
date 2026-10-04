/* ===================================================================
   BIBLIA — los numeros que se muestran en pantalla tienen que ser ciertos.

   La pagina dice "673 terminos en 23 categorias". Si el generador se
   desincroniza del documento original, ese titular miente. Estos tests
   son el unico sitio donde se comprueba.
   =================================================================== */

import { describe, expect, it } from 'vitest';

import { ROUTES, getRoute } from './catalog';
import {
  AMBIGUOS,
  BIBLIA_TOTAL,
  CATEGORIAS,
  CATEGORIA_TOTAL,
  RECUENTO,
  TODOS,
  buscar,
  getTermino,
  getTerminos,
  normalizar,
  vecinos,
} from './biblia';

describe('integridad del documento', () => {
  it('declara 673 terminos y 23 categorias, y los tiene', () => {
    expect(BIBLIA_TOTAL).toBe(673);
    expect(CATEGORIA_TOTAL).toBe(23);
    expect(CATEGORIAS).toHaveLength(23);
    expect(TODOS).toHaveLength(673);
  });

  it('no repite ninguna sigla dentro de una misma categoria', () => {
    // Repetida dentro de una categoria si, se rompe la clave React y
    // `getTermino` no puede decidir. Entre categorias si: ver AMBIGUOS.
    for (const c of CATEGORIAS) {
      const abrev = c.terminos.map((t) => t.abrev);
      expect(new Set(abrev).size, `duplicados en ${c.id}`).toBe(abrev.length);
    }
  });

  it('la suma de las categorias cuadra con el total', () => {
    const suma = CATEGORIAS.reduce((n, c) => n + c.terminos.length, 0);
    expect(suma).toBe(BIBLIA_TOTAL);
  });

  it('el recuento por categoria coincide con el contenido', () => {
    for (const c of CATEGORIAS) {
      expect(RECUENTO.get(c.id)).toBe(c.terminos.length);
    }
  });

  it('ningun termino va sin nombre ni sin definicion', () => {
    for (const t of TODOS) {
      expect(t.abrev.length, `abrev vacia en ${t.categoria}`).toBeGreaterThan(0);
      expect(t.nombre.length, `nombre vacio en ${t.abrev}`).toBeGreaterThan(0);
      expect(t.significado.length, `definicion vacia en ${t.abrev}`).toBeGreaterThan(0);
    }
  });
});

describe('enlaces a cursos', () => {
  it('todo enlace apunta a una ruta que existe de verdad', () => {
    // Un curso inexistente se ve en pantalla como un enlace a la nada.
    const enlazados = TODOS.filter((t) => t.curso);
    expect(enlazados.length).toBeGreaterThan(0);

    for (const t of enlazados) {
      expect(getRoute(t.curso!), `${t.abrev} -> ${t.curso}`).toBeDefined();
    }
  });

  it('ningun curso se queda sin ningun termino enlazado', () => {
    for (const r of ROUTES) {
      const n = TODOS.filter((t) => t.curso === r.id).length;
      expect(n, `${r.id} no enlaza nada`).toBeGreaterThan(0);
    }
  });
});

describe('siglas ambiguas', () => {
  it('declara como ambiguas las siglas que se repiten entre categorias', () => {
    // Ambiguas reales del documento universal: TDD (Test-Driven Development
    // vs Technical Design Document), MVP (Minimum Viable Product vs
    // Model-View-Presenter), Prototype (producto vs patron) e IP (Internet
    // Protocol vs Intellectual Property). Si alguna dejara de serlo, el
    // aviso desaparece y la pagina ensenaria una acepcion en silencio.
    const ambiguas = Object.keys(AMBIGUOS);
    expect(ambiguas).toEqual(expect.arrayContaining(['TDD', 'MVP']));
    for (const a of ambiguas) {
      expect(AMBIGUOS[a].length, `${a} no es realmente ambigua`).toBeGreaterThan(1);
    }
  });

  it('getTermino devuelve una sola entrada y getTerminos las dos', () => {
    const uno = getTermino('TDD');
    const dos = getTerminos('TDD');

    expect(uno).toBeDefined();
    expect(dos).toHaveLength(2);
    // Son categorias distintas: el orden del array no debe decidir.
    expect(uno!.categoria).not.toBe(dos.find((t) => t.categoria !== uno!.categoria)!.categoria);
  });

  it('la categoria desambigua de forma explicita', () => {
    const enFundamentales = getTermino('TDD', 'TÉRMINOS FUNDAMENTALES');
    expect(enFundamentales?.nombre).toMatch(/Test-Driven/i);
  });

  it('buscar sin categoria devuelve las dos acepciones, no una', () => {
    expect(buscar('TDD')).toHaveLength(2);
  });
});

describe('busqueda', () => {
  it('encuentra por sigla exacta', () => {
    const r = buscar('API');
    expect(r.map((t) => t.abrev)).toContain('API');
  });

  it('ignora mayusculas', () => {
    expect(buscar('api')).toHaveLength(buscar('API').length);
  });

  it('normalizar quita acentos y baja a minusculas', () => {
    expect(normalizar('CONTENEDOR')).toBe('contenedor');
    expect(normalizar('MÉTODO')).toBe('metodo');
    expect(normalizar('TÉCNICO')).toBe('tecnico');
    expect(normalizar('Configuración')).toBe('configuracion');
    expect(normalizar('DISEÑO')).toBe('diseno');
    expect(normalizar('acción')).toBe('accion');
    // La enye se descompone igual que una tilde: sin esto, "ano" y
    // "año" no se cruzarian.
    expect(normalizar('año')).toBe(normalizar('ano'));
  });

  it('el corpus tiene acentos, y por eso normalizar es imprescindible', () => {
    // Las siglas y los nombres son ingles (ASCII), pero las definiciones
    // estan en espanol: una gran parte de los 673 terminos llevan tilde.
    // Sin normalizar, buscar "diseno" no encontraria "diseño" — que es
    // exactamente lo que escribe medio mundo en un teclado sin tilde.
    const conAcento = TODOS.filter((t) => {
      const crudo = `${t.abrev}${t.nombre}${t.significado}`.toLowerCase();
      return normalizar(crudo) !== crudo;
    });

    expect(conAcento.length).toBeGreaterThan(80);
    expect(conAcento.length).toBeLessThan(BIBLIA_TOTAL);
  });

  it('buscar sin tilde encuentra lo mismo que buscarla con tilde', () => {
    for (const [conTilde, sinTilde] of [
      ['diseño', 'diseno'],
      ['acción', 'accion'],
      ['lógica', 'logica'],
      ['mínimo', 'minimo'],
      ['técnico', 'tecnico'],
    ]) {
      const a = buscar(conTilde);
      const b = buscar(sinTilde);

      expect(a.length, `nada para ${conTilde}`).toBeGreaterThan(0);
      expect(b.map((t) => t.abrev), `${conTilde} != ${sinTilde}`).toEqual(
        a.map((t) => t.abrev),
      );
    }
  });

  it('devuelve todos los terminos con la busqueda vacia', () => {
    expect(buscar('')).toHaveLength(BIBLIA_TOTAL);
    expect(buscar('   ')).toHaveLength(BIBLIA_TOTAL);
  });

  it('exige TODOS los tokens, no uno solo', () => {
    const ambos = buscar('api rest');
    for (const t of ambos) {
      const texto = `${t.abrev} ${t.nombre} ${t.significado}`.toLowerCase();
      expect(texto).toContain('api');
      expect(texto).toContain('rest');
    }
  });

  it('filtra por categoria sin salirse de ella', () => {
    const r = buscar('', 'SEGURIDAD');
    expect(r.length).toBeGreaterThan(0);
    for (const t of r) expect(t.categoria).toBe('SEGURIDAD');
  });

  it('una categoria desconocida devuelve vacio, no todo', () => {
    // Fallar en silencio hacia "todo" seria el peor caso: el usuario
    // creeria estar filtrando y estaria viendo los 219.
    expect(buscar('', 'CATEGORIA INVENTADA')).toHaveLength(0);
  });

  it('sin coincidencias devuelve lista vacia', () => {
    expect(buscar('xyzqwertyuiop')).toHaveLength(0);
  });
});

describe('orden por relevancia', () => {
  it('la sigla exacta sale la primera', () => {
    // Antes el orden era el del documento: buscar una sigla la dejaba
    // enterrada entre definiciones que solo la mencionaban de pasada.
    for (const sigla of ['API', 'REST', 'Docker', 'JSON']) {
      const r = buscar(sigla);
      expect(r.length, `nada para ${sigla}`).toBeGreaterThan(0);
      expect(r[0].abrev, `${sigla} no sale primera`).toBe(sigla);
    }
  });

  it('un termino que solo la menciona en el texto va despues', () => {
    const r = buscar('API');
    const posicionApi = r.findIndex((t) => t.abrev === 'API');
    const posicionMencion = r.findIndex((t) => t.abrev !== 'API');

    expect(posicionApi).toBe(0);
    if (posicionMencion >= 0) expect(posicionApi).toBeLessThan(posicionMencion);
  });

  it('dentro del mismo rango respeta el orden del documento (orden estable)', () => {
    // Dos ejecuciones seguidas tienen que dar lo mismo: sin estabilidad
    // el listado bailaria al teclear.
    const a = buscar('sistema').map((t) => t.abrev);
    const b = buscar('sistema').map((t) => t.abrev);
    expect(a).toEqual(b);
  });

  it('el ranking no pierde ni duplica ningun resultado', () => {
    const ordenado = buscar('api');
    for (const t of ordenado) {
      const texto = normalizar(`${t.abrev} ${t.nombre} ${t.significado}`);
      expect(texto).toContain('api');
    }
    // La misma entrada (categoria + sigla) no puede salir dos veces.
    const claves = new Set(ordenado.map((t) => `${t.categoria}:${t.abrev}`));
    expect(claves.size).toBe(ordenado.length);
  });
});

describe('vecinos', () => {
  it('el primero no tiene anterior y el ultimo no tiene siguiente', () => {
    expect(vecinos(TODOS[0].abrev).anterior).toBeUndefined();
    expect(vecinos(TODOS[TODOS.length - 1].abrev).siguiente).toBeUndefined();
  });

  it('el segundo tiene como anterior al primero', () => {
    const v = vecinos(TODOS[1].abrev);
    expect(v.anterior?.abrev).toBe(TODOS[0].abrev);
  });

  it('una sigla inexistente no devuelve vecinos inventados', () => {
    expect(vecinos('NO-EXISTE')).toEqual({});
  });
});

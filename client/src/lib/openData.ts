/* ===================================================================
   OPEN-DATA — aplanar el contenido abierto real para la pagina Escuela.

   Los ficheros de open-data/data/*.json no comparten forma: cada fuente
   trae sus propias claves (url, autor, doi, indicador, valor...) y uno
   de los temas llega sin `datos` porque su llamada fallo. Aplanar aqui,
   como funcion pura, deja a la pagina un unico tipo y es justo lo que
   los tests pueden fijar: si manana cambia una clave, salta el test y
   no la pantalla.
   =================================================================== */

/** Un item tal cual viene: las claves dependen de la fuente. */
export type ItemCrudo = {
  titulo?: string;
  indicador?: string;
  autor?: string;
  pais?: string;
  anio?: number | string | null;
  valor?: number | null;
  url?: string;
  doi?: string;
  fragmento?: string;
};

/** Una consulta a una fuente. `datos` falta cuando la llamada fallo. */
export type RegistroCrudo = {
  fuente: string;
  spec?: string;
  ok: boolean;
  error?: string;
  datos?: ItemCrudo[];
};

/** Un tema: `open-data/data/<tema>.json`. */
export type TemaCrudo = {
  tema: string;
  portal?: string;
  registros: RegistroCrudo[];
};

/** Item ya aplanado: lo unico que la pagina sabe pintar. */
export type Item = {
  id: string;
  titulo: string;
  fuente: string;
  detalle: string;
  meta: string;
  href: string | null;
  fragmento: string;
};

/** Manifiesto: `open-data/topics.json`. */
export type Manifiesto = {
  portal: string;
  repo?: string;
  dominio?: string;
  generado_utc: string;
  orden_idiomas?: string[];
  temas: { tema: string; fuentes_ok: number; fuentes_total: number }[];
};

/** `investigacion-escolar` -> `Investigacion escolar`. */
export function humanizar(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

/**
 * Etiquetas de los temas publicados, escritas a mano porque el generico
 * no puede saber la tilde ni que en español solo se capitaliza la
 * primera palabra. `humanizar` queda como respaldo para temas nuevos.
 */
const ETIQUETAS: Record<string, string> = {
  'textos-por-asignatura': 'Textos por asignatura',
  'lecturas-obligatorias': 'Lecturas obligatorias',
  'ciencia-y-actualidad': 'Ciencia y actualidad',
  'datos-educativos': 'Datos educativos',
  'libros-libres': 'Libros libres',
  'investigacion-escolar': 'Investigación escolar',
};

/** Nombre legible de un tema, con su tilde puesta. */
export function etiquetaTema(slug: string): string {
  return ETIQUETAS[slug] ?? humanizar(slug);
}

/** Enlace canonico de un DOI; null si el item no trae ni url ni doi. */
export function enlace(d: ItemCrudo): string | null {
  if (d.url) return d.url;
  return d.doi ? `https://doi.org/${d.doi}` : null;
}

/**
 * Convierte un tema en una lista plana de items homogeneousos.
 *
 * Nunca lanza: una fuente sin `datos` (o con `datos` que no es un array)
 * aporta cero items en lugar de romper la pagina entera. El id es
 * posicional y estable, para poder usarlo de clave de React.
 */
export function aplanar(tema: TemaCrudo): Item[] {
  const salida: Item[] = [];
  const registros = Array.isArray(tema.registros) ? tema.registros : [];

  registros.forEach((reg, i) => {
    const datos = Array.isArray(reg.datos) ? reg.datos : [];
    datos.forEach((d, j) => {
      const href = enlace(d);
      // El doi, si lo hay, ya es el href del titulo: no se repite aqui.
      const meta = [
        d.anio != null ? String(d.anio) : '',
        d.valor != null ? d.valor.toFixed(2) : '',
      ]
        .filter(Boolean)
        .join(' · ');

      salida.push({
        id: `${tema.tema}/${i}/${j}`,
        titulo: d.titulo ?? d.indicador ?? reg.spec ?? 'Sin titulo',
        fuente: reg.fuente,
        detalle: d.autor ?? d.pais ?? '',
        meta,
        href,
        fragmento: d.fragmento ?? '',
      });
    });
  });

  return salida;
}

/** Fuentes que fallaron, para poder decirlo en vez de ocultarlo. */
export function fallos(tema: TemaCrudo): { fuente: string; error: string }[] {
  const registros = Array.isArray(tema.registros) ? tema.registros : [];
  return registros
    .filter((r) => r.ok === false)
    .map((r) => ({ fuente: r.fuente, error: r.error ?? 'sin detalle' }));
}

import { describe, expect, it } from "vitest";
import { getCatalog } from "./catalog";

describe("catálogo público de LATAM Europa", () => {
  it("entrega guías y fuentes con la trazabilidad necesaria", () => {
    const result = getCatalog();

    expect(result.guides.length).toBeGreaterThanOrEqual(7);
    expect(result.sources.length).toBeGreaterThanOrEqual(12);
    expect(result.sources.every(source => Boolean(source.entity && source.url && source.lastCheckedAt))).toBe(true);
  });

  it("filtra recursos por tema", () => {
    const result = getCatalog({ topic: "educacion" });

    expect(result.guides).toHaveLength(1);
    expect(result.guides[0]?.slug).toBe("estudios-homologacion");
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0]?.slug).toBe("educacion-homologacion");
  });

  it("encuentra contenido sin distinguir acentos ni mayúsculas", () => {
    const result = getCatalog({ query: "HOMOLOGACION" });

    expect(result.guides.map(guide => guide.slug)).toContain("estudios-homologacion");
    expect(result.sources.map(source => source.slug)).toContain("educacion-homologacion");
  });

  it("encuentra la fuente de NUSS y la guía de empleo vinculada", () => {
    const result = getCatalog({ query: "nuss" });

    expect(result.sources.map(source => source.slug)).toContain("seguridad-social-nuss");
    expect(result.guides.map(guide => guide.slug)).toContain("buscar-trabajo");
  });

  it("no entrega resultados para una búsqueda que no existe", () => {
    const result = getCatalog({ query: "inexistente-xyz" });

    expect(result.guides).toEqual([]);
    expect(result.sources).toEqual([]);
  });
});

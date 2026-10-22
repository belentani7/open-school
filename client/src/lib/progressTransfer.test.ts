import { describe, expect, it } from "vitest";
import { exportProgressBackup, importProgressBackup } from "./progressTransfer";

const counts = { everyday: 2, coding: 3 };
const now = new Date("2026-10-22T10:00:00.000Z");

describe("portabilidad de progreso educativo", () => {
  it("exporta e importa únicamente unidades publicadas sin identidad", () => {
    const json = exportProgressBackup(
      { everyday: [1, 0], coding: [2] }, counts, now
    );
    expect(JSON.parse(json)).toEqual({
      format: "open-school-progress",
      version: 1,
      exportedAt: now.toISOString(),
      completed: { everyday: [0, 1], coding: [2] },
    });
    expect(json).not.toContain("anon.id");
    expect(importProgressBackup(json, counts)).toEqual({
      everyday: [0, 1], coding: [2],
    });
  });

  it("rechaza rutas inexistentes, índices fuera de catálogo y duplicados", () => {
    const withCompleted = (completed: unknown) => JSON.stringify({
      format: "open-school-progress", version: 1,
      exportedAt: now.toISOString(), completed,
    });
    expect(() => importProgressBackup(withCompleted({ unknown: [0] }), counts)).toThrow();
    expect(() => importProgressBackup(withCompleted({ everyday: [2] }), counts)).toThrow();
    expect(() => importProgressBackup(withCompleted({ everyday: [-1] }), counts)).toThrow();
    expect(() => importProgressBackup(withCompleted({ everyday: [0, 0] }), counts)).toThrow();
    expect(() => importProgressBackup(withCompleted({ coding: ["0"] }), counts)).toThrow();
  });

  it("rechaza JSON inválido, versiones desconocidas y archivos excesivos", () => {
    expect(() => importProgressBackup("invalid", counts)).toThrow();
    expect(() => importProgressBackup("{}", counts)).toThrow();
    expect(() => importProgressBackup(" ".repeat(65537), counts)).toThrow();
    expect(() => importProgressBackup(JSON.stringify({
      format: "open-school-progress", version: 2,
      exportedAt: now.toISOString(), completed: {},
    }), counts)).toThrow();
  });

  it("rechaza objetos con valores de prototipo en vez de admitir rutas falsas", () => {
    const json = '{"format":"open-school-progress","version":1,"exportedAt":"2026-10-22T10:00:00.000Z","completed":{"__proto__":[0]}}';
    expect(() => importProgressBackup(json, counts)).toThrow();
  });
});

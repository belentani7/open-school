import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  recordSourceCheck: vi.fn().mockResolvedValue(true),
}));

import { recordSourceCheck } from "./db";
import { officialSources } from "@shared/latam-data";
import { runOfficialSourceChecks } from "./sourceMonitor";

describe("comprobador de fuentes oficiales", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(recordSourceCheck).mockResolvedValue(true);
  });

  it("registra una comprobación verificada para cada fuente cuando las respuestas son satisfactorias", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 200, url: "https://fuente.example.es/resuelta" });
    vi.stubGlobal("fetch", fetchMock);

    const result = await runOfficialSourceChecks();

    expect(result.checked).toBe(officialSources.length);
    expect(result.verified).toBe(officialSources.length);
    expect(result.failed).toBe(0);
    expect(recordSourceCheck).toHaveBeenCalledTimes(officialSources.length);
    expect(fetchMock).toHaveBeenCalledTimes(officialSources.length);
  });

  it("conserva un resultado fallido sin interrumpir el resto de fuentes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 503, url: "https://fuente.example.es/no-disponible" })
      .mockResolvedValue({ status: 204, url: "https://fuente.example.es/resuelta" });
    vi.stubGlobal("fetch", fetchMock);

    const result = await runOfficialSourceChecks();

    expect(result.failed).toBe(1);
    expect(result.verified).toBe(officialSources.length - 1);
    expect(result.results[0]).toMatchObject({ status: "failed", statusCode: 503 });
    expect(recordSourceCheck).toHaveBeenCalledTimes(officialSources.length);
  });
});

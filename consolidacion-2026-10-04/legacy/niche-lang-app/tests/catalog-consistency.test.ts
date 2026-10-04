import { describe, expect, it } from "vitest";
import { NICHES } from "../constants/niches";
import { ALL_LESSONS_BY_NICHE } from "../lib/data/lesson-templates";

describe("Catalog consistency", () => {
  it("keeps lesson counts aligned with the actual lesson catalog", () => {
    for (const [nicheId, niche] of Object.entries(NICHES)) {
      expect(niche.lessonsCount).toBe(ALL_LESSONS_BY_NICHE[nicheId as keyof typeof ALL_LESSONS_BY_NICHE].length);
    }
  });

  it("keeps every module content shape compatible with its module type", () => {
    for (const lessons of Object.values(ALL_LESSONS_BY_NICHE)) {
      for (const lesson of lessons) {
        for (const module of lesson.modules) {
          if (module.type === "vocabulary") expect(Array.isArray(module.content)).toBe(true);
          if (module.type === "dialogue") expect(Array.isArray(module.content.lines)).toBe(true);
          if (module.type === "exercise") expect(module.content.options.length).toBeGreaterThan(1);
          if (module.type === "introduction" || module.type === "summary") {
            expect(typeof module.content).toBe("string");
          }
        }
      }
    }
  });
});

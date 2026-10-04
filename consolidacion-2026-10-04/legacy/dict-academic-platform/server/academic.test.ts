import { describe, expect, it } from "vitest";
import { courses, getCourse, getCourseDetail, program } from "../shared/dictCatalog";

const locales = ["es", "pt", "en"] as const;

function findDependencyCycle() {
  const byCode = new Map(courses.map(course => [course.code, course]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (code: string): boolean => {
    if (visiting.has(code)) return true;
    if (visited.has(code)) return false;
    visiting.add(code);
    const current = byCode.get(code);
    const hasCycle = current?.prerequisites.some(visit) ?? false;
    visiting.delete(code);
    visited.add(code);
    return hasCycle;
  };
  return courses.some(course => visit(course.code));
}

describe("D.I.C.T. academic catalog", () => {
  it("defines ten complete semesters with 300 internal academic credits", () => {
    expect(courses).toHaveLength(30);
    expect(new Set(courses.map(course => course.semester))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    expect(courses.reduce((total, course) => total + course.credits, 0)).toBe(300);
  });

  it("keeps every course and detailed brief localized in ES, PT and EN", () => {
    courses.forEach(course => locales.forEach(locale => {
      expect(course.title[locale].trim().length).toBeGreaterThan(3);
      expect(course.summary[locale].trim().length).toBeGreaterThan(8);
    }));
    courses.forEach(course => {
      const detail = getCourseDetail(course.code);
      expect(detail).toBeDefined();
      locales.forEach(locale => {
        expect(detail!.objectives[locale]).not.toHaveLength(0);
        expect(detail!.competencies[locale]).not.toHaveLength(0);
        expect(detail!.syllabus[locale]).not.toHaveLength(0);
        expect(detail!.aiPolicy[locale].trim().length).toBeGreaterThan(20);
      });
    });
  });

  it("uses the exact CA name and internally coherent assessment weights", () => {
    locales.forEach(locale => {
      expect(program.creditName[locale]).toBe("Créditos Académicos Internos (CA)");
      expect(program.disclaimer[locale]).toMatch(/ECTS/);
    });
    courses.forEach(course => {
      const detail = getCourseDetail(course.code);
      expect(detail).toBeDefined();
      expect(detail!.assessment.reduce((sum, item) => sum + item.weight, 0)).toBe(100);
    });
  });

  it("contains valid, non-circular blocking prerequisites", () => {
    const courseCodes = new Set(courses.map(course => course.code));
    courses.forEach(course => course.prerequisites.forEach(prerequisite => expect(courseCodes.has(prerequisite)).toBe(true)));
    expect(findDependencyCycle()).toBe(false);
    expect(getCourse("DCT-403")?.prerequisites).toEqual(["DCT-401", "DCT-303"]);
    expect(getCourse("DCT-506")?.prerequisites).toEqual(["DCT-505"]);
  });
});

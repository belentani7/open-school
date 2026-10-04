import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "client/src");
const localizedViews = [
  "pages/Home.tsx", "pages/Catalog.tsx", "pages/CourseDetail.tsx", "pages/Library.tsx", "pages/Labs.tsx", "pages/CertificateVerify.tsx", "pages/StudentDashboard.tsx", "pages/AcademicRecord.tsx", "pages/StudentProfile.tsx", "pages/ProjectsPage.tsx", "pages/PublicPortfolio.tsx", "pages/TutorPage.tsx", "components/DashboardLayout.tsx", "components/PublicShell.tsx", "components/ErrorBoundary.tsx",
];

describe("D.I.C.T. localization coverage", () => {
  it("keeps ES, PT and EN variants in the public and authenticated primary views", () => {
    localizedViews.forEach(relativePath => {
      const source = readFileSync(resolve(root, relativePath), "utf8");
      expect(source, relativePath).toMatch(/\bes\s*:/);
      expect(source, relativePath).toMatch(/\bpt\s*:/);
      expect(source, relativePath).toMatch(/\ben\s*:/);
    });
  });

  it("keeps the exact CA name and non-official notice in both navigation shells", () => {
    const publicShell = readFileSync(resolve(root, "components/PublicShell.tsx"), "utf8");
    const studentShell = readFileSync(resolve(root, "components/DashboardLayout.tsx"), "utf8");
    expect(publicShell).toContain("program.disclaimer");
    expect(publicShell).toContain("program.creditName");
    expect(studentShell).toContain("Créditos Académicos Internos (CA)");
    expect(studentShell).toMatch(/oficial|official/i);
    expect(studentShell).toMatch(/ECTS/);
    expect(publicShell).not.toContain('aria-label="Language selector"');
    expect(studentShell).not.toContain("Registro académico interno.</strong> Esta plataforma");
  });

  it("uses localized values for formerly static authenticated labels and placeholders", () => {
    const dashboard = readFileSync(resolve(root, "pages/StudentDashboard.tsx"), "utf8");
    const projects = readFileSync(resolve(root, "pages/ProjectsPage.tsx"), "utf8");
    const record = readFileSync(resolve(root, "pages/AcademicRecord.tsx"), "utf8");
    expect(dashboard).toContain("activeCourseTitle");
    expect(projects).toContain("placeholder={text.titlePlaceholder}");
    expect(projects).toContain("placeholder={text.technologiesPlaceholder}");
    expect(record).toContain("certificateTypeLabel");
    expect(record).not.toContain("certificate ? certificate.certificateType :");
  });
});

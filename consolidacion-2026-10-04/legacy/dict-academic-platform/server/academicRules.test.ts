import { describe, expect, it } from "vitest";
import { assessmentWeightsAreValid, certificateVerification, unmetPrerequisites } from "../shared/academicRules";

describe("D.I.C.T. academic rules", () => {
  it("allows a prerequisite only after completion at the required grade", () => {
    expect(unmetPrerequisites(["DCT-102"], [{ code: "DCT-102", status: "completed", finalGrade: 65 }])).toEqual([]);
    expect(unmetPrerequisites(["DCT-102", "DCT-103"], [{ code: "DCT-102", status: "completed", finalGrade: 64 }])).toEqual(["DCT-102", "DCT-103"]);
  });

  it("accepts only complete assessment weight models", () => {
    expect(assessmentWeightsAreValid({ quiz: 15, lab: 30, project: 35, research: 10, defense: 10 })).toBe(true);
    expect(assessmentWeightsAreValid({ quiz: 40, lab: 40 })).toBe(false);
  });

  it("returns a positive internal-only certificate response for an active record", () => {
    const response = certificateVerification({ certificateType: "completion", programVersion: "v1.0", awardedCredits: 300, issuedAt: new Date("2026-01-01"), revokedAt: null });
    expect(response).toMatchObject({ valid: true, recordType: "internal_academic_record", awardedCredits: 300 });
    expect(response.valid && response.disclaimer).toMatch(/not an official degree/i);
    expect(certificateVerification(undefined)).toEqual({ valid: false, recordType: "internal_academic_record" });
  });
});

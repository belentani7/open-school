import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function unauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

function standardStudentContext(): TrpcContext {
  return {
    user: { id: 22, openId: "student-22", name: "Student", email: "student@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

function administratorContext(): TrpcContext {
  return {
    user: { id: 1, openId: "admin-1", name: "Administrator", email: "admin@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("D.I.C.T. access boundaries", () => {
  it("allows public curriculum exploration without a session", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    const catalog = await caller.academic.catalog({ locale: "en", semester: 1 });
    expect(catalog.courses).toHaveLength(3);
    expect(catalog.courses[0]?.title).toBe("Digital Foundations & Computing");
  });

  it("rejects unauthenticated access to private student records and tutor", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.student.record()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.tutor.ask({ locale: "en", mode: "hint", message: "Help me find a small next step." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.student.attachProjectFile({ projectId: 1, displayName: "evidence.md", mimeType: "text/markdown", base64Content: "dGVzdA==", accessLevel: "private" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.student.submitAssessment({ assessmentItemId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.student.enroll({ courseCode: "DCT-102" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.student.projectFiles({ projectId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects administrative operations for a standard student", async () => {
    const caller = appRouter.createCaller(standardStudentContext());
    await expect(caller.administration.finalizeEnrollment({ enrollmentId: 1, finalGrade: 88 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.administration.issueCertificate({ userId: 22, certificateType: "completion", programVersion: "v1.0", awardedCredits: 300, competencySnapshot: ["SOFTWARE-FOUNDATIONS"] })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.administration.gradeAssessment({ submissionId: 1, score: 88, feedback: "Clear methodology." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects an assessment configuration whose weights do not total 100", async () => {
    const caller = appRouter.createCaller(administratorContext());
    await expect(caller.administration.setAssessmentWeights({ courseCode: "DCT-102", weights: { quiz: 40, lab: 40 } })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates enrollment and progress input before data operations", async () => {
    const caller = appRouter.createCaller(standardStudentContext());
    await expect(caller.student.enroll({ courseCode: "INVALID" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.student.updateProgress({ enrollmentId: 1, progressPercent: 101 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

});

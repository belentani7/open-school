import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const db = vi.hoisted(() => ({
  addProjectFileReference: vi.fn(), createStudentProject: vi.fn(), enrollStudent: vi.fn(), finalizeEnrollment: vi.fn(), getCourseAssessmentWeights: vi.fn(), getCourseIdByCode: vi.fn(), getOwnedEnrollment: vi.fn(), getOwnedStudentProject: vi.fn(), getPublicPortfolio: vi.fn(), getStudentDashboard: vi.fn(), getDb: vi.fn(), gradeAssessmentSubmission: vi.fn(), hasCourseEnrollment: vi.fn(), issueInternalCertificate: vi.fn(), listAssessmentsForStudent: vi.fn(), listOwnedProjectFiles: vi.fn(), listStudentCertificates: vi.fn(), listStudentCompetencies: vi.fn(), listStudentProjects: vi.fn(), setCourseAssessmentWeights: vi.fn(), submitStudentAssessment: vi.fn(), updateStudentProfile: vi.fn(), updateStudentProgress: vi.fn(), verifyInternalCertificate: vi.fn(),
}));

vi.mock("./db", () => db);
const { appRouter } = await import("./routers");

function context(role: "user" | "admin" = "user"): TrpcContext {
  return { user: { id: role === "admin" ? 1 : 22, openId: `${role}-id`, name: role, email: `${role}@example.com`, loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: () => undefined } as TrpcContext["res"] };
}

beforeEach(() => {
  vi.clearAllMocks();
  db.getStudentDashboard.mockResolvedValue({ credits: 0, coursesCompleted: 0, activeCourses: 0, projects: 0, transcript: [], profile: undefined });
  db.getCourseIdByCode.mockResolvedValue(101);
  db.getOwnedEnrollment.mockResolvedValue({ id: 9 }); db.hasCourseEnrollment.mockResolvedValue(true); db.getOwnedStudentProject.mockResolvedValue({ id: 77 });
  db.enrollStudent.mockResolvedValue(undefined);
  db.updateStudentProgress.mockResolvedValue({ id: 9, userId: 22, progressPercent: 70 });
  db.submitStudentAssessment.mockResolvedValue({ id: 31, assessmentItemId: 14, userId: 22, submittedAt: new Date() });
  db.gradeAssessmentSubmission.mockResolvedValue({ id: 31, score: 89, gradedByUserId: 1 });
  db.issueInternalCertificate.mockResolvedValue({ verificationCode: "DCT-DEMO2026", certificateType: "completion", awardedCredits: 300 });
  db.verifyInternalCertificate.mockResolvedValue({ certificateType: "completion", programVersion: "v1.0", awardedCredits: 300, issuedAt: new Date("2026-01-01"), revokedAt: null });
  db.listStudentCertificates.mockResolvedValue([]); db.listStudentCompetencies.mockResolvedValue([]); db.listStudentProjects.mockResolvedValue([]); db.listOwnedProjectFiles.mockResolvedValue([]); db.listAssessmentsForStudent.mockResolvedValue([]); db.getCourseAssessmentWeights.mockResolvedValue(undefined);
});

describe("D.I.C.T. protected academic flows", () => {
  it("enrols a student in an available first-semester course and keeps advanced prerequisites blocking", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.student.enroll({ courseCode: "DCT-102" })).resolves.toEqual({ enrolled: true, courseCode: "DCT-102" });
    expect(db.enrollStudent).toHaveBeenCalledWith(22, 101);
    await expect(caller.student.enroll({ courseCode: "DCT-201" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("updates owned progress and submits an assessment through the student session", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.student.updateProgress({ enrollmentId: 9, progressPercent: 70 })).resolves.toMatchObject({ userId: 22, progressPercent: 70 });
    await expect(caller.student.submitAssessment({ assessmentItemId: 14 })).resolves.toMatchObject({ userId: 22, assessmentItemId: 14 });
    expect(db.updateStudentProgress).toHaveBeenCalledWith(22, 9, 70);
    expect(db.submitStudentAssessment).toHaveBeenCalledWith(22, 14);
  });

  it("allows only an administrator to grade and issue an internal certificate that can be verified publicly", async () => {
    const admin = appRouter.createCaller(context("admin"));
    await expect(admin.administration.gradeAssessment({ submissionId: 31, score: 89, feedback: "Clear evidence." })).resolves.toMatchObject({ score: 89, gradedByUserId: 1 });
    await expect(admin.administration.issueCertificate({ userId: 22, certificateType: "completion", programVersion: "v1.0", awardedCredits: 300, competencySnapshot: ["SOFTWARE-FOUNDATIONS"] })).resolves.toMatchObject({ verificationCode: "DCT-DEMO2026" });
    const publicCaller = appRouter.createCaller({ ...context(), user: null });
    await expect(publicCaller.certificates.verify({ verificationCode: "DCT-DEMO2026" })).resolves.toMatchObject({ valid: true, awardedCredits: 300, recordType: "internal_academic_record" });
  });

  it("scopes certificates and project file references to the current user", async () => {
    const caller = appRouter.createCaller(context());
    await caller.student.certificates(); await caller.student.assessments({ courseCode: "DCT-102" });
    const foreignProjectFiles = await caller.student.projectFiles({ projectId: 77 });
    expect(foreignProjectFiles).toEqual([]);
    expect(db.listStudentCertificates).toHaveBeenCalledWith(22);
    expect(db.listAssessmentsForStudent).toHaveBeenCalledWith(22, 101);
    expect(db.listOwnedProjectFiles).toHaveBeenCalledWith(22, 77);
  });

  it("surfaces failures in progress, submission, grading and certificate issuance without a silent success", async () => {
    const student = appRouter.createCaller(context()); const admin = appRouter.createCaller(context("admin"));
    db.updateStudentProgress.mockRejectedValueOnce(new Error("Enrollment not found"));
    await expect(student.student.updateProgress({ enrollmentId: 9, progressPercent: 70 })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    db.submitStudentAssessment.mockRejectedValueOnce(new Error("Enrollment required before submitting an assessment"));
    await expect(student.student.submitAssessment({ assessmentItemId: 14 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    db.gradeAssessmentSubmission.mockRejectedValueOnce(new Error("Submission not found"));
    await expect(admin.administration.gradeAssessment({ submissionId: 31, score: 89, feedback: "Clear evidence." })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    db.issueInternalCertificate.mockRejectedValueOnce(new Error("Certificate storage failed"));
    await expect(admin.administration.issueCertificate({ userId: 22, certificateType: "completion", programVersion: "v1.0", awardedCredits: 300, competencySnapshot: ["SOFTWARE-FOUNDATIONS"] })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });

  it("rejects progress, assessments and project files that do not belong to the current student", async () => {
    const caller = appRouter.createCaller(context());
    db.getOwnedEnrollment.mockResolvedValueOnce(undefined);
    await expect(caller.student.updateProgress({ enrollmentId: 900, progressPercent: 30 })).rejects.toMatchObject({ code: "NOT_FOUND" });
    db.hasCourseEnrollment.mockResolvedValueOnce(false);
    await expect(caller.student.assessments({ courseCode: "DCT-102" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    db.getOwnedStudentProject.mockResolvedValueOnce(undefined);
    await expect(caller.student.projectFiles({ projectId: 900 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects a submission without course enrollment and an attachment on another student's project", async () => {
    const caller = appRouter.createCaller(context());
    db.submitStudentAssessment.mockRejectedValueOnce(new Error("Enrollment required before submitting an assessment"));
    await expect(caller.student.submitAssessment({ assessmentItemId: 404 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED", message: "Enrollment required before submitting an assessment" });
    db.getOwnedStudentProject.mockResolvedValueOnce(undefined);
    await expect(caller.student.attachProjectFile({ projectId: 404, displayName: "evidence.md", mimeType: "text/markdown", base64Content: "dGVzdA==", accessLevel: "private" })).rejects.toMatchObject({ code: "NOT_FOUND", message: "Project not found" });
  });
});

export type TranscriptEntry = { code: string; status: string; finalGrade: number | null };

export function unmetPrerequisites(prerequisites: string[], transcript: TranscriptEntry[]) {
  return prerequisites.filter(required => {
    const record = transcript.find(item => item.code === required);
    return record?.status !== "completed" || (record.finalGrade ?? 0) < 65;
  });
}

export function assessmentWeightsAreValid(weights: Record<string, number>) {
  const values = Object.values(weights);
  return values.length > 0 && values.every(value => Number.isInteger(value) && value >= 0 && value <= 100) && values.reduce((sum, value) => sum + value, 0) === 100;
}

export function certificateVerification(certificate: { certificateType: string; programVersion: string; awardedCredits: number; issuedAt: Date; revokedAt: Date | null } | undefined) {
  if (!certificate || certificate.revokedAt) return { valid: false, recordType: "internal_academic_record" as const };
  return { valid: true, recordType: "internal_academic_record" as const, certificateType: certificate.certificateType, programVersion: certificate.programVersion, awardedCredits: certificate.awardedCredits, issuedAt: certificate.issuedAt, disclaimer: "This is an internal D.I.C.T. academic record, not an official degree or ECTS credential." };
}

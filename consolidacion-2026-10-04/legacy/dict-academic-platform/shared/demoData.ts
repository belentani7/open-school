/** Demonstration-only data for product walkthroughs. It is not persisted as a user record. */
export const demoAcademicRecord = {
  label: "DEMONSTRATION DATA — INTERNAL ACADEMIC RECORD",
  credits: 84,
  totalCredits: 300,
  transcript: [
    { code: "DCT-102", name: "Programación I con Python", credits: 10, grade: 83, level: "B" },
    { code: "DCT-105", name: "Programación II y Estructuras de Datos", credits: 10, grade: 78, level: "C" },
    { code: "DCT-201", name: "Ingeniería de Software y Bases de Datos", credits: 10, grade: 86, level: "C" },
    { code: "DCT-301", name: "Machine Learning Aplicado", credits: 10, grade: null, level: "D" },
  ],
  certificate: { verificationCode: "DCT-DEMO-8F21", competency: "Software Foundations", credits: 30 },
  projects: [
    { courseCode: "DCT-201", title: "API for learning records", summary: "Data model, authorization boundaries, typed contract and test plan." },
    { courseCode: "DCT-301", title: "Reproducible classification baseline", summary: "Metrics, experiment log, risk note and documented limitations." },
  ],
} as const;

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateCurriculum() {
  const curriculum = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString().split("T")[0],
    certifications: [],
    modules: [],
    levels: [],
    learningPaths: [],
  };

  const output = `export const curriculumAcademy = ${JSON.stringify(curriculum, null, 2)} as const;\nexport type CurriculumAcademy = typeof curriculumAcademy;`;

  writeFileSync(join(__dirname, "..", "src", "data", "curriculum-academy.ts"), output);
  console.log("Generated curriculum-academy.ts");
}

generateCurriculum().catch(console.error);

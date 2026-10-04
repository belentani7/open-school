import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateCertifications() {
  const certifications = [];

  const output = `export const certifications = ${JSON.stringify(certifications, null, 2)} as const;\nexport type Certification = typeof certifications[number];`;

  writeFileSync(join(__dirname, "..", "src", "data", "certifications.ts"), output);
  console.log("Generated certifications.ts");
}

generateCertifications().catch(console.error);

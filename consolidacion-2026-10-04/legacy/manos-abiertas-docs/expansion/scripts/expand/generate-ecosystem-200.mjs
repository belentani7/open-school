import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateEcosystem200() {
  const categories = [];
  const concepts = [];

  const output = `export const ecosystemCategories = [...];\nexport const ecosystem200: EcosystemConcept[] = [...];`;

  writeFileSync(join(__dirname, "..", "src", "data", "ecosystem-200.ts"), output);
  console.log("Generated ecosystem-200.ts");
}

generateEcosystem200().catch(console.error);

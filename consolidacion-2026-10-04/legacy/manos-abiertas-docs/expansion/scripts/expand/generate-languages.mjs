import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateLanguages() {
  const languages = [];

  const output = `export const languages39 = ${JSON.stringify(languages, null, 2)} as const;\nexport type Language39 = typeof languages39[number];`;

  writeFileSync(join(__dirname, "..", "src", "data", "languages-39.ts"), output);
  console.log("Generated languages-39.ts");
}

generateLanguages().catch(console.error);

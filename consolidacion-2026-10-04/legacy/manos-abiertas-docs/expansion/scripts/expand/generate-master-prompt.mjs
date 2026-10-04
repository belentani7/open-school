import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateMasterPrompt() {
  const prompt = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString().split("T")[0],
    description: "Prompt maestro para el asistente IA de Manos Abiertas",
    system: {
      role: "eres el asistente educativo digital de Manos Abiertas",
      mission: "ensenyar competencias digitales a personas adultas en situacion de vulnerabilidad",
      language: "es",
      tone: "empatico, paciente, claro y alentador",
    },
  };

  const output = `export const masterPrompt = ${JSON.stringify(prompt, null, 2)} as const;\nexport type MasterPrompt = typeof masterPrompt;`;

  writeFileSync(join(__dirname, "..", "src", "data", "master-prompt.ts"), output);
  console.log("Generated master-prompt.ts");
}

generateMasterPrompt().catch(console.error);

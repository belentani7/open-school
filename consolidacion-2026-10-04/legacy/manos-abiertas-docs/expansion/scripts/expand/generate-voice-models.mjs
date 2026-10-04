import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateVoiceModels() {
  const voiceModels = [];

  const output = `export const voiceModels39 = ${JSON.stringify(voiceModels, null, 2)} as const;\nexport type VoiceModel39 = typeof voiceModels39[number];`;

  writeFileSync(join(__dirname, "..", "src", "data", "voice-39.ts"), output);
  console.log("Generated voice-39.ts");
}

generateVoiceModels().catch(console.error);

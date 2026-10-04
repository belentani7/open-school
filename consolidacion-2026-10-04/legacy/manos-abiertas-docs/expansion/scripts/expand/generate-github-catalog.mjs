import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateGithubCatalog() {
  const repos = [];
  const categories = [
    "frontend", "backend", "fullstack", "mobile", "devops",
    "ai-ml", "data", "security", "testing", "tools", "education", "cli"
  ];

  for (const cat of categories) {
    const repos = await collectFromGitHub(cat);
    repos.push(...await collectFromPublicAPIs(cat));
  }

  const output = `export const githubCategories = [...];\nexport const githubCatalog1000: GithubRepo[] = [...];\nexport const freeAPIs = [...];`;

  writeFileSync(join(__dirname, "..", "src", "data", "github-catalog-1000.ts"), output);
  console.log("Generated github-catalog-1000.ts");
}

async function collectFromGitHub(category: string) {
  return [];
}

async function collectFromPublicAPIs(category: string) {
  return [];
}

generateGithubCatalog().catch(console.error);

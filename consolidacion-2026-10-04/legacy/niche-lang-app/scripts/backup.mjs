import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const projectDir = "/home/ubuntu/niche-lang-app";
const dateStr = new Date().toISOString().slice(0, 10);
const backupName = `Proyecto_NicheLang_Backup_${dateStr}.zip`;
const backupDir = "/home/ubuntu/nichelang_backup_temp";
const targetZip = path.join("/home/ubuntu", backupName);

function copy(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  execFileSync("cp", ["-r", source, destination]);
}

if (fs.existsSync(backupDir)) fs.rmSync(backupDir, { recursive: true, force: true });
if (fs.existsSync(targetZip)) fs.rmSync(targetZip, { force: true });

for (const directory of ["app", "components", "lib", "server", "shared", "constants", "hooks", "drizzle"]) {
  copy(path.join(projectDir, directory), path.join(backupDir, "src", directory));
}

copy(path.join(projectDir, "docs"), path.join(backupDir, "docs"));
for (const file of ["README.md", "PROJECT_README.md", "AUDIT_REPORT_10000.md", "audit_matrix_spec.md", "audit_observations.md", "todo.md"]) {
  copy(path.join(projectDir, file), path.join(backupDir, "docs", file));
}

copy(path.join(projectDir, "tests"), path.join(backupDir, "tests"));
copy(path.join(projectDir, "assets", "images"), path.join(backupDir, "assets", "images"));
copy(path.join(projectDir, ".github"), path.join(backupDir, "ci", ".github"));
copy(path.join(projectDir, "scripts"), path.join(backupDir, "ops", "scripts"));

for (const file of [
  "package.json",
  "pnpm-lock.yaml",
  "Dockerfile",
  "docker-compose.yml",
  "tsconfig.json",
  "drizzle.config.ts",
  "app.config.ts",
  "theme.config.js",
  "tailwind.config.js",
  ".env.template",
  ".dockerignore",
  "LICENSE",
]) {
  copy(path.join(projectDir, file), path.join(backupDir, file));
}

fs.mkdirSync(path.dirname(targetZip), { recursive: true });
execFileSync("zip", ["-r", targetZip, "."], { cwd: backupDir, stdio: "inherit" });
fs.rmSync(backupDir, { recursive: true, force: true });
console.log(`Backup created: ${targetZip}`);
console.log("Drive folders: /src, /docs, /tests, /assets, /ci, /ops");

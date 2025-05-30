import fs from "fs-extra";
import path from "node:path";

export async function setupTursoClient(
  projectDir: string,
  templateDir: string,
) {
  const dbAddonDir = path.join(templateDir, "addons", "db");
  const tursoClientSourcePath = path.join(dbAddonDir, "turso-client.ts");
  const dbDir = path.join(projectDir, "src", "lib", "db");
  const tursoClientTargetPath = path.join(dbDir, "client.ts");

  if (fs.existsSync(tursoClientSourcePath)) {
    fs.ensureDirSync(dbDir);
    fs.copyFileSync(tursoClientSourcePath, tursoClientTargetPath);
  }
}

export async function addTursoDependency(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  if (!pkgJson.dependencies) {
    pkgJson.dependencies = {};
  }

  if (!pkgJson.devDependencies) {
    pkgJson.devDependencies = {};
  }

  pkgJson.dependencies["@libsql/client"] = "^0.14.0";
  pkgJson.devDependencies.concurrently = "^9.1.0";

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}

export async function updateTursoScripts(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  if (!pkgJson.scripts) {
    pkgJson.scripts = {};
  }

  // Update dev script to use concurrently
  pkgJson.scripts.dev = "concurrently \"pnpm run dev:db\" \"next dev --turbopack\"";
  pkgJson.scripts["dev:db"] = "turso dev --db-file local.db";

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}

export async function createTursoEnvFile(projectDir: string) {
  const envContent = `NODE_ENV=development
TURSO_DATABASE_URL=http://127.0.0.1:8080
TURSO_AUTH_TOKEN=
`;

  const envFilePath = path.join(projectDir, ".env");
  fs.writeFileSync(envFilePath, envContent);
}

export async function updateGitignoreForTurso(projectDir: string) {
  const gitignorePath = path.join(projectDir, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");

    // Add local DB entries if they don't already exist
    if (!gitignoreContent.includes("local.db")) {
      gitignoreContent += `
# Local DB
local.db*
`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
    }
  }
}

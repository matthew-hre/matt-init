import fs from "fs-extra";
import path from "node:path";

import type { DatabaseProvider } from "../types";

export async function setupEnvValidator(
  projectDir: string,
  templateDir: string,
  databaseProvider: DatabaseProvider = "none",
) {
  const envAddonDir = path.join(templateDir, "addons", "env");

  // Copy try-parse-env.ts to src/lib/
  const parseEnvSourcePath = path.join(envAddonDir, "try-parse-env.ts");
  const parseEnvTargetPath = path.join(projectDir, "src", "lib", "try-parse-env.ts");

  // Choose the correct env file based on database provider
  const envFileName = databaseProvider === "turso" ? "env-turso.ts" : "env-base.ts";
  const envSourcePath = path.join(envAddonDir, envFileName);
  const envTargetPath = path.join(projectDir, "src", "lib", "env.ts");

  if (fs.existsSync(parseEnvSourcePath)) {
    fs.ensureDirSync(path.dirname(parseEnvTargetPath));
    fs.copyFileSync(parseEnvSourcePath, parseEnvTargetPath);
  }

  if (fs.existsSync(envSourcePath)) {
    fs.ensureDirSync(path.dirname(envTargetPath));
    fs.copyFileSync(envSourcePath, envTargetPath);
  }
}

export async function createBaseEnvFile(projectDir: string) {
  const envContent = `NODE_ENV=development
`;

  const envFilePath = path.join(projectDir, ".env");
  fs.writeFileSync(envFilePath, envContent);
}

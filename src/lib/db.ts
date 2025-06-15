import fs from "fs-extra";
import path from "node:path";

import { addPackageToDependencies, addScriptToPackageJson, generateRandomSecret } from "./utils";

/**
 * Applies the Drizzle ORM setup for a Turso database in the specified project directory.
 * This function installs necessary packages, copies template files, sets up environment variables,
 * and adds scripts to package.json for database management.
 *
 * @param projectDir the directory of the project where Drizzle ORM will be set up
 * @param PACKAGE_ROOT the root directory of the package containing templates
 */
export async function applyDrizzleTurso(projectDir: string, PACKAGE_ROOT: string): Promise<void> {
  // dependencies
  await addPackageToDependencies(projectDir, "@libsql/client");
  await addPackageToDependencies(projectDir, "drizzle-orm");
  await addPackageToDependencies(projectDir, "better-auth");

  // devDependencies
  await addPackageToDependencies(projectDir, "drizzle-kit", true);
  await addPackageToDependencies(projectDir, "concurrently", true);

  // Copy the Drizzle setup template to the project directory
  const drizzleTemplatePath = path.join(PACKAGE_ROOT, "templates/backend/drizzle/turso");
  await fs.copy(drizzleTemplatePath, projectDir, {
    overwrite: true,
    errorOnExist: false,
  });

  // Copy the .env.example file to .env
  const envExamplePath = path.join(projectDir, ".env.example");
  const envPath = path.join(projectDir, ".env");
  await fs.copyFile(envExamplePath, envPath);

  // replace some .env values
  const envContent = await fs.readFile(envPath, "utf-8");
  const updatedEnvContent = envContent
    .replace("your_turso_database_url", "http://127.0.0.1:8080")
    .replace("your_better_auth_url", "https://localhost:3000")
    .replace("your_turso_auth_token", "# not needed for local development")
    .replace("your_better_auth_secret", await generateRandomSecret());
  await fs.writeFile(envPath, updatedEnvContent, "utf-8");

  // Add Drizzle scripts to package.json
  await addScriptToPackageJson(projectDir, "db:migrate", "drizzle-kit migrate");
  await addScriptToPackageJson(projectDir, "db:generate", "drizzle-kit generate");
  await addScriptToPackageJson(projectDir, "db:push", "drizzle-kit push");
  await addScriptToPackageJson(projectDir, "db:studio", "drizzle-kit studio");
  await addScriptToPackageJson(projectDir, "dev:db", "turso dev --db-file local.db");
  await addScriptToPackageJson(projectDir, "dev", "concurrently \"pnpm run dev:db\" \"next dev --turbopack\"", true);
}

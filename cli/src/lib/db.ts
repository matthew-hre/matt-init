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

  // Copy the base Drizzle template to the project directory
  const baseTemplatePath = path.join(PACKAGE_ROOT, "templates/backend/drizzle/base");
  await fs.copy(baseTemplatePath, projectDir, {
    overwrite: true,
    errorOnExist: false,
  });

  // Copy the Turso template to the project directory
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

/**
 * Applies the Drizzle ORM setup for a Docker Postgres database in the specified project directory.
 * This function installs necessary packages, copies template files, sets up environment variables,
 * and adds scripts to package.json for database management.
 *
 * @param projectDir the directory of the project where Drizzle ORM will be set up
 * @param PACKAGE_ROOT the root directory of the package containing templates
 */
export async function applyDrizzleDockerPostgres(projectDir: string, PACKAGE_ROOT: string): Promise<void> {
  // dependencies
  await addPackageToDependencies(projectDir, "drizzle-orm");
  await addPackageToDependencies(projectDir, "better-auth");
  await addPackageToDependencies(projectDir, "pg");
  await addPackageToDependencies(projectDir, "postgres");
  await addPackageToDependencies(projectDir, "uuid");

  // devDependencies
  await addPackageToDependencies(projectDir, "drizzle-kit", true);
  await addPackageToDependencies(projectDir, "concurrently", true);
  await addPackageToDependencies(projectDir, "@types/pg", true);

  // Copy the base Drizzle template to the project directory
  const baseTemplatePath = path.join(PACKAGE_ROOT, "templates/backend/drizzle/base");
  await fs.copy(baseTemplatePath, projectDir, {
    overwrite: true,
    errorOnExist: false,
  });

  // Copy the Docker Postgres template to the project directory
  const drizzleTemplatePath = path.join(PACKAGE_ROOT, "templates/backend/drizzle/docker-postgres");
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
    .replace("your_better_auth_url", "https://localhost:3000")
    .replace("your_better_auth_secret", await generateRandomSecret())
    .replace("POSTGRES_USER=", "POSTGRES_USER=postgres")
    .replace("POSTGRES_PASSWORD=", "POSTGRES_PASSWORD=postgres");
  await fs.writeFile(envPath, updatedEnvContent, "utf-8");

  // Add Drizzle scripts to package.json
  await addScriptToPackageJson(projectDir, "db:migrate", "drizzle-kit migrate");
  await addScriptToPackageJson(projectDir, "db:generate", "drizzle-kit generate");
  await addScriptToPackageJson(projectDir, "db:push", "drizzle-kit push");
  await addScriptToPackageJson(projectDir, "db:studio", "drizzle-kit studio");
  await addScriptToPackageJson(projectDir, "dev:db", "docker-compose up db");
  await addScriptToPackageJson(
    projectDir,
    "dev",
    "concurrently --kill-others \"pnpm run dev:db\" \"next dev --turbopack\"",
    true,
  );
  await addScriptToPackageJson(projectDir, "db:down", "docker-compose down");
  await addScriptToPackageJson(projectDir, "db:reset", "docker-compose down && pnpm run dev:db");
  await addScriptToPackageJson(projectDir, "db:wipe", "docker-compose down -v && pnpm run dev:db && pnpm run db:push");
}

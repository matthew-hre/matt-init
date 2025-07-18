import fs from "fs-extra";
import path from "node:path";

import { addPackagesToDependencies, addScriptsToPackageJson, generateRandomSecret } from "./utils";

/**
 * Applies the Drizzle ORM setup for a Turso database in the specified project directory.
 * This function installs necessary packages, copies template files, sets up environment variables,
 * and adds scripts to package.json for database management.
 *
 * @param projectDir the directory of the project where Drizzle ORM will be set up
 * @param PACKAGE_ROOT the root directory of the package containing templates
 */
export async function applyDrizzleTurso(projectDir: string, PACKAGE_ROOT: string): Promise<void> {
  // Install dependencies in batches
  await addPackagesToDependencies(projectDir, ["@libsql/client", "drizzle-orm", "better-auth"]);
  await addPackagesToDependencies(projectDir, ["drizzle-kit", "concurrently"], true);

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
    .replace("your_better_auth_url", "http://localhost:3000")
    .replace("your_turso_auth_token", "# not needed for local development")
    .replace("your_better_auth_secret", await generateRandomSecret());
  await fs.writeFile(envPath, updatedEnvContent, "utf-8");

  // Add Drizzle scripts to package.json in batch
  await addScriptsToPackageJson(projectDir, {
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "dev:db": "turso dev --db-file local.db",
  });

  // Update the dev script separately since it needs to overwrite existing
  await addScriptsToPackageJson(projectDir, {
    dev: "concurrently \"pnpm run dev:db\" \"next dev --turbopack\"",
  }, true);
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
  // Install dependencies in batches
  await addPackagesToDependencies(projectDir, ["drizzle-orm", "better-auth", "pg", "postgres", "uuid"]);
  await addPackagesToDependencies(projectDir, ["drizzle-kit", "concurrently", "@types/pg"], true);

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
    .replace("your_better_auth_url", "http://localhost:3000")
    .replace("your_better_auth_secret", await generateRandomSecret())
    .replace("POSTGRES_USER=", "POSTGRES_USER=postgres")
    .replace("POSTGRES_PASSWORD=", "POSTGRES_PASSWORD=postgres");
  await fs.writeFile(envPath, updatedEnvContent, "utf-8");

  // Add Drizzle scripts to package.json in batch
  await addScriptsToPackageJson(projectDir, {
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "dev:db": "docker-compose up db",
    "db:down": "docker-compose down",
    "db:reset": "docker-compose down && pnpm run dev:db",
    "db:wipe": "docker-compose down -v && pnpm run dev:db && pnpm run db:push",
  });

  // Update the dev script separately since it needs to overwrite existing
  await addScriptsToPackageJson(projectDir, {
    dev: "concurrently --kill-others \"pnpm run dev:db\" \"next dev --turbopack\"",
  }, true);
}

import fs from "fs-extra";
import { randomBytes } from "node:crypto";
import path from "node:path";

export async function setupBetterAuthDrizzleTurso(
  projectDir: string,
  templateDir: string,
) {
  const betterAuthAddonDir = path.join(templateDir, "addons", "db", "betterauth-drizzle-turso");

  // Copy auth.ts and fix imports
  const authSourcePath = path.join(betterAuthAddonDir, "auth.ts");
  const authTargetPath = path.join(projectDir, "src", "lib", "auth.ts");

  if (fs.existsSync(authSourcePath)) {
    let authContent = fs.readFileSync(authSourcePath, "utf-8");
    // Fix the import paths for the copied location
    authContent = authContent.replace("import { db } from \"./db\";", "import { db } from \"~/lib/db\";");
    authContent = authContent.replace("import * as schema from \"./db/schema\";", "import * as schema from \"~/lib/db/schema\";");
    authContent = authContent.replace("import env from \"./env\";", "import env from \"~/lib/env\";");

    fs.ensureDirSync(path.dirname(authTargetPath));
    fs.writeFileSync(authTargetPath, authContent);
  }

  // Copy middleware.ts
  const middlewareSourcePath = path.join(betterAuthAddonDir, "middleware.ts");
  const middlewareTargetPath = path.join(projectDir, "src", "middleware.ts");

  if (fs.existsSync(middlewareSourcePath)) {
    fs.copyFileSync(middlewareSourcePath, middlewareTargetPath);
  }

  // Replace the database index file with betterauth version
  const dbIndexSourcePath = path.join(betterAuthAddonDir, "index.ts");
  const dbDir = path.join(projectDir, "src", "lib", "db");
  const dbIndexTargetPath = path.join(dbDir, "index.ts");

  if (fs.existsSync(dbIndexSourcePath)) {
    fs.ensureDirSync(dbDir);
    fs.copyFileSync(dbIndexSourcePath, dbIndexTargetPath);
  }

  // Replace schema files with betterauth versions
  const schemaSourceDir = path.join(betterAuthAddonDir, "schema");
  const schemaTargetDir = path.join(dbDir, "schema");

  if (fs.existsSync(schemaSourceDir)) {
    // Remove existing schema directory and replace with betterauth version
    if (fs.existsSync(schemaTargetDir)) {
      fs.removeSync(schemaTargetDir);
    }
    fs.ensureDirSync(schemaTargetDir);
    fs.copySync(schemaSourceDir, schemaTargetDir);
  }

  // Replace drizzle config with betterauth version
  const drizzleConfigSourcePath = path.join(betterAuthAddonDir, "drizzle.config.ts");
  const drizzleConfigTargetPath = path.join(projectDir, "drizzle.config.ts");

  if (fs.existsSync(drizzleConfigSourcePath)) {
    fs.copyFileSync(drizzleConfigSourcePath, drizzleConfigTargetPath);
  }

  // Copy Next.js template files for betterauth
  const nextAddonDir = path.join(templateDir, "addons", "next", "betterauth-turso-drizzle");
  const appDir = path.join(projectDir, "src", "app");

  if (fs.existsSync(nextAddonDir)) {
    // Remove existing app directory and replace with betterauth version
    if (fs.existsSync(appDir)) {
      fs.removeSync(appDir);
    }
    fs.ensureDirSync(appDir);
    fs.copySync(nextAddonDir, appDir);
  }
}

export async function addBetterAuthDependencies(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  if (!pkgJson.dependencies) {
    pkgJson.dependencies = {};
  }

  // Add better-auth dependency
  pkgJson.dependencies["better-auth"] = "^1.0.1";

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}

export async function createBetterAuthEnvFile(projectDir: string) {
  // Generate a random secret key
  const secret = randomBytes(32).toString("hex");

  const envContent = `NODE_ENV=development
TURSO_DATABASE_URL=http://127.0.0.1:8080
TURSO_AUTH_TOKEN=
BETTER_AUTH_SECRET=${secret}
BETTER_AUTH_URL=http://localhost:3000
`;

  const envFilePath = path.join(projectDir, ".env");
  fs.writeFileSync(envFilePath, envContent);
}

export async function createBetterAuthEnvValidator(projectDir: string) {
  const envContent = `import { z } from "zod";

import { tryParseEnv } from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
`;

  const envFilePath = path.join(projectDir, "src", "lib", "env.ts");
  fs.writeFileSync(envFilePath, envContent);
}

import fs from "fs-extra";
import path from "node:path";

export async function setupDrizzleTurso(
  projectDir: string,
  templateDir: string,
) {
  const drizzleAddonDir = path.join(templateDir, "addons", "db", "drizzle-turso");

  // Copy drizzle config
  const drizzleConfigSourcePath = path.join(drizzleAddonDir, "drizzle.config.ts");
  const drizzleConfigTargetPath = path.join(projectDir, "drizzle.config.ts");

  if (fs.existsSync(drizzleConfigSourcePath)) {
    fs.copyFileSync(drizzleConfigSourcePath, drizzleConfigTargetPath);
  }

  // Copy database index file
  const dbIndexSourcePath = path.join(drizzleAddonDir, "index.ts");
  const dbDir = path.join(projectDir, "src", "lib", "db");
  const dbIndexTargetPath = path.join(dbDir, "index.ts");

  if (fs.existsSync(dbIndexSourcePath)) {
    fs.ensureDirSync(dbDir);
    fs.copyFileSync(dbIndexSourcePath, dbIndexTargetPath);
  }

  // Copy schema files
  const schemaSourceDir = path.join(drizzleAddonDir, "schema");
  const schemaTargetDir = path.join(dbDir, "schema");

  if (fs.existsSync(schemaSourceDir)) {
    fs.ensureDirSync(schemaTargetDir);
    fs.copySync(schemaSourceDir, schemaTargetDir);
  }

  // Copy Next.js template files
  const nextAddonDir = path.join(templateDir, "addons", "next", "turso-drizzle");
  const appDir = path.join(projectDir, "src", "app");

  // Copy layout.tsx
  const layoutSourcePath = path.join(nextAddonDir, "layout.tsx");
  const layoutTargetPath = path.join(appDir, "layout.tsx");

  if (fs.existsSync(layoutSourcePath)) {
    fs.copyFileSync(layoutSourcePath, layoutTargetPath);
  }

  // Copy page.tsx
  const pageSourcePath = path.join(nextAddonDir, "page.tsx");
  const pageTargetPath = path.join(appDir, "page.tsx");

  if (fs.existsSync(pageSourcePath)) {
    fs.copyFileSync(pageSourcePath, pageTargetPath);
  }
}

export async function addDrizzleDependencies(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  if (!pkgJson.dependencies) {
    pkgJson.dependencies = {};
  }

  if (!pkgJson.devDependencies) {
    pkgJson.devDependencies = {};
  }

  // Add drizzle-orm as dependency and drizzle-kit as dev dependency
  pkgJson.dependencies["drizzle-orm"] = "^0.44.0";
  pkgJson.devDependencies["drizzle-kit"] = "^0.31.1";

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}

export async function updateDrizzleScripts(projectDir: string) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);

  if (!pkgJson.scripts) {
    pkgJson.scripts = {};
  }

  // Add Drizzle-specific scripts
  pkgJson.scripts["db:generate"] = "drizzle-kit generate";
  pkgJson.scripts["db:migrate"] = "drizzle-kit migrate";
  pkgJson.scripts["db:push"] = "drizzle-kit push";
  pkgJson.scripts["db:studio"] = "drizzle-kit studio";

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}

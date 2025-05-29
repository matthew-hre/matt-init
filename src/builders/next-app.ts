import fs from "fs-extra";
import path from "node:path";

import { setupVscodeSettings } from "~/utils/vscode";

import type { DatabaseProvider } from "../types";

import { setupEnvValidator } from "../utils/setup-env";
import { addTursoDependency, createTursoEnvFile, setupTursoDatabase, updateGitignoreForTurso, updateTursoScripts } from "./db/turso";

export async function buildNextApp(
  projectDir: string,
  templateDir: string,
  projectName: string,
  databaseProvider: DatabaseProvider,
) {
  // base is the directory where the base nextjs template files are located
  fs.copySync(`${templateDir}/base`, projectDir);

  // Rename gitignore
  fs.renameSync(
    path.join(projectDir, "_gitignore"),
    path.join(projectDir, ".gitignore"),
  );

  // Rename eslint
  fs.renameSync(
    path.join(projectDir, "_eslint.config.mjs"),
    path.join(projectDir, "eslint.config.mjs"),
  );

  // Update package.json name
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fs.readJsonSync(pkgJsonPath);
  pkgJson.name = projectName;
  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });

  // Set up database-specific configurations
  if (databaseProvider === "turso") {
    await setupTursoDatabase(projectDir, templateDir);
    await addTursoDependency(projectDir);
    await createTursoEnvFile(projectDir);
    updateGitignoreForTurso(projectDir);
    updateTursoScripts(projectDir);
  }

  // Set up env files based on database provider
  setupEnvValidator(projectDir, templateDir, databaseProvider);

  // set up vscode settings
  setupVscodeSettings(projectDir, templateDir);
}

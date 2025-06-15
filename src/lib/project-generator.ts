import fs from "fs-extra";
import path from "node:path";

import { findGitExecutable } from "~/utils/git";
import { detectPackageManager } from "~/utils/package-manager";

import type { BackendSetup, DatabaseProvider, ProjectOptions } from "../types";

import { applyDrizzleTurso } from "./db";
import { setProjectName } from "./utils";

const PACKAGE_ROOT = path.resolve(__dirname, "../");

export async function generateProject(options: ProjectOptions): Promise<void> {
  const targetPath = path.join(process.cwd(), options.projectName);
  await copyBaseTemplate(options.projectName);
  // - Apply backend setup
  // - Configure database if needed

  if (options.backendSetup === "drizzle") {
    if (options.databaseProvider === "turso") {
      await applyDrizzleTurso(targetPath, PACKAGE_ROOT);
    }
  }

  if (options.shouldUseNix) {
    await applyNixFlake(targetPath, options.backendSetup, options.databaseProvider);
  }

  if (options.shouldSetupVsCode) {
    await applyVsCodeSettings(targetPath);
  }

  if (options.shouldInstall) {
    await installDependencies(targetPath);
  }

  // do this at the very end to ensure all files are in place
  if (options.shouldInitGit) {
    await applyGitInit(targetPath);
  }

  // clean up
  const gitignorePath = path.join(targetPath, "_gitignore");
  const newGitignorePath = path.join(targetPath, ".gitignore");

  const eslintConfigPath = path.join(targetPath, "_eslint.config.mjs");
  const newEslintConfigPath = path.join(targetPath, "eslint.config.mjs");

  await fs.rename(gitignorePath, newGitignorePath);
  await fs.rename(eslintConfigPath, newEslintConfigPath);

  await setProjectName(targetPath, options.projectName);
}

async function copyBaseTemplate(projectName: string): Promise<void> {
  // The base next.js template is located in src/templates/base
  const baseTemplatePath = path.join(PACKAGE_ROOT, "templates/base");
  const targetPath = path.join(process.cwd(), projectName);

  // Use fs-extra to copy the base template to the target directory
  await fs.copy(baseTemplatePath, targetPath, {
    overwrite: true,
    errorOnExist: false,
  });
}

async function applyNixFlake(projectDir: string, backend: BackendSetup, dbProvider: DatabaseProvider): Promise<void> {
  // Copy the Nix flake template to the project directory
  const nixTemplatePath = path.join(PACKAGE_ROOT, "templates/extras/nix/base");
  await fs.copy(nixTemplatePath, projectDir, {
    overwrite: true,
    errorOnExist: false,
  });

  // TODO: Refactor for better extensibility
  if (backend === "drizzle" && dbProvider === "turso") {
    // Copy the Drizzle + Turso Nix flake template
    const drizzleTursoNixPath = path.join(PACKAGE_ROOT, "templates/extras/nix/drizzle/turso");
    await fs.copy(drizzleTursoNixPath, projectDir, {
      overwrite: true,
      errorOnExist: false,
    });
  }
}

async function applyGitInit(projectDir: string): Promise<void> {
  const gitPath = await findGitExecutable();

  if (!gitPath || typeof gitPath !== "string") {
    throw new Error("Git is not installed or not found in PATH.");
  }

  const { execa } = await import("execa");
  await execa(gitPath, ["init"], {
    cwd: projectDir,
    stdio: "pipe",
  });

  await execa(gitPath, ["branch", "-m", "main"], {
    cwd: projectDir,
    stdio: "pipe",
  });

  await execa(gitPath, ["add", "."], {
    cwd: projectDir,
    stdio: "pipe",
  });
}

async function applyVsCodeSettings(projectDir: string): Promise<void> {
  const vscodeSettingsPath = path.join(PACKAGE_ROOT, "templates/extras/vscode/base/_settings.json");
  const vscodeExtensionsPath = path.join(PACKAGE_ROOT, "templates/extras/vscode/base/_extensions.json");

  // Copy VS Code settings
  await fs.copy(vscodeSettingsPath, path.join(projectDir, ".vscode", "settings.json"), {
    overwrite: true,
    errorOnExist: false,
  });
  // Copy VS Code extensions
  await fs.copy(vscodeExtensionsPath, path.join(projectDir, ".vscode", "extensions.json"), {
    overwrite: true,
    errorOnExist: false,
  });
}

async function installDependencies(projectDir: string): Promise<void> {
  const packageManager = detectPackageManager();

  const { execa } = await import("execa");
  await execa(packageManager, ["install"], {
    cwd: projectDir,
    stdio: "pipe",
  });
}

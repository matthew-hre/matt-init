import fs from "fs-extra";
import path from "node:path";

import { findGitExecutable } from "~/utils/git";
import { detectPackageManager } from "~/utils/package-manager";

import type { BackendSetup, DatabaseProvider, ProjectOptions } from "../types";

import { applyDrizzleTurso } from "./db";
import { setProjectName } from "./utils";

/**
 * Generates a new project based on the provided options.
 * This function sets up the project structure, applies backend configurations,
 * sets up VS Code settings, initializes Git, and installs dependencies.
 *
 * @param {ProjectOptions} options The options for generating the project.
 * @param {string} PACKAGE_ROOT The root directory of the package, used to locate templates.
 * @returns {Promise<void>} A promise that resolves when the project is generated.
 */
export async function generateProject(options: ProjectOptions, PACKAGE_ROOT: string): Promise<void> {
  const targetPath = options.projectDir;
  await copyBaseTemplate(options.projectDir, PACKAGE_ROOT);
  // - Apply backend setup
  // - Configure database if needed

  if (options.backendSetup === "drizzle") {
    if (options.databaseProvider === "turso") {
      await applyDrizzleTurso(targetPath, PACKAGE_ROOT);
    }
  }

  if (options.shouldUseNix) {
    await applyNixFlake(targetPath, options.backendSetup, options.databaseProvider, PACKAGE_ROOT);
  }

  if (options.shouldSetupVsCode) {
    await applyVsCodeSettings(targetPath, PACKAGE_ROOT);
  }

  if (options.shouldInstall) {
    await installDependencies(targetPath);
  }

  // clean up
  const gitignorePath = path.join(targetPath, "_gitignore");
  const newGitignorePath = path.join(targetPath, ".gitignore");

  const eslintConfigPath = path.join(targetPath, "_eslint.config.mjs");
  const newEslintConfigPath = path.join(targetPath, "eslint.config.mjs");

  await fs.rename(gitignorePath, newGitignorePath);
  await fs.rename(eslintConfigPath, newEslintConfigPath);

  await setProjectName(targetPath, options.projectName);

  // do this at the very end to ensure all files are in place.
  // make sure this happens *after* we set up the gitignore
  if (options.shouldInitGit) {
    await applyGitInit(targetPath);
  }
}

/**
 * Copies the base Next.js template to the target project directory.
 * This function uses fs-extra to copy the template files from the package root
 * to the specified project directory.
 *
 * @param targetPath The targetPath of the project.
 * @returns {Promise<void>} A promise that resolves when the template has been copied.
 */
async function copyBaseTemplate(targetPath: string, PACKAGE_ROOT: string): Promise<void> {
  // The base next.js template is located in src/templates/base
  const baseTemplatePath = path.join(PACKAGE_ROOT, "templates/base");
  // Use fs-extra to copy the base template to the target directory
  await fs.copy(baseTemplatePath, targetPath, {
    overwrite: true,
    errorOnExist: false,
  });
}

/**
 * Applies the Nix flake configuration to the project directory.
 * This function copies the Nix flake template and applies specific configurations
 * based on the backend setup and database provider.
 *
 * @param projectDir The directory where the project is located.
 * @param backend The backend setup chosen for the project.
 * @param dbProvider The database provider chosen for the project.
 * @returns {Promise<void>} A promise that resolves when the Nix flake has been applied.
 */
async function applyNixFlake(projectDir: string, backend: BackendSetup, dbProvider: DatabaseProvider, PACKAGE_ROOT: string): Promise<void> {
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

/**
 * Initializes a Git repository in the project directory.
 * This function finds the Git executable, initializes a new Git repository,
 * sets the main branch to "main", and adds all files to the staging area.
 *
 * @param projectDir The directory where the project is located.
 * @returns {Promise<void>} A promise that resolves when the Git repository has been initialized.
 */
async function applyGitInit(projectDir: string): Promise<void> {
  const gitPath = await findGitExecutable();

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

/**
 * Applies VS Code settings and extensions to the project directory.
 * This function copies the VS Code settings and extensions configuration
 * from the package templates to the project's .vscode directory.
 *
 * @param projectDir The directory where the project is located.
 * @returns {Promise<void>} A promise that resolves when the VS Code settings have been applied.
 */
async function applyVsCodeSettings(projectDir: string, PACKAGE_ROOT: string): Promise<void> {
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

/**
 * Installs project dependencies using the detected package manager.
 * This function uses execa to run the package manager's install command
 * in the specified project directory.
 *
 * @param projectDir The directory where the project is located.
 * @returns {Promise<void>} A promise that resolves when the dependencies have been installed.
 */
async function installDependencies(projectDir: string): Promise<void> {
  const packageManager = detectPackageManager();

  const { execa } = await import("execa");
  await execa(packageManager, ["install"], {
    cwd: projectDir,
    stdio: "pipe",
  });
}

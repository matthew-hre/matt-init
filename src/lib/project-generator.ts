import fs from "fs-extra";
import path from "node:path";

import { findGitExecutable } from "~/utils/git";
import { detectPackageManager } from "~/utils/package-manager";

import type { ProjectOptions } from "../types";

const PACKAGE_ROOT = path.resolve(__dirname, "../");

export async function generateProject(options: ProjectOptions): Promise<void> {
  await copyBaseTemplate(options.projectName);
  // - Apply backend setup
  // - Configure database if needed

  if (options.shouldUseNix) {
    await applyNixFlake(path.join(process.cwd(), options.projectName));
  }

  if (options.shouldInitGit) {
    await applyGitInit(path.join(process.cwd(), options.projectName));
  }

  if (options.shouldInstall) {
    await installDependencies(path.join(process.cwd(), options.projectName));
  }
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

  const gitignorePath = path.join(targetPath, "_gitignore");
  const newGitignorePath = path.join(targetPath, ".gitignore");

  const eslintConfigPath = path.join(targetPath, "_eslint.config.mjs");
  const newEslintConfigPath = path.join(targetPath, "eslint.config.mjs");

  await fs.rename(gitignorePath, newGitignorePath);
  await fs.rename(eslintConfigPath, newEslintConfigPath);
}

async function applyNixFlake(projectDir: string): Promise<void> {
  // Copy the Nix flake template to the project directory
  const nixTemplatePath = path.join(PACKAGE_ROOT, "templates/extras/nix");
  await fs.copy(nixTemplatePath, projectDir, {
    overwrite: true,
    errorOnExist: false,
  });
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

async function installDependencies(projectDir: string): Promise<void> {
  const packageManager = detectPackageManager();

  const { execa } = await import("execa");
  await execa(packageManager, ["install"], {
    cwd: projectDir,
    stdio: "pipe",
  });
}

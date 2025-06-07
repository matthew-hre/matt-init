import fs from "fs-extra";
import path from "node:path";

import type { ProjectOptions } from "../types";

const PACKAGE_ROOT = path.resolve(__dirname, "../");

export async function generateProject(options: ProjectOptions): Promise<void> {
  // TODO: Implement actual project generation logic
  // - Copy base template
  await copyBaseTemplate(options.projectName);
  // - Apply backend setup
  // - Configure database if needed
  // - Add Nix flake if requested
  // - Initialize git if requested
  // - Install dependencies if requested
}

async function copyBaseTemplate(projectName: string): Promise<void> {
  // The base next.js template is located in src/templates/base
  const baseTemplatePath = path.join(PACKAGE_ROOT, "templates/base");
  const targetPath = path.join(process.cwd(), projectName);

  // Use fs-extra to copy the base template to the target directory
  await fs.copy(baseTemplatePath, targetPath, {
    overwrite: true,
    errorOnExist: true,
  });

  console.log(`Copied base template to ${targetPath}`);
}

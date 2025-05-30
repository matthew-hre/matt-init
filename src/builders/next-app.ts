import fs from "fs-extra";
import path from "node:path";

import { setupVscodeSettings } from "~/utils/vscode";

export async function buildNextApp(
  projectDir: string,
  templateDir: string,
  projectName: string,
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

  // set up vscode settings
  setupVscodeSettings(projectDir, templateDir);
}

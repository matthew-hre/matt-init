import fs from "fs-extra";
import { randomBytes } from "node:crypto";
import path from "node:path";

/**
 * Adds a package to the project's dependencies or devDependencies in package.json.
 *
 * @param projectDir the directory of the project
 * @param packageName the name of the package to add
 * @param devDependency whether to add the package as a devDependency (default: false)
 */
export async function addPackageToDependencies(
  projectDir: string,
  packageName: string,
  devDependency: boolean = false,
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  if (devDependency) {
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies[packageName] = "latest";
  }
  else {
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies[packageName] = "latest";
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Adds a script to the project's package.json scripts section.
 *
 * @param projectDir the directory of the project
 * @param scriptName the name of the script to add
 * @param scriptCommand the command for the script
 * @param updateExisting whether to update an existing script with the same name (default: false)
 */
export async function addScriptToPackageJson(
  projectDir: string,
  scriptName: string,
  scriptCommand: string,
  updateExisting: boolean = false,
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.scripts = packageJson.scripts || {};

  if (!updateExisting && packageJson.scripts[scriptName]) {
    return;
  }

  packageJson.scripts[scriptName] = scriptCommand;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Generates a random 64-character hexadecimal string to be used as a secret.
 *
 * @returns {Promise<string>} A promise that resolves to a random secret string.
 */
export async function generateRandomSecret(): Promise<string> {
  return randomBytes(32).toString("hex");
}

/**
 * Sets the project name in various configuration files.
 * This function replaces the placeholder `__APP_NAME__` with the actual project name
 * in the specified files within the project directory.
 *
 * @param projectDir the directory of the project
 * @param projectName the name of the project to set
 */
export async function setProjectName(
  projectDir: string,
  projectName: string,
): Promise<void> {
  // this isn't comprehensive at all, and probably needs a refactor.
  // since we know what files the project name is used in, we can just
  // replace the placeholder with the actual project name.

  const filesToUpdate = [
    path.join(projectDir, "package.json"),
    path.join(projectDir, "flake.nix"),
    path.join(projectDir, "nix", "devShell.nix"),
  ];

  for (const filePath of filesToUpdate) {
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, "utf-8");
      content = content.replace(/__APP_NAME__/g, projectName);
      await fs.writeFile(filePath, content, "utf-8");
    }
    // just skip if the file doesn't exist, this needs to be more robust
  }
}

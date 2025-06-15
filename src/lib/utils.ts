import fs from "fs-extra";
import { randomBytes } from "node:crypto";
import path from "node:path";

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

export async function generateRandomSecret(): Promise<string> {
  return randomBytes(32).toString("hex");
}

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
    else {
      console.warn(`Issue replacing project name in file: ${filePath}`);
    }
  }
}

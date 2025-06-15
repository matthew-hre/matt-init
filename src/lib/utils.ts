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

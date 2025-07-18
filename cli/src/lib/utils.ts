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
 * Adds multiple packages to the project's dependencies or devDependencies in package.json.
 * This is more efficient than calling addPackageToDependencies multiple times as it only
 * reads and writes the package.json file once.
 *
 * @param projectDir the directory of the project
 * @param packages array of package names to add
 * @param devDependency whether to add packages as devDependencies (default: false)
 */
export async function addPackagesToDependencies(
  projectDir: string,
  packages: string[],
  devDependency: boolean = false,
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  if (devDependency) {
    packageJson.devDependencies = packageJson.devDependencies || {};
    for (const packageName of packages) {
      packageJson.devDependencies[packageName] = "latest";
    }
  }
  else {
    packageJson.dependencies = packageJson.dependencies || {};
    for (const packageName of packages) {
      packageJson.dependencies[packageName] = "latest";
    }
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
 * Adds multiple scripts to the project's package.json scripts section.
 * This is more efficient than calling addScriptToPackageJson multiple times as it only
 * reads and writes the package.json file once.
 *
 * @param projectDir the directory of the project
 * @param scripts object with script names as keys and commands as values
 * @param updateExisting whether to update existing scripts with the same names (default: false)
 */
export async function addScriptsToPackageJson(
  projectDir: string,
  scripts: Record<string, string>,
  updateExisting: boolean = false,
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.scripts = packageJson.scripts || {};

  for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
    if (!updateExisting && packageJson.scripts[scriptName]) {
      continue;
    }
    packageJson.scripts[scriptName] = scriptCommand;
  }

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
  // always update package.json as it's required
  const packageJsonPath = path.join(projectDir, "package.json");
  try {
    if (await fs.pathExists(packageJsonPath)) {
      let content = await fs.readFile(packageJsonPath, "utf-8");
      content = content.replace(/__APP_NAME__/g, projectName);
      await fs.writeFile(packageJsonPath, content, "utf-8");
    }
  }
  catch (error) {
    // updating the package.json is critical, so we throw an error if it fails
    throw new Error(`Failed to update package.json: ${error instanceof Error ? error.message : String(error)}`);
  }

  // optional files - only update if they exist
  const optionalFiles = [
    path.join(projectDir, "flake.nix"),
    path.join(projectDir, "nix", "devShell.nix"),
    path.join(projectDir, "docker-compose.yml"),
    path.join(projectDir, ".env.example"),
    path.join(projectDir, ".env"),
  ];

  for (const filePath of optionalFiles) {
    try {
      if (await fs.pathExists(filePath)) {
        let content = await fs.readFile(filePath, "utf-8");
        content = content.replace(/__APP_NAME__/g, projectName);
        await fs.writeFile(filePath, content, "utf-8");
      }
    }
    catch (error) {
      // log error but continue processing other files
      console.debug(`Failed to update ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

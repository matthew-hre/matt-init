import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  addPackageToDependencies,
  addScriptToPackageJson,
  generateRandomSecret,
  setProjectName,
} from "../../src/lib/utils";

const tempDirs: string[] = [];

function createTempProject(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
  tempDirs.push(tempDir);
  fs.writeJsonSync(path.join(tempDir, "package.json"), {});
  fs.mkdirSync(path.join(tempDir, "nix"), { recursive: true });
  fs.writeFileSync(path.join(tempDir, "flake.nix"), "name = '__APP_NAME__';");
  fs.writeFileSync(path.join(tempDir, "nix/devShell.nix"), "name = '__APP_NAME__';");
  return tempDir;
}

describe("utils", () => {
  afterEach(() => {
    // Clean up all temporary directories created during tests
    tempDirs.forEach((dir) => {
      if (fs.pathExistsSync(dir)) {
        fs.removeSync(dir);
      }
    });
    tempDirs.length = 0; // Clear the array
  });

  it("generateRandomSecret returns a 64-char hex string", async () => {
    const secret = await generateRandomSecret();
    expect(secret).toMatch(/^[a-f0-9]{64}$/);
  });

  it("addScriptToPackageJson adds script", async () => {
    const dir = createTempProject();
    await addScriptToPackageJson(dir, "dev", "next dev");
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.scripts.dev).toBe("next dev");
  });

  it("addScriptToPackageJson overwrites existing script", async () => {
    const dir = createTempProject();
    await addScriptToPackageJson(dir, "dev", "next dev");
    await addScriptToPackageJson(dir, "dev", "next start", true);
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.scripts.dev).toBe("next start");
  });

  it("skips adding script when it already exists and updateExisting is false", async () => {
    const dir = createTempProject();
    const pkg = { scripts: { test: "existing-script" } };
    await fs.writeJson(path.join(dir, "package.json"), pkg);

    await addScriptToPackageJson(dir, "test", "new-script", false);

    const updatedPkg = await fs.readJson(path.join(dir, "package.json"));
    expect(updatedPkg.scripts.test).toBe("existing-script");
  });

  it("addPackageToDependencies adds to dependencies", async () => {
    const dir = createTempProject();
    await addPackageToDependencies(dir, "chalk");
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.dependencies.chalk).toBe("latest");
  });

  it("addPackageToDependencies adds to devDependencies", async () => {
    const dir = createTempProject();
    await addPackageToDependencies(dir, "vitest", true);
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.devDependencies.vitest).toBe("latest");
  });

  it("setProjectName replaces __APP_NAME__ in files", async () => {
    const dir = createTempProject();
    await setProjectName(dir, "hello-world");
    const flake = await fs.readFile(path.join(dir, "flake.nix"), "utf-8");
    const devShell = await fs.readFile(path.join(dir, "nix/devShell.nix"), "utf-8");
    expect(flake).toContain("hello-world");
    expect(devShell).toContain("hello-world");
  });
});

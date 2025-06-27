import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

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

  it("setProjectName works when only package.json exists (no nix files)", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    // Create only package.json with __APP_NAME__
    await fs.writeJson(path.join(dir, "package.json"), {
      name: "__APP_NAME__",
      version: "1.0.0",
    });

    // Should not throw even though nix files don't exist
    await expect(setProjectName(dir, "my-app")).resolves.not.toThrow();

    // Check that package.json was updated
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.name).toBe("my-app");
  });

  it("setProjectName throws when package.json update fails", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    // Create a read-only package.json
    const pkgPath = path.join(dir, "package.json");
    await fs.writeJson(pkgPath, { name: "__APP_NAME__" });
    await fs.chmod(pkgPath, 0o444); // Read-only

    // Should throw when it can't write to package.json
    await expect(setProjectName(dir, "my-app")).rejects.toThrow(/Failed to update package.json/);

    // Cleanup: restore write permissions
    await fs.chmod(pkgPath, 0o644);
  });

  it("setProjectName handles partial file existence gracefully", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    // Create package.json and flake.nix, but not nix/devShell.nix
    await fs.writeJson(path.join(dir, "package.json"), {
      name: "__APP_NAME__",
      scripts: { dev: "next dev" },
    });
    await fs.writeFile(path.join(dir, "flake.nix"), "description = '__APP_NAME__';");

    // Should not throw
    await expect(setProjectName(dir, "partial-app")).resolves.not.toThrow();

    // Check that existing files were updated
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    const flake = await fs.readFile(path.join(dir, "flake.nix"), "utf-8");

    expect(pkg.name).toBe("partial-app");
    expect(flake).toContain("partial-app");
  });

  it("setProjectName handles multiple __APP_NAME__ occurrences", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    // Create package.json with multiple __APP_NAME__ occurrences
    await fs.writeJson(path.join(dir, "package.json"), {
      name: "__APP_NAME__",
      description: "Welcome to __APP_NAME__!",
      repository: "https://github.com/user/__APP_NAME__",
    });

    await setProjectName(dir, "multi-replace");

    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.name).toBe("multi-replace");
    expect(pkg.description).toBe("Welcome to multi-replace!");
    expect(pkg.repository).toBe("https://github.com/user/multi-replace");
  });

  it("setProjectName preserves file permissions and encoding", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    const pkgPath = path.join(dir, "package.json");
    await fs.writeJson(pkgPath, { name: "__APP_NAME__" });

    // Set specific permissions
    await fs.chmod(pkgPath, 0o755);
    const statsBefore = await fs.stat(pkgPath);

    await setProjectName(dir, "preserve-test");

    // Check permissions are preserved
    const statsAfter = await fs.stat(pkgPath);
    expect(statsAfter.mode).toBe(statsBefore.mode);
  });

  it("setProjectName logs debug messages for failed optional files", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "matt-init-test-"));
    tempDirs.push(dir);

    // Spy on console.debug
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    // Create package.json
    await fs.writeJson(path.join(dir, "package.json"), { name: "__APP_NAME__" });

    // Create a nix directory but make the file unwritable
    await fs.mkdir(path.join(dir, "nix"), { recursive: true });
    const nixFilePath = path.join(dir, "nix", "devShell.nix");
    await fs.writeFile(nixFilePath, "name = '__APP_NAME__';");
    await fs.chmod(nixFilePath, 0o444); // Read-only

    // Should not throw
    await expect(setProjectName(dir, "debug-test")).resolves.not.toThrow();

    // Check that package.json was still updated
    const pkg = await fs.readJson(path.join(dir, "package.json"));
    expect(pkg.name).toBe("debug-test");

    // Check that debug was called for the failed nix file
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Failed to update.*nix.*devShell\.nix/),
    );

    // Cleanup
    debugSpy.mockRestore();
    await fs.chmod(nixFilePath, 0o644);
  });
});

import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProjectOptions } from "../../src/types";

import { generateProject } from "../../src/lib/project-generator";

const tempDirs: string[] = [];
const PACKAGE_ROOT = path.join(__dirname, "../../src");

function baseOptions(): ProjectOptions {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "proj-gen-"));
  tempDirs.push(tempDir);
  return {
    projectName: "test-app",
    projectDir: tempDir,
    templateDir: path.join(__dirname, "../../src/templates"),
    shouldUseNix: false,
    shouldIncludeCI: false,
    shouldSetupVsCode: false,
    shouldInitGit: false,
    shouldInstall: false,
    backendSetup: "none",
    databaseProvider: "none",
  };
}

const mockExeca = vi.fn();

vi.mock("execa", () => ({
  execa: mockExeca,
}));

vi.mock("~/lib/utils", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...(mod as object),
    setProjectName: vi.fn(),
  };
});

vi.mock("../../src/utils/package-manager", () => ({
  detectPackageManager: vi.fn(() => "npm"),
}));

describe("generateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies the base template to the target directory", async () => {
    const options = baseOptions();
    await generateProject(options, PACKAGE_ROOT);

    const copied = await fs.pathExists(path.join(options.projectDir, "src/app/page.tsx"));
    expect(copied).toBe(true);
  });

  it("renames special template files like _gitignore", async () => {
    const options = baseOptions();
    await generateProject(options, PACKAGE_ROOT);

    const gitignoreExists = await fs.pathExists(path.join(options.projectDir, ".gitignore"));
    const eslintExists = await fs.pathExists(path.join(options.projectDir, "eslint.config.mjs"));

    expect(gitignoreExists).toBe(true);
    expect(eslintExists).toBe(true);
  });

  it("calls setProjectName", async () => {
    const options = baseOptions();
    const { setProjectName } = await import("../../src/lib/utils");

    await generateProject(options, PACKAGE_ROOT);
    expect(setProjectName).toHaveBeenCalledWith(options.projectDir, options.projectName);
  });

  it("handles missing optional steps gracefully", async () => {
    const options = {
      ...baseOptions(),
      shouldUseNix: false,
      shouldSetupVsCode: false,
      shouldIncludeCI: false,
      shouldInitGit: false,
      shouldInstall: false,
    };

    await expect(generateProject(options, PACKAGE_ROOT)).resolves.not.toThrow();
  });

  it("handles Nix setup for different backend combinations", async () => {
    const options = {
      ...baseOptions(),
      shouldUseNix: true,
      backendSetup: "none" as const,
      databaseProvider: "none" as const,
    };

    await expect(generateProject(options, PACKAGE_ROOT)).resolves.not.toThrow();
  });

  it("calls the correct package manager install function", async () => {
    const options = {
      ...baseOptions(),
      shouldInstall: true,
    };

    await generateProject(options, PACKAGE_ROOT);
    expect(mockExeca).toHaveBeenCalledWith("npm", ["install"], expect.anything());
  });

  it("installs dependencies when shouldInstall is true", async () => {
    const options = {
      ...baseOptions(),
      shouldInstall: true,
    };

    const { detectPackageManager } = await import("../../src/utils/package-manager");
    vi.mocked(detectPackageManager).mockReturnValue("npm");

    await generateProject(options, PACKAGE_ROOT);

    expect(mockExeca).toHaveBeenCalledWith("npm", ["install"], {
      cwd: options.projectDir,
      stdio: "pipe",
    });
  });

  it("does not install dependencies when shouldInstall is false", async () => {
    const options = {
      ...baseOptions(),
      shouldInstall: false,
    };

    await generateProject(options, PACKAGE_ROOT);

    const packageManagerCalls = mockExeca.mock.calls.filter(call =>
      ["npm", "yarn", "pnpm", "bun"].includes(call[0])
      && Array.isArray(call[1])
      && call[1].includes("install"),
    );

    expect(packageManagerCalls).toHaveLength(0);
  });

  afterEach(() => {
    // Clean up all temporary directories created during tests
    tempDirs.forEach((dir) => {
      if (fs.pathExistsSync(dir)) {
        fs.removeSync(dir);
      }
    });
    tempDirs.length = 0; // Clear the array
  });
});

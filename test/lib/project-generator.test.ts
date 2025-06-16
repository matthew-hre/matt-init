import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProjectOptions } from "../../src/types";

import { generateProject } from "../../src/lib/project-generator";

const tempDirs: string[] = [];

function baseOptions(): ProjectOptions {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "proj-gen-"));
  tempDirs.push(tempDir);
  return {
    projectName: "test-app",
    projectDir: tempDir,
    templateDir: path.join(__dirname, "../../src/templates"),
    shouldUseNix: false,
    shouldSetupVsCode: false,
    shouldInitGit: false,
    shouldInstall: false,
    backendSetup: "none",
    databaseProvider: "none",
  };
}

vi.mock("execa", () => ({
  execa: vi.fn(),
}));

vi.mock("~/lib/utils", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...(mod as object),
    setProjectName: vi.fn(),
  };
});

describe("generateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies the base template to the target directory", async () => {
    const options = baseOptions();
    await generateProject(options);

    const copied = await fs.pathExists(path.join(options.projectDir, "src/app/page.tsx"));
    expect(copied).toBe(true);
  });

  it("renames special template files like _gitignore", async () => {
    const options = baseOptions();
    await generateProject(options);

    const gitignoreExists = await fs.pathExists(path.join(options.projectDir, ".gitignore"));
    const eslintExists = await fs.pathExists(path.join(options.projectDir, "eslint.config.mjs"));

    expect(gitignoreExists).toBe(true);
    expect(eslintExists).toBe(true);
  });

  it("calls setProjectName", async () => {
    const options = baseOptions();
    const { setProjectName } = await import("../../src/lib/utils");

    await generateProject(options);
    expect(setProjectName).toHaveBeenCalledWith(options.projectDir, options.projectName);
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

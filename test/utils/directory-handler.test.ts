import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const tempDirs: string[] = [];

function createTempDirWithContent(dirName: string): string {
  const tempDir = path.join(os.tmpdir(), dirName);
  tempDirs.push(tempDir);
  fs.ensureDirSync(tempDir);
  fs.writeFileSync(path.join(tempDir, "existing.txt"), "hello");
  return tempDir;
}

describe("handleDirectoryConflict", () => {
  afterEach(() => {
    // Clean up all temporary directories created during tests
    tempDirs.forEach((dir) => {
      if (fs.pathExistsSync(dir)) {
        fs.removeSync(dir);
      }
    });
    tempDirs.length = 0; // Clear the array
  });

  it("allows proceeding when target directory doesn't exist", async () => {
    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    const tempDir = path.join(os.tmpdir(), `no-dir-${Date.now()}`);
    await expect(handleDirectoryConflict(tempDir, "test-app")).resolves.toBeUndefined();
  });

  it("throws if directory exists and user aborts", async () => {
    const existingDir = createTempDirWithContent(`abort-dir-${Date.now()}`);

    vi.mock("@clack/prompts", () => ({
      select: () => Symbol("cancel"),
      isCancel: (val: unknown) => typeof val === "symbol" && String(val) === "Symbol(cancel)",
      cancel: vi.fn(() => {
        throw new Error("User cancelled operation.");
      }),
    }));

    const { handleDirectoryConflict: mockedHandler } = await import("../../src/utils/directory-handler");

    await expect(mockedHandler(existingDir, "test-app")).rejects.toThrow("User cancelled operation.");
  });
});

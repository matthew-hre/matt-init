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

function createEmptyTempDir(dirName: string): string {
  const tempDir = path.join(os.tmpdir(), dirName);
  tempDirs.push(tempDir);
  fs.ensureDirSync(tempDir);
  return tempDir;
}

describe("handleExistingDirectory", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    vi.doUnmock("@clack/prompts");
  });

  it("returns 'overwrite' in CI mode", async () => {
    const { handleExistingDirectory } = await import("../../src/utils/directory-handler");
    const result = await handleExistingDirectory("/some/path", "test-app", true);
    expect(result).toBe("overwrite");
  });

  it("returns user choice when user selects overwrite", async () => {
    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("overwrite"),
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleExistingDirectory } = await import("../../src/utils/directory-handler");
    const result = await handleExistingDirectory("/some/path", "test-app", false);
    expect(result).toBe("overwrite");
    vi.doUnmock("@clack/prompts");
  });

  it("returns user choice when user selects merge", async () => {
    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("merge"),
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleExistingDirectory } = await import("../../src/utils/directory-handler");
    const result = await handleExistingDirectory("/some/path", "test-app", false);
    expect(result).toBe("merge");
    vi.doUnmock("@clack/prompts");
  });

  it("returns 'cancel' when user cancels", async () => {
    const cancelSymbol = Symbol("cancel");
    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue(cancelSymbol),
      isCancel: vi.fn().mockReturnValue(true),
    }));

    const { handleExistingDirectory } = await import("../../src/utils/directory-handler");
    const result = await handleExistingDirectory("/some/path", "test-app", false);
    expect(result).toBe("cancel");
    vi.doUnmock("@clack/prompts");
  });

  it("calls select with correct message and options", async () => {
    const mockSelect = vi.fn().mockResolvedValue("overwrite");
    vi.doMock("@clack/prompts", () => ({
      select: mockSelect,
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleExistingDirectory } = await import("../../src/utils/directory-handler");
    await handleExistingDirectory("/some/path", "my-project", false);

    expect(mockSelect).toHaveBeenCalledWith({
      message: "Directory \"my-project\" already exists and is not empty. What would you like to do?",
      options: [
        { value: "overwrite", label: "Overwrite (delete existing content)" },
        { value: "merge", label: "Merge (keep existing files, add new ones)" },
        { value: "cancel", label: "Cancel operation" },
      ],
      initialValue: "cancel",
    });
    vi.doUnmock("@clack/prompts");
  });
});

describe("handleDirectoryConflict", () => {
  afterEach(() => {
    // Clean up all temporary directories created during tests
    tempDirs.forEach((dir) => {
      if (fs.pathExistsSync(dir)) {
        fs.removeSync(dir);
      }
    });
    tempDirs.length = 0; // Clear the array
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    vi.doUnmock("@clack/prompts");
  });

  it("allows proceeding when target directory doesn't exist", async () => {
    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    const tempDir = path.join(os.tmpdir(), `no-dir-${Date.now()}`);
    await expect(handleDirectoryConflict(tempDir, "test-app")).resolves.toBeUndefined();
  });

  it("allows proceeding when target directory exists but is empty", async () => {
    const emptyDir = createEmptyTempDir(`empty-dir-${Date.now()}`);
    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    await expect(handleDirectoryConflict(emptyDir, "test-app")).resolves.toBeUndefined();
  });

  it("removes directory when user chooses overwrite", async () => {
    const existingDir = createTempDirWithContent(`overwrite-dir-${Date.now()}`);

    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("overwrite"),
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    await handleDirectoryConflict(existingDir, "test-app");

    expect(fs.existsSync(existingDir)).toBe(false);
    vi.doUnmock("@clack/prompts");
  });

  it("keeps directory when user chooses merge", async () => {
    const existingDir = createTempDirWithContent(`merge-dir-${Date.now()}`);
    const existingFile = path.join(existingDir, "existing.txt");

    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("merge"),
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    await handleDirectoryConflict(existingDir, "test-app");

    expect(fs.existsSync(existingDir)).toBe(true);
    expect(fs.existsSync(existingFile)).toBe(true);
    expect(fs.readFileSync(existingFile, "utf-8")).toBe("hello");
    vi.doUnmock("@clack/prompts");
  });

  it("exits process when user chooses cancel", async () => {
    const existingDir = createTempDirWithContent(`cancel-dir-${Date.now()}`);
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exit called");
    });

    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("cancel"),
      isCancel: vi.fn().mockReturnValue(false),
      cancel: vi.fn(),
    }));

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");

    await expect(handleDirectoryConflict(existingDir, "test-app")).rejects.toThrow("Process exit called");
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
    vi.doUnmock("@clack/prompts");
  });

  it("handles CI mode with existing non-empty directory", async () => {
    const existingDir = createTempDirWithContent(`ci-dir-${Date.now()}`);

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
    await handleDirectoryConflict(existingDir, "test-app", true);

    // In CI mode, it should overwrite (remove the directory)
    expect(fs.existsSync(existingDir)).toBe(false);
  });

  it("throws if directory exists and user aborts via cancel symbol", async () => {
    const existingDir = createTempDirWithContent(`abort-dir-${Date.now()}`);
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Process exit called");
    });

    const cancelSymbol = Symbol("cancel");
    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue(cancelSymbol),
      isCancel: vi.fn().mockReturnValue(true),
      cancel: vi.fn(),
    }));

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");

    await expect(handleDirectoryConflict(existingDir, "test-app")).rejects.toThrow("Process exit called");
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
    vi.doUnmock("@clack/prompts");
  });

  it("handles file system errors gracefully", async () => {
    const existingDir = createTempDirWithContent(`fs-error-dir-${Date.now()}`);

    // Mock fs.remove to throw an error
    const originalRemove = fs.remove;
    vi.spyOn(fs, "remove").mockRejectedValue(new Error("File system error"));

    vi.doMock("@clack/prompts", () => ({
      select: vi.fn().mockResolvedValue("overwrite"),
      isCancel: vi.fn().mockReturnValue(false),
    }));

    const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");

    await expect(handleDirectoryConflict(existingDir, "test-app")).rejects.toThrow("File system error");

    // Restore original function
    fs.remove = originalRemove;
    vi.doUnmock("@clack/prompts");
  });
});

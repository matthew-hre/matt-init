import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";

// Track temp directories for cleanup
export const tempDirs: string[] = [];

// Mock all external dependencies
export function setupMocks() {
  vi.mock("@clack/prompts", () => ({
    cancel: vi.fn(),
    intro: vi.fn(),
    isCancel: vi.fn(() => false),
    spinner: vi.fn(() => ({
      start: vi.fn(),
      stop: vi.fn(),
      message: vi.fn(),
    })),
  }));

  vi.mock("commander", () => ({
    Command: vi.fn().mockImplementation(() => ({
      name: vi.fn().mockReturnThis(),
      description: vi.fn().mockReturnThis(),
      argument: vi.fn().mockReturnThis(),
      option: vi.fn().mockReturnThis(),
      version: vi.fn().mockReturnThis(),
      parse: vi.fn().mockReturnThis(),
      args: [],
      opts: vi.fn(() => ({})),
    })),
  }));

  vi.mock("picocolors", () => ({
    default: {
      bgGreen: vi.fn(text => text),
      black: vi.fn(text => text),
    },
  }));

  vi.mock("../../src/lib/project-generator", () => ({
    generateProject: vi.fn(),
  }));

  vi.mock("../../src/prompts/backend-setup", () => ({
    promptBackendSetup: vi.fn(() => Promise.resolve("none")),
  }));

  vi.mock("../../src/prompts/database-provider", () => ({
    promptDatabaseProvider: vi.fn(() => Promise.resolve("none")),
  }));

  vi.mock("../../src/prompts/project-name", () => ({
    promptProjectName: vi.fn(() => Promise.resolve({ projectName: "test-project" })),
  }));

  vi.mock("../../src/prompts/yes-no", () => ({
    promptInitGit: vi.fn(() => Promise.resolve(true)),
    promptInstallDependencies: vi.fn(() => Promise.resolve(true)),
    promptSetupVsCodeSettings: vi.fn(() => Promise.resolve(true)),
    promptUseNix: vi.fn(() => Promise.resolve(false)),
  }));

  vi.mock("../../src/utils/directory-handler", () => ({
    handleDirectoryConflict: vi.fn(async (projectDir: string) => {
      // Track the project directory for cleanup
      tempDirs.push(projectDir);
    }),
  }));
}

export type TestContext = {
  mockCommand: any;
  originalProcessArgv: string[];
  originalProcessCwd: () => string;
  originalProcessExit: (code?: number) => never;
  originalConsoleLog: typeof console.log;
  originalConsoleError: typeof console.error;
};

export function setupTestContext(): TestContext {
  const context: TestContext = {
    mockCommand: null,
    originalProcessArgv: process.argv,
    originalProcessCwd: process.cwd,
    originalProcessExit: process.exit,
    originalConsoleLog: console.log,
    originalConsoleError: console.error,
  };

  // Create a temporary directory for this test context
  const tempWorkingDir = createTempDir();

  // Mock process methods
  process.exit = vi.fn() as any;
  process.cwd = vi.fn(() => tempWorkingDir);
  console.log = vi.fn();
  console.error = vi.fn();

  return context;
}

export async function createMockCommand(context: TestContext) {
  // Create mock command with proper method chaining
  context.mockCommand = {
    name: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    argument: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    version: vi.fn().mockReturnThis(),
    parse: vi.fn().mockReturnThis(),
    args: [],
    opts: vi.fn(() => ({})),
  };

  const { Command } = await import("commander");
  vi.mocked(Command).mockImplementation(() => context.mockCommand);

  return context.mockCommand;
}

export function cleanupTestContext(context: TestContext) {
  // Clean up temp directories (including any project directories created during tests)
  tempDirs.forEach((dir) => {
    try {
      if (fs.pathExistsSync(dir)) {
        fs.removeSync(dir);
      }
    }
    catch (error) {
      // Log but don't fail tests due to cleanup issues
      console.warn(`Failed to clean up temp directory ${dir}:`, error);
    }
  });
  tempDirs.length = 0;

  // Restore original values
  process.argv = context.originalProcessArgv;
  process.cwd = context.originalProcessCwd;
  process.exit = context.originalProcessExit;
  console.log = context.originalConsoleLog;
  console.error = context.originalConsoleError;

  vi.resetModules();
}

export function createTempDir(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-test-"));
  tempDirs.push(tempDir);
  return tempDir;
}

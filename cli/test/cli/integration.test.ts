import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TestContext } from "./helpers";

import { cleanupTestContext, createMockCommand, setupMocks, setupTestContext } from "./helpers";

setupMocks();

describe("cLI Integration", () => {
  let context: TestContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    context = setupTestContext();
    await createMockCommand(context);
  });

  afterEach(() => {
    cleanupTestContext(context);
  });

  describe("complete project generation", () => {
    it("creates complete project options object with all defaults", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith({
        projectName: "my-app",
        projectDir: expect.any(String),
        templateDir: expect.stringContaining("src/templates"),
        shouldUseNix: true, // Default is true, --no-nix makes it false
        shouldSetupVsCode: true, // Default is true, --no-vscode makes it false
        shouldInitGit: true, // Default is true, --no-git makes it false
        shouldInstall: true, // Default is true, --no-install makes it false
        backendSetup: "none",
        databaseProvider: "none",
      }, expect.any(String));
    });

    it("creates project options with interactive choices", async () => {
      context.mockCommand.args = ["interactive-app"];
      context.mockCommand.opts = vi.fn(() => ({
        default: false,
        ci: false,
        noNix: false,
        noVscode: false,
        noInstall: false,
        noGit: false,
      }));

      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");
      const { promptDatabaseProvider } = await import("../../src/prompts/database-provider");
      const { promptUseNix, promptSetupVsCodeSettings, promptInstallDependencies, promptInitGit } = await import("../../src/prompts/yes-no");
      const { generateProject } = await import("../../src/lib/project-generator");

      vi.mocked(promptBackendSetup).mockResolvedValue("drizzle");
      vi.mocked(promptDatabaseProvider).mockResolvedValue("turso");
      vi.mocked(promptUseNix).mockResolvedValue(true);
      vi.mocked(promptSetupVsCodeSettings).mockResolvedValue(false);
      vi.mocked(promptInstallDependencies).mockResolvedValue(true);
      vi.mocked(promptInitGit).mockResolvedValue(false);

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith({
        projectName: "interactive-app",
        projectDir: expect.any(String),
        templateDir: expect.stringContaining("src/templates"),
        shouldUseNix: true,
        shouldSetupVsCode: false,
        shouldInitGit: false,
        shouldInstall: true,
        backendSetup: "drizzle",
        databaseProvider: "turso",
      }, expect.any(String));
    });
  });
});

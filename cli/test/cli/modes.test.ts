import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TestContext } from "./helpers";

import { cleanupTestContext, createMockCommand, setupMocks, setupTestContext } from "./helpers";

setupMocks();

describe("cLI Modes", () => {
  let context: TestContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    context = setupTestContext();
    await createMockCommand(context);
  });

  afterEach(() => {
    cleanupTestContext(context);
  });

  describe("interactive Mode", () => {
    it("shows intro in interactive mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: false }));

      const { intro } = await import("@clack/prompts");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(intro).toHaveBeenCalled();
    });

    it("prompts for project name when not provided", async () => {
      context.mockCommand.args = [];
      context.mockCommand.opts = vi.fn(() => ({ default: false, ci: false }));

      const { promptProjectName } = await import("../../src/prompts/project-name");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptProjectName).toHaveBeenCalled();
    });

    it("prompts for backend setup in interactive mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: false, ci: false }));

      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptBackendSetup).toHaveBeenCalled();
    });

    it("prompts for database provider when drizzle backend is chosen", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: false, ci: false }));

      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");
      const { promptDatabaseProvider } = await import("../../src/prompts/database-provider");

      vi.mocked(promptBackendSetup).mockResolvedValue("drizzle");

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptDatabaseProvider).toHaveBeenCalled();
    });

    it("skips database provider prompt when backend is none", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: false, ci: false }));

      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");
      const { promptDatabaseProvider } = await import("../../src/prompts/database-provider");

      vi.mocked(promptBackendSetup).mockResolvedValue("none");

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptDatabaseProvider).not.toHaveBeenCalled();
    });

    it("prompts for optional features when not disabled by flags", async () => {
      context.mockCommand.opts = vi.fn(() => ({
        default: false,
        ci: false,
        noNix: false,
        noVscode: false,
        noInstall: false,
        noGit: false,
      }));

      const { promptIncludeLintingCI, promptUseNix, promptSetupVsCodeSettings, promptInstallDependencies, promptInitGit } = await import("../../src/prompts/yes-no");

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptUseNix).toHaveBeenCalled();
      expect(promptIncludeLintingCI).toHaveBeenCalled();
      expect(promptSetupVsCodeSettings).toHaveBeenCalled();
      expect(promptInstallDependencies).toHaveBeenCalled();
      expect(promptInitGit).toHaveBeenCalled();
    });
  });

  describe("cI Mode", () => {
    it("skips intro in CI mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { intro } = await import("@clack/prompts");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(intro).not.toHaveBeenCalled();
    });

    it("skips all prompts in CI mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { promptProjectName } = await import("../../src/prompts/project-name");
      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");
      const { promptDatabaseProvider } = await import("../../src/prompts/database-provider");

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptProjectName).not.toHaveBeenCalled();
      expect(promptBackendSetup).not.toHaveBeenCalled();
      expect(promptDatabaseProvider).not.toHaveBeenCalled();
    });

    it("uses console.log instead of spinner in CI mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { spinner } = await import("@clack/prompts");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(spinner).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith("Creating your Next.js project...");
      expect(console.log).toHaveBeenCalledWith("Project created successfully!");
    });

    it("passes CI flag to directory conflict handler", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { handleDirectoryConflict } = await import("../../src/utils/directory-handler");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(handleDirectoryConflict).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        true,
      );
    });
  });

  describe("default Mode", () => {
    it("skips prompts when default flag is used", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { promptProjectName } = await import("../../src/prompts/project-name");
      const { promptBackendSetup } = await import("../../src/prompts/backend-setup");

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(promptProjectName).not.toHaveBeenCalled();
      expect(promptBackendSetup).not.toHaveBeenCalled();
    });

    it("uses spinner in default mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { spinner } = await import("@clack/prompts");
      const mockSpinnerInstance = {
        start: vi.fn(),
        stop: vi.fn(),
        message: vi.fn(),
      };
      vi.mocked(spinner).mockReturnValue(mockSpinnerInstance);

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(spinner).toHaveBeenCalled();
      expect(mockSpinnerInstance.start).toHaveBeenCalledWith("Creating your Next.js project...");
      expect(mockSpinnerInstance.stop).toHaveBeenCalledWith("Project created successfully!");
    });
  });
});

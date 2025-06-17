import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TestContext } from "./helpers";

import { cleanupTestContext, createMockCommand, createTempDir, setupMocks, setupTestContext } from "./helpers";

setupMocks();

describe("cLI Project Options", () => {
  let context: TestContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    context = setupTestContext();
    await createMockCommand(context);
  });

  afterEach(() => {
    cleanupTestContext(context);
  });

  describe("project naming", () => {
    it("uses provided project name from CLI argument", async () => {
      context.mockCommand.args = ["my-custom-app"];
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: "my-custom-app",
        }),
      );
    });

    it("uses default project name when none provided", async () => {
      context.mockCommand.args = [];
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: "my-app",
        }),
      );
    });
  });

  describe("flag handling", () => {
    it("respects no-git flag", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true, noGit: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          shouldInitGit: false,
        }),
      );
    });

    it("respects no-install flag", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true, noInstall: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          shouldInstall: false,
        }),
      );
    });

    it("respects no-nix flag", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true, noNix: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          shouldUseNix: false,
        }),
      );
    });

    it("respects no-vscode flag", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true, noVscode: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          shouldSetupVsCode: false,
        }),
      );
    });
  });

  describe("directory handling", () => {
    it("sets correct project directory based on current working directory", async () => {
      const tempDir = createTempDir();
      process.cwd = vi.fn(() => tempDir);

      context.mockCommand.args = ["test-project"];
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          projectDir: path.resolve(tempDir, "test-project"),
        }),
      );
    });

    it("sets correct template directory", async () => {
      context.mockCommand.opts = vi.fn(() => ({ default: true }));

      const { generateProject } = await import("../../src/lib/project-generator");
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(generateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          templateDir: expect.stringContaining("src/templates"),
        }),
      );
    });
  });
});

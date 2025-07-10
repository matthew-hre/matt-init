import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TestContext } from "./helpers";

import { version } from "../../package.json";
import { cleanupTestContext, createMockCommand, setupMocks, setupTestContext } from "./helpers";

setupMocks();

describe("cLI Command Setup", () => {
  let context: TestContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    context = setupTestContext();
    await createMockCommand(context);
  });

  afterEach(() => {
    cleanupTestContext(context);
  });

  describe("command configuration", () => {
    it("configures the command with correct name and description", async () => {
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(context.mockCommand.name).toHaveBeenCalledWith("matt-init");
      expect(context.mockCommand.description).toHaveBeenCalledWith("Set up Next.js apps the way Matt likes 'em.");
    });

    it("sets up all command line options", async () => {
      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(context.mockCommand.argument).toHaveBeenCalledWith("[dir]", "Name of the app directory");
      expect(context.mockCommand.option).toHaveBeenCalledWith("--no-git", "Skip git initialization");
      expect(context.mockCommand.option).toHaveBeenCalledWith("--no-install", "Skip package installation");
      expect(context.mockCommand.option).toHaveBeenCalledWith("--no-nix", "Skip Nix flake for environment management");
      expect(context.mockCommand.option).toHaveBeenCalledWith("--no-vscode", "Skip VS Code settings setup");
      expect(context.mockCommand.option).toHaveBeenCalledWith("-y, --default", "Use defaults, skip prompts");
      expect(context.mockCommand.option).toHaveBeenCalledWith("--ci", "Run in CI mode (non-interactive, test mode)");
      expect(context.mockCommand.version).toHaveBeenCalledWith(version);
    });
  });
});

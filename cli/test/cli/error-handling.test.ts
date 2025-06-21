import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TestContext } from "./helpers";

import { cleanupTestContext, createMockCommand, setupMocks, setupTestContext } from "./helpers";

setupMocks();

describe("cLI Error Handling", () => {
  let context: TestContext;

  beforeEach(async () => {
    vi.clearAllMocks();
    context = setupTestContext();
    await createMockCommand(context);
  });

  afterEach(() => {
    cleanupTestContext(context);
  });

  describe("cancellation handling", () => {
    it("handles cancellation in interactive mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: false }));

      const { isCancel, cancel } = await import("@clack/prompts");
      const { generateProject } = await import("../../src/lib/project-generator");

      vi.mocked(isCancel).mockReturnValue(true);
      vi.mocked(generateProject).mockRejectedValue(Symbol("cancel"));

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(cancel).toHaveBeenCalledWith("Operation cancelled.");
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("handles cancellation in CI mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { isCancel, cancel } = await import("@clack/prompts");
      const { generateProject } = await import("../../src/lib/project-generator");

      vi.mocked(isCancel).mockReturnValue(true);
      vi.mocked(generateProject).mockRejectedValue(Symbol("cancel"));

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(cancel).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith("Operation cancelled.");
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe("general error handling", () => {
    it("handles general errors in interactive mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: false }));

      const { cancel } = await import("@clack/prompts");
      const { generateProject } = await import("../../src/lib/project-generator");

      const error = new Error("Test error");
      vi.mocked(generateProject).mockRejectedValue(error);

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(cancel).toHaveBeenCalledWith("Something went wrong!");
      expect(console.error).toHaveBeenCalledWith(error);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("handles general errors in CI mode", async () => {
      context.mockCommand.opts = vi.fn(() => ({ ci: true }));

      const { cancel } = await import("@clack/prompts");
      const { generateProject } = await import("../../src/lib/project-generator");

      const error = new Error("Test error");
      vi.mocked(generateProject).mockRejectedValue(error);

      const { runCLI } = await import("../../src/cli");
      await runCLI();

      expect(cancel).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Something went wrong!");
      expect(console.error).toHaveBeenCalledWith(error);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});

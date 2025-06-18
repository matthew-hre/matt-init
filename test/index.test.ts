import type { MockInstance } from "vitest";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("picocolors", () => ({
  default: {
    red: vi.fn(text => text),
  },
}));

vi.mock("../src/cli", () => ({
  runCLI: vi.fn(),
}));

describe("main entry point", () => {
  let originalExit: typeof process.exit;
  let exitSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    // clear module cache to ensure fresh imports
    vi.resetModules();

    vi.spyOn(console, "error").mockImplementation(() => {});

    originalExit = process.exit;
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => {
        return undefined as never;
      });
  });

  afterEach(() => {
    // restore both
    process.exit = originalExit;
    vi.restoreAllMocks();
  });

  it("executes runCLI successfully", async () => {
    const { runCLI } = await import("../src/cli");
    vi.mocked(runCLI).mockResolvedValue();

    await import("../src/index");
    await new Promise(r => setTimeout(r, 10));

    expect(runCLI).toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("handles errors and exits with code 1", async () => {
    const { runCLI } = await import("../src/cli");
    const error = new Error("Test error");
    vi.mocked(runCLI).mockRejectedValue(error);

    await import("../src/index");

    await new Promise(r => setTimeout(r, 50));

    console.log("console.error calls:", vi.mocked(console.error).mock.calls);

    expect(console.error).toHaveBeenCalledWith("An error occurred:", error);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

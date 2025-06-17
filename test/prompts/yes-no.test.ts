import type { MockInstance } from "vitest";

import { confirm } from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  promptInitGit,
  promptInstallDependencies,
  promptSetupVsCodeSettings,
  promptUseNix,
} from "../../src/prompts/yes-no";

vi.mock("@clack/prompts");

describe("prompt functions", () => {
  let exitSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });
  });

  it("promptUseNix returns true", async () => {
    (confirm as any).mockResolvedValue(true);
    const result = await promptUseNix();
    expect(result).toBe(true);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("promptUseNix exits if cancelled", async () => {
    (confirm as any).mockResolvedValue(Symbol("cancel"));
    await expect(promptUseNix()).rejects.toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it("promptInstallDependencies returns false", async () => {
    (confirm as any).mockResolvedValue(false);
    const result = await promptInstallDependencies();
    expect(result).toBe(false);
  });

  it("promptInitGit returns true", async () => {
    (confirm as any).mockResolvedValue(true);
    const result = await promptInitGit();
    expect(result).toBe(true);
  });

  it("promptSetupVsCodeSettings exits on cancel", async () => {
    (confirm as any).mockResolvedValue(Symbol("cancel"));
    await expect(promptSetupVsCodeSettings()).rejects.toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});

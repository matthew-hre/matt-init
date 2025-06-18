import type { MockInstance } from "vitest";

import { select } from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { promptBackendSetup } from "../../src/prompts/backend-setup";

vi.mock("@clack/prompts");

describe("promptBackendSetup", () => {
  let exitSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });
  });

  it("returns 'drizzle' when selected", async () => {
    (select as any).mockResolvedValue("drizzle");
    const result = await promptBackendSetup();
    expect(result).toBe("drizzle");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("returns 'none' when selected", async () => {
    (select as any).mockResolvedValue("none");
    const result = await promptBackendSetup();
    expect(result).toBe("none");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("calls process.exit on cancel", async () => {
    (select as any).mockResolvedValue(Symbol("cancel"));
    await expect(promptBackendSetup()).rejects.toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});

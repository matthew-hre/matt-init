import type { MockInstance } from "vitest";

import { select } from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { promptDatabaseProvider } from "../../src/prompts/database-provider";

vi.mock("@clack/prompts");

describe("promptDatabaseProvider", () => {
  let exitSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });
  });

  it("returns 'turso' when selected", async () => {
    (select as any).mockResolvedValue("turso");
    const result = await promptDatabaseProvider();
    expect(result).toBe("turso");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("returns 'docker-postgres' when selected", async () => {
    (select as any).mockResolvedValue("docker-postgres");
    const result = await promptDatabaseProvider();
    expect(result).toBe("docker-postgres");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("calls process.exit on cancel", async () => {
    (select as any).mockResolvedValue(Symbol("cancel"));
    await expect(promptDatabaseProvider()).rejects.toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});

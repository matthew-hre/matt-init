import type { MockInstance } from "vitest";

import { text } from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { promptProjectName, validateProjectName } from "../../src/prompts/project-name";

vi.mock("@clack/prompts");

describe("promptProjectName", () => {
  let exitSpy: MockInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });
  });

  it("returns a valid project name", async () => {
    (text as any).mockResolvedValue("my-app");
    const result = await promptProjectName();
    expect(result).toEqual({ projectName: "my-app" });
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("calls process.exit on cancel", async () => {
    (text as any).mockResolvedValue(Symbol("cancel"));
    await expect(promptProjectName()).rejects.toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  describe("validateProjectName", () => {
    it("accepts valid project names", () => {
      expect(validateProjectName("valid-name")).toBeUndefined();
      expect(validateProjectName("abc123")).toBeUndefined();
    });

    it("rejects empty names", () => {
      expect(validateProjectName("")).toBe("Project name is required");
      expect(validateProjectName(undefined)).toBe("Project name is required");
    });

    it("rejects names with uppercase letters", () => {
      expect(validateProjectName("BadName")).toMatch(/must only contain/);
    });

    it("rejects names with symbols", () => {
      expect(validateProjectName("nope!")).toMatch(/must only contain/);
      expect(validateProjectName("white space")).toMatch(/must only contain/);
    });
  });
});

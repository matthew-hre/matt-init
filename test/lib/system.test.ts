/* eslint-disable node/no-process-env */
import { afterEach, describe, expect, it } from "vitest";

import { findGitExecutable } from "../../src/utils/git";
import { detectPackageManager } from "../../src/utils/package-manager";

describe("git utils", () => {
  it("findGitExecutable returns a string path", async () => {
    const gitPath = await findGitExecutable();
    expect(typeof gitPath).toBe("string");
    expect(gitPath).toMatch(/git/);
  });
});

describe("package manager utils", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("detects pnpm when present", () => {
    process.env.npm_config_user_agent = "pnpm/8.6.7 node/v18.16.0 darwin arm64";
    expect(detectPackageManager()).toBe("pnpm");
  });

  it("detects yarn when present", () => {
    process.env.npm_config_user_agent = "yarn/1.22.19 npm/? node/v18.16.0 darwin arm64";
    expect(detectPackageManager()).toBe("yarn");
  });

  it("detects npm when present", () => {
    process.env.npm_config_user_agent = "npm/9.6.7 node/v18.16.0 darwin arm64";
    expect(detectPackageManager()).toBe("npm");
  });

  it("falls back to npm if no agent is set", () => {
    delete process.env.npm_config_user_agent;
    expect(detectPackageManager()).toBe("npm");
  });
});

/* eslint-disable node/no-process-env */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getGitBashErrorMessage, isGitBash } from "../../src/utils/environment";

describe("environment utils", () => {
  describe("isGitBash", () => {
    const originalEnv = process.env;
    const originalPlatform = Object.getOwnPropertyDescriptor(process, "platform");

    beforeEach(() => {
      process.env = { ...originalEnv };
      vi.resetModules();
    });

    afterEach(() => {
      process.env = originalEnv;
      if (originalPlatform) {
        Object.defineProperty(process, "platform", originalPlatform);
      }
    });

    it("should detect Git Bash when MSYSTEM is MINGW32", () => {
      process.env.MSYSTEM = "MINGW32";
      expect(isGitBash()).toBe(true);
    });

    it("should detect Git Bash when MSYSTEM is MINGW64", () => {
      process.env.MSYSTEM = "MINGW64";
      expect(isGitBash()).toBe(true);
    });

    it("should detect Git Bash when MSYSTEM contains MSYS", () => {
      process.env.MSYSTEM = "MSYS";
      expect(isGitBash()).toBe(true);
    });

    it("should detect Git Bash when TERM is cygwin", () => {
      process.env.TERM = "cygwin";
      expect(isGitBash()).toBe(true);
    });

    it("should detect Git Bash when SHELL is /usr/bin/bash on Windows", () => {
      Object.defineProperty(process, "platform", {
        value: "win32",
        writable: true,
        configurable: true,
      });
      process.env.SHELL = "/usr/bin/bash";
      expect(isGitBash()).toBe(true);
    });

    it("should not detect Git Bash when SHELL is /usr/bin/bash on non-Windows", () => {
      Object.defineProperty(process, "platform", {
        value: "darwin",
        writable: true,
        configurable: true,
      });
      process.env.SHELL = "/usr/bin/bash";
      expect(isGitBash()).toBe(false);
    });

    it("should detect Git Bash when EXEPATH contains git", () => {
      process.env.EXEPATH = "C:\\Program Files\\Git\\bin";
      expect(isGitBash()).toBe(true);
    });

    it("should detect Git Bash when PATH contains mingw on Windows", () => {
      Object.defineProperty(process, "platform", {
        value: "win32",
        writable: true,
        configurable: true,
      });
      process.env.PATH = "C:\\mingw64\\bin;C:\\Windows\\System32";
      expect(isGitBash()).toBe(true);
    });

    it("should not detect Git Bash when no indicators are present", () => {
      // Clean environment
      process.env = {};
      expect(isGitBash()).toBe(false);
    });

    it("should not detect Git Bash on normal Windows terminals", () => {
      Object.defineProperty(process, "platform", {
        value: "win32",
        writable: true,
        configurable: true,
      });
      process.env = {
        COMSPEC: "C:\\Windows\\System32\\cmd.exe",
        TERM: "xterm-256color",
      };
      expect(isGitBash()).toBe(false);
    });
  });

  describe("getGitBashErrorMessage", () => {
    it("should return an error message with alternative terminal suggestions", () => {
      const message = getGitBashErrorMessage();
      expect(message).toContain("Git Bash is not supported");
      expect(message).toContain("Windows Terminal");
      expect(message).toContain("PowerShell");
      expect(message).toContain("Command Prompt");
      expect(message).toContain("WSL");
      expect(message).toContain("VS Code integrated terminal");
      expect(message).toContain("--ci flag");
    });
  });
});

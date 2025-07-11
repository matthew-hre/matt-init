import fs from "fs-extra";
import path from "node:path";
import tmp from "tmp";
import { describe, expect, it } from "vitest";

import { generateProject } from "../src/lib/project-generator";

const PACKAGE_ROOT = path.join(__dirname, "../src");

const bool = [true, false];
const backendConfigs = [
  { backendSetup: "none" as const, databaseProvider: "none" as const },
  { backendSetup: "drizzle" as const, databaseProvider: "turso" as const },
  { backendSetup: "drizzle" as const, databaseProvider: "docker-postgres" as const },
];

// TODO: this is getting ridiculous
const combinations = bool.flatMap(shouldInitGit =>
  bool.flatMap(shouldUseNix =>
    bool.flatMap(shouldIncludeCI =>
      bool.flatMap(shouldSetupVsCode =>
        backendConfigs.map(({ backendSetup, databaseProvider }) => ({
          shouldInitGit,
          shouldUseNix,
          shouldIncludeCI,
          shouldSetupVsCode,
          backendSetup,
          databaseProvider,
        })),
      ),
    ),
  ),
);

describe.each(combinations)(
  "generateProject with git=$shouldInitGit, nix=$shouldUseNix, CI=$shouldIncludeCI, vscode=$shouldSetupVsCode, backend=$backendSetup, db=$databaseProvider",
  ({ shouldInitGit, shouldUseNix, shouldIncludeCI, shouldSetupVsCode, backendSetup, databaseProvider }) => {
    it("generates project correctly", async () => {
      const options = {
        projectName: "test-app",
        backendSetup,
        databaseProvider,
        shouldInitGit,
        shouldUseNix,
        shouldIncludeCI,
        shouldSetupVsCode,
        shouldInstall: false,
      };

      const tempDir = tmp.dirSync({ unsafeCleanup: true });
      const projectDir = path.join(tempDir.name, options.projectName);
      await generateProject({
        ...options,
        projectDir,
        templateDir: "",
      }, PACKAGE_ROOT);

      expect(await fs.pathExists(projectDir)).toBe(true);

      if (shouldUseNix) {
        expect(await fs.pathExists(path.join(projectDir, "flake.nix"))).toBe(true);
      }

      if (shouldSetupVsCode) {
        expect(await fs.pathExists(path.join(projectDir, ".vscode", "settings.json"))).toBe(true);
      }

      if (shouldInitGit) {
        expect(await fs.pathExists(path.join(projectDir, ".git"))).toBe(true);
      }

      if (backendSetup === "drizzle" && databaseProvider === "turso") {
        expect(await fs.pathExists(path.join(projectDir, "drizzle.config.ts"))).toBe(true);
      }

      if (backendSetup === "drizzle" && databaseProvider === "docker-postgres") {
        expect(await fs.pathExists(path.join(projectDir, "docker-compose.yml"))).toBe(true);
        expect(await fs.pathExists(path.join(projectDir, "drizzle.config.ts"))).toBe(true);
      }

      if (shouldIncludeCI) {
        expect(await fs.pathExists(path.join(projectDir, ".github", "workflows", "lint.yaml"))).toBe(true);
      }

      tempDir.removeCallback();
    });
  },
);

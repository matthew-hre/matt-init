import fs from "fs-extra";
import path from "node:path";

import type { DatabaseProvider } from "../types";

export async function setupNixFlake(
  projectDir: string,
  templateDir: string,
  projectName: string,
  databaseProvider: DatabaseProvider = "none",
) {
  const nixAddonDir = path.join(templateDir, "addons", "nix");

  // Copy flake.nix to project root
  const flakeSourcePath = path.join(nixAddonDir, "flake.nix");
  const flakeTargetPath = path.join(projectDir, "flake.nix");

  if (fs.existsSync(flakeSourcePath)) {
    let flakeContent = fs.readFileSync(flakeSourcePath, "utf-8");
    flakeContent = flakeContent.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    fs.writeFileSync(flakeTargetPath, flakeContent);
  }

  // Choose the correct devShell file based on database provider
  const devShellFileName
    = databaseProvider === "turso"
      ? "devShell-turso.nix"
      : "devShell-base.nix";
  const devShellSourcePath = path.join(
    nixAddonDir,
    "devshells",
    devShellFileName,
  );
  const nixDir = path.join(projectDir, "nix");
  const devShellTargetPath = path.join(nixDir, "devShell.nix");

  if (fs.existsSync(devShellSourcePath)) {
    fs.ensureDirSync(nixDir);
    let devShellContent = fs.readFileSync(devShellSourcePath, "utf-8");
    devShellContent = devShellContent.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    fs.writeFileSync(devShellTargetPath, devShellContent);
  }
}

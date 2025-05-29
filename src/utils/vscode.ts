import fs from "fs-extra";
import path from "node:path";

export async function setupVscodeSettings(
  projectDir: string,
  templateDir: string,
) {
  const vscodeAddonDir = path.join(templateDir, "addons", "vscode");

  // Copy vscode/extensions.json to .vscode/extensions.json
  const vscodeExensionsSourceDir = path.join(vscodeAddonDir, "extensions.json");
  const vscodeExensionsTargetDir = path.join(projectDir, ".vscode", "extensions.json");

  // Copy vscode/settings.json to .vscode/settings.json
  const vscodeSettingsSourceDir = path.join(vscodeAddonDir, "settings.json");
  const vscodeSettingsTargetDir = path.join(projectDir, ".vscode", "settings.json");

  if (fs.existsSync(vscodeExensionsSourceDir)) {
    fs.ensureDirSync(path.dirname(vscodeExensionsTargetDir));
    fs.copyFileSync(vscodeExensionsSourceDir, vscodeExensionsTargetDir);
  }

  if (fs.existsSync(vscodeSettingsSourceDir)) {
    fs.ensureDirSync(path.dirname(vscodeSettingsTargetDir));
    fs.copyFileSync(vscodeSettingsSourceDir, vscodeSettingsTargetDir);
  }
}

import fs from "fs-extra";
import path from "node:path";

export async function setupEnvValidator(
  projectDir: string,
  templateDir: string,
) {
  const envAddonDir = path.join(templateDir, "addons", "env");

  // Copy try-parse-env.ts to src/lib/
  const parseEnvSourcePath = path.join(envAddonDir, "try-parse-env.ts");
  const parseEnvTargetPath = path.join(projectDir, "src", "lib", "try-parse-env.ts");

  // Copy env-base.ts to src/lib/
  const envSourcePath = path.join(envAddonDir, "env-base.ts");
  const envTargetPath = path.join(projectDir, "src", "lib", "env.ts");

  if (fs.existsSync(parseEnvSourcePath)) {
    fs.ensureDirSync(path.dirname(parseEnvTargetPath));
    fs.copyFileSync(parseEnvSourcePath, parseEnvTargetPath);
  }

  if (fs.existsSync(envSourcePath)) {
    fs.ensureDirSync(path.dirname(envTargetPath));
    fs.copyFileSync(envSourcePath, envTargetPath);
  }
}

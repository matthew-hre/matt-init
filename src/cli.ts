import { cancel, intro, isCancel, spinner } from "@clack/prompts";
import { Command } from "commander";
import path from "node:path";
import pc from "picocolors";

import type { BackendSetup, DatabaseProvider, ProjectOptions } from "./types";

import { generateProject } from "./lib/project-generator";
import { promptBackendSetup } from "./prompts/backend-setup";
import { promptDatabaseProvider } from "./prompts/database-provider";
import { promptProjectName } from "./prompts/project-name";
import { promptInitGit, promptInstallDependencies, promptUseNix } from "./prompts/yes-no";
import { handleDirectoryConflict } from "./utils/directory-handler";

const PACKAGE_ROOT = path.join(__dirname, "../");

export async function runCLI() {
  const program = new Command()
    .name("matt-init")
    .description("Set up Next.js apps the way Matt likes 'em.")
    .argument("[dir]", "Name of the app directory")
    .option("--no-git", "Skip git initialization")
    .option("--no-install", "Skip package installation")
    .option("--nix", "Initialize with Nix flake")
    .option("-y, --default", "Use defaults, skip prompts")
    .version("1.0.0")
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  const options = program.opts();

  // Start the interactive flow
  intro(pc.bgGreen(pc.black(" matt-init ")));

  let projectName = cliProvidedName;
  let shouldInitGit = !options.noGit;
  let shouldInstall = !options.noInstall;
  let shouldUseNix = options.nix ?? true;
  let backendSetup: BackendSetup = "none";
  let databaseProvider: DatabaseProvider = "none";

  try {
    // Interactive prompts if not using defaults
    if (!options.default) {
      // 1. Project name
      if (!projectName) {
        const nameResult = await promptProjectName();
        projectName = nameResult.projectName;
      }

      // 2. Backend setup
      backendSetup = await promptBackendSetup();

      // 3. Database provider (only if drizzle backend setup chosen)
      if (backendSetup === "drizzle") {
        databaseProvider = await promptDatabaseProvider();
      }

      // 4. Quick yes/no prompts
      if (!options.nix) {
        shouldUseNix = await promptUseNix();
      }

      if (options.install !== false) {
        shouldInstall = await promptInstallDependencies();
      }

      if (options.git !== false) {
        shouldInitGit = await promptInitGit();
      }
    }

    if (!projectName) {
      projectName = "my-app";
    }

    const projectDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.join(PACKAGE_ROOT, "src", "templates");

    // Handle existing directory conflicts
    await handleDirectoryConflict(projectDir, projectName);

    // Prepare project options
    const projectOptions: ProjectOptions = {
      projectName,
      projectDir,
      templateDir,
      shouldUseNix,
      shouldInitGit,
      shouldInstall,
      backendSetup,
      databaseProvider,
    };

    // Generate the project with spinner
    const s = spinner();
    s.start("Creating your Next.js project...");

    await generateProject(projectOptions);

    s.stop("Project created successfully!");
  }
  catch (error) {
    if (isCancel(error)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    cancel("Something went wrong!");
    console.error(error);
    process.exit(1);
  }
}

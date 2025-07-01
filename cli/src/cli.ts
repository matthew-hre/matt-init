import { cancel, intro, isCancel, spinner } from "@clack/prompts";
import { Command } from "commander";
import path from "node:path";
import pc from "picocolors";

import type { BackendSetup, DatabaseProvider, ProjectOptions } from "./types";

import { generateProject } from "./lib/project-generator";
import { promptBackendSetup } from "./prompts/backend-setup";
import { promptDatabaseProvider } from "./prompts/database-provider";
import { promptProjectName } from "./prompts/project-name";
import { promptInitGit, promptInstallDependencies, promptSetupVsCodeSettings, promptUseNix } from "./prompts/yes-no";
import { BANNER } from "./utils/banner";
import { handleDirectoryConflict } from "./utils/directory-handler";

const PACKAGE_ROOT = path.join(__dirname, "./");
/**
 * Main CLI entry point for the matt-init tool.
 * This sets up a Next.js app with various options based on user input or command line flags.
 *
 * @returns {Promise<void>} Resolves when the CLI has completed its execution.
 */
export async function runCLI() {
  const program = new Command()
    .name("matt-init")
    .description("Set up Next.js apps the way Matt likes 'em.")
    .argument("[dir]", "Name of the app directory")
    .option("--no-git", "Skip git initialization")
    .option("--no-install", "Skip package installation")
    .option("--no-nix", "Skip Nix flake for environment management")
    .option("--no-vscode", "Skip VS Code settings setup")
    .option("-y, --default", "Use defaults, skip prompts")
    .option("--ci", "Run in CI mode (non-interactive, test mode)")
    .version("1.0.5");

  program.addHelpText("before", `${BANNER}\n`);

  program.addHelpText("after", `\nhttps://github.com/matthew-hre/matt-init`);

  program.parse(process.argv);

  const cliProvidedName = program.args[0];
  const options = program.opts();

  // Start the interactive flow (skip intro in CI mode)
  if (!options.ci) {
    intro(pc.green(BANNER));
  }

  // Separate the path from the project name
  // If user provides a path like "./my-app" or "../projects/my-app",
  // we use the path for directory creation but extract just the basename for the project name
  let projectPath = cliProvidedName;
  let projectName = cliProvidedName ? path.basename(path.resolve(process.cwd(), cliProvidedName)) : undefined;
  let shouldInitGit = !options.noGit;
  let shouldInstall = !options.noInstall;
  let shouldUseNix = !options.noNix;
  let shouldSetupVsCode = !options.noVscode;
  let backendSetup: BackendSetup = "none";
  let databaseProvider: DatabaseProvider = "none";

  try {
    // Interactive prompts if not using defaults or CI mode
    if (!options.default && !options.ci) {
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
      if (!options.noNix) {
        shouldUseNix = await promptUseNix();
      }

      if (!options.noVscode) {
        shouldSetupVsCode = await promptSetupVsCodeSettings();
      }

      if (!options.noInstall) {
        shouldInstall = await promptInstallDependencies();
      }

      if (!options.noGit) {
        shouldInitGit = await promptInitGit();
      }
    }

    if (!projectName) {
      projectName = "my-app";
    }

    if (!projectPath) {
      projectPath = projectName;
    }

    const projectDir = path.resolve(process.cwd(), projectPath);
    const templateDir = path.join(PACKAGE_ROOT, "src", "templates");

    // Handle existing directory conflicts
    await handleDirectoryConflict(projectDir, projectName, options.ci);

    // Prepare project options
    const projectOptions: ProjectOptions = {
      projectName,
      projectDir,
      templateDir,
      shouldUseNix,
      shouldSetupVsCode,
      shouldInitGit,
      shouldInstall,
      backendSetup,
      databaseProvider,
    };

    // Generate the project with spinner (skip spinner in CI mode)
    if (options.ci) {
      console.log("Creating your Next.js project...");
      await generateProject(projectOptions, PACKAGE_ROOT);
      console.log("Project created successfully!");
    }
    else {
      const s = spinner();
      s.start("Creating your Next.js project...");
      await generateProject(projectOptions, PACKAGE_ROOT);
      s.stop("Project created successfully!");
    }
  }
  catch (error) {
    if (isCancel(error)) {
      if (options.ci) {
        console.log("Operation cancelled.");
        process.exit(0);
      }
      else {
        cancel("Operation cancelled.");
        process.exit(0);
      }
    }

    if (options.ci) {
      console.error("Something went wrong!");
      console.error(error);
      process.exit(1);
    }
    else {
      cancel("Something went wrong!");
      console.error(error);
      process.exit(1);
    }
  }
}

import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import path from "node:path";

import type { DatabaseProvider, ProjectOptions } from "./types";

import { generateProject } from "./lib/project-generator";

const PACKAGE_ROOT = path.join(__dirname, "../");

// Helper function to handle cancellation
function handleCancel<T>(result: T | symbol): T {
  if (p.isCancel(result)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }
  return result as T;
}

export async function runCLI() {
  console.log(chalk.green(`
 ███╗   ███╗ █████╗ ████████╗████████╗      ██╗███╗   ██╗██╗████████╗
 ████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝      ██║████╗  ██║██║╚══██╔══╝
 ██╔████╔██║███████║   ██║      ██║   █████╗██║██╔██╗ ██║██║   ██║   
 ██║╚██╔╝██║██╔══██║   ██║      ██║   ╚════╝██║██║╚██╗██║██║   ██║   
 ██║ ╚═╝ ██║██║  ██║   ██║      ██║         ██║██║ ╚████║██║   ██║   
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
    `));

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

  let projectName = cliProvidedName;
  let shouldInitGit = !options.noGit;
  let shouldInstall = !options.noInstall;
  let shouldUseNix = options.nix || true;
  let databaseProvider: DatabaseProvider = "none";

  // Interactive prompts if not using defaults
  if (!options.default) {
    if (!projectName) {
      const nameResult = await p.text({
        message: "What will your project be called?",
        defaultValue: "my-app",
        placeholder: "my-app",
        validate: (value) => {
          if (!value)
            return "Please enter a project name";
          if (!/^[\w-]+$/.test(value))
            return "Project name can only contain letters, numbers, hyphens, and underscores";
        },
      });

      projectName = handleCancel(nameResult);
    }

    const dbResult = await p.select({
      message: "Choose a database provider:",
      options: [
        { value: "turso", label: "Turso (SQLite)" },
        { value: "none", label: "None" },
      ],
      initialValue: "none",
    });

    databaseProvider = handleCancel(dbResult) as DatabaseProvider;

    const nixResult = await p.confirm({
      message: "Initialize with Nix flake?",
      initialValue: true,
    });

    shouldUseNix = handleCancel(nixResult);

    const gitResult = await p.confirm({
      message: "Initialize a git repository?",
      initialValue: true,
    });

    shouldInitGit = handleCancel(gitResult);

    const installResult = await p.confirm({
      message: "Install dependencies?",
      initialValue: true,
    });

    shouldInstall = handleCancel(installResult);
  }

  if (!projectName)
    projectName = "my-app";

  const projectDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.join(PACKAGE_ROOT, "template");

  // Handle existing directory
  if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0) {
    const overwriteResult = await p.confirm({
      message: `Directory ${chalk.cyan(projectName)} already exists and is not empty. Overwrite?`,
      initialValue: false,
    });

    if (!handleCancel(overwriteResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
  }

  // Prepare project options
  const projectOptions: ProjectOptions = {
    projectName,
    projectDir,
    templateDir,
    shouldUseNix,
    shouldInitGit,
    shouldInstall,
    databaseProvider,
  };

  // Generate the project
  await generateProject(projectOptions);
}

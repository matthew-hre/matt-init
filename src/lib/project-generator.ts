import chalk from "chalk";
import fs from "fs-extra";

import type { ProjectOptions } from "../types";

import { buildNextApp } from "../builders/next-app";
import { setupGit } from "../utils/git";
import { installDependencies } from "../utils/install-deps";
import { setupNixFlake } from "../utils/nix";
import { spinner } from "../utils/spinner";

export async function generateProject(options: ProjectOptions) {
  const { projectName, projectDir, templateDir, shouldUseNix, shouldInitGit, shouldInstall, databaseProvider } = options;

  // Check if directory exists and handle overwrite
  await handleExistingDirectory(projectDir);

  padSteps(1);

  // Copy template files
  spinner.start("Creating project files...");
  try {
    buildNextApp(projectDir, templateDir, projectName, databaseProvider);
    spinner.succeed(`Project ${chalk.green(projectName)} created!`);
    padSteps();
  }
  catch (error) {
    spinner.fail("Failed to create project files");
    throw error;
  }

  // Setup Nix flake if requested
  if (shouldUseNix) {
    spinner.start("Setting up Nix flake...");
    try {
      await setupNixFlake(projectDir, templateDir, projectName, databaseProvider);
      spinner.succeed("Nix flake configured!");
      padSteps();
    }
    catch (error: unknown) {
      spinner.fail("Failed to setup Nix flake");
      console.log(chalk.yellow("You can setup Nix manually later"));
      if (error instanceof Error) {
        console.log(chalk.grey(`  ${chalk.bold("Error: ")} ${error.message}`));
      }
    }
  }

  // Install dependencies
  if (shouldInstall) {
    spinner.start("Installing dependencies with pnpm...");
    try {
      await installDependencies(projectDir);
      spinner.succeed("Dependencies installed!");
      padSteps();
    }
    catch (error: unknown) {
      spinner.fail("Failed to install dependencies");
      console.log(chalk.yellow("You can install dependencies manually later with: pnpm install"));
      if (error instanceof Error) {
        console.log(chalk.grey(`  ${chalk.bold("Error: ")} ${error.message}`));
      }
    }
  }

  // Initialize git repository
  if (shouldInitGit) {
    spinner.start("Initializing git repository...");
    try {
      await setupGit(projectDir);
      spinner.succeed("Git repository initialized with initial commit!");
    }
    catch (error: unknown) {
      spinner.fail("Failed to initialize git repository");
      console.log(chalk.yellow("You can initialize git manually later with: git init"));
      if (error instanceof Error) {
        console.log(chalk.grey(`  ${chalk.bold("Error: ")} ${error.message}`));
      }
    }
  }

  // Final instructions
  console.log(chalk.green(`\nAll done! Next, make sure to:`));
  console.log(chalk.gray(`  ${chalk.bold(`cd ${projectName}`)}`));
  if (shouldUseNix) {
    console.log(chalk.gray(`  ${chalk.bold("nix develop")} (to enter the Nix shell)`));
  }
  console.log(chalk.gray(`  ${chalk.bold("pnpm dev")}`));
}

async function handleExistingDirectory(projectDir: string) {
  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length > 0) {
      // This will be handled by the CLI layer with prompts
      // For now, we'll assume the CLI has already confirmed overwrite
      fs.emptyDirSync(projectDir);
    }
  }
}

function padSteps(count: number = 2) {
  for (let i = 0; i < count; i++) {
    console.log(chalk.gray(`│`));
  }
}

#!/usr/bin/env node

import pc from "picocolors";

import { runCLI } from "./cli";
import { getGitBashErrorMessage, isGitBash } from "./utils/environment";

/**
 * Main entry point for the application.
 * Executes the CLI runner and handles any errors that occur during execution.
 * If an error occurs, it logs the error message in red and exits the process with code 1.
 *
 * @returns A promise that resolves when the CLI execution completes successfully
 * @throws Will exit the process with code 1 if any error occurs during CLI execution
 */
async function main() {
  try {
    // Check if running in Git Bash before proceeding
    if (isGitBash() && !process.argv.includes("--ci")) {
      console.error(pc.red("Error: Git Bash detected"));
      console.error(getGitBashErrorMessage());
      process.exit(1);
    }

    await runCLI();
  }
  catch (error) {
    console.error(pc.red("An error occurred:"), error);
    process.exit(1);
  }
}

main();

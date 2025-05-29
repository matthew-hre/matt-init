#!/usr/bin/env node

import chalk from "chalk";

import { runCLI } from "./cli";

async function main() {
  try {
    await runCLI();
  }
  catch (error) {
    console.error(chalk.red("An error occurred:"), error);
    process.exit(1);
  }
}

main();

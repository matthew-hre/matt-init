#!/usr/bin/env node

import pc from "picocolors";

import { runCLI } from "./cli";

async function main() {
  try {
    await runCLI();
  }
  catch (error) {
    console.error(pc.red("An error occurred:"), error);
    process.exit(1);
  }
}

main();

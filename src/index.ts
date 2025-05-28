#!/usr/bin/env node

import chalk from 'chalk';
import { runCli } from '~/lib/cli';

async function main(): Promise<void> {
    try {
        await runCli();
    } catch (error) {
        console.error(chalk.red('❌ Error creating project:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();
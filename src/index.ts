#!/usr/bin/env node

import chalk from "chalk";
import * as p from "@clack/prompts";
import { Command } from "commander";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { setupGit } from "./utils/git";
import { installDependencies } from "./utils/install-deps";
import { buildNextApp } from "./builders/next-app";
import { spinner } from "./utils/spinner";

const PACKAGE_ROOT = path.join(__dirname, "../");

async function main() {
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
        .option("-y, --default", "Use defaults, skip prompts")
        .version("1.0.0")
        .parse(process.argv);

    const cliProvidedName = program.args[0];
    const options = program.opts();

    let projectName = cliProvidedName;
    let shouldInitGit = !options.noGit;
    let shouldInstall = !options.noInstall;

    // Interactive prompts if not using defaults
    if (!options.default) {
        if (!projectName) {
            const nameResult = await p.text({
                message: "What will your project be called?",
                defaultValue: "my-app",
                placeholder: "my-app",
                validate: (value) => {
                    if (!value) return "Please enter a project name";
                    if (!/^[a-zA-Z0-9-_]+$/.test(value)) return "Project name can only contain letters, numbers, hyphens, and underscores";
                    return;
                },
            });

            if (p.isCancel(nameResult)) {
                p.cancel("Operation cancelled.");
                process.exit(0);
            }

            projectName = nameResult;
        }

        const gitResult = await p.confirm({
            message: "Initialize a git repository?",
            initialValue: true,
        });

        if (p.isCancel(gitResult)) {
            p.cancel("Operation cancelled.");
            process.exit(0);
        }

        shouldInitGit = gitResult;

        const installResult = await p.confirm({
            message: "Install dependencies?",
            initialValue: true,
        });

        if (p.isCancel(installResult)) {
            p.cancel("Operation cancelled.");
            process.exit(0);
        }

        shouldInstall = installResult;
    }

    if (!projectName) projectName = "my-app";

    const projectDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.join(PACKAGE_ROOT, "template", "base");

    // Check if directory exists
    if (fs.existsSync(projectDir)) {
        if (fs.readdirSync(projectDir).length > 0) {
            const overwriteResult = await p.confirm({
                message: `Directory ${chalk.cyan(projectName)} already exists and is not empty. Overwrite?`,
                initialValue: false,
            });

            if (p.isCancel(overwriteResult) || !overwriteResult) {
                p.cancel("Operation cancelled.");
                process.exit(0);
            }

            fs.emptyDirSync(projectDir);
        }
    }

    padSteps(1);

    // Copy template files
    spinner.start('Creating project files...');
    try {
        buildNextApp(projectDir, templateDir, projectName);
        spinner.succeed(`Project ${chalk.green(projectName)} created successfully!`);
    } catch (error) {
        spinner.fail('Failed to create project files');
        throw error;
    }

    padSteps();

    // Install dependencies
    if (shouldInstall) {
        spinner.start('Installing dependencies with pnpm...');
        try {
            await installDependencies(projectDir);
            spinner.succeed('Dependencies installed successfully!');
        } catch (error) {
            spinner.fail('Failed to install dependencies');
            console.log(chalk.yellow("You can install dependencies manually later with: pnpm install"));
        }
    }

    padSteps();

    // Initialize git repository
    if (shouldInitGit) {
        spinner.start('Initializing git repository...');
        try {
            await setupGit(projectDir);
            spinner.succeed('Git repository initialized with initial commit!');
        } catch (error) {
            spinner.fail('Failed to initialize git repository');
            console.log(chalk.yellow("You can initialize git manually later with: git init"));
        }
    }

    console.log(chalk.green(`\nAll done! Next, make sure to:`));
    console.log(chalk.gray(`  ${chalk.bold(`cd ${projectName}`)}`));
    console.log(chalk.gray(`  ${chalk.bold("pnpm dev")}`));
}

main().catch((error) => {
    console.error(chalk.red("An error occurred:"), error);
    process.exit(1);
});

function padSteps(count: number = 2) {
    for (let i = 0; i < count; i++) {
        console.log(chalk.gray(`│`));
    }
}
#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject } from './lib/create-project';
import { displayBanner } from './lib/banner';
import { validateProjectName } from './lib/utils';
import * as path from 'path';

const program = new Command();

interface ProjectOptions {
    name: string;
    directory: string;
    initGit: boolean;
}

program
    .name('matt-init')
    .description('CLI tool for scaffolding Next.js projects')
    .version('1.0.0');

// Main command - interactive project creation
program
    .argument('[directory]', 'Project directory (will also be used as project name)')
    .action(async (directory?: string) => {
        displayBanner();

        try {
            console.log(chalk.blue('Let\'s create your Next.js project!\n'));

            // Step 1: Project name and directory
            const projectInfo = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'directory',
                    message: 'What should we call your project directory?',
                    default: directory || 'my-nextjs-app',
                    when: !directory,
                    validate: (input: string) => {
                        if (!input.trim()) {
                            return 'Project directory is required';
                        }
                        if (!validateProjectName(input)) {
                            return 'Directory name must contain only lowercase letters, numbers, hyphens, and underscores';
                        }
                        return true;
                    }
                },
                {
                    type: 'input',
                    name: 'name',
                    message: 'What\'s the display name for your project?',
                    default: (answers: any) => (directory || answers.directory),
                    validate: (input: string) => {
                        if (!input.trim()) {
                            return 'Project name is required';
                        }
                        return true;
                    }
                }
            ]);

            const projectDirectory = directory || projectInfo.directory;
            const projectName = projectInfo.name || projectDirectory;

            const projectOptions: ProjectOptions = {
                name: projectName,
                directory: projectDirectory,
                initGit: false // Default value
            };

            // Ask if the user wants to initialize a git repository
            const { initGit } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'initGit',
                    message: 'Would you like to initialize a git repository?',
                    default: true
                }
            ]);

            projectOptions.initGit = initGit;

            // Show summary
            console.log(chalk.blue('\n📋 Project Summary:'));
            console.log(chalk.gray(`  Name: ${projectOptions.name}`));
            console.log(chalk.gray(`  Directory: ${projectOptions.directory}`));
            console.log(chalk.gray(`  Initialize Git: ${projectOptions.initGit ? 'Yes' : 'No'}`));

            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: '\nDoes this look good? Ready to create your project?',
                    default: true
                }
            ]);

            if (!confirm) {
                console.log(chalk.yellow('Project creation cancelled.'));
                process.exit(0);
            }

            console.log(''); // Add some space before spinner starts

            await createProject(projectOptions);

            console.log(chalk.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
            console.log(chalk.gray(`\nTo get started:`));
            console.log(chalk.gray(`  cd ${projectOptions.directory}`));
            console.log(chalk.gray(`  pnpm dev`));

        } catch (error) {
            console.error(chalk.red('❌ Error creating project:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

// Add a help command that shows examples
program
    .command('help')
    .description('Show usage examples and help')
    .action(() => {
        console.log(chalk.cyan('\n📚 Usage Examples:\n'));
        console.log(chalk.gray('Create a project interactively:'));
        console.log(chalk.blue('  matt-init\n'));
        console.log(chalk.gray('Create a project in a specific directory:'));
        console.log(chalk.blue('  matt-init my-awesome-app\n'));
        console.log(chalk.gray('Alternative ways to run:'));
        console.log(chalk.blue('  pnpm run dev my-project'));
        console.log(chalk.blue('  npx matt-init my-project\n'));
    });

// Handle unknown commands
program.on('command:*', (operands) => {
    console.error(chalk.red(`Unknown command: ${operands[0]}`));
    console.log(chalk.gray('Run "matt-init help" for available commands'));
    process.exit(1);
});

// Show help if run with --help or -h
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    displayBanner();
    program.help();
}

program.parse();
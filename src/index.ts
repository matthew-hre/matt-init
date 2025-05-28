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
    database: 'turso' | 'postgres' | 'none';
    auth: boolean;
    ci: boolean;
    editor: boolean;
    hooks: boolean;
    ui: 'shadcn' | 'daisyui' | 'none';
}

program
    .name('matt-init')
    .description('CLI tool for scaffolding Next.js projects with opinionated defaults')
    .version('1.0.0');

// Main command - interactive project creation
program
    .argument('[directory]', 'Project directory (will also be used as project name)')
    .action(async (directory?: string) => {
        displayBanner();

        try {
            console.log(chalk.blue('🚀 Let\'s create your Next.js project!\n'));

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

            console.log(chalk.gray(`\nProject: ${chalk.white(projectName)}`));
            console.log(chalk.gray(`Directory: ${chalk.white(projectDirectory)}\n`));

            // Step 2: Database setup
            console.log(chalk.cyan('📊 Database Configuration'));
            const databaseChoice = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'database',
                    message: 'Choose your database setup:',
                    choices: [
                        {
                            name: '🚀 Turso - SQLite on the edge (recommended for most apps)',
                            value: 'turso',
                            short: 'Turso'
                        },
                        {
                            name: '🐘 PostgreSQL - Traditional SQL database via Docker',
                            value: 'postgres',
                            short: 'PostgreSQL'
                        },
                        {
                            name: '🚫 None - Skip database setup for now',
                            value: 'none',
                            short: 'None'
                        }
                    ],
                    default: 'turso'
                }
            ]);

            // Step 3: UI Library
            console.log(chalk.cyan('\n🎨 UI Library'));
            const uiChoice = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'ui',
                    message: 'Choose your UI component library:',
                    choices: [
                        {
                            name: '🎯 shadcn/ui - Modern React components with Radix UI',
                            value: 'shadcn',
                            short: 'shadcn/ui'
                        },
                        {
                            name: '🌼 DaisyUI - Beautiful Tailwind CSS components',
                            value: 'daisyui',
                            short: 'DaisyUI'
                        },
                        {
                            name: '🎨 None - Just Tailwind CSS (I\'ll build my own)',
                            value: 'none',
                            short: 'Tailwind only'
                        }
                    ],
                    default: 'shadcn'
                }
            ]);

            // Step 4: Authentication
            console.log(chalk.cyan('\n🔐 Authentication'));
            const authChoice = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'auth',
                    message: 'Include Better-Auth for user authentication?',
                    default: true
                }
            ]);

            // Step 5: Development Tools
            console.log(chalk.cyan('\n⚙️ Development Tools'));
            const toolsChoice = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'ci',
                    message: 'Setup GitHub Actions for CI/CD (linting, type-checking)?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'hooks',
                    message: 'Setup Git pre-commit hooks (Husky + lint-staged)?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'editor',
                    message: 'Include VS Code settings and EditorConfig?',
                    default: true
                }
            ]);

            // Combine all choices
            const projectOptions: ProjectOptions = {
                name: projectName,
                directory: projectDirectory,
                database: databaseChoice.database,
                auth: authChoice.auth,
                ui: uiChoice.ui,
                ci: toolsChoice.ci,
                hooks: toolsChoice.hooks,
                editor: toolsChoice.editor
            };

            // Show summary
            console.log(chalk.blue('\n📋 Project Summary:'));
            console.log(chalk.gray(`  Name: ${projectOptions.name}`));
            console.log(chalk.gray(`  Directory: ${projectOptions.directory}`));
            console.log(chalk.gray(`  Database: ${projectOptions.database}`));
            console.log(chalk.gray(`  Auth: ${projectOptions.auth ? 'Yes' : 'No'}`));
            console.log(chalk.gray(`  UI: ${projectOptions.ui}`));
            console.log(chalk.gray(`  CI/CD: ${projectOptions.ci ? 'Yes' : 'No'}`));
            console.log(chalk.gray(`  Git Hooks: ${projectOptions.hooks ? 'Yes' : 'No'}`));
            console.log(chalk.gray(`  Editor Config: ${projectOptions.editor ? 'Yes' : 'No'}`));

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

            console.log(chalk.blue('\n🚀 Creating your Next.js project...\n'));

            await createProject(projectOptions);

            console.log(chalk.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
            console.log(chalk.gray(`\nTo get started:`));
            console.log(chalk.gray(`  cd ${projectOptions.directory}`));
            console.log(chalk.gray(`  pnpm install`));
            console.log(chalk.gray(`  pnpm dev`));

            if (projectOptions.database === 'postgres') {
                console.log(chalk.yellow(`\n⚠️  Don't forget to start your PostgreSQL database:`));
                console.log(chalk.gray(`  docker-compose up -d`));
            }

            if (projectOptions.database === 'turso') {
                console.log(chalk.blue(`\n💡 To set up Turso:`));
                console.log(chalk.gray(`  1. Install Turso CLI: curl -sSfL https://get.tur.so/install.sh | bash`));
                console.log(chalk.gray(`  2. Create database: turso db create ${projectOptions.directory}`));
                console.log(chalk.gray(`  3. Get URL: turso db show --url ${projectOptions.directory}`));
                console.log(chalk.gray(`  4. Create token: turso db tokens create ${projectOptions.directory}`));
                console.log(chalk.gray(`  5. Update your .env.local file`));
            }

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
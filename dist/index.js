#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const create_project_1 = require("./lib/create-project");
const banner_1 = require("./lib/banner");
const utils_1 = require("./lib/utils");
const program = new commander_1.Command();
program
    .name('matt-init')
    .description('CLI tool for scaffolding Next.js projects with opinionated defaults')
    .version('1.0.0');
// Main command - interactive project creation
program
    .argument('[directory]', 'Project directory (will also be used as project name)')
    .action(async (directory) => {
    (0, banner_1.displayBanner)();
    try {
        console.log(chalk_1.default.blue('🚀 Let\'s create your Next.js project!\n'));
        // Step 1: Project name and directory
        const projectInfo = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'directory',
                message: 'What should we call your project directory?',
                default: directory || 'my-nextjs-app',
                when: !directory,
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Project directory is required';
                    }
                    if (!(0, utils_1.validateProjectName)(input)) {
                        return 'Directory name must contain only lowercase letters, numbers, hyphens, and underscores';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'name',
                message: 'What\'s the display name for your project?',
                default: (answers) => (directory || answers.directory),
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Project name is required';
                    }
                    return true;
                }
            }
        ]);
        const projectDirectory = directory || projectInfo.directory;
        const projectName = projectInfo.name || projectDirectory;
        console.log(chalk_1.default.gray(`\nProject: ${chalk_1.default.white(projectName)}`));
        console.log(chalk_1.default.gray(`Directory: ${chalk_1.default.white(projectDirectory)}\n`));
        // Step 2: Database setup
        console.log(chalk_1.default.cyan('📊 Database Configuration'));
        const databaseChoice = await inquirer_1.default.prompt([
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
        // Step 3: Authentication
        console.log(chalk_1.default.cyan('\n🔐 Authentication'));
        const authChoice = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'auth',
                message: 'Include Better-Auth for user authentication?',
                default: true
            }
        ]);
        // Step 4: UI Library
        console.log(chalk_1.default.cyan('\n🎨 UI Library'));
        const uiChoice = await inquirer_1.default.prompt([
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
        // Step 5: Development Tools
        console.log(chalk_1.default.cyan('\n⚙️ Development Tools'));
        const toolsChoice = await inquirer_1.default.prompt([
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
        const projectOptions = {
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
        console.log(chalk_1.default.blue('\n📋 Project Summary:'));
        console.log(chalk_1.default.gray(`  Name: ${projectOptions.name}`));
        console.log(chalk_1.default.gray(`  Directory: ${projectOptions.directory}`));
        console.log(chalk_1.default.gray(`  Database: ${projectOptions.database}`));
        console.log(chalk_1.default.gray(`  Auth: ${projectOptions.auth ? 'Yes' : 'No'}`));
        console.log(chalk_1.default.gray(`  UI: ${projectOptions.ui}`));
        console.log(chalk_1.default.gray(`  CI/CD: ${projectOptions.ci ? 'Yes' : 'No'}`));
        console.log(chalk_1.default.gray(`  Git Hooks: ${projectOptions.hooks ? 'Yes' : 'No'}`));
        console.log(chalk_1.default.gray(`  Editor Config: ${projectOptions.editor ? 'Yes' : 'No'}`));
        const { confirm } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '\nDoes this look good? Ready to create your project?',
                default: true
            }
        ]);
        if (!confirm) {
            console.log(chalk_1.default.yellow('Project creation cancelled.'));
            process.exit(0);
        }
        console.log(chalk_1.default.blue('\n🚀 Creating your Next.js project...\n'));
        await (0, create_project_1.createProject)(projectOptions);
        console.log(chalk_1.default.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
        console.log(chalk_1.default.gray(`\nTo get started:`));
        console.log(chalk_1.default.gray(`  cd ${projectOptions.directory}`));
        console.log(chalk_1.default.gray(`  pnpm install`));
        console.log(chalk_1.default.gray(`  pnpm dev`));
        if (projectOptions.database === 'postgres') {
            console.log(chalk_1.default.yellow(`\n⚠️  Don't forget to start your PostgreSQL database:`));
            console.log(chalk_1.default.gray(`  docker-compose up -d`));
        }
        if (projectOptions.database === 'turso') {
            console.log(chalk_1.default.blue(`\n💡 To set up Turso:`));
            console.log(chalk_1.default.gray(`  1. Install Turso CLI: curl -sSfL https://get.tur.so/install.sh | bash`));
            console.log(chalk_1.default.gray(`  2. Create database: turso db create ${projectOptions.directory}`));
            console.log(chalk_1.default.gray(`  3. Get URL: turso db show --url ${projectOptions.directory}`));
            console.log(chalk_1.default.gray(`  4. Create token: turso db tokens create ${projectOptions.directory}`));
            console.log(chalk_1.default.gray(`  5. Update your .env.local file`));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error creating project:'), error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Add a help command that shows examples
program
    .command('help')
    .description('Show usage examples and help')
    .action(() => {
    console.log(chalk_1.default.cyan('\n📚 Usage Examples:\n'));
    console.log(chalk_1.default.gray('Create a project interactively:'));
    console.log(chalk_1.default.blue('  matt-init\n'));
    console.log(chalk_1.default.gray('Create a project in a specific directory:'));
    console.log(chalk_1.default.blue('  matt-init my-awesome-app\n'));
    console.log(chalk_1.default.gray('Alternative ways to run:'));
    console.log(chalk_1.default.blue('  pnpm run dev my-project'));
    console.log(chalk_1.default.blue('  npx matt-init my-project\n'));
});
// Handle unknown commands
program.on('command:*', (operands) => {
    console.error(chalk_1.default.red(`Unknown command: ${operands[0]}`));
    console.log(chalk_1.default.gray('Run "matt-init help" for available commands'));
    process.exit(1);
});
// Show help if run with --help or -h
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    (0, banner_1.displayBanner)();
    program.help();
}
program.parse();
//# sourceMappingURL=index.js.map
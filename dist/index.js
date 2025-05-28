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
    .description('CLI tool for scaffolding Next.js projects')
    .version('1.0.0');
// Main command - interactive project creation
program
    .argument('[directory]', 'Project directory (will also be used as project name)')
    .action(async (directory) => {
    (0, banner_1.displayBanner)();
    try {
        console.log(chalk_1.default.blue('Let\'s create your Next.js project!\n'));
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
        const projectOptions = {
            name: projectName,
            directory: projectDirectory,
            initGit: false // Default value
        };
        // Ask if the user wants to initialize a git repository
        const { initGit } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'initGit',
                message: 'Would you like to initialize a git repository?',
                default: false
            }
        ]);
        projectOptions.initGit = initGit;
        // Show summary
        console.log(chalk_1.default.blue('\n📋 Project Summary:'));
        console.log(chalk_1.default.gray(`  Name: ${projectOptions.name}`));
        console.log(chalk_1.default.gray(`  Directory: ${projectOptions.directory}`));
        console.log(chalk_1.default.gray(`  Initialize Git: ${projectOptions.initGit ? 'Yes' : 'No'}`));
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
        console.log(''); // Add some space before spinner starts
        await (0, create_project_1.createProject)(projectOptions);
        console.log(chalk_1.default.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
        console.log(chalk_1.default.gray(`\nTo get started:`));
        console.log(chalk_1.default.gray(`  cd ${projectOptions.directory}`));
        console.log(chalk_1.default.gray(`  pnpm dev`));
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
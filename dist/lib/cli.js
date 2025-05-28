"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = runCli;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const create_project_1 = require("~/lib/create-project");
const banner_1 = require("~/lib/banner");
const prompts_1 = require("~/lib/prompts");
async function runCli() {
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
        console.log(chalk_1.default.blue('Let\'s create your Next.js project!\n'));
        // Step 1: Get project info (name and directory)
        const projectInfo = await (0, prompts_1.askProjectInfo)(directory);
        const projectDirectory = directory || projectInfo.directory;
        const projectName = projectInfo.name || projectDirectory;
        // Step 2: Ask about database
        const { database } = await (0, prompts_1.askDatabase)();
        // Step 3: Ask about nix flake
        const { nixFlake } = await (0, prompts_1.askNixFlake)();
        // Step 4: Ask about git initialization
        const { initGit } = await (0, prompts_1.askGitInit)();
        // Step 5: Ask about pre-commit hooks (only if git is enabled)
        let preCommitHooks = false;
        if (initGit) {
            const preCommitAnswer = await (0, prompts_1.askPreCommitHooks)();
            preCommitHooks = preCommitAnswer.preCommitHooks;
        }
        // Step 6: Show summary and get confirmation
        console.log(chalk_1.default.blue('\n📋 Project Summary:'));
        console.log(chalk_1.default.gray(`  Name: ${projectName}`));
        console.log(chalk_1.default.gray(`  Directory: ${projectDirectory}`));
        console.log(chalk_1.default.gray(`  Database: ${database === 'none' ? 'None' : database.charAt(0).toUpperCase() + database.slice(1)}`));
        console.log(chalk_1.default.gray(`  Nix Flake: ${nixFlake ? 'Yes' : 'No'}`));
        console.log(chalk_1.default.gray(`  Initialize Git: ${initGit ? 'Yes' : 'No'}`));
        if (initGit) {
            console.log(chalk_1.default.gray(`  Pre-commit Hooks: ${preCommitHooks ? 'Yes' : 'No'}`));
        }
        const { confirm } = await (0, prompts_1.askConfirmation)();
        if (!confirm) {
            console.log(chalk_1.default.yellow('Project creation cancelled.'));
            process.exit(0);
        }
        // Build options object
        const projectOptions = {
            name: projectName,
            directory: projectDirectory,
            initGit,
            nixFlake,
            database,
            preCommitHooks
        };
        console.log(''); // Add some space before spinner starts
        await (0, create_project_1.createProject)(projectOptions);
        console.log(chalk_1.default.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
        if (database !== 'none') {
            console.log(chalk_1.default.cyan(`🎉 Database setup: ${database.charAt(0).toUpperCase() + database.slice(1)}`));
        }
        console.log(chalk_1.default.gray(`\nTo get started:`));
        console.log(chalk_1.default.gray(`  cd ${projectOptions.directory}`));
        console.log(chalk_1.default.gray(`  pnpm dev`));
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
}
//# sourceMappingURL=cli.js.map
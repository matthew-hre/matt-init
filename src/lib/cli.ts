import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from '~/lib/create-project';
import { displayBanner } from '~/lib/banner';
import { ProjectOptions } from '~/lib/types';
import { askProjectInfo, askGitInit, askFeatures, askConfirmation, askNixFlake } from '~/lib/prompts';

export async function runCli(): Promise<void> {
    const program = new Command();

    program
        .name('matt-init')
        .description('CLI tool for scaffolding Next.js projects')
        .version('1.0.0');

    // Main command - interactive project creation
    program
        .argument('[directory]', 'Project directory (will also be used as project name)')
        .action(async (directory?: string) => {
            displayBanner();

            console.log(chalk.blue('Let\'s create your Next.js project!\n'));

            // Step 1: Get project info (name and directory)
            const projectInfo = await askProjectInfo(directory);
            const projectDirectory = directory || projectInfo.directory;
            const projectName = projectInfo.name || projectDirectory;

            // Step 2: Ask about optional features
            const { features } = await askFeatures();

            // Step 3: Ask about nix flake
            const { nixFlake } = await askNixFlake();

            // Step 4: Ask about git initialization
            const { initGit } = await askGitInit();

            // Step 5: Show summary and get confirmation
            console.log(chalk.blue('\n📋 Project Summary:'));
            console.log(chalk.gray(`  Name: ${projectName}`));
            console.log(chalk.gray(`  Directory: ${projectDirectory}`));
            console.log(chalk.gray(`  Features: ${features.length > 0 ? features.join(', ') : 'None'}`));
            console.log(chalk.gray(`  Nix Flake: ${nixFlake ? 'Yes' : 'No'}`));
            console.log(chalk.gray(`  Initialize Git: ${initGit ? 'Yes' : 'No'}`));

            const { confirm } = await askConfirmation();

            if (!confirm) {
                console.log(chalk.yellow('Project creation cancelled.'));
                process.exit(0);
            }

            // Build options object
            const projectOptions: ProjectOptions = {
                name: projectName,
                directory: projectDirectory,
                initGit,
                nixFlake,
                features
            };

            console.log(''); // Add some space before spinner starts

            await createProject(projectOptions);

            console.log(chalk.green(`\n✅ Project "${projectOptions.name}" created successfully!`));
            if (features.length > 0) {
                console.log(chalk.cyan(`🎉 Installed features: ${features.join(', ')}`));
            }
            console.log(chalk.gray(`\nTo get started:`));
            console.log(chalk.gray(`  cd ${projectOptions.directory}`));
            console.log(chalk.gray(`  pnpm dev`));
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
}
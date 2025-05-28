import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { customizeNextJsProject } from '~/lib/file-handlers';
import { initializeGitRepository, createInitialCommit } from '~/lib/git';
import { runLintFix } from '~/lib/format';
import { createBasicReadme } from '~/lib/templates';
import { applyDatabaseInstaller, applyPreCommitInstaller } from '~/lib/installers';
import { ProjectOptions } from '~/lib/types';
import { runCmd } from '~/lib/run-cmd';

export async function createProject(options: ProjectOptions): Promise<void> {
    const projectPath = path.resolve(process.cwd(), options.directory);

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory "${options.directory}" already exists`);
    }

    let spinner = ora('Creating Next.js project...').start();

    try {
        await createNextJsProject(options.directory);
        spinner.succeed('Next.js project created');

        spinner = ora('Customizing project files...').start();
        await customizeNextJsProject(projectPath, {
            initGit: options.initGit,
            nixFlake: options.nixFlake,
            projectName: options.name,
            database: options.database
        });
        spinner.succeed('Project files customized');

        spinner = ora('Setting up project documentation...').start();
        await createBasicReadme(projectPath, {
            name: options.name,
            directory: options.directory,
            nixFlake: options.nixFlake,
            database: options.database
        });
        spinner.succeed('Project documentation created');

        // Apply database setup if selected
        if (options.database !== 'none') {
            spinner = ora(`Setting up database: ${options.database}...`).start();
            await applyDatabaseInstaller(projectPath, options.database);
            spinner.succeed('Database setup completed');
        }

        spinner = ora('Tidying up...').start();
        await runLintFix(projectPath);
        spinner.succeed('Code formatted and linted');

        if (options.initGit) {
            spinner = ora('Initializing git repository...').start();
            await initializeGitRepository(projectPath);
            spinner.succeed('Git repository initialized');
        }

        // Apply pre-commit hooks if enabled (must be after git init)
        if (options.preCommitHooks) {
            spinner = ora('Setting up pre-commit hooks...').start();
            await applyPreCommitInstaller(projectPath, options.preCommitHooks);
            spinner.succeed('Pre-commit hooks configured');
        }

        // Create initial git commit at the very end (after all files are created)
        if (options.initGit) {
            spinner = ora('Creating initial commit...').start();
            await createInitialCommit(projectPath);
            spinner.succeed('Initial commit created');
        }

    } catch (error) {
        spinner.fail('Failed to create project');
        throw error;
    }
}

async function createNextJsProject(directory: string): Promise<void> {
    await runCmd('pnpm', [
        'create',
        'next-app@latest',
        directory,
        '--typescript',
        '--tailwind',
        '--eslint',
        '--app',
        '--turbopack',
        '--src-dir',
        '--import-alias=~/*',
        '--use-pnpm'
    ], {
        stdio: 'pipe', // Hide output
        cwd: process.cwd()
    });
}
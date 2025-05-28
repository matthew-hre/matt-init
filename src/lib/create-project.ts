import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { Spinner } from '~/lib/spinner';
import { customizeNextJsProject } from '~/lib/file-handlers';
import { initializeGitRepository } from '~/lib/git';
import { runLintFix } from '~/lib/format';
import { createBasicReadme } from '~/lib/templates';
import { ProjectOptions } from '~/lib/types';
import { runCmd } from '~/lib/run-cmd';

export async function createProject(options: ProjectOptions): Promise<void> {
    const projectPath = path.resolve(process.cwd(), options.directory);

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory "${options.directory}" already exists`);
    }

    const spinner = new Spinner('Creating Next.js project...');
    spinner.start();

    try {
        await createNextJsProject(options.directory);
        spinner.succeed('Next.js project created');

        spinner.updateMessage('Customizing project files...');
        spinner.start();
        await customizeNextJsProject(projectPath, { initGit: options.initGit });
        spinner.succeed('Project files customized');

        spinner.updateMessage('Setting up project documentation...');
        spinner.start();
        await createBasicReadme(projectPath, options);
        spinner.succeed('Project documentation created');

        spinner.updateMessage('Tidying up...');
        spinner.start();
        await runLintFix(projectPath);
        spinner.succeed('Code formatted and linted');

        if (options.initGit) {
            spinner.updateMessage('Initializing git repository...');
            spinner.start();
            await initializeGitRepository(projectPath);
            spinner.succeed('Git repository initialized');
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
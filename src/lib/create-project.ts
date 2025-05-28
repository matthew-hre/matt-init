import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { Spinner } from './spinner';
import { customizeNextJsProject, initializeGitRepository, runLintFix } from './file-handlers';

export interface ProjectOptions {
    name: string;
    directory: string;
    initGit: boolean;
}

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
    return new Promise((resolve, reject) => {
        const child = spawn('pnpm', [
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

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

async function createBasicReadme(projectPath: string, options: ProjectOptions): Promise<void> {
    // Read the README template
    const templatesPath = path.join(__dirname, '..', 'templates');
    const readmeTemplate = path.join(templatesPath, 'README.md');
    let readmeContent = await fs.readFile(readmeTemplate, 'utf8');

    // Replace placeholders with actual values
    readmeContent = readmeContent
        .replace(/{{PROJECT_NAME}}/g, options.name)
        .replace(/{{DIRECTORY}}/g, options.directory);

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}
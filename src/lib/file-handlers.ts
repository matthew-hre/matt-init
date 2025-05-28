import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Empty the public directory of a Next.js project
 */
export async function emptyPublicDirectory(projectPath: string): Promise<void> {
    const publicPath = path.join(projectPath, 'public');

    if (await fs.pathExists(publicPath)) {
        // Remove all files in public directory
        const items = await fs.readdir(publicPath);
        for (const item of items) {
            await fs.remove(path.join(publicPath, item));
        }
    }
}

/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content: string): string {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
}

/**
 * Replace default Next.js app files with custom templates
 */
export async function replaceAppFiles(projectPath: string): Promise<void> {
    const appPath = path.join(projectPath, 'src', 'app');
    const templatesPath = path.join(__dirname, '..', 'templates', 'nextjs');

    // Process and copy layout.tsx
    const layoutTemplate = path.join(templatesPath, 'layout.tsx');
    const layoutContent = await fs.readFile(layoutTemplate, 'utf8');
    const processedLayoutContent = processTemplateContent(layoutContent);
    await fs.writeFile(path.join(appPath, 'layout.tsx'), processedLayoutContent);

    // Process and copy page.tsx
    const pageTemplate = path.join(templatesPath, 'page.tsx');
    const pageContent = await fs.readFile(pageTemplate, 'utf8');
    const processedPageContent = processTemplateContent(pageContent);
    await fs.writeFile(path.join(appPath, 'page.tsx'), processedPageContent);
}

/**
 * Initialize a git repository in the project directory
 */
export async function initializeGitRepository(projectPath: string): Promise<void> {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
        // Initialize git repo
        const initProcess = spawn('git', ['init'], {
            cwd: projectPath,
            stdio: 'pipe'
        });

        initProcess.on('close', (code: number | null) => {
            if (code !== 0) {
                reject(new Error(`Git init failed with exit code ${code}`));
                return;
            }

            // Set main as default branch
            const branchProcess = spawn('git', ['branch', '-M', 'main'], {
                cwd: projectPath,
                stdio: 'pipe'
            });

            branchProcess.on('close', (branchCode: number | null) => {
                if (branchCode !== 0) {
                    reject(new Error(`Git branch setup failed with exit code ${branchCode}`));
                    return;
                }

                // Add all files
                const addProcess = spawn('git', ['add', '.'], {
                    cwd: projectPath,
                    stdio: 'pipe'
                });

                addProcess.on('close', (addCode: number | null) => {
                    if (addCode !== 0) {
                        reject(new Error(`Git add failed with exit code ${addCode}`));
                        return;
                    }

                    // Commit files
                    const commitProcess = spawn('git', ['commit', '-m', ':sparkles: Initial commit!'], {
                        cwd: projectPath,
                        stdio: 'pipe'
                    });

                    commitProcess.on('close', (commitCode: number | null) => {
                        if (commitCode === 0) {
                            resolve();
                        } else {
                            reject(new Error(`Git commit failed with exit code ${commitCode}`));
                        }
                    });

                    commitProcess.on('error', (error: Error) => {
                        reject(error);
                    });
                });

                addProcess.on('error', (error: Error) => {
                    reject(error);
                });
            });

            branchProcess.on('error', (error: Error) => {
                reject(error);
            });
        });

        initProcess.on('error', (error: Error) => {
            reject(error);
        });
    });
}

/**
 * Apply all customizations to a newly created Next.js project
 */
export async function customizeNextJsProject(projectPath: string, options: { initGit: boolean }): Promise<void> {
    await emptyPublicDirectory(projectPath);
    await replaceAppFiles(projectPath);
}
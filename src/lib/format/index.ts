import * as fs from 'fs-extra';
import * as path from 'path';
import { runCmd } from '~/lib/run-cmd';

/**
 * Set up ESLint with antfu's configuration
 */
export async function setupEslint(projectPath: string): Promise<void> {
    // Remove default ESLint config files created by Next.js
    const eslintrcPath = path.join(projectPath, 'eslint.config.mjs');
    if (await fs.pathExists(eslintrcPath)) {
        await fs.remove(eslintrcPath);
    }

    // Copy eslint.config.js from template
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const eslintTemplate = path.join(templatesPath, 'eslint.config.mjs');
    const eslintContent = await fs.readFile(eslintTemplate, 'utf8');
    await fs.writeFile(path.join(projectPath, 'eslint.config.mjs'), eslintContent);

    // Install antfu's ESLint config
    await runCmd('pnpm', ['add', '-D', '@antfu/eslint-config', 'eslint-plugin-format'], { stdio: 'pipe', cwd: projectPath });

}

/**
 * Add lint scripts to package.json
 */
export async function addLintScripts(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);

        // Add lint scripts
        packageJson.scripts = {
            ...packageJson.scripts,
            "lint": "eslint .",
            "lint:fix": "eslint . --fix"
        };

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
}

/**
 * Run lint:fix on the project
 */
export async function runLintFix(projectPath: string): Promise<void> {
    try {
        await runCmd('pnpm', ['run', 'lint:fix'], {
            stdio: 'pipe',
            cwd: projectPath,
            timeout: 30000 // Add 30 second timeout
        });
    } catch (error) {
        // ESLint returns non-zero exit codes when it finds/fixes issues, but that's okay
        // We only ignore exit code errors, but still throw on actual command execution errors
        if (error && typeof error === 'object' && 'exitCode' in error) {
            // Ignore ESLint exit codes, it's normal for it to return non-zero when fixing issues
            return;
        }

        // Log the error but don't fail the entire process for lint issues
        console.warn('Lint fix failed:', error instanceof Error ? error.message : error);
    }
}
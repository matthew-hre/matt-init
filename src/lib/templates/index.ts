import * as fs from 'fs-extra';
import * as path from 'path';
import { createFileFromTemplate } from '~/lib/utils';

/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content: string): string {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
}

/**
 * Process and copy a template file to the destination
 */
async function processTemplateFile(templatePath: string, outputPath: string): Promise<void> {
    const content = await fs.readFile(templatePath, 'utf8');
    const processedContent = processTemplateContent(content);
    await fs.writeFile(outputPath, processedContent);
}

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
 * Replace default Next.js app files with custom templates
 */
export async function replaceAppFiles(projectPath: string): Promise<void> {
    const appPath = path.join(projectPath, 'src', 'app');
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'nextjs');

    // Process and copy template files
    await processTemplateFile(
        path.join(templatesPath, 'layout.tsx'),
        path.join(appPath, 'layout.tsx')
    );

    await processTemplateFile(
        path.join(templatesPath, 'page.tsx'),
        path.join(appPath, 'page.tsx')
    );
}

/**
 * Remove default favicon from the app directory
 */
export async function removeFavicon(projectPath: string): Promise<void> {
    const faviconPath = path.join(projectPath, 'src', 'app', 'favicon.ico');

    if (await fs.pathExists(faviconPath)) {
        await fs.remove(faviconPath);
    }
}

/**
 * Create basic README from template
 */
export async function createBasicReadme(projectPath: string, options: { name: string; directory: string; nixFlake?: boolean; database?: string }): Promise<void> {
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const readmeTemplate = path.join(templatesPath, 'README.md');
    const outputPath = path.join(projectPath, 'README.md');

    // Generate database-specific instructions
    let databaseInstructions = '';
    if (options.database === 'turso') {
        databaseInstructions = `
   > **Note:** This project uses Turso (SQLite) as the database. The \`pnpm dev\` command will automatically start both the database server and Next.js development server using concurrently.

`;
    }

    createFileFromTemplate(readmeTemplate, outputPath, {
        PROJECT_NAME: options.name,
        DIRECTORY: options.directory,
        NIX_DEVELOP_COMMAND: options.nixFlake ? 'nix develop\n   ' : '',
        DATABASE_INSTRUCTIONS: databaseInstructions
    });
}

/**
 * Create nix flake files from templates
 */
export async function createNixFlake(projectPath: string, options: { name: string; database?: string }): Promise<void> {
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'nix');

    // Create nix directory
    const nixDir = path.join(projectPath, 'nix');
    await fs.ensureDir(nixDir);

    // Create flake.nix in project root
    const flakeTemplate = path.join(templatesPath, 'flake.nix');
    const flakeOutput = path.join(projectPath, 'flake.nix');
    createFileFromTemplate(flakeTemplate, flakeOutput, {
        PROJECT_NAME: options.name
    });

    // Determine additional nix packages and parameters based on options
    const nixPackages = [];
    const nixParams = [];

    if (options.database === 'turso') {
        nixPackages.push('turso-cli', 'sqld');
        nixParams.push('turso-cli', 'sqld');
    }

    // Create devShell.nix with conditional packages
    const devShellTemplate = path.join(templatesPath, 'devShell.nix');
    const devShellOutput = path.join(nixDir, 'devShell.nix');

    createFileFromTemplate(devShellTemplate, devShellOutput, {
        PROJECT_NAME: options.name,
        ADDITIONAL_PARAMS: nixParams.length > 0 ? `\n  ${nixParams.join(',\n  ')},` : '',
        ADDITIONAL_PACKAGES: nixPackages.length > 0 ? `\n    ${nixPackages.join('\n    ')}` : ''
    });
}
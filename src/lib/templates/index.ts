import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content: string): string {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
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
export async function createBasicReadme(projectPath: string, options: { name: string; directory: string }): Promise<void> {
    // Read the README template
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const readmeTemplate = path.join(templatesPath, 'README.md');
    let readmeContent = await fs.readFile(readmeTemplate, 'utf8');

    // Replace placeholders with actual values
    readmeContent = readmeContent
        .replace(/{{PROJECT_NAME}}/g, options.name)
        .replace(/{{DIRECTORY}}/g, options.directory);

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}
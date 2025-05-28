import { emptyPublicDirectory, replaceAppFiles, removeFavicon } from '~/lib/templates';
import { setupEslint, addLintScripts } from '~/lib/format';

/**
 * Apply all customizations to a newly created Next.js project
 */
export async function customizeNextJsProject(projectPath: string, options: { initGit: boolean }): Promise<void> {
    await emptyPublicDirectory(projectPath);
    await replaceAppFiles(projectPath);
    await removeFavicon(projectPath);
    await setupEslint(projectPath);
    await addLintScripts(projectPath);
}
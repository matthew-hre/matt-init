import { emptyPublicDirectory, replaceAppFiles, removeFavicon, createNixFlake, createEnvFiles } from '~/lib/templates';
import { setupEslint, addLintScripts } from '~/lib/format';

/**
 * Apply all customizations to a newly created Next.js project
 */
export async function customizeNextJsProject(projectPath: string, options: { initGit: boolean; nixFlake: boolean; projectName: string; database: string }): Promise<void> {
    await emptyPublicDirectory(projectPath);
    await replaceAppFiles(projectPath);
    await removeFavicon(projectPath);
    await setupEslint(projectPath);
    await addLintScripts(projectPath);

    // Create typesafe env files for all projects
    await createEnvFiles(projectPath, { database: options.database });

    if (options.nixFlake) {
        await createNixFlake(projectPath, { name: options.projectName, database: options.database });
    }
}
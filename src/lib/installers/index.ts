import { runCmd } from '~/lib/run-cmd';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface Installer {
    deps?: string[];
    devDeps?: string[];
    apply: (projectPath: string) => Promise<void>;
}

// Drizzle installer
async function applyDrizzle(projectPath: string): Promise<void> {
    // Copy drizzle configuration files
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'drizzle');
    const targetPath = path.join(projectPath, 'src', 'lib', 'db');

    await fs.ensureDir(targetPath);

    // Copy drizzle files if they exist
    if (await fs.pathExists(templatesPath)) {
        await fs.copy(templatesPath, targetPath);
    }

    // Create drizzle config file
    const drizzleConfig = `import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/db/schema.ts',
    out: './drizzle',
    driver: 'sqlite',
    dbCredentials: {
        url: './sqlite.db',
    },
} satisfies Config;
`;

    await fs.writeFile(path.join(projectPath, 'drizzle.config.ts'), drizzleConfig);
}


export const installers: Record<string, Installer> = {
    drizzle: {
        deps: ['drizzle-orm', 'better-sqlite3'],
        devDeps: ['drizzle-kit', '@types/better-sqlite3'],
        apply: applyDrizzle,
    }
};

export async function applyInstallers(
    projectPath: string,
    selectedFeatures: string[]
): Promise<void> {
    const selectedInstallers = selectedFeatures
        .filter(feature => feature in installers)
        .map(feature => ({ name: feature, installer: installers[feature] }));

    if (selectedInstallers.length === 0) {
        return;
    }

    // Collect all dependencies
    const allDeps = new Set<string>();
    const allDevDeps = new Set<string>();

    selectedInstallers.forEach(({ installer }) => {
        installer.deps?.forEach(dep => allDeps.add(dep));
        installer.devDeps?.forEach(dep => allDevDeps.add(dep));
    });

    // Install dependencies
    if (allDeps.size > 0) {
        await runCmd('pnpm', ['add', ...Array.from(allDeps)], {
            cwd: projectPath,
            stdio: 'pipe'
        });
    }

    if (allDevDeps.size > 0) {
        await runCmd('pnpm', ['add', '-D', ...Array.from(allDevDeps)], {
            cwd: projectPath,
            stdio: 'pipe'
        });
    }

    // Apply each installer
    for (const { name, installer } of selectedInstallers) {
        await installer.apply(projectPath);
    }
}
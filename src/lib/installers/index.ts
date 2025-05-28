import { runCmd } from '~/lib/run-cmd';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface DatabaseInstaller {
    deps?: string[];
    devDeps?: string[];
    apply: (projectPath: string) => Promise<void>;
}

// Turso installer
async function applyTurso(projectPath: string): Promise<void> {
    // Create .env file with Turso configuration
    const envContent = `TURSO_DATABASE_URL=http://127.0.0.1:8080
TURSO_AUTH_TOKEN=
`;
    await fs.writeFile(path.join(projectPath, '.env'), envContent);

    // Create database client file
    const dbDir = path.join(projectPath, 'src', 'lib', 'db');
    await fs.ensureDir(dbDir);

    const clientContent = `import { createClient } from "@libsql/client";

const client = createClient({
  url: "http://127.0.0.1:8080",
});

export default client;
`;
    await fs.writeFile(path.join(dbDir, 'client.ts'), clientContent);

    // Update package.json scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
        ...packageJson.scripts,
        'dev:db': 'turso dev --db-file local.db',
        'dev': 'concurrently "pnpm run dev:db" "next dev"'
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

export const databaseInstallers: Record<string, DatabaseInstaller> = {
    turso: {
        deps: ['@libsql/client', 'concurrently'],
        apply: applyTurso,
    }
};

export async function applyDatabaseInstaller(
    projectPath: string,
    database: string
): Promise<void> {
    if (database === 'none' || !databaseInstallers[database]) {
        return;
    }

    const installer = databaseInstallers[database];

    // Install dependencies
    if (installer.deps && installer.deps.length > 0) {
        await runCmd('pnpm', ['add', ...installer.deps], {
            cwd: projectPath,
            stdio: 'pipe'
        });
    }

    if (installer.devDeps && installer.devDeps.length > 0) {
        await runCmd('pnpm', ['add', '-D', ...installer.devDeps], {
            cwd: projectPath,
            stdio: 'pipe'
        });
    }

    // Apply the installer
    await installer.apply(projectPath);
}
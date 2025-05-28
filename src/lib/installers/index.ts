import { runCmd } from '~/lib/run-cmd';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface DatabaseInstaller {
    deps?: string[];
    devDeps?: string[];
    apply: (projectPath: string) => Promise<void>;
}

export interface PreCommitInstaller {
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

// Pre-commit hooks installer
async function applyPreCommitHooks(projectPath: string): Promise<void> {
    // Update package.json with lint-staged configuration
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson['lint-staged'] = {
        "*": "pnpm lint"
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    // Initialize Husky
    await runCmd('pnpm', ['exec', 'husky', 'init'], {
        cwd: projectPath,
        stdio: 'pipe'
    });

    // Update pre-commit hook
    const preCommitPath = path.join(projectPath, '.husky', 'pre-commit');
    await fs.writeFile(preCommitPath, 'pnpm exec lint-staged\n');

    // Make pre-commit executable
    await fs.chmod(preCommitPath, '755');
}

export const databaseInstallers: Record<string, DatabaseInstaller> = {
    turso: {
        deps: ['@libsql/client', 'concurrently'],
        apply: applyTurso,
    }
};

export const preCommitInstaller: PreCommitInstaller = {
    devDeps: ['husky', 'lint-staged'],
    apply: applyPreCommitHooks,
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

export async function applyPreCommitInstaller(
    projectPath: string,
    enabled: boolean
): Promise<void> {
    if (!enabled) {
        return;
    }

    // Install dev dependencies
    if (preCommitInstaller.devDeps && preCommitInstaller.devDeps.length > 0) {
        await runCmd('pnpm', ['add', '-D', ...preCommitInstaller.devDeps], {
            cwd: projectPath,
            stdio: 'pipe'
        });
    }

    // Apply the installer
    await preCommitInstaller.apply(projectPath);
}
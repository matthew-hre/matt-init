import { runCmd } from '~/lib/run-cmd';

/**
 * Initialize a git repository in the project directory (without committing)
 */
export async function initializeGitRepository(projectPath: string): Promise<void> {
    // Initialize git repo
    await runCmd('git', ['init'], { cwd: projectPath, stdio: 'pipe' });

    // Set main as default branch
    await runCmd('git', ['branch', '-M', 'main'], { cwd: projectPath, stdio: 'pipe' });
}

/**
 * Create the initial commit with all project files
 */
export async function createInitialCommit(projectPath: string): Promise<void> {
    // Add all files
    await runCmd('git', ['add', '.'], { cwd: projectPath, stdio: 'pipe' });

    // Commit files
    await runCmd('git', ['commit', '-m', ':sparkles: Initial commit!'], { cwd: projectPath, stdio: 'pipe' });
}
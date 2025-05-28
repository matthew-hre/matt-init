"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGitRepository = initializeGitRepository;
exports.createInitialCommit = createInitialCommit;
const run_cmd_1 = require("~/lib/run-cmd");
/**
 * Initialize a git repository in the project directory (without committing)
 */
async function initializeGitRepository(projectPath) {
    // Initialize git repo
    await (0, run_cmd_1.runCmd)('git', ['init'], { cwd: projectPath, stdio: 'pipe' });
    // Set main as default branch
    await (0, run_cmd_1.runCmd)('git', ['branch', '-M', 'main'], { cwd: projectPath, stdio: 'pipe' });
}
/**
 * Create the initial commit with all project files
 */
async function createInitialCommit(projectPath) {
    // Add all files
    await (0, run_cmd_1.runCmd)('git', ['add', '.'], { cwd: projectPath, stdio: 'pipe' });
    // Commit files
    await (0, run_cmd_1.runCmd)('git', ['commit', '-m', ':sparkles: Initial commit!'], { cwd: projectPath, stdio: 'pipe' });
}
//# sourceMappingURL=index.js.map
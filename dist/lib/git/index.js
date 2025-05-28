"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGitRepository = initializeGitRepository;
const run_cmd_1 = require("~/lib/run-cmd");
/**
 * Initialize a git repository in the project directory
 */
async function initializeGitRepository(projectPath) {
    // Initialize git repo
    await (0, run_cmd_1.runCmd)('git', ['init'], { cwd: projectPath, stdio: 'pipe' });
    // Set main as default branch
    await (0, run_cmd_1.runCmd)('git', ['branch', '-M', 'main'], { cwd: projectPath, stdio: 'pipe' });
    // Add all files
    await (0, run_cmd_1.runCmd)('git', ['add', '.'], { cwd: projectPath, stdio: 'pipe' });
    // Commit files
    await (0, run_cmd_1.runCmd)('git', ['commit', '-m', ':sparkles: Initial commit!'], { cwd: projectPath, stdio: 'pipe' });
}
//# sourceMappingURL=index.js.map
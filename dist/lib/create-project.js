"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const ora_1 = __importDefault(require("ora"));
const file_handlers_1 = require("~/lib/file-handlers");
const git_1 = require("~/lib/git");
const format_1 = require("~/lib/format");
const templates_1 = require("~/lib/templates");
const installers_1 = require("~/lib/installers");
const run_cmd_1 = require("~/lib/run-cmd");
async function createProject(options) {
    const projectPath = path.resolve(process.cwd(), options.directory);
    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory "${options.directory}" already exists`);
    }
    let spinner = (0, ora_1.default)('Creating Next.js project...').start();
    try {
        await createNextJsProject(options.directory);
        spinner.succeed('Next.js project created');
        spinner = (0, ora_1.default)('Customizing project files...').start();
        await (0, file_handlers_1.customizeNextJsProject)(projectPath, {
            initGit: options.initGit,
            nixFlake: options.nixFlake,
            projectName: options.name,
            database: options.database
        });
        spinner.succeed('Project files customized');
        spinner = (0, ora_1.default)('Installing environment dependencies...').start();
        await (0, installers_1.installEnvDependencies)(projectPath);
        spinner.succeed('Environment dependencies installed');
        spinner = (0, ora_1.default)('Setting up project documentation...').start();
        await (0, templates_1.createBasicReadme)(projectPath, {
            name: options.name,
            directory: options.directory,
            nixFlake: options.nixFlake,
            database: options.database
        });
        spinner.succeed('Project documentation created');
        // Apply database setup if selected
        if (options.database !== 'none') {
            spinner = (0, ora_1.default)(`Setting up database: ${options.database}...`).start();
            await (0, installers_1.applyDatabaseInstaller)(projectPath, options.database);
            spinner.succeed('Database setup completed');
        }
        spinner = (0, ora_1.default)('Tidying up...').start();
        await (0, format_1.runLintFix)(projectPath);
        spinner.succeed('Code formatted and linted');
        if (options.initGit) {
            spinner = (0, ora_1.default)('Initializing git repository...').start();
            await (0, git_1.initializeGitRepository)(projectPath);
            spinner.succeed('Git repository initialized');
        }
        // Apply pre-commit hooks if enabled (must be after git init)
        if (options.preCommitHooks) {
            spinner = (0, ora_1.default)('Setting up pre-commit hooks...').start();
            await (0, installers_1.applyPreCommitInstaller)(projectPath, options.preCommitHooks);
            spinner.succeed('Pre-commit hooks configured');
        }
        // Create initial git commit at the very end (after all files are created)
        if (options.initGit) {
            spinner = (0, ora_1.default)('Creating initial commit...').start();
            await (0, git_1.createInitialCommit)(projectPath);
            spinner.succeed('Initial commit created');
        }
    }
    catch (error) {
        spinner.fail('Failed to create project');
        throw error;
    }
}
async function createNextJsProject(directory) {
    await (0, run_cmd_1.runCmd)('pnpm', [
        'create',
        'next-app@latest',
        directory,
        '--typescript',
        '--tailwind',
        '--eslint',
        '--app',
        '--turbopack',
        '--src-dir',
        '--import-alias=~/*',
        '--use-pnpm'
    ], {
        stdio: 'pipe', // Hide output
        cwd: process.cwd()
    });
}
//# sourceMappingURL=create-project.js.map
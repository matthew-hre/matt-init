"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askProjectInfo = askProjectInfo;
exports.askNixFlake = askNixFlake;
exports.askGitInit = askGitInit;
exports.askConfirmation = askConfirmation;
exports.askDatabase = askDatabase;
exports.askPreCommitHooks = askPreCommitHooks;
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("~/lib/utils");
/**
 * Ask for project directory and name
 */
async function askProjectInfo(directory) {
    return await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'directory',
            message: 'What should we call your project directory?',
            default: directory || 'my-nextjs-app',
            when: !directory,
            validate: (input) => {
                if (!input.trim()) {
                    return 'Project directory is required';
                }
                if (!(0, utils_1.validateProjectName)(input)) {
                    return 'Directory name must contain only lowercase letters, numbers, hyphens, and underscores';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'name',
            message: 'What\'s the display name for your project?',
            default: (answers) => (directory || answers.directory),
            validate: (input) => {
                if (!input.trim()) {
                    return 'Project name is required';
                }
                return true;
            }
        }
    ]);
}
/**
 * Ask if user wants to add a nix flake
 */
async function askNixFlake() {
    return await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'nixFlake',
            message: 'Would you like to add a nix flake for development environment?',
            default: true
        }
    ]);
}
/**
 * Ask if user wants to initialize git repository
 */
async function askGitInit() {
    return await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'initGit',
            message: 'Would you like to initialize a git repository?',
            default: true
        }
    ]);
}
/**
 * Show project summary and ask for confirmation
 */
async function askConfirmation() {
    return await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '\nDoes this look good? Ready to create your project?',
            default: true
        }
    ]);
}
/**
 * Ask user to select database type
 */
async function askDatabase() {
    return await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'database',
            message: 'Which database would you like to use?',
            choices: [
                {
                    name: 'Turso (SQLite)',
                    value: 'turso'
                },
                {
                    name: 'None',
                    value: 'none'
                }
            ],
            default: 'none'
        }
    ]);
}
/**
 * Ask if user wants to enable pre-commit hooks
 */
async function askPreCommitHooks() {
    return await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'preCommitHooks',
            message: 'Would you like to enable pre-commit hooks (Husky + lint-staged)?',
            default: false
        }
    ]);
}
//# sourceMappingURL=prompts.js.map
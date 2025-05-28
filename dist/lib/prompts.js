"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askProjectInfo = askProjectInfo;
exports.askGitInit = askGitInit;
exports.askConfirmation = askConfirmation;
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
async function askConfirmation(projectName, projectDirectory, initGit) {
    console.log('\n📋 Project Summary:');
    console.log(`  Name: ${projectName}`);
    console.log(`  Directory: ${projectDirectory}`);
    console.log(`  Initialize Git: ${initGit ? 'Yes' : 'No'}`);
    return await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '\nDoes this look good? Ready to create your project?',
            default: true
        }
    ]);
}
//# sourceMappingURL=prompts.js.map
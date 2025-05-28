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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const spinner_1 = require("./spinner");
const file_handlers_1 = require("./file-handlers");
const readme_1 = require("../templates/readme");
async function createProject(options) {
    const projectPath = path.resolve(process.cwd(), options.directory);
    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory "${options.directory}" already exists`);
    }
    const spinner = new spinner_1.Spinner('Creating Next.js project...');
    spinner.start();
    try {
        await createNextJsProject(options.directory);
        spinner.succeed('Next.js project created');
        spinner.updateMessage('Customizing project files...');
        spinner.start();
        await (0, file_handlers_1.customizeNextJsProject)(projectPath, { initGit: options.initGit });
        spinner.succeed('Project files customized');
        spinner.updateMessage('Setting up project documentation...');
        spinner.start();
        await createBasicReadme(projectPath, options);
        spinner.succeed('Project documentation created');
        if (options.initGit) {
            spinner.updateMessage('Initializing git repository...');
            spinner.start();
            await (0, file_handlers_1.initializeGitRepository)(projectPath);
            spinner.succeed('Git repository initialized');
        }
    }
    catch (error) {
        spinner.fail('Failed to create project');
        throw error;
    }
}
async function createNextJsProject(directory) {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)('pnpm', [
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
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
        child.on('error', (error) => {
            reject(error);
        });
    });
}
async function createBasicReadme(projectPath, options) {
    const readme = (0, readme_1.generateReadme)(options.name, options.directory);
    await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}
//# sourceMappingURL=create-project.js.map
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
exports.emptyPublicDirectory = emptyPublicDirectory;
exports.replaceAppFiles = replaceAppFiles;
exports.createGitignore = createGitignore;
exports.initializeGitRepository = initializeGitRepository;
exports.customizeNextJsProject = customizeNextJsProject;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Empty the public directory of a Next.js project
 */
async function emptyPublicDirectory(projectPath) {
    const publicPath = path.join(projectPath, 'public');
    if (await fs.pathExists(publicPath)) {
        // Remove all files in public directory
        const items = await fs.readdir(publicPath);
        for (const item of items) {
            await fs.remove(path.join(publicPath, item));
        }
    }
}
/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content) {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
}
/**
 * Replace default Next.js app files with custom templates
 */
async function replaceAppFiles(projectPath) {
    const appPath = path.join(projectPath, 'src', 'app');
    const templatesPath = path.join(__dirname, '..', 'templates', 'nextjs');
    // Process and copy layout.tsx
    const layoutTemplate = path.join(templatesPath, 'layout.tsx');
    const layoutContent = await fs.readFile(layoutTemplate, 'utf8');
    const processedLayoutContent = processTemplateContent(layoutContent);
    await fs.writeFile(path.join(appPath, 'layout.tsx'), processedLayoutContent);
    // Process and copy page.tsx
    const pageTemplate = path.join(templatesPath, 'page.tsx');
    const pageContent = await fs.readFile(pageTemplate, 'utf8');
    const processedPageContent = processTemplateContent(pageContent);
    await fs.writeFile(path.join(appPath, 'page.tsx'), processedPageContent);
}
/**
 * Create a .gitignore file for a Next.js project
 */
async function createGitignore(projectPath) {
    const gitignoreTemplatePath = path.join(__dirname, '..', 'templates', '.gitignore');
    const gitignoreContent = await fs.readFile(gitignoreTemplatePath, 'utf8');
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
}
/**
 * Initialize a git repository in the project directory
 */
async function initializeGitRepository(projectPath) {
    const { spawn } = require('child_process');
    return new Promise((resolve, reject) => {
        // Initialize git repo
        const initProcess = spawn('git', ['init'], {
            cwd: projectPath,
            stdio: 'pipe'
        });
        initProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Git init failed with exit code ${code}`));
                return;
            }
            // Set main as default branch
            const branchProcess = spawn('git', ['branch', '-M', 'main'], {
                cwd: projectPath,
                stdio: 'pipe'
            });
            branchProcess.on('close', (branchCode) => {
                if (branchCode !== 0) {
                    reject(new Error(`Git branch setup failed with exit code ${branchCode}`));
                    return;
                }
                // Add all files
                const addProcess = spawn('git', ['add', '.'], {
                    cwd: projectPath,
                    stdio: 'pipe'
                });
                addProcess.on('close', (addCode) => {
                    if (addCode !== 0) {
                        reject(new Error(`Git add failed with exit code ${addCode}`));
                        return;
                    }
                    // Commit files
                    const commitProcess = spawn('git', ['commit', '-m', ':sparkles: Initial commit!'], {
                        cwd: projectPath,
                        stdio: 'pipe'
                    });
                    commitProcess.on('close', (commitCode) => {
                        if (commitCode === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error(`Git commit failed with exit code ${commitCode}`));
                        }
                    });
                    commitProcess.on('error', (error) => {
                        reject(error);
                    });
                });
                addProcess.on('error', (error) => {
                    reject(error);
                });
            });
            branchProcess.on('error', (error) => {
                reject(error);
            });
        });
        initProcess.on('error', (error) => {
            reject(error);
        });
    });
}
/**
 * Apply all customizations to a newly created Next.js project
 */
async function customizeNextJsProject(projectPath, options) {
    await emptyPublicDirectory(projectPath);
    await replaceAppFiles(projectPath);
    if (options.initGit) {
        await createGitignore(projectPath);
    }
}
//# sourceMappingURL=file-handlers.js.map
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
exports.setupEslint = setupEslint;
exports.addLintScripts = addLintScripts;
exports.runLintFix = runLintFix;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const run_cmd_1 = require("~/lib/run-cmd");
/**
 * Set up ESLint with antfu's configuration
 */
async function setupEslint(projectPath) {
    // Remove default ESLint config files created by Next.js
    const eslintrcPath = path.join(projectPath, 'eslint.config.mjs');
    if (await fs.pathExists(eslintrcPath)) {
        await fs.remove(eslintrcPath);
    }
    // Copy eslint.config.js from template
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const eslintTemplate = path.join(templatesPath, 'eslint.config.mjs');
    const eslintContent = await fs.readFile(eslintTemplate, 'utf8');
    await fs.writeFile(path.join(projectPath, 'eslint.config.mjs'), eslintContent);
    // Install antfu's ESLint config
    await (0, run_cmd_1.runCmd)('pnpm', ['add', '-D', '@antfu/eslint-config'], { stdio: 'pipe', cwd: projectPath });
}
/**
 * Add lint scripts to package.json
 */
async function addLintScripts(projectPath) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        // Add lint scripts
        packageJson.scripts = {
            ...packageJson.scripts,
            "lint": "eslint .",
            "lint:fix": "eslint . --fix"
        };
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
}
/**
 * Run lint:fix on the project
 */
async function runLintFix(projectPath) {
    try {
        await (0, run_cmd_1.runCmd)('pnpm', ['run', 'lint:fix'], { stdio: 'pipe', cwd: projectPath });
    }
    catch (error) {
        // ESLint returns non-zero exit codes when it finds/fixes issues, but that's okay
        // We only ignore exit code errors, but still throw on actual command execution errors
        if (error && typeof error === 'object' && 'exitCode' in error) {
            // Ignore ESLint exit codes, it's normal for it to return non-zero when fixing issues
            return;
        }
        throw error;
    }
}
//# sourceMappingURL=index.js.map
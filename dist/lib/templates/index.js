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
exports.removeFavicon = removeFavicon;
exports.createBasicReadme = createBasicReadme;
exports.createNixFlake = createNixFlake;
exports.createEnvFiles = createEnvFiles;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const utils_1 = require("~/lib/utils");
/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content) {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
}
/**
 * Process and copy a template file to the destination
 */
async function processTemplateFile(templatePath, outputPath) {
    const content = await fs.readFile(templatePath, 'utf8');
    const processedContent = processTemplateContent(content);
    await fs.writeFile(outputPath, processedContent);
}
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
 * Replace default Next.js app files with custom templates
 */
async function replaceAppFiles(projectPath) {
    const appPath = path.join(projectPath, 'src', 'app');
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'nextjs');
    // Process and copy template files
    await processTemplateFile(path.join(templatesPath, 'layout.tsx'), path.join(appPath, 'layout.tsx'));
    await processTemplateFile(path.join(templatesPath, 'page.tsx'), path.join(appPath, 'page.tsx'));
}
/**
 * Remove default favicon from the app directory
 */
async function removeFavicon(projectPath) {
    const faviconPath = path.join(projectPath, 'src', 'app', 'favicon.ico');
    if (await fs.pathExists(faviconPath)) {
        await fs.remove(faviconPath);
    }
}
/**
 * Create basic README from template
 */
async function createBasicReadme(projectPath, options) {
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const readmeTemplate = path.join(templatesPath, 'README.md');
    const outputPath = path.join(projectPath, 'README.md');
    // Generate database-specific instructions
    let databaseInstructions = '';
    if (options.database === 'turso') {
        databaseInstructions = `
   > **Note:** This project uses Turso (SQLite) as the database. The \`pnpm dev\` command will automatically start both the database server and Next.js development server using concurrently.

`;
    }
    (0, utils_1.createFileFromTemplate)(readmeTemplate, outputPath, {
        PROJECT_NAME: options.name,
        DIRECTORY: options.directory,
        NIX_DEVELOP_COMMAND: options.nixFlake ? 'nix develop\n   ' : '',
        DATABASE_INSTRUCTIONS: databaseInstructions
    });
}
/**
 * Create nix flake files from templates
 */
async function createNixFlake(projectPath, options) {
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'nix');
    // Create nix directory
    const nixDir = path.join(projectPath, 'nix');
    await fs.ensureDir(nixDir);
    // Create flake.nix in project root
    const flakeTemplate = path.join(templatesPath, 'flake.nix');
    const flakeOutput = path.join(projectPath, 'flake.nix');
    (0, utils_1.createFileFromTemplate)(flakeTemplate, flakeOutput, {
        PROJECT_NAME: options.name
    });
    // Determine additional nix packages and parameters based on options
    const nixPackages = [];
    const nixParams = [];
    if (options.database === 'turso') {
        nixPackages.push('turso-cli', 'sqld');
        nixParams.push('turso-cli', 'sqld');
    }
    // Create devShell.nix with conditional packages
    const devShellTemplate = path.join(templatesPath, 'devShell.nix');
    const devShellOutput = path.join(nixDir, 'devShell.nix');
    (0, utils_1.createFileFromTemplate)(devShellTemplate, devShellOutput, {
        PROJECT_NAME: options.name,
        ADDITIONAL_PARAMS: nixParams.length > 0 ? `\n  ${nixParams.join(',\n  ')},` : '',
        ADDITIONAL_PACKAGES: nixPackages.length > 0 ? `\n    ${nixPackages.join('\n    ')}` : ''
    });
}
/**
 * Create typesafe env files from templates
 */
async function createEnvFiles(projectPath, options) {
    const templatesPath = path.join(__dirname, '..', '..', 'templates', 'env');
    const envDir = path.join(projectPath, 'src', 'lib');
    await fs.ensureDir(envDir);
    // Generate Turso-specific env schema if Turso is selected
    let tursoEnvSchema = '';
    if (options.database === 'turso') {
        tursoEnvSchema = '\n  TURSO_DATABASE_URL: z.string(),\n  TURSO_AUTH_TOKEN: z.string(),';
    }
    // Copy env.ts with conditional schema
    const envTemplate = path.join(templatesPath, 'env.ts');
    const envOutput = path.join(envDir, 'env.ts');
    (0, utils_1.createFileFromTemplate)(envTemplate, envOutput, {
        TURSO_ENV_SCHEMA: tursoEnvSchema
    });
    // Copy try-parse-env.ts
    const tryParseEnvTemplate = path.join(templatesPath, 'try-parse-env.ts');
    const tryParseEnvOutput = path.join(envDir, 'try-parse-env.ts');
    await fs.copy(tryParseEnvTemplate, tryParseEnvOutput);
}
//# sourceMappingURL=index.js.map
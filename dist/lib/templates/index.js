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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Process template file content by removing development-only comments
 */
function processTemplateContent(content) {
    // Remove @ts-nocheck comments that are only needed in the templates folder
    return content.replace(/^\/\/ @ts-nocheck\s*\n?/gm, '');
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
    // Read the README template
    const templatesPath = path.join(__dirname, '..', '..', 'templates');
    const readmeTemplate = path.join(templatesPath, 'README.md');
    let readmeContent = await fs.readFile(readmeTemplate, 'utf8');
    // Replace placeholders with actual values
    readmeContent = readmeContent
        .replace(/{{PROJECT_NAME}}/g, options.name)
        .replace(/{{DIRECTORY}}/g, options.directory);
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}
//# sourceMappingURL=index.js.map
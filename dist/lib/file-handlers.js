"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customizeNextJsProject = customizeNextJsProject;
const templates_1 = require("~/lib/templates");
const format_1 = require("~/lib/format");
/**
 * Apply all customizations to a newly created Next.js project
 */
async function customizeNextJsProject(projectPath, options) {
    await (0, templates_1.emptyPublicDirectory)(projectPath);
    await (0, templates_1.replaceAppFiles)(projectPath);
    await (0, templates_1.removeFavicon)(projectPath);
    await (0, format_1.setupEslint)(projectPath);
    await (0, format_1.addLintScripts)(projectPath);
}
//# sourceMappingURL=file-handlers.js.map
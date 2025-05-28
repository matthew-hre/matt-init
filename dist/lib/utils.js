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
exports.validateProjectName = validateProjectName;
exports.isValidDirectory = isValidDirectory;
exports.createFileFromTemplate = createFileFromTemplate;
exports.logStep = logStep;
exports.logSuccess = logSuccess;
exports.logError = logError;
const fs = __importStar(require("fs-extra"));
function validateProjectName(name) {
    return /^[a-z0-9-_]+$/.test(name);
}
function isValidDirectory(dirPath) {
    try {
        return fs.pathExistsSync(dirPath);
    }
    catch {
        return false;
    }
}
function createFileFromTemplate(templatePath, outputPath, replacements = {}) {
    let content = fs.readFileSync(templatePath, 'utf-8');
    Object.entries(replacements).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    fs.writeFileSync(outputPath, content);
}
function logStep(message) {
    console.log(`📝 ${message}`);
}
function logSuccess(message) {
    console.log(`✅ ${message}`);
}
function logError(message) {
    console.error(`❌ ${message}`);
}
//# sourceMappingURL=utils.js.map
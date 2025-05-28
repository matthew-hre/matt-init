import * as fs from 'fs-extra';
import * as path from 'path';

export function validateProjectName(name: string): boolean {
    return /^[a-z0-9-_]+$/.test(name);
}

export function isValidDirectory(dirPath: string): boolean {
    try {
        return fs.pathExistsSync(dirPath);
    } catch {
        return false;
    }
}

export function createFileFromTemplate(templatePath: string, outputPath: string, replacements: Record<string, string> = {}): void {
    let content = fs.readFileSync(templatePath, 'utf-8');

    Object.entries(replacements).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    fs.writeFileSync(outputPath, content);
}

export function logStep(message: string): void {
    console.log(`📝 ${message}`);
}

export function logSuccess(message: string): void {
    console.log(`✅ ${message}`);
}

export function logError(message: string): void {
    console.error(`❌ ${message}`);
}
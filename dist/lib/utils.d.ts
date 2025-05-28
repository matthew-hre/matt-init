export declare function validateProjectName(name: string): boolean;
export declare function isValidDirectory(dirPath: string): boolean;
export declare function runCommand(command: string, cwd: string, silent?: boolean): void;
export declare function createFileFromTemplate(templatePath: string, outputPath: string, replacements?: Record<string, string>): void;
export declare function logStep(message: string): void;
export declare function logSuccess(message: string): void;
export declare function logError(message: string): void;
//# sourceMappingURL=utils.d.ts.map
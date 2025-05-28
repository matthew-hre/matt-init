/**
 * Empty the public directory of a Next.js project
 */
export declare function emptyPublicDirectory(projectPath: string): Promise<void>;
/**
 * Replace default Next.js app files with custom templates
 */
export declare function replaceAppFiles(projectPath: string): Promise<void>;
/**
 * Create a .gitignore file for a Next.js project
 */
export declare function createGitignore(projectPath: string): Promise<void>;
/**
 * Initialize a git repository in the project directory
 */
export declare function initializeGitRepository(projectPath: string): Promise<void>;
/**
 * Apply all customizations to a newly created Next.js project
 */
export declare function customizeNextJsProject(projectPath: string, options: {
    initGit: boolean;
}): Promise<void>;
//# sourceMappingURL=file-handlers.d.ts.map
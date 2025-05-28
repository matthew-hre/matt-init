/**
 * Empty the public directory of a Next.js project
 */
export declare function emptyPublicDirectory(projectPath: string): Promise<void>;
/**
 * Replace default Next.js app files with custom templates
 */
export declare function replaceAppFiles(projectPath: string): Promise<void>;
/**
 * Remove default favicon from the app directory
 */
export declare function removeFavicon(projectPath: string): Promise<void>;
/**
 * Create basic README from template
 */
export declare function createBasicReadme(projectPath: string, options: {
    name: string;
    directory: string;
    nixFlake?: boolean;
}): Promise<void>;
/**
 * Create nix flake files from templates
 */
export declare function createNixFlake(projectPath: string, options: {
    name: string;
}): Promise<void>;
//# sourceMappingURL=index.d.ts.map
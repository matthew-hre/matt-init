export interface ProjectInfoAnswers {
    directory: string;
    name: string;
}
export interface GitInitAnswers {
    initGit: boolean;
}
export interface NixFlakeAnswers {
    nixFlake: boolean;
}
export interface ConfirmationAnswers {
    confirm: boolean;
}
export interface FeaturesAnswers {
    features: string[];
}
/**
 * Ask for project directory and name
 */
export declare function askProjectInfo(directory?: string): Promise<ProjectInfoAnswers>;
/**
 * Ask if user wants to add a nix flake
 */
export declare function askNixFlake(): Promise<NixFlakeAnswers>;
/**
 * Ask if user wants to initialize git repository
 */
export declare function askGitInit(): Promise<GitInitAnswers>;
/**
 * Show project summary and ask for confirmation
 */
export declare function askConfirmation(): Promise<ConfirmationAnswers>;
/**
 * Ask user to select optional features
 */
export declare function askFeatures(): Promise<FeaturesAnswers>;
//# sourceMappingURL=prompts.d.ts.map
export interface ProjectInfoAnswers {
    directory: string;
    name: string;
}
export interface GitInitAnswers {
    initGit: boolean;
}
export interface ConfirmationAnswers {
    confirm: boolean;
}
/**
 * Ask for project directory and name
 */
export declare function askProjectInfo(directory?: string): Promise<ProjectInfoAnswers>;
/**
 * Ask if user wants to initialize git repository
 */
export declare function askGitInit(): Promise<GitInitAnswers>;
/**
 * Show project summary and ask for confirmation
 */
export declare function askConfirmation(projectName: string, projectDirectory: string, initGit: boolean): Promise<ConfirmationAnswers>;
//# sourceMappingURL=prompts.d.ts.map
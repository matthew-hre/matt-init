export interface ProjectOptions {
    name: string;
    directory: string;
    initGit: boolean;
    nixFlake: boolean;
    database: string;
    preCommitHooks: boolean;
}
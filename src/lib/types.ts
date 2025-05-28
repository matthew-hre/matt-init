export interface ProjectOptions {
    name: string;
    directory: string;
    initGit: boolean;
    nixFlake: boolean;
    features: string[];
}
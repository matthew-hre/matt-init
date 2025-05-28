export interface ProjectOptions {
    name: string;
    directory: string;
    database: 'turso' | 'postgres' | 'none';
    auth: boolean;
    ci: boolean;
    editor: boolean;
    hooks: boolean;
    ui: 'shadcn' | 'daisyui' | 'none';
}
export declare function createProject(options: ProjectOptions): Promise<void>;
//# sourceMappingURL=create-project.d.ts.map
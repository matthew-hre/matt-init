export interface TemplateContext {
    projectName: string;
    database: 'turso' | 'postgres' | 'none';
    auth: boolean;
    ci: boolean;
    editor: boolean;
    hooks: boolean;
    ui: 'shadcn' | 'daisyui' | 'none';
}
export declare class TemplateManager {
    private templatesDir;
    constructor();
    renderTemplate(templatePath: string, context: TemplateContext): Promise<string>;
    copyTemplate(templatePath: string, targetPath: string, context: TemplateContext): Promise<void>;
    createEnvExample(context: TemplateContext): Promise<string>;
    createNextConfig(): Promise<string>;
    createTailwindConfig(context: TemplateContext): Promise<string>;
    createVSCodeSettings(): Promise<string>;
    createEditorConfig(): Promise<string>;
    createLintStagedConfig(): Promise<string>;
    createComponentsJson(): Promise<string>;
    createDrizzleConfig(context: TemplateContext): Promise<string>;
}
//# sourceMappingURL=template-manager.d.ts.map
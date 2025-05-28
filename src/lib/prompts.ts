import inquirer from 'inquirer';
import { validateProjectName } from '~/lib/utils';

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

export interface DatabaseAnswers {
    database: string;
}

export interface PreCommitHooksAnswers {
    preCommitHooks: boolean;
}

/**
 * Ask for project directory and name
 */
export async function askProjectInfo(directory?: string): Promise<ProjectInfoAnswers> {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'directory',
            message: 'What should we call your project directory?',
            default: directory || 'my-nextjs-app',
            when: !directory,
            validate: (input: string) => {
                if (!input.trim()) {
                    return 'Project directory is required';
                }
                if (!validateProjectName(input)) {
                    return 'Directory name must contain only lowercase letters, numbers, hyphens, and underscores';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'name',
            message: 'What\'s the display name for your project?',
            default: (answers: any) => (directory || answers.directory),
            validate: (input: string) => {
                if (!input.trim()) {
                    return 'Project name is required';
                }
                return true;
            }
        }
    ]);
}

/**
 * Ask if user wants to add a nix flake
 */
export async function askNixFlake(): Promise<NixFlakeAnswers> {
    return await inquirer.prompt([
        {
            type: 'confirm',
            name: 'nixFlake',
            message: 'Would you like to add a nix flake for development environment?',
            default: true
        }
    ]);
}

/**
 * Ask if user wants to initialize git repository
 */
export async function askGitInit(): Promise<GitInitAnswers> {
    return await inquirer.prompt([
        {
            type: 'confirm',
            name: 'initGit',
            message: 'Would you like to initialize a git repository?',
            default: true
        }
    ]);
}

/**
 * Show project summary and ask for confirmation
 */
export async function askConfirmation(): Promise<ConfirmationAnswers> {
    return await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '\nDoes this look good? Ready to create your project?',
            default: true
        }
    ]);
}

/**
 * Ask user to select database type
 */
export async function askDatabase(): Promise<DatabaseAnswers> {
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'database',
            message: 'Which database would you like to use?',
            choices: [
                {
                    name: 'Turso (SQLite)',
                    value: 'turso'
                },
                {
                    name: 'None',
                    value: 'none'
                }
            ],
            default: 'none'
        }
    ]);
}

/**
 * Ask if user wants to enable pre-commit hooks
 */
export async function askPreCommitHooks(): Promise<PreCommitHooksAnswers> {
    return await inquirer.prompt([
        {
            type: 'confirm',
            name: 'preCommitHooks',
            message: 'Would you like to enable pre-commit hooks (Husky + lint-staged)?',
            default: false
        }
    ]);
}
import inquirer from 'inquirer';
import { validateProjectName } from '~/lib/utils';

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
export async function askConfirmation(projectName: string, projectDirectory: string, initGit: boolean): Promise<ConfirmationAnswers> {
    console.log('\n📋 Project Summary:');
    console.log(`  Name: ${projectName}`);
    console.log(`  Directory: ${projectDirectory}`);
    console.log(`  Initialize Git: ${initGit ? 'Yes' : 'No'}`);

    return await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '\nDoes this look good? Ready to create your project?',
            default: true
        }
    ]);
}
import { execa } from "execa";
import ora from "ora";


export async function setupGit(
    projectDir: string,
) {
    const gitSpinner = ora('Initializing git repository...').start();
    try {
        await execa("git", ["init"], { cwd: projectDir });
        await execa("git", ["branch", "-m", "main"], { cwd: projectDir });
        await execa("git", ["add", "."], { cwd: projectDir });
        await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectDir });
        gitSpinner.succeed('Git repository initialized with initial commit!');
    } catch (error) {
        gitSpinner.fail('Failed to initialize git repository');
    }
}
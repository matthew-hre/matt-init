import { execa } from "execa";


export async function setupGit(
    projectDir: string,
) {
    await execa("git", ["init"], { cwd: projectDir });
    await execa("git", ["branch", "-m", "main"], { cwd: projectDir });
    await execa("git", ["add", "."], { cwd: projectDir });
    await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectDir });
}
import { execa } from "execa";


export async function installDependencies(
    projectDir: string,
) {
    try {
        await execa("pnpm", ["install"], { cwd: projectDir });
    } catch (error) {
        // not doing any other package manager support for now
        return error;
    }
}
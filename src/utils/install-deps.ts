import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";


export async function installDependencies(
    projectDir: string,
) {
    const installSpinner = ora('Installing dependencies with pnpm...').start();
    try {
        await execa("pnpm", ["install"], { cwd: projectDir });
        installSpinner.succeed('Dependencies installed successfully!');
    } catch (error) {
        installSpinner.text = 'pnpm failed, trying npm...';
        try {
            await execa("npm", ["install"], { cwd: projectDir });
            installSpinner.succeed('Dependencies installed successfully with npm!');
        } catch (npmError) {
            installSpinner.fail('Failed to install dependencies');
            console.log(chalk.yellow("You can install dependencies manually later with: pnpm install"));
        }
    }
}
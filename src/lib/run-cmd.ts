import { execa } from 'execa';

export async function runCmd(cmd: string, args: string[], opts = {}) {
    const result = await execa(cmd, args, { stdio: 'inherit', ...opts });
    return result;
}
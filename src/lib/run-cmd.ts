import { execa, type Options } from 'execa';

export async function runCmd(cmd: string, args: string[], opts: Options = {}) {
    const result = await execa(cmd, args, { stdio: 'inherit', ...opts });
    return result;
}
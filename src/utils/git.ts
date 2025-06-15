export async function findGitExecutable(): Promise<string | Error> {
  const { execa } = await import("execa");

  try {
    const { stdout } = await execa("which", ["git"]);
    return stdout.trim();
  }
  catch (error) {
    return error as Error;
  }
}

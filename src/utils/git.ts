/**
 * Utility function to find the path to the git executable.
 *
 * @returns {Promise<string | Error>} Resolves with the path to the git executable or an error if not found.
 */
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

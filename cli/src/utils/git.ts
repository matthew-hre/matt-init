/**
 * Utility function to find the path to the git executable.
 *
 * @returns {Promise<string>} Resolves with the path to the git executable or throws an error if not found.
 */
export async function findGitExecutable(): Promise<string> {
  const { execa } = await import("execa");

  try {
    const { stdout } = await execa("which", ["git"]);
    return stdout.trim();
  }
  catch {
    throw new Error("Git executable not found in PATH");
  }
}

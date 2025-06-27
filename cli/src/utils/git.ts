/**
 * Utility function to find the path to the git executable.
 *
 * @returns {Promise<string>} Resolves with the path to the git executable or throws an error if not found.
 */
export async function findGitExecutable(): Promise<string> {
  const { execa } = await import("execa");

  try {
    // windows uses 'where', others use 'which'
    const cmd = process.platform === "win32" ? "where" : "which";
    const { stdout } = await execa(cmd, ["git"]);
    return stdout.trim();
  }
  catch {
    throw new Error("Git executable not found in PATH");
  }
}

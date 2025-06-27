/* eslint-disable node/no-process-env */

/**
 * Detects if the current process is running in Git Bash (MINGW/MSYS).
 * Git Bash has known issues with interactive prompts in Node.js applications.
 *
 * @returns {boolean} True if running in Git Bash, false otherwise
 */
export function isGitBash(): boolean {
  // Check various environment indicators of Git Bash
  const term = process.env.TERM;
  const msystem = process.env.MSYSTEM;
  const shell = process.env.SHELL;
  const exePath = process.env.EXEPATH;

  // Git Bash typically sets MSYSTEM to MINGW32 or MINGW64
  if (msystem && (msystem.includes("MINGW") || msystem.includes("MSYS"))) {
    return true;
  }

  // Check if TERM contains 'cygwin' or 'xterm' with MINGW/Git paths
  if (term && term.includes("cygwin")) {
    return true;
  }

  // Check if running from Git Bash's typical shell path
  if (shell && shell.includes("/usr/bin/bash") && process.platform === "win32") {
    return true;
  }

  // Check EXEPATH for Git installation
  if (exePath && exePath.toLowerCase().includes("git")) {
    return true;
  }

  // Additional check: Git Bash usually has MINGW in various paths
  const pathEnv = process.env.PATH || "";
  if (process.platform === "win32" && pathEnv.toLowerCase().includes("mingw")) {
    return true;
  }

  return false;
}

/**
 * Returns an error message for Git Bash users with alternative terminal suggestions.
 *
 * @returns {string} The error message to display
 */
export function getGitBashErrorMessage(): string {
  return `
Git Bash is not supported for interactive prompts.

Please use one of the following alternative terminals:
  • Windows Terminal
  • PowerShell
  • Command Prompt (cmd.exe)
  • WSL (Windows Subsystem for Linux)
  • VS Code integrated terminal

Alternatively, you can run the CLI in non-interactive mode using the --ci flag.
`;
}

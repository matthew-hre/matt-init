import { confirm } from "@clack/prompts";

/**
 * Prompts the user with a yes/no question and returns the answer.
 * If the user cancels, the process exits gracefully.
 *
 * @returns {Promise<boolean>} The user's response (true for yes, false for no).
 */
export async function promptUseNix(): Promise<boolean> {
  const useNix = await confirm({
    message: "Initialize with Nix flake?",
    initialValue: true,
  });

  if (typeof useNix === "symbol") {
    process.exit(0);
  }

  return useNix;
}

/**
 * Prompts the user to install dependencies and returns the answer.
 * If the user cancels, the process exits gracefully.
 *
 * @returns {Promise<boolean>} The user's response (true for yes, false for no).
 */
export async function promptInstallDependencies(): Promise<boolean> {
  const installDeps = await confirm({
    message: "Install dependencies?",
    initialValue: true,
  });

  if (typeof installDeps === "symbol") {
    process.exit(0);
  }

  return installDeps;
}

/**
 * Prompts the user to initialize a git repository and returns the answer.
 * If the user cancels, the process exits gracefully.
 *
 * @returns {Promise<boolean>} The user's response (true for yes, false for no).
 */
export async function promptInitGit(): Promise<boolean> {
  const initGit = await confirm({
    message: "Initialize git repository?",
    initialValue: true,
  });

  if (typeof initGit === "symbol") {
    process.exit(0);
  }

  return initGit;
}

/**
 * Prompts the user to set up VS Code settings and returns the answer.
 * If the user cancels, the process exits gracefully.
 *
 * @returns {Promise<boolean>} The user's response (true for yes, false for no).
 */
export async function promptSetupVsCodeSettings(): Promise<boolean> {
  const setupVsCode = await confirm({
    message: "Setup VS Code settings?",
    initialValue: true,
  });

  if (typeof setupVsCode === "symbol") {
    process.exit(0);
  }

  return setupVsCode;
}

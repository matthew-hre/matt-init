import { confirm } from "@clack/prompts";

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

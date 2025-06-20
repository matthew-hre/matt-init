export type BackendSetup = "none" | "drizzle" | "supabase";
export type DatabaseProvider = "none" | "turso" | "neon" | "postgres";

export type ProjectOptions = {
  projectName: string;
  projectDir: string;
  templateDir: string;
  shouldUseNix: boolean;
  shouldSetupVsCode?: boolean;
  shouldInitGit: boolean;
  shouldInstall: boolean;
  backendSetup: BackendSetup;
  databaseProvider: DatabaseProvider;
};

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

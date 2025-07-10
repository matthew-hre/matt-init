export type BackendSetup = "none" | "drizzle" | "supabase";
export type DatabaseProvider = "none" | "turso" | "neon" | "docker-postgres";

export type ProjectOptions = {
  projectName: string;
  projectDir: string;
  templateDir: string;
  shouldUseNix: boolean;
  shouldIncludeCI: boolean;
  shouldSetupVsCode?: boolean;
  shouldInitGit: boolean;
  shouldInstall: boolean;
  backendSetup: BackendSetup;
  databaseProvider: DatabaseProvider;
};

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

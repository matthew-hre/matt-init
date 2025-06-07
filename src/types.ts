export type DatabaseProvider = "turso" | "none";
export type OrmProvider = "drizzle" | "none";
export type AuthProvider = "betterauth" | "none";

export type ProjectOptions = {
  projectName: string;
  projectDir: string;
  templateDir: string;
  shouldUseNix: boolean;
  shouldInitGit: boolean;
  shouldInstall: boolean;
  databaseProvider: DatabaseProvider;
  ormProvider: OrmProvider;
  authProvider: AuthProvider;
};

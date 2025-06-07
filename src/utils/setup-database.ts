import type { AuthProvider, DatabaseProvider, OrmProvider } from "../types";

import { addBetterAuthDependencies, createBetterAuthEnvFile, createBetterAuthEnvValidator, setupBetterAuthDrizzleTurso } from "../builders/auth/betterauth-drizzle-turso";
import { addDrizzleDependencies, setupDrizzleTurso, updateDrizzleScripts } from "../builders/db/drizzle-turso";
import { addTursoDependency, createTursoEnvFile, setupTursoClient, updateGitignoreForTurso, updateTursoScripts } from "../builders/db/turso";
import { createBaseEnvFile, setupEnvValidator } from "./setup-env";

export async function setupDatabase(
  projectDir: string,
  templateDir: string,
  databaseProvider: DatabaseProvider,
  ormProvider: OrmProvider = "none",
  authProvider: AuthProvider = "none",
) {
  if (databaseProvider === "turso") {
    // Always add Turso base dependencies and configuration
    await addTursoDependency(projectDir);
    updateGitignoreForTurso(projectDir);
    updateTursoScripts(projectDir);

    if (ormProvider === "drizzle") {
      if (authProvider === "betterauth") {
        // Set up BetterAuth with Drizzle and Turso
        await setupBetterAuthDrizzleTurso(projectDir, templateDir);
        await addDrizzleDependencies(projectDir);
        await addBetterAuthDependencies(projectDir);
        await updateDrizzleScripts(projectDir);
        await createBetterAuthEnvFile(projectDir);
        await createBetterAuthEnvValidator(projectDir);
      }
      else {
        // Set up Drizzle ORM with Turso (no auth)
        await setupDrizzleTurso(projectDir, templateDir);
        await addDrizzleDependencies(projectDir);
        await updateDrizzleScripts(projectDir);
        await createTursoEnvFile(projectDir);
      }
    }
    else {
      // Set up basic Turso client (no ORM)
      await setupTursoClient(projectDir, templateDir);
      await createTursoEnvFile(projectDir);
    }
  }
  else {
    // No database provider - create basic .env file
    await createBaseEnvFile(projectDir);
  }

  // Set up env files based on database provider
  if (databaseProvider !== "none" && authProvider !== "betterauth") {
    await setupEnvValidator(projectDir, templateDir, databaseProvider);
  }
}

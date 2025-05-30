import type { DatabaseProvider, OrmProvider } from "../types";

import { addDrizzleDependencies, setupDrizzleTurso, updateDrizzleScripts } from "../builders/db/drizzle-turso";
import { addTursoDependency, createTursoEnvFile, setupTursoClient, updateGitignoreForTurso, updateTursoScripts } from "../builders/db/turso";
import { createBaseEnvFile, setupEnvValidator } from "./setup-env";

export async function setupDatabase(
  projectDir: string,
  templateDir: string,
  databaseProvider: DatabaseProvider,
  ormProvider: OrmProvider = "none",
) {
  if (databaseProvider === "turso") {
    // Always add Turso base dependencies and configuration
    await addTursoDependency(projectDir);
    await createTursoEnvFile(projectDir);
    updateGitignoreForTurso(projectDir);
    updateTursoScripts(projectDir);

    if (ormProvider === "drizzle") {
      // Set up Drizzle ORM with Turso
      await setupDrizzleTurso(projectDir, templateDir);
      await addDrizzleDependencies(projectDir);
      await updateDrizzleScripts(projectDir);
    }
    else {
      // Set up basic Turso client (no ORM)
      await setupTursoClient(projectDir, templateDir);
    }
  }
  else {
    // No database provider - create basic .env file
    await createBaseEnvFile(projectDir);
  }

  // Set up env files based on database provider
  setupEnvValidator(projectDir, templateDir, databaseProvider);
}

import { select } from "@clack/prompts";

import type { DatabaseProvider } from "../types";

export async function promptDatabaseProvider(): Promise<DatabaseProvider> {
  const databaseProvider = await select({
    message: "Choose your database provider:",
    options: [
      {
        value: "neon" as const,
        label: "Neon",
        hint: "Serverless Postgres with generous free tier",
      },
      {
        value: "turso" as const,
        label: "Turso",
        hint: "Edge SQLite database",
      },
      {
        value: "postgres" as const,
        label: "Docker Postgres",
        hint: "Local development with Docker",
      },
    ],
  });

  if (typeof databaseProvider === "symbol") {
    process.exit(0);
  }

  return databaseProvider;
}

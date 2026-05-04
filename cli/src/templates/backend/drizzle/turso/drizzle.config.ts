import { defineConfig } from "drizzle-kit";

import { serverEnv } from "~/lib/env";

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema/index.ts",
  dialect: "turso",
  casing: "snake_case",
  dbCredentials: {
    url: serverEnv.TURSO_DATABASE_URL!,
    authToken: serverEnv.NODE_ENV === "development" ? undefined : serverEnv.TURSO_AUTH_TOKEN!,
  },
});

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { serverEnv } from "~/lib/env";

import * as schema from "./schema";

const client = createClient({
  url: serverEnv.TURSO_DATABASE_URL,
  authToken: serverEnv.NODE_ENV === "development" ? undefined : serverEnv.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { casing: "snake_case", schema });

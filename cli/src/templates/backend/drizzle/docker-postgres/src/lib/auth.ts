import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { v4 as uuidv4 } from "uuid";

import { db } from "./db";
import * as schema from "./db/schema";
import { serverEnv } from "~/lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  plugins: [nextCookies()],
});

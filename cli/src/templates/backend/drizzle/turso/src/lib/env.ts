import { loadEnv } from "@matthew-hre/env";
import { z } from "zod";

const schema = {
  server: z.object({
    NODE_ENV: z.string().nonempty(),
    TURSO_DATABASE_URL: z.string().nonempty(),
    TURSO_AUTH_TOKEN: z.string(), // not required for local dev
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.string().nonempty(),
  }),
  client: z.object({}),
};

export type ServerEnvSchema = z.infer<typeof schema.server>;
export type ClientEnvSchema = z.infer<typeof schema.client>;

export const { serverEnv, clientEnv } = loadEnv(schema);

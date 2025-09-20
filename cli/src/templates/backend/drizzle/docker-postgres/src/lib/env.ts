import { loadEnv } from "@matthew-hre/env";
import { z } from "zod";

const schema = {
  server: z.object({
    NODE_ENV: z.string().nonempty(),
    DATABASE_URL: z.string().nonempty(),
    POSTGRES_DB: z.string().nonempty(),
    POSTGRES_USER: z.string().nonempty(),
    POSTGRES_PASSWORD: z.string().nonempty(),
    POSTGRES_PORT: z.string().nonempty(),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.string().nonempty(),
  }),
  client: z.object({}),
};

export type ServerEnvSchema = z.infer<typeof schema.server>;
export type ClientEnvSchema = z.infer<typeof schema.client>;

export const { serverEnv, clientEnv } = loadEnv(schema);

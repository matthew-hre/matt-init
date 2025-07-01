import { z } from "zod";

import { tryParseEnv } from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);

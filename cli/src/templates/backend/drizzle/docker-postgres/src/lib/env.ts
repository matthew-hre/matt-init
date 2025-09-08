import { z } from "zod";

import { tryParseEnv } from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  POSTGRES_DB: z.string().nonempty(),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_PORT: z.string().nonempty(),
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BETTER_AUTH_URL: z.string().nonempty(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);

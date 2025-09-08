import { z } from "zod";

import { tryParseEnv } from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string().nonempty(),
  TURSO_DATABASE_URL: z.string().nonempty(),
  TURSO_AUTH_TOKEN: z.string(), // not required for local dev
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BETTER_AUTH_URL: z.string().nonempty(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);

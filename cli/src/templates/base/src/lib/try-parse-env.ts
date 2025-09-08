/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from "zod";

import { ZodError } from "zod";

export function tryParseEnv<T extends ZodRawShape>(
  EnvSchema: ZodObject<T>,
  buildEnv: Record<string, string | undefined> = process.env,
) {
  try {
    EnvSchema.parse(buildEnv);
  }
  catch (error) {
    if (error instanceof ZodError) {
      let message = "Missing required values in .env:\n";
      error.issues.forEach((err) => {
        message += `${String(err.path[0])}\n`;
      });

      console.error(message);
    }
    else {
      console.error("An unexpected error occurred while parsing environment variables:", error);
    }
    process.exit(1);
  }
}

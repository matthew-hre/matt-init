import { select } from "@clack/prompts";

import type { BackendSetup } from "../types";

export async function promptBackendSetup(): Promise<BackendSetup> {
  const backendSetup = await select({
    message: "Choose your backend setup:",
    options: [
      {
        value: "drizzle" as const,
        label: "Database + Drizzle + BetterAuth",
        hint: "Full-stack setup with type-safe DB and auth",
      },
      {
        value: "supabase" as const,
        label: "Supabase",
        hint: "Hosted database with built-in auth",
      },
      {
        value: "none" as const,
        label: "None",
        hint: "Just a clean Next.js frontend",
      },
    ],
  });

  if (typeof backendSetup === "symbol") {
    process.exit(0);
  }

  return backendSetup;
}

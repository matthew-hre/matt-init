// @ts-nocheck
import { createClient } from "@libsql/client";
import env from "~/lib/env";

const client = createClient({
    url: env.TURSO_DATABASE_URL,
});

export default client;
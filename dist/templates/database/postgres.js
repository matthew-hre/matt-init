"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const env_1 = require("~/config/env");
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
});
exports.db = (0, node_postgres_1.drizzle)(pool);
//# sourceMappingURL=postgres.js.map
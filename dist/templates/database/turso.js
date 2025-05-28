"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.client = void 0;
const client_1 = require("@libsql/client");
const libsql_1 = require("drizzle-orm/libsql");
const env_1 = require("~/config/env");
exports.client = (0, client_1.createClient)({
    url: env_1.env.DATABASE_URL,
    authToken: env_1.env.DATABASE_AUTH_TOKEN,
});
exports.db = (0, libsql_1.drizzle)(exports.client);
//# sourceMappingURL=turso.js.map
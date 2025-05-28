"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const env_1 = require("~/config/env");
exports.auth = (0, better_auth_1.betterAuth)({
    secret: env_1.env.AUTH_SECRET,
    baseURL: env_1.env.NEXT_PUBLIC_APP_URL,
    database: {
    // Configure based on your database choice
    },
});
//# sourceMappingURL=config.js.map
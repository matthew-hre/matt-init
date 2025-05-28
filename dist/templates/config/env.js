"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_APP_URL: zod_1.z.string().url().default('http://localhost:3000'),
}, {}, { databaseEnv });
{
    {
        authEnv;
    }
}
;
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map
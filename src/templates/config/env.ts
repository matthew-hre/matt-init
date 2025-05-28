import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),{{ databaseEnv }}{ { authEnv } }
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
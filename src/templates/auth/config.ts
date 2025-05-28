import { betterAuth } from 'better-auth';
import { env } from '~/config/env';

export const auth = betterAuth({
    secret: env.AUTH_SECRET,
    baseURL: env.NEXT_PUBLIC_APP_URL,
    database: {
        // Configure based on your database choice
    },
});
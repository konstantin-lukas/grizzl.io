import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
});

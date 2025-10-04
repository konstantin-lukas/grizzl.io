import { db } from "./db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "keycloak",
                    clientId: "test-client",
                    clientSecret: "test-client-secret",
                    authorizationUrl: "http://keycloak.grizzl.localhost/realms/dev-test/protocol/openid-connect/auth",
                    tokenUrl: "http://keycloak:8080/realms/dev-test/protocol/openid-connect/token",
                    userInfoUrl: "http://keycloak:8080/realms/dev-test/protocol/openid-connect/userinfo",
                    scopes: ["openid", "email", "profile"],
                },
            ],
        }),
    ],
});

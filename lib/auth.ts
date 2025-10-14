import { db } from "@@/lib/db";
import { generateId } from "@@/server/utils/id";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

const plugins =
    process.env.NUXT_PUBLIC_APP_ENV !== "production"
        ? [
              genericOAuth({
                  config: [
                      {
                          providerId: "keycloak",
                          clientId: "test-client",
                          clientSecret: "test-client-secret",
                          authorizationUrl:
                              "http://keycloak.grizzl.localhost/realms/dev-test/protocol/openid-connect/auth",
                          tokenUrl: "http://keycloak:8080/realms/dev-test/protocol/openid-connect/token",
                          userInfoUrl: "http://keycloak:8080/realms/dev-test/protocol/openid-connect/userinfo",
                          scopes: ["openid", "email", "profile"],
                      },
                  ],
              }),
          ]
        : undefined;

const socialProviders =
    process.env.NUXT_PUBLIC_APP_ENV === "production"
        ? {
              github: {
                  clientId: process.env.GITHUB_ID!,
                  clientSecret: process.env.GITHUB_SECRET!,
              },
              twitch: {
                  clientId: process.env.TWITCH_ID!,
                  clientSecret: process.env.TWITCH_SECRET!,
              },
              reddit: {
                  clientId: process.env.REDDIT_ID!,
                  clientSecret: process.env.REDDIT_SECRET!,
              },
              discord: {
                  clientId: process.env.DISCORD_ID!,
                  clientSecret: process.env.DISCORD_SECRET!,
              },
          }
        : undefined;

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    advanced: {
        database: {
            generateId,
        },
    },
    plugins,
    socialProviders,
});

import type { AuthOptions, Session } from "next-auth";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import KeycloakProvider from "next-auth/providers/keycloak";
import RedditProvider from "next-auth/providers/reddit";
import SpotifyProvider from "next-auth/providers/spotify";
import TwitchProvider from "next-auth/providers/twitch";

const authOptions: AuthOptions = {
    providers:
        process.env.APP_ENV === "production"
            ? [
                  GithubProvider({
                      clientId: process.env.GITHUB_ID ?? "",
                      clientSecret: process.env.GITHUB_SECRET ?? "",
                  }),
                  DiscordProvider({
                      clientId: process.env.DISCORD_ID ?? "",
                      clientSecret: process.env.DISCORD_SECRET ?? "",
                  }),
                  RedditProvider({
                      clientId: process.env.REDDIT_ID ?? "",
                      clientSecret: process.env.REDDIT_SECRET ?? "",
                  }),
                  TwitchProvider({
                      clientId: process.env.TWITCH_ID ?? "",
                      clientSecret: process.env.TWITCH_SECRET ?? "",
                  }),
                  SpotifyProvider({
                      clientId: process.env.SPOTIFY_ID ?? "",
                      clientSecret: process.env.SPOTIFY_SECRET ?? "",
                  }),
              ]
            : [
                  KeycloakProvider({
                      clientId: "nextauth-client",
                      clientSecret: "test-client-secret",
                      issuer: "http://localhost:8080/realms/dev-test",
                  }),
              ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider && token.email) token.email += account.provider;
            if (account?.provider && token.name) token.name += account.provider;
            return token;
        },
        async session({ session }: { session: Session }) {
            delete session.user;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

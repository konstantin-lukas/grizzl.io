import { z } from "zod";

const NonEmptyString = z.string().min(1);
const NotLiteral = (literal: string) => NonEmptyString.refine(value => value !== literal);
const EmptyString = z.literal("");

export const EnvProductionSchema = z.object({
    OAUTH_GITHUB_ID: NonEmptyString,
    OAUTH_GITHUB_SECRET: NonEmptyString,
    OAUTH_DISCORD_ID: NonEmptyString,
    OAUTH_DISCORD_SECRET: NonEmptyString,
    OAUTH_REDDIT_ID: NonEmptyString,
    OAUTH_REDDIT_SECRET: NonEmptyString,
    OAUTH_TWITCH_ID: NonEmptyString,
    OAUTH_TWITCH_SECRET: NonEmptyString,

    BETTER_AUTH_SECRET: NotLiteral("ultra-ultra-ultra-secure-password"),
    BETTER_AUTH_URL: NotLiteral("http://grizzl.localhost"),

    NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY: NotLiteral("John Doe"),
    NUXT_PUBLIC_LEGAL_STREET: NotLiteral("742 Evergreen Terrace"),
    NUXT_PUBLIC_LEGAL_ZIP_AND_CITY: NotLiteral("55555 Springfield"),
    NUXT_PUBLIC_LEGAL_PHONE: NotLiteral("+01 23456789"),
    NUXT_PUBLIC_LEGAL_EMAIL: NotLiteral("john.doe@mail.com"),

    NUXT_PUBLIC_APP_ENV: z.literal("production"),
    NUXT_PUBLIC_ORIGIN: z.literal("https://grizzl.io"),
    NUXT_PUBLIC_VERSION: z.string().regex(/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/),

    POSTGRES_USER: z.undefined(),
    POSTGRES_PASSWORD: z.undefined(),
    POSTGRES_DB: z.undefined(),

    DB_HOST: z.literal("postgres"),
    DB_NAME: z.literal("grizzl"),
    DB_USERNAME: z.literal("grizzl_user"),
    DB_PASSWORD: NotLiteral("password"),
});

export const EnvSchema = z.object({
    OAUTH_GITHUB_ID: EmptyString,
    OAUTH_GITHUB_SECRET: EmptyString,
    OAUTH_DISCORD_ID: EmptyString,
    OAUTH_DISCORD_SECRET: EmptyString,
    OAUTH_REDDIT_ID: EmptyString,
    OAUTH_REDDIT_SECRET: EmptyString,
    OAUTH_TWITCH_ID: EmptyString,
    OAUTH_TWITCH_SECRET: EmptyString,

    BETTER_AUTH_SECRET: z.literal("ultra-ultra-ultra-secure-password"),
    BETTER_AUTH_URL: z.literal("http://grizzl.localhost"),

    NUXT_PUBLIC_LEGAL_RESPONSIBLE_ENTITY: z.literal("John Doe"),
    NUXT_PUBLIC_LEGAL_STREET: z.literal("742 Evergreen Terrace"),
    NUXT_PUBLIC_LEGAL_ZIP_AND_CITY: z.literal("55555 Springfield"),
    NUXT_PUBLIC_LEGAL_PHONE: z.literal("+01 23456789"),
    NUXT_PUBLIC_LEGAL_EMAIL: z.literal("john.doe@mail.com"),

    NUXT_PUBLIC_APP_ENV: z.enum(["development", "test"]),
    NUXT_PUBLIC_ORIGIN: z.literal("http://grizzl.localhost"),
    NUXT_PUBLIC_VERSION: z.literal("development"),

    DB_HOST: z.literal("postgres"),
    DB_NAME: z.literal("grizzl"),
    DB_USERNAME: z.literal("grizzl_user"),
    DB_PASSWORD: z.literal("password"),
});

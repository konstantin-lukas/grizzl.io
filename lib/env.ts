import { z } from "zod";

export const EnvSchema = z
    .object({
        NUXT_PUBLIC_APP_ENV: z.literal("production"),
        NUXT_PUBLIC_ORIGIN: z.literal("https://grizzl.io"),
        NUXT_PUBLIC_VERSION: z
            .string("development")
            .refine(version => /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)),
    })
    .or(
        z.object({
            NUXT_PUBLIC_APP_ENV: z.enum(["development", "test"]),
            NUXT_PUBLIC_ORIGIN: z.literal("http://grizzl.localhost"),
            NUXT_PUBLIC_VERSION: z.literal("development"),
        }),
    );

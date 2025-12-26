import { EnvProductionSchema, EnvSchema } from "@@/lib/env";

export default defineNitroPlugin(() => {
    if (process.env.NUXT_PUBLIC_APP_ENV === "development" || process.env.NUXT_PUBLIC_APP_ENV === "test") {
        EnvSchema.parse(process.env);
    } else {
        EnvProductionSchema.parse(process.env);
    }
});

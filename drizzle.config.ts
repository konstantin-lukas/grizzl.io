import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./lib/db/migrations",
    schema: "./lib/db/schema",
    casing: "snake_case",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});

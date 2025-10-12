import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./lib/db/migrations",
    schema: "./lib/db/schema",
    casing: "snake_case",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        ssl: false,
    },
    verbose: true,
    strict: true,
});

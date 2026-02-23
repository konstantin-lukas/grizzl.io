import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "~~/database/schema";

export function createDBConnection() {
    const pool = new Pool({
        host: "postgres",
        database: "grizzl",
        user: "admin",
        password: "admin",
        ssl: false,
        max: 1,
    });

    const db = drizzle(pool, {
        casing: "snake_case",
        schema,
    });

    return { pool, db };
}

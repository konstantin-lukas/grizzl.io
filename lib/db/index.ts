import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
    casing: "snake_case",
    schema,
});

import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: false,
});

export const db = drizzle(pool, {
    casing: "snake_case",
    schema,
});

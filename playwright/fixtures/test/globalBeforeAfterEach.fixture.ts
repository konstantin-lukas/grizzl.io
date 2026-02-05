import type { TableConfig } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { getTableConfig } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import * as schema from "~~/server/database/schema";

/**
 * This fixture serves as a global beforeEach/afterEach because Playwright currently doesn't have one.
 * There's no point importing this in a test. Any code you put before the waitForUse call is executed before each test
 * and before each beforeEach block in that test file. Code inserted after the waitForUse call acts as a global afterEach.
 */
export default function globalBeforeAfterEach() {
    // eslint-disable-next-line no-empty-pattern
    return async ({}, waitForUse: () => void) => {
        // SECTION START: RESET DATABASE
        const pool = new Pool({
            host: "postgres",
            database: "grizzl",
            user: "admin",
            password: "admin",
            ssl: false,
        });

        const db = drizzle(pool, {
            casing: "snake_case",
            schema,
        });

        const isTableToEmpty = <T extends TableConfig>(key: string, table: unknown): table is PgTableWithColumns<T> => {
            const excludedTables = ["user", "account", "session"];
            return !key.includes("Enum") && !excludedTables.includes(key);
        };

        for (const [key, table] of Object.entries(schema)) {
            if (!isTableToEmpty(key, table)) continue;
            const config = getTableConfig(table);
            config.schema = config.schema === undefined ? "public" : config.schema;
            const tableToTruncate = `"${config.schema}"."${config.name}"`;
            await db.execute(sql.raw(`truncate ${tableToTruncate} cascade;`));
        }
        // SECTION END: RESET DATABASE

        await waitForUse();

        await pool.end();
    };
}

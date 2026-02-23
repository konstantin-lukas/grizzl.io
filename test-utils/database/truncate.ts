import type { TableConfig } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { getTableConfig } from "drizzle-orm/pg-core";
import * as schema from "~~/database/schema";

export async function truncate(db: ReturnType<typeof drizzle>, excludedTables = ["user", "account", "session"]) {
    const isTableToEmpty = <T extends TableConfig>(key: string, table: unknown): table is PgTableWithColumns<T> => {
        return !key.includes("Enum") && !excludedTables.includes(key);
    };

    for (const [key, table] of Object.entries(schema)) {
        if (!isTableToEmpty(key, table)) continue;
        const config = getTableConfig(table);
        config.schema = config.schema === undefined ? "public" : config.schema;
        const tableToTruncate = `"${config.schema}"."${config.name}"`;
        await db.execute(sql.raw(`truncate ${tableToTruncate} cascade;`));
    }
}

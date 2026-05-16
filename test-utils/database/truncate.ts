import type { TableConfig } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { getTableConfig } from "drizzle-orm/pg-core";
import type { Database } from "~~/database";
import * as schema from "~~/database/schema";

export async function truncate(db: Database, excludedTables = ["user", "account", "session"]) {
    const isTableToEmpty = <T extends TableConfig>(key: string, _table: unknown): _table is PgTableWithColumns<T> => {
        return !key.includes("Enum") && !key.includes("Relation") && !excludedTables.includes(key);
    };

    for (const [key, table] of Object.entries(schema)) {
        if (!isTableToEmpty(key, table)) continue;
        const config = getTableConfig(table);
        config.schema = config.schema === undefined ? "public" : config.schema;
        const tableToTruncate = `"${config.schema}"."${config.name}"`;
        await db.execute(sql.raw(`truncate ${tableToTruncate} cascade;`));
    }
}

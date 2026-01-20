import * as schema from "@@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import { getTableConfig } from "drizzle-orm/pg-core";

type ExcludeEnum<T extends string> = T extends `${string}Enum${string}` ? never : T;
export default abstract class BaseFixture<T extends ExcludeEnum<keyof typeof schema>> {
    protected readonly db;
    protected readonly schema;
    protected constructor(db: ReturnType<typeof drizzle>, tableName: T) {
        this.db = db;
        this.schema = schema[tableName];
    }

    protected get testUser() {
        return (async () => {
            const result = await this.db.select().from(schema.user).where(eq(schema.user.email, "user@test.com"));
            return result[0];
        })();
    }

    async reset() {
        const config = getTableConfig(this.schema);
        config.schema = config.schema === undefined ? "public" : config.schema;
        const tableToTruncate = `"${config.schema}"."${config.name}"`;
        await this.db.execute(sql.raw(`truncate ${tableToTruncate} cascade;`));
    }
}

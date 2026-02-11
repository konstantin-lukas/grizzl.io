import * as schema from "@@/server/database/schema";
import { type InferInsertModel, eq, sql } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import { getTableConfig } from "drizzle-orm/pg-core";

type ExcludeEnum<T extends string> = T extends `${string}Enum${string}` ? never : T;
type SchemaKey = ExcludeEnum<keyof typeof schema>;
export type InsertModel<T extends (typeof schema)[SchemaKey]> = Partial<InferInsertModel<T>>;
export type InsertOptions<T extends SchemaKey, N extends number> = {
    count?: N;
    overrides?: InsertModel<(typeof schema)[T]> | ((index: number) => InsertModel<(typeof schema)[T]>);
};

export default abstract class BaseFixture<T extends SchemaKey> {
    protected readonly db;
    protected readonly schema;
    protected abstract readonly dataProvider: (index: number) => InsertModel<(typeof schema)[T]>;
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

    async insert<N extends number = 10>(options: InsertOptions<T, N> = {}) {
        const { count = 10, overrides = {} } = options;

        const getOverrides = (index: number) => (typeof overrides === "function" ? overrides(index) : overrides);

        const needsUserId = "userId" in this.schema;
        const suppliesUserId = "userId" in getOverrides(0);
        const userId = !suppliesUserId && needsUserId ? (await this.testUser)!.id : undefined;

        const mapper = (_: unknown, index: number) => {
            const defaults = this.dataProvider(index);
            return {
                userId,
                ...defaults,
                ...(typeof overrides === "function" ? overrides(index) : overrides),
            };
        };

        const data = Array.from({ length: count }).map(mapper);
        const returnValue = await this.db.insert(this.schema).values(data).returning();
        return returnValue as NTuple<ArrayElement<typeof returnValue>, N>;
    }
}

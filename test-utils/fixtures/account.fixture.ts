import BaseFixture, { type InsertOptions } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date } from "~~/test-utils/helpers/data";

export default class AccountFixture extends BaseFixture<"account"> {
    protected dataProvider = () => ({
        accountId: "123",
        providerId: "ABC",
        accessToken: "___",
        refreshToken: "___",
        idToken: "___",
        accessTokenExpiresAt: date(),
        refreshTokenExpiresAt: date(),
        scope: "",
        password: "%!A",
        createdAt: date(),
        updatedAt: date(),
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "account");
    }

    override async insert<N extends number = 1>(
        options: InsertOptions<"account", N> & { overrides: { userId: string } },
    ) {
        const { count = 1, overrides = {} } = options;
        return super.insert({ count: count as N, overrides });
    }

    async select() {
        return await this.db.select().from(this.schema);
    }
}

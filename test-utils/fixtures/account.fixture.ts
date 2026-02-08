import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date } from "~~/test-utils/helpers/data";

export default class AccountFixture extends BaseFixture<"account"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "account");
    }

    async insert({ userId }: { userId: string }) {
        const data = {
            accountId: "123",
            providerId: "ABC",
            userId,
            accessToken: "___",
            refreshToken: "___",
            idToken: "___",
            accessTokenExpiresAt: date(),
            refreshTokenExpiresAt: date(),
            scope: "",
            password: "%!A",
            createdAt: date(),
            updatedAt: date(),
        };
        return (await this.db.insert(this.schema).values(data).returning())[0]!;
    }

    async select() {
        return await this.db.select().from(this.schema);
    }
}

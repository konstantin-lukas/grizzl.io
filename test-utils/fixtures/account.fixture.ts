import BaseFixture, { type InsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date } from "~~/test-utils/helpers/data";

export default class AccountFixture extends BaseFixture<"account"> {
    protected defaults = () => ({
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

    override async insert<N extends number>(count: N, overrides: InsertOverrides<"account"> & { userId: string }) {
        return super.insert(count, overrides);
    }
}

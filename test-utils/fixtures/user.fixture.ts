import BaseFixture, { type InsertOptions } from "@@/test-utils/fixtures/base.fixture";
import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class UserFixture extends BaseFixture<"user"> {
    protected dataProvider = () => ({
        name: "Mr. Burns",
        email: "cmontgomeryburns@springfieldnuclear.com",
        emailVerified: true,
    });
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "user");
    }

    override async insert<N extends number = 1>(options: InsertOptions<"user", N> = {}) {
        const { count = 1, overrides = {} } = options;
        return super.insert({ count: count as N, overrides });
    }

    async select(email: "user@test.com" | "cmontgomeryburns@springfieldnuclear.com") {
        return (await this.db.select().from(this.schema).where(eq(this.schema.email, email)))[0];
    }
}

import BaseFixture from "@@/tests/e2e/fixtures/db/base.fixture";
import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";

export default class UserFixture extends BaseFixture<"user"> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "user");
    }

    async insert() {
        const data = {
            name: "Mr. Burns",
            email: "cmontgomeryburns@springfieldnuclear.com",
            emailVerified: true,
        };
        return (await this.db.insert(this.schema).values(data).returning())[0];
    }

    async select(email: "user@test.com" | "cmontgomeryburns@springfieldnuclear.com") {
        return (await this.db.select().from(this.schema).where(eq(this.schema.email, email)))[0];
    }
}

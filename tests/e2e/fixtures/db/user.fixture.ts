import BaseFixture from "@e2e/fixtures/db/base.fixture";
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
}

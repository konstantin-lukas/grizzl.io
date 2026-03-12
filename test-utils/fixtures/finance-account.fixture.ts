import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, str } from "~~/test-utils/helpers/data";

export default class FinanceAccountFixture extends BaseFixture<"financeAccount"> {
    protected defaults = (index: number) => ({
        title: str({ length: 100, seed: index, spaces: false }),
        createdAt: date({ seed: index }),
        currency: "EUR",
        balance: 0,
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "financeAccount");
    }
}

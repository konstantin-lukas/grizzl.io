import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, int, str } from "~~/test-utils/helpers/data";

export default class FinanceTransactionFixture extends BaseFixture<"financeTransaction"> {
    protected defaults = (index: number) => ({
        title: str({ length: 100, seed: index, spaces: false }),
        reference: str({ length: 100, seed: index + 100, spaces: false }),
        amount: int({ min: -300_00, max: 300_00, seed: index }),
        createdAt: date({ seed: index }),
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "financeTransaction");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"financeTransaction", { accountId: string; categoryId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

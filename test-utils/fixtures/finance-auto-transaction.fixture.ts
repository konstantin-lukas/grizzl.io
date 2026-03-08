import { Category } from "#shared/finance/enums/category.enum";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, int, str } from "~~/test-utils/helpers/data";

export default class FinanceAutoTransactionFixture extends BaseFixture<"financeAutoTransaction"> {
    public readonly categories = Object.values(Category);
    protected defaults = (index: number) => ({
        title: str({ length: 100, seed: index, spaces: false }),
        reference: str({ length: 100, seed: index + 100, spaces: false }),
        amount: int({ min: 5_00, max: 300_00, seed: index }),
        category: this.categories[int({ min: 0, max: this.categories.length - 1, seed: index })],
        execInterval: int({ min: 1, max: 12, seed: index }),
        execOn: int({ min: 1, max: 31, seed: index }),
        lastExec: date({ seed: index }).toISOString().split("T")[0],
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "financeAutoTransaction");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"financeAutoTransaction", { accountId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

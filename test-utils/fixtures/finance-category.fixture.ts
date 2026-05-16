import { CATEGORY_ICONS } from "#shared/core/constants/category-icons.constant";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { Database } from "~~/database";
import { int, str } from "~~/test-utils/helpers/data";

export default class FinanceCategoryFixture extends BaseFixture<"financeCategory"> {
    protected defaults = (index: number) => {
        const displayName = str({ length: 100, seed: index });
        const normalizedName = displayName.toLowerCase().replaceAll(/\s/g, "_");
        return {
            displayName,
            normalizedName,
            icon: CATEGORY_ICONS[int({ min: 0, max: CATEGORY_ICONS.length - 1, seed: index })],
        };
    };

    constructor(db: Database) {
        super(db, "financeCategory");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"financeCategory", { accountId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

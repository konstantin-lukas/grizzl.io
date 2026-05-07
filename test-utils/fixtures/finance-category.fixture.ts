import { IconTagsMap } from "#shared/core/maps/icon-tags.map";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { int, str } from "~~/test-utils/helpers/data";

const icons = Object.keys(IconTagsMap);
export default class FinanceCategoryFixture extends BaseFixture<"financeCategory"> {
    protected defaults = (index: number) => {
        const displayName = str({ length: 100, seed: index });
        const normalizedName = displayName.toLowerCase().replaceAll(/\s/g, "_");
        return {
            displayName,
            normalizedName,
            icon: icons[int({ min: 0, max: icons.length - 1, seed: index })],
        };
    };

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "financeCategory");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"financeCategory", { accountId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

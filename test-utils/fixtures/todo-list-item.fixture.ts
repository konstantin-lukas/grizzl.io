import { CATEGORY_ICONS } from "#shared/core/constants/category-icons.constant";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, int, maybe, str } from "~~/test-utils/helpers/data";

export default class TodoListItemFixture extends BaseFixture<"todoListItem"> {
    protected defaults = (index: number) => ({
        text: str({ length: 200, seed: index, spaces: false }),
        icon: CATEGORY_ICONS[int({ min: 0, max: CATEGORY_ICONS.length - 1, seed: index })],
        scheduledFor: maybe(() => date({ seed: index }).toISOString().split("T")[0], { seed: index, odds: 0.1 }),
        index,
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "todoListItem");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"todoListItem", { listId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

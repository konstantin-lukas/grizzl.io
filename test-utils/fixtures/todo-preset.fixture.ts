import { LONG_TITLE_MAX, TITLE_MAX } from "#shared/core/validators/core.validator";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";
import BaseFixture, { type ExtendedInsertOverrides } from "@@/test-utils/fixtures/base.fixture";
import type { drizzle } from "drizzle-orm/node-postgres";
import { date, int, str, strArr } from "~~/test-utils/helpers/data";

export default class TodoPresetFixture extends BaseFixture<"todoPreset"> {
    protected defaults = (index: number) => ({
        title: str({ length: TITLE_MAX, seed: index, spaces: false }),
        createdAt: date({ seed: index }),
        items: strArr({
            arrLength: int({ min: 0, max: TODO_LIST_MAX_LENGTH, seed: index }),
            seed: index,
            spaces: index % 2 === 0,
            strLength: int({ min: 1, max: LONG_TITLE_MAX, seed: index }),
        }),
    });

    constructor(db: ReturnType<typeof drizzle>) {
        super(db, "todoPreset");
    }

    override async insert<N extends number>(
        count: N,
        overrides: ExtendedInsertOverrides<"todoPreset", { listId: string }>,
    ) {
        return super.insert(count, overrides);
    }
}

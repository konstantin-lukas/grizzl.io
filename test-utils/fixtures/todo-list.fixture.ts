import { CATEGORY_ICONS } from "#shared/core/constants/category-icons.constant";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import BaseFixture from "@@/test-utils/fixtures/base.fixture";
import type { Database } from "~~/database";
import { date, int, str } from "~~/test-utils/helpers/data";

export default class TodoListFixture extends BaseFixture<"todoList"> {
    protected defaults = (index: number) => ({
        title: str({ length: TITLE_MAX, seed: index, spaces: false }),
        createdAt: date({ seed: index }),
        icon: CATEGORY_ICONS[int({ min: 0, max: CATEGORY_ICONS.length - 1, seed: index })],
    });

    constructor(db: Database) {
        super(db, "todoList");
    }
}

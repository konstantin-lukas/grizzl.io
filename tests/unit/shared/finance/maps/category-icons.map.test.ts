import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { CategoryIconsMap } from "#shared/finance/maps/category-icons.map";
import { expect, test } from "vitest";

test(`contains no key that is longer than ${TITLE_MAX}`, () => {
    const keys = Object.keys(CategoryIconsMap);
    const containsLongKeys = keys.some(key => key.length > TITLE_MAX);
    expect(containsLongKeys).toBe(false);
});

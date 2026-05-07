import { IconTagsMap } from "#shared/core/maps/icon-tags.map";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { expect, test } from "vitest";

test(`contains no key that is longer than ${TITLE_MAX}`, () => {
    const keys = Object.keys(IconTagsMap);
    const containsLongKeys = keys.some(key => key.length > TITLE_MAX);
    expect(containsLongKeys).toBe(false);
});

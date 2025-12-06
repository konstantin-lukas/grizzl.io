import { createToastSuccess } from "@@/app/utils/toast";
import { expect, test } from "vitest";

test.each([
    ["no description", "title", undefined],
    ["with description", "title", "description"],
])("wraps arguments in object (%s)", (_, title, description) => {
    const toast = createToastSuccess(title, description);
    expect(toast.title).toBe(title);
    expect(toast.description).toBe(description);
    expect(toast.color).toBe("success");
});

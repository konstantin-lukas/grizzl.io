import { createToastError } from "@@/app/utils/toast";
import { expect, test } from "vitest";
import { h } from "vue";

test("wraps arguments in object when error.data is absent", () => {
    const error = { name: "NetworkError", message: "Oopsie Doodle" };
    const toast = createToastError(error as never);
    expect(toast.title).toBe(error.name);
    expect(toast.description).toBe(error.message);
    expect(toast.color).toBe("error");
});

test("wraps arguments in object when error.data is absent", () => {
    const error = { data: { statusMessage: "NetworkError", description: "Oopsie Doodle" } };
    const toast = createToastError(error as never);
    expect(toast.title).toBe(error.data.statusMessage);
    expect((toast.description as unknown as { type: string }).type).toBe(h("div").type);
    expect((toast.description as unknown as { props: { style: string } }).props?.style).toContain(
        "white-space: preserve nowrap",
    );
    expect(toast.color).toBe("error");
});

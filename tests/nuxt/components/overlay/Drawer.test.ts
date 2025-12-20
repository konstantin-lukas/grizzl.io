import Drawer from "@@/app/components/overlay/Drawer.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

const content = "Hello, world!";
test("should be closed by default", async () => {
    await mountSuspended(Drawer, {
        scoped: true,
        slots: { default: content },
        props: { "data-test-id": "drawer" },
    });
    const drawer = document.querySelector("[role='dialog']");
    expect(drawer).toBeNull();
});

test("should be opened by passing the open prop", async () => {
    await mountSuspended(Drawer, {
        scoped: true,
        slots: { default: content },
        props: { "data-test-id": "drawer", "open": true },
    });
    const drawer = document.querySelector("[role='dialog']");
    expect(drawer?.textContent).toBe(content);
});

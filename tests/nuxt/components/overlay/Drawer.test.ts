import Drawer from "@@/app/components/overlay/Drawer.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

const slots = { default: "Hello, world!" };

test("should be closed by default", async () => {
    await mountSuspended(Drawer, {
        scoped: true,
        slots,
    });
    const drawer = document.querySelector("[role='dialog']");
    expect(drawer).toBeNull();
});

test("should be opened by passing the open prop", async () => {
    await mountSuspended(Drawer, {
        scoped: true,
        slots,
        props: { open: true },
    });
    const drawer = document.querySelector("[role='dialog']");
    expect(drawer?.textContent).toBe(slots.default);
});

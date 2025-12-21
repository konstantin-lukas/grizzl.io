import Slideover from "@@/app/components/overlay/Slideover.vue";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

const slots = { default: "Hello, world!" };
const stubs = { UTooltip };

test("should be closed by default", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        props: { portal: false },
    });
    const slideover = wrapper.find("[role='dialog']");
    expect(slideover.exists()).toBe(false);
});

test("should be opened by passing the open prop", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        global: { stubs },
        props: { open: true, portal: false },
    });
    const slideover = wrapper.find("[role='dialog']");
    expect(slideover.text()).toBe(`ui.goBack${slots.default}`);
});

test("should have button that emits the close event", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        global: { stubs },
        props: { open: true, portal: false },
    });
    const button = wrapper.find("[data-test-id='go-back-button']");
    expect(wrapper.emitted("close")).toBeUndefined();
    await button.trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
});

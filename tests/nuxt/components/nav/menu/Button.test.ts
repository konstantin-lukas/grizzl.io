import Button from "@@/app/components/nav/menu/Button.vue";
import useMenu from "@@/app/composables/useMenu";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import { UTooltip } from "~~/test-utils/vitest/stubs";

const stubs = { UTooltip };

test("should open and close the menu when clicked", async () => {
    const wrapper = await mountSuspended(Button, { scoped: true, global: { stubs } });
    const button = wrapper.find("button");
    const { isOpen } = useMenu();
    expect(isOpen.value).toBe(false);
    await button.trigger("click");
    expect(isOpen.value).toBe(true);
    await button.trigger("click");
    expect(isOpen.value).toBe(false);
});

test("should display a tooltip with the correct text", async () => {
    const wrapper = await mountSuspended(Button, {
        scoped: true,
        global: { stubs },
    });
    const tooltip = wrapper.findByTestId("tooltip");
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(tooltip.text()).toBe("menu.aria.toggleMenu");
});

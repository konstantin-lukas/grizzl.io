import Button from "@@/app/components/button/Button.vue";
import { deferred } from "@@/tests/utils/async";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";

const text = "Hello, world!";
const stubs = {
    UTooltip: {
        template: `
            <div>
                <slot />
                <div class="tooltip">
                    <slot name="content" />
                </div>
            </div>
        `,
    },
};

test("should display a button with the provided content", async () => {
    const wrapper = await mountSuspended(Button, { scoped: true, slots: { default: text } });
    expect(wrapper.text()).toBe(text);
});

test("should add a tooltip if an aria-label is provided", async () => {
    const wrapper = await mountSuspended(Button, {
        scoped: true,
        props: { "aria-label": text, "data-test-id": "button" },
        global: { stubs },
    });
    const tooltip = wrapper.findByTestId("tooltip");
    const button = wrapper.findByTestId("button");
    expect(button.exists()).toBe(true);
    expect(tooltip.text()).toBe(text);
});

test("should not add a tooltip if no aria-label is provided", async () => {
    const wrapper = await mountSuspended(Button, {
        scoped: true,
        props: { "data-test-id": "button" },
        global: { stubs },
    });
    const tooltip = wrapper.findByTestId("tooltip");
    const button = wrapper.findByTestId("button");
    expect(button.exists()).toBe(true);
    expect(tooltip.exists()).toBe(false);
});

test("calls onAsyncClick instead of click event handler and disables button while loading, then re-enables", async () => {
    const deferredClick = deferred();
    const onAsyncClick = vi.fn(() => deferredClick.promise);
    const onClick = vi.fn();

    const wrapper = await mountSuspended(Button, { scoped: true, props: { onAsyncClick, onClick } });
    const button = wrapper.find("button");

    expect(button.attributes("disabled")).toBeUndefined();

    await button.trigger("click");

    expect(button.attributes("disabled")).toBeDefined();
    expect(onAsyncClick).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();

    deferredClick.resolve();
    await vi.waitFor(() => {
        expect(button.attributes("disabled")).toBeUndefined();
    });
});

test("handles click events normally when no async click event handler is provided", async () => {
    const onClick = vi.fn();

    const wrapper = await mountSuspended(Button, { scoped: true, props: { onClick } });
    const button = wrapper.find("button");

    await button.trigger("click");

    expect(onClick).toHaveBeenCalledOnce();
});

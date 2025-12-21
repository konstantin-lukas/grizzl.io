import Empty from "@@/app/components/data/Empty.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should render the correct title and button text", async () => {
    const wrapper = await mountSuspended(Empty, { scoped: true });
    const title = wrapper.findByTestId("data-empty-title");
    const button = wrapper.find("button");
    expect(title.text()).toBe("ui.noEntries");
    expect(button.text()).toBe("ui.create");
});

test("should emit a click event when button pressed", async () => {
    const wrapper = await mountSuspended(Empty, { scoped: true });
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("open");
});

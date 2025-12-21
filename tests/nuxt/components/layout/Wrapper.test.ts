import Wrapper from "@@/app/components/layout/Wrapper.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should render its default slot inside a div with certain styles", async () => {
    const text = "Hello, world!";
    const wrapper = await mountSuspended(Wrapper, { scoped: true, slots: { default: text } });
    const div = wrapper.find("div");
    expect(div.text()).toBe(text);
    expect(div.attributes("class")).toBe("mx-auto min-h-main-height max-w-240 px-8 py-main-padding");
});

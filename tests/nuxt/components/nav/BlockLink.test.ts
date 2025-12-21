import BlockLink from "@@/app/components/nav/BlockLink.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

const slots = { default: "Hello, world!" };

test("should render a button style link", async () => {
    const props = { "to": "/bananas", "data-test-id": "link" };
    const wrapper = await mountSuspended(BlockLink, { scoped: true, slots, props });
    const card = wrapper.findByTestId("link");
    const comingSoon = wrapper.findByTestId("block-link-coming-soon");
    expect(card.element.tagName).toBe("A");
    expect(card.text()).toBe(slots.default);
    expect(card.attributes("href")).toBe(props.to);
    expect(comingSoon.exists()).toBe(false);
});

test("should not render a link when disabled and attach a coming soon label", async () => {
    const props = { "to": "/bananas", "data-test-id": "link", "disabled": true };
    const wrapper = await mountSuspended(BlockLink, { scoped: true, slots, props });
    const card = wrapper.findByTestId("link");
    const comingSoon = wrapper.findByTestId("block-link-coming-soon");
    expect(card.element.tagName).toBe("SPAN");
    expect(card.text()).toBe(slots.default);
    expect(card.attributes("href")).toBeUndefined();
    expect(comingSoon.text()).toBe("menu.comingSoon");
});

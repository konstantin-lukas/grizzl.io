import Heading from "@@/app/components/typo/H2.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should render as an h2 by default", async () => {
    const wrapper = await mountSuspended(Heading);
    const h2 = wrapper.find("h2");
    const span = wrapper.find("span");
    expect(h2.exists()).toBe(true);
    expect(span.exists()).toBe(false);
});

test("should allow rendering with a different tag", async () => {
    const wrapper = await mountSuspended(Heading, { props: { as: "span" } });
    const h2 = wrapper.find("h2");
    const span = wrapper.find("span");
    expect(h2.exists()).toBe(false);
    expect(span.exists()).toBe(true);
});

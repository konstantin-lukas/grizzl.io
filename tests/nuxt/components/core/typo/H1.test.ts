import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import Heading from "~/core/components/typo/H1.vue";

test("should render as an h1 by default", async () => {
    const wrapper = await mountSuspended(Heading);
    const h1 = wrapper.find("h1");
    const span = wrapper.find("span");
    expect(h1.exists()).toBe(true);
    expect(span.exists()).toBe(false);
});

test("should allow rendering with a different tag", async () => {
    const wrapper = await mountSuspended(Heading, { props: { as: "span" } });
    const h1 = wrapper.find("h1");
    const span = wrapper.find("span");
    expect(h1.exists()).toBe(false);
    expect(span.exists()).toBe(true);
});

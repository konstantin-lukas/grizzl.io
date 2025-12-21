import Heading from "@@/app/components/typo/H3.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should always render as an h3", async () => {
    const wrapper = await mountSuspended(Heading, { props: { as: "span" } });
    const h3 = wrapper.find("h3");
    const span = wrapper.find("span");
    expect(h3.exists()).toBe(true);
    expect(span.exists()).toBe(false);
});

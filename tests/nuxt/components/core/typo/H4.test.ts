import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import Heading from "~/core/components/typo/H4.vue";

test("should always render as an h4", async () => {
    const wrapper = await mountSuspended(Heading, { props: { as: "span" } });
    const h4 = wrapper.find("h4");
    const span = wrapper.find("span");
    expect(h4.exists()).toBe(true);
    expect(span.exists()).toBe(false);
});

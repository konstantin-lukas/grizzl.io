import HeroCard from "@@/app/components/layout/HeroCard.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should render a card with a link to the respective section", async () => {
    const props = { label: "timer", icon: "mdi:timer-outline" };
    const wrapper = await mountSuspended(HeroCard, { scoped: true, props } as never);
    const card = wrapper.find("a");
    const label = wrapper.findByTestId("hero-card-label");
    const comingSoon = wrapper.findByTestId("hero-card-coming-soon");
    expect(card.attributes("href")).toBe(`/${props.label}`);
    expect(card.attributes("aria-hidden")).toBeUndefined();
    expect(label.text()).toBe(`ui.${props.label}`);
    expect(comingSoon.exists()).toBe(false);
});

test("should render a div without a link and a coming soon label when disabled", async () => {
    const props = { label: "timer", icon: "mdi:timer-outline", disabled: true };
    const wrapper = await mountSuspended(HeroCard, { scoped: true, props } as never);
    const card = wrapper.find("div");
    const label = wrapper.findByTestId("hero-card-label");
    const comingSoon = wrapper.findByTestId("hero-card-coming-soon");
    expect(card.attributes("aria-hidden")).toBeDefined();
    expect(card.attributes("href")).toBeUndefined();
    expect(label.text()).toBe(`ui.${props.label}`);
    expect(comingSoon.text()).toBe("menu.comingSoon");
});

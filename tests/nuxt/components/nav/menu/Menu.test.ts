import Menu from "@@/app/components/nav/menu/Menu.vue";
import useMenu from "@@/app/composables/useMenu";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";

const stubs = { UTooltip };

test("should use the correct translation keys and link to the correct pages", async () => {
    const wrapper = await mountSuspended(Menu, { scoped: true, global: { stubs } });
    const nav = wrapper.findByTestId("menu-main-nav");
    const homeLink = wrapper.findByTestId("menu-link-home");
    const timerLink = wrapper.findByTestId("menu-link-timer");
    const financeLink = wrapper.findByTestId("menu-link-finance");
    const pollLink = wrapper.findByTestId("menu-link-poll");
    const todoLink = wrapper.findByTestId("menu-link-todo");
    const timerLI = wrapper.findByTestId("menu-list-item-timer");
    const financeLI = wrapper.findByTestId("menu-list-item-finance");
    const pollLI = wrapper.findByTestId("menu-list-item-poll");
    const todoLI = wrapper.findByTestId("menu-list-item-todo");

    expect(nav.attributes("aria-label")).toBe("menu.aria.mainNav");
    expect(homeLink.attributes("aria-label")).toBe("menu.aria.goToHome");
    expect(homeLink.attributes("href")).toBe("/");

    expect(timerLink.attributes("href")).toBe("/timer");
    expect(timerLI.attributes("aria-hidden")).toBeUndefined();
    expect(timerLink.text()).toBe("ui.timer");

    expect(financeLink.attributes("href")).toBeUndefined();
    expect(financeLI.attributes("aria-hidden")).toBe("true");
    expect(financeLink.text()).toBe("ui.finance");

    expect(pollLink.attributes("href")).toBeUndefined();
    expect(pollLI.attributes("aria-hidden")).toBe("true");
    expect(pollLink.text()).toBe("ui.poll");

    expect(todoLink.attributes("href")).toBeUndefined();
    expect(todoLI.attributes("aria-hidden")).toBe("true");
    expect(todoLink.text()).toBe("ui.todo");
});

test("should display the correct version number", async () => {
    const version = "v1.2.3";
    const wrapper = await mountSuspended(Menu, {
        scoped: true,
        global: {
            stubs,
            mocks: {
                $config: {
                    public: { version },
                },
            },
        },
    });
    const appVersion = wrapper.findByTestId("app-version");
    expect(appVersion.text()).toBe(version);
});

test("should have aria-hidden iff it is closed", async () => {
    const wrapper = await mountSuspended(Menu, {
        scoped: true,
        global: { stubs },
    });
    const { open, close } = useMenu();
    const menu = wrapper.find("header");
    expect(menu.attributes("aria-hidden")).toBe("true");
    open();
    await vi.waitFor(() => {
        expect(menu.attributes("aria-hidden")).toBeUndefined();
    });
    close();
    await vi.waitFor(() => {
        expect(menu.attributes("aria-hidden")).toBeDefined();
    });
});

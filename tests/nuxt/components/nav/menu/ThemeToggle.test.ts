import ThemeToggle from "@@/app/components/nav/menu/ThemeToggle.vue";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";

const stubs = { UTooltip };

const { colorModeState, useColorModeMock } = await vi.hoisted(async () => {
    const { reactive } = await import("vue");
    const state = reactive({
        preference: "light",
        value: "light",
    });

    const colorModeState = {
        get preference() {
            return state.preference;
        },
        set preference(next: string) {
            state.preference = next;
            state.value = next;
        },
        get value() {
            return state.value;
        },
    };

    return {
        colorModeState,
        useColorModeMock: vi.fn(() => colorModeState),
    };
});

mockNuxtImport("useColorMode", () => {
    return useColorModeMock;
});

test("should toggle the theme when clicked", async () => {
    const wrapper = await mountSuspended(ThemeToggle, {
        scoped: true,
        global: {
            stubs,
        },
    });
    const button = wrapper.find("button");

    expect(colorModeState.preference).toBe("light");
    expect(colorModeState.value).toBe("light");

    await button.trigger("click");
    expect(colorModeState.preference).toBe("dark");
    expect(colorModeState.value).toBe("dark");

    await button.trigger("click");
    expect(colorModeState.preference).toBe("light");
    expect(colorModeState.value).toBe("light");
});

test("should display a tooltip with the correct text", async () => {
    const wrapper = await mountSuspended(ThemeToggle, {
        scoped: true,
        global: { stubs },
    });
    const tooltip = wrapper.findByTestId("tooltip");
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(tooltip.text()).toBe("menu.aria.toggleTheme");
});

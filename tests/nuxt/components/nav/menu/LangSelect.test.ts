import LangSelect from "@@/app/components/nav/menu/LangSelect.vue";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";
import { UTooltip } from "~~/test-utils/vitest/stubs";

const stubs = { UTooltip };

const { i18nState, useI18nMock } = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const locale = ref("en");

    const i18nState = {
        locale,
        setLocale: (code: string) => {
            locale.value = code;
        },
    };

    return {
        i18nState,
        useI18nMock: vi.fn(() => i18nState),
    };
});

mockNuxtImport("useI18n", () => {
    return useI18nMock;
});

test("should allow changing the language", async () => {
    const wrapper = await mountSuspended(LangSelect, {
        scoped: true,
        attachTo: document.body,
        global: {
            stubs,
        },
    });
    const button = wrapper.findByTestId("lang-select");
    expect(button.text()).toBe("🇺🇸English");
    await button.trigger("click");
    const german = document.querySelector("[role='option']:nth-of-type(2)") as HTMLElement;
    expect(german.textContent).toBe("🇩🇪Deutsch");
    german.click();
    await vi.waitFor(() => {
        expect(button.text()).toBe("🇩🇪Deutsch");
    });
    expect(i18nState.locale.value).toBe("de");
});

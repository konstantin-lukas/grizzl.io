import { LOCALES } from "#shared/core/constants/i18n.constant";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import useLocale from "~/core/composables/useLocale";

const { i18nState, useI18nMock } = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const locale = ref("en");

    const i18nState = {
        locale,
    };

    return {
        i18nState,
        useI18nMock: vi.fn(() => i18nState),
    };
});

mockNuxtImport("useI18n", () => {
    return useI18nMock;
});

beforeEach(() => {
    vi.clearAllMocks();
    i18nState.locale.value = "en";
});

test("returns the selected locale metadata", () => {
    const locale = useLocale();
    const english = LOCALES.find(({ code }) => code === "en")!;

    expect(locale.code.value).toBe(english.code);
    expect(locale.fnsLocale.value).toBe(english.fnsLocale);
    expect(locale.language.value).toBe(english.language);
    expect(locale.zodLocale.value).toBe(english.zodLocale);
    expect(locale.uiLocale.value).toBe(english.uiLocale);
});

test("updates when locale changes", async () => {
    const locale = useLocale();
    const german = LOCALES.find(({ code }) => code === "de")!;

    i18nState.locale.value = "de";
    await nextTick();

    expect(locale.code.value).toBe(german.code);
    expect(locale.fnsLocale.value).toBe(german.fnsLocale);
    expect(locale.language.value).toBe(german.language);
    expect(locale.zodLocale.value).toBe(german.zodLocale);
    expect(locale.uiLocale.value).toBe(german.uiLocale);
});

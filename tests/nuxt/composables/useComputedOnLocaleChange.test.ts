import useComputedOnLocaleChange from "@@/app/composables/useComputedOnLocaleChange";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";
import { nextTick } from "vue";

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
});

test("initializes with callback result", async () => {
    const state = useComputedOnLocaleChange(() => "apples");
    expect(state.value).toBe("apples");
});

test("updates when locale changes", async () => {
    const baseState = { value: 0 };
    const state = useComputedOnLocaleChange(() => {
        baseState.value++;
        return baseState.value;
    });

    expect(state.value).toBe(1);

    i18nState.locale.value = "de";
    await nextTick();

    expect(state.value).toBe(2);
});

test("updates when provided getter changes", async () => {
    const baseState = { value: 0 };
    const state = useComputedOnLocaleChange(
        () => {
            return baseState.value;
        },
        () => baseState.value,
    );

    expect(state.value).toBe(0);

    baseState.value = 1;
    await nextTick();

    expect(state.value).toBe(0);
});

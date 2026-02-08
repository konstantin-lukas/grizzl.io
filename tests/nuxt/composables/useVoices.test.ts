import useVoices from "@@/app/composables/useVoices";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";
import { withSetup } from "~~/test-utils/helpers/nuxt";

const { useI18nMock } = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const locale = ref("en");

    const i18nState = { locale };

    return {
        i18nState,
        useI18nMock: vi.fn(() => i18nState),
    };
});

mockNuxtImport("useI18n", () => {
    return useI18nMock;
});

function createSpeechSynthesisMock() {
    let voices: SpeechSynthesisVoice[] = [];
    const listeners = new Map<string, Set<() => void>>();

    const getVoices = vi.fn(() => voices);

    const addEventListener = vi.fn((name: string, cb: () => void) => {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name)!.add(cb);
    });

    const removeEventListener = vi.fn((name: string, cb: () => void) => {
        listeners.get(name)?.delete(cb);
    });

    const setVoices = (next: SpeechSynthesisVoice[]) => {
        voices = next;
    };

    const dispatch = (name: string) => {
        for (const cb of listeners.get(name) ?? []) cb();
    };

    const mock = {
        getVoices,
        addEventListener,
        removeEventListener,
    };

    return { mock, setVoices, dispatch };
}

test("returns an empty array when `speechSynthesis` is unavailable", async () => {
    vi.stubGlobal("speechSynthesis", undefined);

    const { composable } = await withSetup(() => useVoices());

    expect(composable.value).toEqual([]);
});

test("loads voices on mount and updates on voiceschanged", async () => {
    const { mock, setVoices, dispatch } = createSpeechSynthesisMock();
    vi.stubGlobal("speechSynthesis", mock);

    const v1 = [{ name: "Voice A", lang: "en", localService: true, voiceURI: "1" } as SpeechSynthesisVoice];
    setVoices(v1);

    const { composable } = await withSetup(() => useVoices());

    expect(mock.getVoices).toHaveBeenCalledTimes(1);
    expect(mock.addEventListener).toHaveBeenCalledTimes(1);
    expect(mock.addEventListener).toHaveBeenCalledWith("voiceschanged", expect.any(Function));
    expect(composable.value).toEqual(v1);

    const v2 = [
        { name: "Voice B", lang: "en", localService: true, voiceURI: "2" } as SpeechSynthesisVoice,
        { name: "Voice C", lang: "en", localService: true, voiceURI: "3" } as SpeechSynthesisVoice,
    ];
    setVoices(v2);
    dispatch("voiceschanged");

    expect(mock.getVoices).toHaveBeenCalledTimes(2);
    expect(composable.value).toEqual(v2);
});

test("should remove the event listener on unmount", async () => {
    const { mock } = createSpeechSynthesisMock();
    vi.stubGlobal("speechSynthesis", mock);

    const { wrapper } = await withSetup(() => useVoices());

    const handler = mock.addEventListener.mock.calls.find(c => c[0] === "voiceschanged")?.[1];
    expect(handler).toBeTypeOf("function");

    wrapper.unmount();

    expect(mock.removeEventListener).toHaveBeenCalledWith("voiceschanged", handler);
});

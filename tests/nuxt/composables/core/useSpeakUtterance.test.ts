import { beforeEach, expect, test, vi } from "vitest";
import useSpeakUtterance from "~/core/composables/useSpeakUtterance";

const { voices, speechSynthesisStub, SpeechSynthesisUtteranceStub, useVoicesMock } = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const voices = ref([]);
    const speechSynthesisStub = {
        speaking: false,
        speak: vi.fn(),
    };

    const SpeechSynthesisUtteranceStub = vi.fn(
        class {
            public voice = "";
        },
    );
    vi.stubGlobal("speechSynthesis", speechSynthesisStub);
    vi.stubGlobal("SpeechSynthesisUtterance", SpeechSynthesisUtteranceStub);
    return {
        voices,
        speechSynthesisStub,
        SpeechSynthesisUtteranceStub,
        useVoicesMock: () => voices,
    };
});

beforeEach(() => {
    vi.restoreAllMocks();
    speechSynthesisStub.speak.mockReset();
    SpeechSynthesisUtteranceStub.mockReset();
});

vi.mock("~/core/composables/useVoices", () => {
    return { default: useVoicesMock };
});

test("returns early and does not speak when speechSynthesis.speaking is true", () => {
    speechSynthesisStub.speaking = true;

    const speak = useSpeakUtterance();
    speak("Hello", "voice-uri-1");

    expect(speechSynthesisStub.speak).not.toHaveBeenCalled();
    expect(SpeechSynthesisUtteranceStub).not.toHaveBeenCalled();
});

test("speaks an utterance when provided voice exists", () => {
    speechSynthesisStub.speaking = false;
    voices.value = [{ voiceURI: "voice-uri-1" } as never];

    const speak = useSpeakUtterance();
    speak("Hello", "voice-uri-1");

    expect(speechSynthesisStub.speak).toHaveBeenCalledOnce();
    expect(speechSynthesisStub.speak).toHaveBeenCalledWith(expect.any(Object));
    expect(SpeechSynthesisUtteranceStub).toHaveBeenCalledOnce();
});

test("does not speak an utterance when the provided voice does not exist", () => {
    speechSynthesisStub.speaking = false;
    voices.value = [{ voiceURI: "voice-uri-1" } as never];

    const speak = useSpeakUtterance();
    speak("Hello", "voice-uri-2");

    expect(speechSynthesisStub.speak).not.toHaveBeenCalled();
    expect(SpeechSynthesisUtteranceStub).toHaveBeenCalledOnce();
});

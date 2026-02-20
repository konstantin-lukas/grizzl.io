import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { clearNuxtState } from "nuxt/app";
import { beforeEach, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import useAnimateTimer from "~/features/timer/composables/useAnimateTimer";
import useTimer from "~/features/timer/composables/useTimer";

const voiceDigest = "apple";

const {
    useVoicesMock,
    useVoiceDigestMock,
    useSpeakUtteranceMock,
    requestAnimationFrameMock,
    audioPlayMock,
    audioConstructorMock,
    speak,
} = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const voices = ref([{ voiceURI: "oranges" }]);
    const useVoicesMock = vi.fn(() => voices);
    const useVoiceDigestMock = vi.fn(() => ({ value: voiceDigest }));
    const speak = vi.fn();
    const useSpeakUtteranceMock = () => speak;
    const audioPlayMock = vi.fn(() => Promise.resolve());
    const audioConstructorMock = vi.fn();
    class AudioMock {
        constructor() {
            audioConstructorMock();
        }
        async play() {
            await audioPlayMock();
        }
    }
    const requestAnimationFrameMock = vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(() => 0);
    vi.stubGlobal("Audio", AudioMock);

    return {
        speak,
        useVoicesMock,
        useVoiceDigestMock,
        useSpeakUtteranceMock,
        requestAnimationFrameMock,
        audioPlayMock,
        audioConstructorMock,
    };
});

mockNuxtImport("useVoices", () => {
    return useVoicesMock;
});

vi.mock("~/features/timer/composables/useVoiceDigest", () => {
    return { default: useVoiceDigestMock };
});

mockNuxtImport("useSpeakUtterance", () => {
    return useSpeakUtteranceMock;
});

beforeEach(() => {
    clearNuxtState();
    vi.useFakeTimers();
    vi.setSystemTime(0);
    requestAnimationFrameMock.mockReset();
    useVoicesMock.mockClear();
    speak.mockClear();
    audioPlayMock.mockReset();
    audioConstructorMock.mockReset();
});

test("loops the animation function", async () => {
    const { interval, playing } = useTimer();
    interval.value = { duration: 1000, id: "123" } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    animateTimer();

    expect(requestAnimationFrameMock).toHaveBeenCalledOnce();
    expect(requestAnimationFrameMock).toHaveBeenCalledWith(animateTimer);
});

test("stops the animation when no interval is selected", async () => {
    const { interval, playing } = useTimer();
    interval.value = undefined;
    playing.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    animateTimer();

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
});

test("stops the animation when timer is not playing", async () => {
    const { interval, playing } = useTimer();
    interval.value = { duration: 1000, id: "123" } as never;
    playing.value = false;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    animateTimer();

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
});

test("stops the animation when the last interval of current timer completed and emits the finish event", async () => {
    const emit = vi.fn();
    const { interval, playing, intervalStartTime } = useTimer();

    intervalStartTime.value = 1000;
    interval.value = { duration: 1000, id: "123", repeatCount: 1 } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(emit, 3, ["appleoranges"]);
    vi.setSystemTime(3000);

    animateTimer();

    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    expect(emit).toHaveBeenCalledOnce();
    expect(emit).toHaveBeenCalledWith("finish");
    expect(audioConstructorMock).toHaveBeenCalledOnce();
    expect(audioPlayMock).toHaveBeenCalledOnce();
});

test("should not play audio at the end of the timer if muted", async () => {
    const emit = vi.fn();
    const { interval, playing, intervalStartTime, mute } = useTimer();

    intervalStartTime.value = 1000;
    interval.value = { duration: 1000, id: "123", repeatCount: 1 } as never;
    playing.value = true;
    mute.value = true;

    const animateTimer = useAnimateTimer(emit, 3, ["appleoranges"]);
    vi.setSystemTime(3000);

    animateTimer();

    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(audioPlayMock).not.toHaveBeenCalled();
});

test("should move on to the next interval if the current interval has completed", async () => {
    const emit = vi.fn();
    const { interval, playing, intervalStartTime, progress, repetition } = useTimer();

    intervalStartTime.value = 1000;
    interval.value = { duration: 1000, id: "123", repeatCount: 2 } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(emit, 3, ["appleoranges"]);
    vi.setSystemTime(3000);

    animateTimer();

    expect(intervalStartTime.value).toBe(3000);
    expect(progress.value).toBe(0);
    expect(repetition.value).toBe(2);
});

test("should play audio when a beat pattern is specified and the next beat is reached (accented)", async () => {
    const { interval, playing } = useTimer();
    interval.value = { duration: 1000, id: "123", beatPattern: ["high", "low", "pause"] } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(audioPlayMock).not.toHaveBeenCalled();

    animateTimer();

    expect(audioConstructorMock).toHaveBeenCalledOnce();
    expect(audioPlayMock).toHaveBeenCalledOnce();

    animateTimer();

    expect(audioConstructorMock).toHaveBeenCalledOnce();
    expect(audioPlayMock).toHaveBeenCalledOnce();
});

test("should play audio when a beat pattern is specified and the next beat is reached (normal)", async () => {
    const { interval, playing } = useTimer();
    interval.value = { duration: 1000, id: "123", beatPattern: ["low", "low", "pause"] } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(audioPlayMock).not.toHaveBeenCalled();

    animateTimer();

    expect(audioConstructorMock).toHaveBeenCalledOnce();
    expect(audioPlayMock).toHaveBeenCalledOnce();
});

test("should not play audio when a beat pattern is specified but the timer is muted", async () => {
    const { interval, playing, mute } = useTimer();
    interval.value = { duration: 1000, id: "123", beatPattern: ["high", "low", "pause"] } as never;
    playing.value = true;
    mute.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(audioPlayMock).not.toHaveBeenCalled();

    animateTimer();

    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(audioPlayMock).not.toHaveBeenCalled();
});

test("should play audio when the interval title changes", async () => {
    const { interval, playing } = useTimer();
    interval.value = { duration: 1000, id: "123", title: "bananas" } as never;
    playing.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    expect(speak).not.toHaveBeenCalled();

    animateTimer();

    await nextTick();
    vi.advanceTimersToNextTimer();

    expect(speak).toHaveBeenCalledOnce();
    expect(speak).toHaveBeenCalledWith("bananas", "oranges");
});

test("should not play audio when the interval title changes but the timer is muted", async () => {
    const { interval, playing, mute } = useTimer();
    interval.value = { duration: 1000, id: "123", title: "bananas" } as never;
    playing.value = true;
    mute.value = true;

    const animateTimer = useAnimateTimer(() => undefined, 3, ["appleoranges"]);

    expect(speak).not.toHaveBeenCalled();

    animateTimer();

    await nextTick();
    vi.advanceTimersToNextTimer();

    expect(speak).not.toHaveBeenCalled();
});

test("should stop playback if the round changes and is past the last one", async () => {
    const { interval, playing, round } = useTimer();
    interval.value = { duration: 1000, id: "123" } as never;
    playing.value = true;

    useAnimateTimer(() => undefined, 1, ["appleoranges"]);
    round.value = 2;
    await nextTick();
    expect(playing.value).toBe(false);
});

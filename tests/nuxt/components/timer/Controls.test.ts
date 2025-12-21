import Controls from "@@/app/components/timer/Controls.vue";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";

const stubs = { UTooltip };

const useTimerMock = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const round = ref(2);
    const playing = ref(false);
    const mute = ref(false);
    const reset = vi.fn();
    return vi.fn(() => ({ reset, round, playing, mute }));
});

mockNuxtImport("useTimer", async () => {
    return useTimerMock;
});

beforeEach(() => {
    const { round, playing, mute } = useTimerMock();
    round.value = 2;
    playing.value = false;
    mute.value = false;
    vi.resetAllMocks();
});

test("should have control elements with the correct aria labels", async () => {
    const wrapper = await mountSuspended(Controls, {
        scoped: true,
        global: { stubs },
        props: { rounds: 3 },
    });
    const resetButton = wrapper.findByTestId("timer-controls-reset-button");
    const playButton = wrapper.findByTestId("timer-controls-play-button");
    const pauseButton = wrapper.findByTestId("timer-controls-pause-button");
    const muteButton = wrapper.findByTestId("timer-controls-mute-button");
    const unmuteButton = wrapper.findByTestId("timer-controls-unmute-button");
    expect(resetButton.attributes("aria-label")).toBe("ui.reset");
    expect(playButton.attributes("aria-label")).toBe("ui.start");
    expect(pauseButton.exists()).toBe(false);
    expect(muteButton.attributes("aria-label")).toBe("ui.mute");
    expect(unmuteButton.exists()).toBe(false);
});

test("should have control elements that control the timer store", async () => {
    const wrapper = await mountSuspended(Controls, {
        scoped: true,
        global: { stubs },
        props: { rounds: 3 },
    });
    const { playing, round, mute, reset } = useTimerMock();

    const makeAssertions = (...params: [boolean, number, boolean, number]) => {
        expect(playing.value).toBe(params[0]);
        expect(round.value).toBe(params[1]);
        expect(mute.value).toBe(params[2]);
        expect(reset).toHaveBeenCalledTimes(params[3]);
    };

    makeAssertions(false, 2, false, 0);
    await wrapper.findByTestId("timer-controls-play-button").trigger("click");
    makeAssertions(true, 2, false, 0);
    await wrapper.findByTestId("timer-controls-pause-button").trigger("click");
    makeAssertions(false, 2, false, 0);
    await wrapper.findByTestId("timer-controls-mute-button").trigger("click");
    makeAssertions(false, 2, true, 0);
    await wrapper.findByTestId("timer-controls-unmute-button").trigger("click");
    makeAssertions(false, 2, false, 0);
    wrapper.findByTestId("timer-controls-reset-button").trigger("click");
    makeAssertions(false, 2, false, 1);
    expect(wrapper.emitted()).toHaveProperty("reset");
});

test("should reset the timer when playback has finished and play button is pressed", async () => {
    const wrapper = await mountSuspended(Controls, {
        scoped: true,
        global: { stubs },
        props: { rounds: 1 },
    });
    const { playing, round, mute, reset } = useTimerMock();
    expect(playing.value).toBe(false);
    expect(round.value).toBe(2);
    expect(mute.value).toBe(false);
    expect(reset).not.toHaveBeenCalled();
    expect(wrapper.emitted()).not.toHaveProperty("reset");

    await wrapper.findByTestId("timer-controls-play-button").trigger("click");

    expect(playing.value).toBe(true);
    expect(mute.value).toBe(false);
    expect(reset).toHaveBeenCalledOnce();
    expect(wrapper.emitted()).toHaveProperty("reset");
});

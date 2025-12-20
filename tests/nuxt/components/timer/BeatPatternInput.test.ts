import BeatPatternInput from "@@/app/components/timer/BeatPatternInput.vue";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";

const stubs = { UTooltip };
const props = { beats: ["high", "low", "pause"], barLength: 300 };

const { formFieldColorMock, useFormFieldMock } = await vi.hoisted(async () => {
    const { ref } = await import("vue");
    const formFieldColorMock = ref("default");
    const useFormFieldMock = vi.fn(() => ({
        emitFormChange: vi.fn(),
        color: formFieldColorMock,
    }));

    return {
        formFieldColorMock,
        useFormFieldMock,
    };
});

mockNuxtImport("useFormField", async () => {
    return useFormFieldMock;
});

test("should display the provided beats by default", async () => {
    const wrapper = await mountSuspended(BeatPatternInput, {
        scoped: true,
        props,
        global: { stubs },
    });
    const beatInputs = wrapper.findAll("[data-test-id^='beat-pattern-input-beat']");
    expect(beatInputs).toHaveLength(3);
    expect(beatInputs[0].classes()).toContain("i-mdi:exclamation-thick");
    expect(beatInputs[0].classes()).toContain("bg-primary");
    expect(beatInputs[1].classes()).toContain("i-mdi:music-note-quarter");
    expect(beatInputs[1].classes()).not.toContain("bg-primary");
    expect(beatInputs[2].classes()).toContain("i-mdi:music-rest-quarter");
    expect(beatInputs[2].classes()).not.toContain("bg-primary");
});

test("should allow adding and deleting items with the control buttons", async () => {
    const wrapper = await mountSuspended(BeatPatternInput, {
        scoped: true,
        props,
        global: { stubs },
    });
    const addAccent = wrapper.findByTestId("beat-pattern-input-add-accent-button");
    await addAccent.trigger("click");
    const addBeat = wrapper.findByTestId("beat-pattern-input-add-beat-button");
    await addBeat.trigger("click");
    const addPause = wrapper.findByTestId("beat-pattern-input-add-pause-button");
    await addPause.trigger("click");
    const del = wrapper.findByTestId("beat-pattern-input-delete-button");
    await del.trigger("click");

    expect(addAccent.attributes("aria-label")).toBe("timer.form.interval.addAccent");
    expect(addBeat.attributes("aria-label")).toBe("timer.form.interval.addBeat");
    expect(addPause.attributes("aria-label")).toBe("timer.form.interval.addPause");
    expect(del.attributes("aria-label")).toBe("timer.form.interval.deleteBeat");
    expect(wrapper.emitted("update:beats")).toEqual([
        [["high", "low", "pause", "high"]],
        [["high", "low", "pause", "low"]],
        [["high", "low", "pause", "pause"]],
        [["high", "low"]],
    ]);
});

test("should loop the current beat pattern when clicking the play button", async () => {
    let now = 0;

    const dateNowSpy = vi.spyOn(Date, "now").mockImplementation(() => now);

    const rafQueue: FrameRequestCallback[] = [];
    const rafSpy = vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(cb => {
        rafQueue.push(cb);
        return 0;
    });

    const wrapper = await mountSuspended(BeatPatternInput, {
        scoped: true,
        props,
        global: { stubs },
    });

    const playButton = wrapper.findByTestId("beat-pattern-input-play-button");
    expect(playButton.attributes("aria-label")).toBe("ui.play");

    const getBeats = () => wrapper.findAll("[data-test-id^='beat-pattern-input-beat']");
    const expectActiveIndex = async (index: number) => {
        await wrapper.vm.$nextTick();
        const beats = getBeats();
        beats.forEach((b, i) => {
            if (i === index) expect(b.classes()).toContain("bg-primary");
            else expect(b.classes()).not.toContain("bg-primary");
        });
    };

    await playButton.trigger("click");
    expect(rafQueue.length).toBeGreaterThan(0);

    const stepFrameTo = async (t: number) => {
        now = t;
        const cb = rafQueue.shift();
        expect(cb).toBeTruthy();
        cb!(now);
        await wrapper.vm.$nextTick();
    };

    await expectActiveIndex(0);

    await stepFrameTo(0);
    await expectActiveIndex(0);

    await stepFrameTo(100);
    await expectActiveIndex(1);

    await stepFrameTo(200);
    await expectActiveIndex(2);

    await stepFrameTo(300);
    await expectActiveIndex(0);

    const pauseButton = wrapper.findByTestId("beat-pattern-input-pause-button");
    expect(pauseButton.attributes("aria-label")).toBe("ui.pause");
    await pauseButton.trigger("click");

    await stepFrameTo(400);
    await expectActiveIndex(0);

    rafSpy.mockRestore();
    dateNowSpy.mockRestore();
});

test("should apply `border-error` when form field color is error", async () => {
    formFieldColorMock.value = "default";

    const wrapper = await mountSuspended(BeatPatternInput, {
        scoped: true,
        props,
        global: { stubs },
    });

    expect(wrapper.classes()).not.toContain("border-error");

    formFieldColorMock.value = "error";
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain("border-error");
});

import useTimer from "@@/app/composables/useTimer";
import { clearNuxtState } from "nuxt/app";
import { beforeEach, expect, it, vi } from "vitest";
import { withSetup } from "~~/test-utils/helpers/nuxt";

beforeEach(() => {
    clearNuxtState();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
});

it("initializes state with expected defaults", async () => {
    const { composable } = await withSetup(() => useTimer());

    expect(composable.progress.value).toBe(0);
    expect(composable.elapsedIntervalTime.value).toBe(0);
    expect(composable.repetition.value).toBe(1);
    expect(composable.round.value).toBe(1);
    expect(composable.playing.value).toBe(false);
    expect(composable.mute.value).toBe(false);
    expect(composable.currentBeat.value).toBe(-1);
    expect(composable.interval.value).toBeUndefined();
    expect(composable.lastIntervalTitleRead.value).toBeUndefined();
    expect(composable.intervalStartTime.value).toBe(Date.now());
});

it("reset(false) resets per-interval fields only", async () => {
    const { composable } = await withSetup(() => useTimer());

    composable.progress.value = 50;
    composable.elapsedIntervalTime.value = 1234;
    composable.repetition.value = 3;
    composable.currentBeat.value = 7;
    composable.playing.value = true;
    composable.round.value = 4;
    composable.lastIntervalTitleRead.value = "foo";
    composable.intervalStartTime.value = 1;

    composable.reset(false);

    expect(composable.progress.value).toBe(0);
    expect(composable.elapsedIntervalTime.value).toBe(0);
    expect(composable.repetition.value).toBe(1);
    expect(composable.currentBeat.value).toBe(-1);
    expect(composable.intervalStartTime.value).toBe(Date.now());
    expect(composable.playing.value).toBe(true);
    expect(composable.round.value).toBe(4);
    expect(composable.lastIntervalTitleRead.value).toBe("foo");
});

it("reset(true) fully resets all fields", async () => {
    const { composable } = await withSetup(() => useTimer());

    composable.progress.value = 10;
    composable.elapsedIntervalTime.value = 222;
    composable.repetition.value = 2;
    composable.currentBeat.value = 1;
    composable.playing.value = true;
    composable.round.value = 9;
    composable.lastIntervalTitleRead.value = "bar";
    composable.intervalStartTime.value = 555;

    composable.reset(true);

    expect(composable.progress.value).toBe(0);
    expect(composable.intervalStartTime.value).toBe(Date.now());
    expect(composable.elapsedIntervalTime.value).toBe(0);
    expect(composable.repetition.value).toBe(1);
    expect(composable.currentBeat.value).toBe(-1);
    expect(composable.playing.value).toBe(false);
    expect(composable.round.value).toBe(1);
    expect(composable.lastIntervalTitleRead.value).toBeUndefined();
});

it("returns the same underlying refs on repeated calls", async () => {
    const { composable: a } = await withSetup(() => useTimer());
    a.progress.value = 42;

    const { composable: b } = await withSetup(() => useTimer());
    expect(b.progress.value).toBe(42);
});

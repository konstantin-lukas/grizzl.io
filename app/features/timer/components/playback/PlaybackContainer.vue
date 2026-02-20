<script setup lang="ts">
import type { Timer } from "#shared/features/timer/validators/timer.validator";
import PlaybackControls from "~/features/timer/components/playback/PlaybackControls.vue";
import PlaybackProgress from "~/features/timer/components/playback/PlaybackProgress.vue";
import useTimer from "~/features/timer/composables/useTimer";

const { timer } = defineProps<{ timer: Timer }>();
const {
    round,
    playing,
    interval,
    progress,
    elapsedIntervalTime,
    currentBeat,
    repetition,
    lastIntervalTitleRead,
    reset,
} = useTimer();

const activeIntervalIndex = ref(0);

const next = () => {
    if (!interval.value) return;
    playing.value = false;
    progress.value = 0;
    elapsedIntervalTime.value = 0;
    currentBeat.value = -1;
    round.value++;
    if (repetition.value < interval.value.repeatCount) {
        repetition.value++;
    } else {
        repetition.value = 1;
        activeIntervalIndex.value++;
    }
};

const previous = () => {
    if (!interval.value || !timer.intervals) return;
    playing.value = false;
    progress.value = 0;
    elapsedIntervalTime.value = 0;
    currentBeat.value = -1;
    if (repetition.value > 1) {
        repetition.value--;
    } else if (activeIntervalIndex.value > 0) {
        repetition.value = timer.intervals[--activeIntervalIndex.value]!.repeatCount;
    } else {
        lastIntervalTitleRead.value = undefined;
    }
    if (round.value > 1) {
        round.value--;
    }
};

watch(
    activeIntervalIndex,
    () => {
        interval.value =
            timer.intervals.length > activeIntervalIndex.value ? timer.intervals[activeIntervalIndex.value] : undefined;
    },
    { immediate: true },
);
const rounds = computed(() => timer.intervals.reduce((prev, curr) => prev + curr.repeatCount, 0));
const duration = computed(() => timer.intervals.reduce((prev, curr) => prev + curr.duration * curr.repeatCount, 0));
</script>

<template>
    <section aria-labelledby="timer-name" class="center w-full">
        <TypoH1 id="timer-name" class="line-clamp-2 w-full text-center" data-test-id="timer-title">
            {{ timer.title }}
        </TypoH1>
        <div class="relative h-6 w-full" aria-live="polite">
            <Transition name="swipe" mode="out-in">
                <span
                    id="interval-title"
                    :key="interval?.id"
                    data-test-id="interval-title"
                    class="block w-full overflow-hidden text-center text-xl leading-tight text-nowrap text-ellipsis text-neutral-600 uppercase sm:text-2xl dark:text-neutral-400"
                >
                    {{ interval?.title }}
                </span>
            </Transition>
        </div>
        <PlaybackProgress
            :timer
            :rounds
            :duration
            :index="activeIntervalIndex"
            @finish="
                activeIntervalIndex++;
                reset();
            "
        />
        <PlaybackControls
            :rounds
            @reset="
                activeIntervalIndex = 0;
                reset(true);
            "
            @next="next()"
            @previous="previous()"
        />
    </section>
</template>

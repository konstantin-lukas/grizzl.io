<script setup lang="ts">
import { Beat } from "#shared/features/timer/enums/beat.enum";
import type { Timer } from "#shared/features/timer/validators/timer.validator";
import { intervalToDuration } from "date-fns";
import useAnimateTimer from "~/features/timer/composables/useAnimateTimer";
import useTimer from "~/features/timer/composables/useTimer";

const emit = defineEmits(["finish"]);
const props = defineProps<{
    rounds: number;
    voiceUri: string | null;
    timer: Timer;
    index: number;
}>();

useAnimateTimer(emit, props.rounds, props.voiceUri);
const { progress, elapsedIntervalTime, round, interval, repetition } = useTimer();

const formatDuration = (elapsed: number, max?: number) => {
    if (!max) return "––:––";
    const d = intervalToDuration({ start: 0, end: max - elapsed });
    const zeroPad = (n?: number) => String(n ?? 0).padStart(2, "0");
    return `${zeroPad(d.minutes)}:${zeroPad(d.seconds)}`;
};

const remainingTimeInInterval = computed(() => formatDuration(elapsedIntervalTime.value, interval.value?.duration));
const remainingTime = computed(() =>
    formatDuration(
        props.timer.intervals.slice(0, props.index + 1).reduce((prev, { duration, repeatCount }, currentIndex) => {
            if (currentIndex === props.index) {
                return prev + elapsedIntervalTime.value + duration * (repetition.value - 1);
            }
            return prev + duration * repeatCount;
        }, 0),
        props.timer.intervals.reduce((prev, { duration, repeatCount }) => prev + duration * repeatCount, 0),
    ),
);
const activeRound = computed(() => {
    if (round.value > props.rounds) return "–/–";
    return `${round.value}/${props.rounds}`;
});
const backgroundImage = computed(() => `conic-gradient(var(--ui-primary) ${progress.value}turn, var(--ui-border) 0)`);
const transform = computed(() => `rotate(${progress.value}turn)`);

const baseClass = tw`absolute text-xl text-neutral-600 sm:text-2xl dark:text-neutral-400`;
</script>

<template>
    <div
        class="relative mx-auto my-12 aspect-square w-[90%] max-w-96 overflow-hidden rounded-full xs:w-full"
        role="progressbar"
        :aria-valuemin="0"
        :aria-valuemax="interval?.duration ?? 0"
        :aria-valuenow="elapsedIntervalTime"
        aria-labelledby="interval-title"
    >
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span
                class="center relative aspect-square w-[calc(100%-2.5rem)] scale-[calc(1/1.1)] rounded-full bg-back text-4xl xs:w-[calc(100%-3rem)] xs:text-5xl sm:text-6xl"
            >
                <span
                    class="bottom-[calc(50%+1.25rem)] xs:bottom-[calc(50%+1.5rem)] sm:bottom-[calc(50%+1.75rem)]"
                    data-test-id="timer-remaining-time"
                    :class="baseClass"
                >
                    {{ remainingTime }}
                </span>
                <span data-test-id="timer-remaining-interval-time">{{ remainingTimeInInterval }}</span>
                <span
                    class="top-[calc(50%+1.25rem)] xs:top-[calc(50%+1.5rem)] sm:top-[calc(50%+1.75rem)]"
                    data-test-id="timer-active-round"
                    :class="baseClass"
                >
                    {{ activeRound }}
                </span>
            </span>
        </div>
        <span
            v-if="interval?.id && elapsedIntervalTime > 0"
            class="absolute top-0 left-1/2 block size-5 -translate-x-1/2 rounded-full bg-primary xs:size-6"
        />
        <div
            v-if="interval?.id && elapsedIntervalTime > 0"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform }"
        >
            <span class="absolute top-0 left-1/2 block size-5 -translate-x-1/2 rounded-full bg-primary xs:size-6" />
        </div>
        <div
            v-for="(beat, i) in interval?.beatPattern"
            :key="i"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform: `rotate(${i / (interval?.beatPattern?.length ?? 1)}turn)` }"
        >
            <span
                v-if="beat !== Beat.PAUSE"
                data-test-id="timer-beat-indicator"
                :class="
                    i / (interval?.beatPattern?.length ?? 1) < progress
                        ? 'border-b-primary'
                        : 'border-b-border-accented'
                "
                class="absolute top-8 left-1/2 block size-0 -translate-x-1/2 border-r-12 border-b-12 border-l-12 border-r-transparent border-l-transparent"
            />
        </div>
    </div>
</template>

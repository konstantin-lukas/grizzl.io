<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import { intervalToDuration } from "date-fns";
import accentedAudio from "~/assets/sound/accented_beat.wav";
import beatAudio from "~/assets/sound/beat.wav";
import beep from "~/assets/sound/intermittent_beep.wav";

const emit = defineEmits(["finish"]);
const props = defineProps<{
    rounds: number;
    voiceUri: string | null;
    duration: number;
}>();

const {
    progress,
    startTime,
    intervalStartTime,
    elapsedIntervalTime,
    elapsedTime,
    repetition,
    round,
    playing,
    mute,
    currentBeat,
    interval,
    lastIntervalTitleRead,
    reset,
} = useTimer();

const speak = useSpeakUtterance();

const formatDuration = (elapsed: number, max?: number) => {
    if (!max) return "––:––";
    const d = intervalToDuration({ start: 0, end: max - elapsed });
    const zeroPad = (n?: number) => String(n ?? 0).padStart(2, "0");
    return `${zeroPad(d.minutes)}:${zeroPad(d.seconds)}`;
};

const remainingTimeInInterval = computed(() => formatDuration(elapsedIntervalTime.value, interval.value?.duration));
const remainingTime = computed(() => formatDuration(elapsedTime.value, props.duration));
const activeRound = computed(() => {
    if (round.value > props.rounds) return "–/–";
    return `${round.value}/${props.rounds}`;
});
const backgroundImage = computed(() => `conic-gradient(var(--ui-primary) ${progress.value}turn, var(--ui-border) 0)`);
const transform = computed(() => `rotate(${progress.value}turn)`);

const animateTimer = () => {
    if (!interval.value?.duration || !interval.value?.id || !playing.value) return;
    elapsedIntervalTime.value = Date.now() - intervalStartTime.value;
    elapsedTime.value = Date.now() - startTime.value;

    if (interval.value.beatPattern && interval.value.beatPattern.length > 0) {
        const barLengthInMs = interval.value.duration;
        const moduloTime = (Date.now() - intervalStartTime.value) % barLengthInMs;
        const beatLength = barLengthInMs / interval.value.beatPattern.length;
        const nextBeat = Math.floor(moduloTime / beatLength);
        if (currentBeat.value < nextBeat) {
            if (interval.value.beatPattern[nextBeat] !== Beat.PAUSE) {
                const beat = new Audio(
                    interval.value.beatPattern[nextBeat] === Beat.ACCENTED ? accentedAudio : beatAudio,
                );
                beat.play();
            }
            currentBeat.value = nextBeat;
        }
    }

    const newProgress = elapsedIntervalTime.value / interval.value.duration;
    if (newProgress >= 1) {
        if (!mute.value) {
            const beat = new Audio(beep);
            beat.play();
        }
        round.value++;
        if (repetition.value === interval.value.repeatCount) {
            emit("finish");
            return;
        }
        progress.value = 0;
        intervalStartTime.value = Date.now();
        repetition.value++;
    }
    progress.value = newProgress;
    requestAnimationFrame(animateTimer);
};

watch(
    () => [interval.value?.title, playing.value] as const,
    ([t, p]) => {
        const voice = props.voiceUri;
        if (t && voice && p && lastIntervalTitleRead.value !== interval.value?.id) {
            setTimeout(() => speak(t, voice), 500);
            lastIntervalTitleRead.value = interval.value?.id;
        }
    },
);

watch(interval, () => {
    reset();
    animateTimer();
});

watch(round, r => {
    if (r > props.rounds) playing.value = false;
});

watch(playing, p => {
    if (p) {
        intervalStartTime.value = Date.now() - elapsedIntervalTime.value;
        startTime.value = Date.now() - elapsedTime.value;
        animateTimer();
    }
});
const baseClass = tw`absolute text-xl text-neutral-600 sm:text-2xl dark:text-neutral-400`;
</script>

<template>
    <div class="relative mx-auto my-16 aspect-square w-[90%] max-w-96 overflow-hidden rounded-full xs:w-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span
                class="center relative aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] rounded-full bg-back text-4xl xs:w-[calc(100%-3rem)] xs:text-5xl sm:text-6xl"
            >
                <span
                    class="bottom-[calc(50%+1.25rem)] xs:bottom-[calc(50%+1.5rem)] sm:bottom-[calc(50%+1.75rem)]"
                    :class="baseClass"
                >
                    {{ remainingTime }}
                </span>
                <span>{{ remainingTimeInInterval }}</span>
                <span
                    class="top-[calc(50%+1.25rem)] xs:top-[calc(50%+1.5rem)] sm:top-[calc(50%+1.75rem)]"
                    :class="baseClass"
                >
                    {{ activeRound }}
                </span>
            </span>
        </div>
        <span
            v-if="interval?.id && elapsedIntervalTime > 0"
            class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6"
        />
        <div
            v-if="interval?.id && elapsedIntervalTime > 0"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform }"
        >
            <span class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6" />
        </div>
        <div
            v-for="(beat, index) in interval?.beatPattern"
            :key="index"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform: `rotate(${index / (interval?.beatPattern?.length ?? 1)}turn)` }"
        >
            <span
                v-if="beat !== Beat.PAUSE"
                :class="
                    index / (interval?.beatPattern?.length ?? 1) < progress
                        ? 'border-b-primary'
                        : 'border-b-border-accented'
                "
                class="absolute top-8 left-1/2 block size-0 -translate-x-1/2 border-r-12 border-b-12 border-l-12 border-r-transparent border-l-transparent"
            />
        </div>
    </div>
</template>

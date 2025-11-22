<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";
import { intervalToDuration } from "date-fns";

const props = defineProps<{ interval?: Timer["intervals"][number]; rounds: number; voiceUri: string | null }>();
const emit = defineEmits(["finish"]);
const { progress, startTime, elapsedTime, repetition, round, playing, reset } = useTimer(props.interval?.duration);

const time = computed(() => {
    if (!props.interval?.duration) return "––:––";
    const d = intervalToDuration({ start: 0, end: props.interval.duration - elapsedTime.value });
    const zeroPad = (n?: number) => String(n ?? 0).padStart(2, "0");
    return `${zeroPad(d.minutes)}:${zeroPad(d.seconds)}`;
});

const speak = useSpeakUtterance();

const activeRound = computed(() => {
    if (round.value > props.rounds) return "–/–";
    return `${round.value}/${props.rounds}`;
});

const backgroundImage = computed(() => `conic-gradient(var(--ui-primary) ${progress.value}turn, var(--ui-border) 0)`);
const transform = computed(() => `rotate(${progress.value}turn)`);

const lastIntervalTitleRead = ref<string | undefined>(undefined);

watch(
    () => [props.interval?.title, playing.value] as const,
    ([t, p]) => {
        const voice = props.voiceUri;
        if (t && voice && p && lastIntervalTitleRead.value !== props.interval?.id) {
            speak(t, voice);
            lastIntervalTitleRead.value = props.interval?.id;
        }
    },
);

const animateTimer = () => {
    if (!props.interval?.duration || !props.interval?.id || !playing.value) return;
    elapsedTime.value = Date.now() - startTime.value;
    const newProgress = elapsedTime.value / props.interval.duration;
    if (newProgress >= 1) {
        round.value++;
        if (repetition.value === props?.interval.repeatCount) {
            emit("finish");
            return;
        }
        progress.value = 0;
        startTime.value = Date.now();
        repetition.value++;
    }
    progress.value = newProgress;
    requestAnimationFrame(animateTimer);
};

watch(props, () => {
    reset();
    animateTimer();
});

watch(round, r => {
    if (r > props.rounds) playing.value = false;
});

watch(playing, p => {
    if (p) {
        startTime.value = Date.now() - elapsedTime.value;
        animateTimer();
    }
});
</script>

<template>
    <div class="relative mx-auto my-16 aspect-square w-full max-w-96 overflow-hidden rounded-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span
                class="center relative aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] rounded-full bg-back text-4xl xs:w-[calc(100%-3rem)] xs:text-5xl sm:text-6xl"
            >
                <span>{{ time }}</span>
                <span
                    class="absolute top-[calc(50%+1.25rem)] text-xl text-neutral-600 xs:top-[calc(50%+1.5rem)] sm:top-[calc(50%+1.75rem)] sm:text-2xl dark:text-neutral-400"
                    >{{ activeRound }}</span
                >
            </span>
        </div>
        <span
            v-if="props.interval?.id && elapsedTime > 0"
            class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6"
        />
        <div
            v-if="props.interval?.id && elapsedTime > 0"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform }"
        >
            <span class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6" />
        </div>
    </div>
</template>

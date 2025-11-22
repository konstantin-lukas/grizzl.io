<script setup lang="ts">
import { intervalToDuration } from "date-fns";

const props = defineProps<{ duration?: number; id?: string; repetitions?: number }>();
const emit = defineEmits(["finish"]);
const { progress, startTime, elapsedTime, repetition, reset } = useTimer(props.duration);

const time = computed(() => {
    if (!props.duration) return "––:––";
    const d = intervalToDuration({ start: 0, end: props.duration - elapsedTime.value });
    const zeroPad = (n?: number) => String(n ?? 0).padStart(2, "0");
    return `${zeroPad(d.minutes)}:${zeroPad(d.seconds)}`;
});

const backgroundImage = computed(() => `conic-gradient(var(--ui-primary) ${progress.value}turn, var(--ui-border) 0)`);
const transform = computed(() => `rotate(${progress.value}turn)`);

watch(
    props,
    () => {
        reset();
        const animateTimer = () => {
            if (!props.duration || !props.id) return;
            elapsedTime.value = Date.now() - startTime.value;
            const newProgress = elapsedTime.value / props.duration;
            if (newProgress >= 1) {
                if (repetition.value === props?.repetitions) {
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
        animateTimer();
    },
    { immediate: true },
);
</script>

<template>
    <div class="relative mx-auto my-16 aspect-square w-full max-w-96 overflow-hidden rounded-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span
                class="center aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] rounded-full bg-back text-4xl xs:w-[calc(100%-3rem)] xs:text-5xl sm:text-6xl"
            >
                {{ time }}
            </span>
        </div>
        <span
            v-if="props.id"
            class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6"
        />
        <div
            v-if="props.id"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform }"
        >
            <span class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary xs:size-6" />
        </div>
    </div>
</template>

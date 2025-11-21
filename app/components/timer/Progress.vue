<script setup lang="ts">
import { intervalToDuration } from "date-fns";

const props = defineProps<{ duration?: number; id?: string }>();
const emit = defineEmits(["finish"]);
const ringProgress = ref(0 / (props.duration ?? 1));
const startTime = ref(Date.now());
const elapsedTime = ref(0);

const progress = computed(() => {
    const d = intervalToDuration({ start: 0, end: elapsedTime.value });
    const zeroPad = (n?: number) => String(n ?? 0).padStart(2, "0");
    return `${zeroPad(d.minutes)}:${zeroPad(d.seconds)}`;
});

const backgroundImage = computed(
    () => `conic-gradient(var(--ui-primary) ${ringProgress.value}turn, var(--ui-border) 0)`,
);
const transform = computed(() => `rotate(${ringProgress.value}turn)`);

watch(
    props,
    () => {
        const animateTimer = () => {
            if (!props.duration || !props.id) return;
            elapsedTime.value = Date.now() - startTime.value;
            const progress = elapsedTime.value / props.duration;
            if (progress >= 1) {
                startTime.value = Date.now();
                ringProgress.value = 0;
                elapsedTime.value = 0;
                emit("finish");
                return;
            }
            ringProgress.value = progress;
            requestAnimationFrame(animateTimer);
        };
        animateTimer();
    },
    { immediate: true },
);
</script>

<template>
    <div class="relative my-16 aspect-square w-full overflow-hidden rounded-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span class="center aspect-square w-[calc(100%-3rem)] scale-[calc(1/1.1)] rounded-full bg-back text-6xl">
                {{ progress }}
            </span>
        </div>
        <span v-if="props.id" class="absolute top-0 left-1/2 block size-6 -translate-x-1/2 rounded-full bg-primary" />
        <div
            v-if="props.id"
            class="pointer-events-none absolute top-0 left-0 aspect-square w-full"
            :style="{ transform }"
        >
            <span class="absolute top-0 left-1/2 block size-6 -translate-x-1/2 rounded-full bg-primary" />
        </div>
    </div>
</template>

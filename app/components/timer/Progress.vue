<script setup lang="ts">
const props = defineProps<{ duration: number }>();
const ringProgress = ref(0 / props.duration);
const startTime = ref(Date.now());

const backgroundImage = computed(
    () => `conic-gradient(var(--ui-primary) ${ringProgress.value}turn, var(--ui-border) 0)`,
);
const transform = computed(() => `rotate(${ringProgress.value}turn)`);

onMounted(() => {
    const animateTimer = () => {
        const progress = (Date.now() - startTime.value) / props.duration;
        const reset = progress >= 1;
        ringProgress.value = reset ? 0 : progress;
        if (reset) startTime.value = Date.now();
        requestAnimationFrame(animateTimer);
    };
    animateTimer();
});
</script>

<template>
    <div class="relative my-16 aspect-square w-full overflow-hidden rounded-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span class="center aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] rounded-full bg-back text-6xl">
                {{ duration }}
            </span>
        </div>
        <span class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary" />
        <div class="pointer-events-none absolute top-0 left-0 aspect-square w-full" :style="{ transform }">
            <span class="absolute top-0 left-1/2 block size-4 -translate-x-1/2 rounded-full bg-primary" />
        </div>
    </div>
</template>

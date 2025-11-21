<script setup lang="ts">
const props = defineProps<{ duration: number }>();
const ringProgress = ref(0 / props.duration);
const startTime = ref(Date.now());

const backgroundImage = computed(
    () => `conic-gradient(var(--ui-primary) ${ringProgress.value * 360}deg, var(--ui-border) 0)`,
);

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
    <div class="my-16 aspect-square w-full overflow-hidden rounded-full">
        <div class="center aspect-square w-full scale-110 bg-primary" :style="{ backgroundImage }">
            <span class="center aspect-square w-[calc(100%-2rem)] scale-[calc(1/1.1)] rounded-full bg-back text-6xl">
                {{ duration }}
            </span>
        </div>
    </div>
</template>

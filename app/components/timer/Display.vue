<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const { timer } = defineProps<{ timer: Timer }>();
const activeIntervalIndex = ref(0);
const activeTimer = computed(() => {
    return timer.intervals.length > activeIntervalIndex.value ? timer.intervals[activeIntervalIndex.value] : null;
});
</script>

<template>
    <section aria-labelledby="timer-name" class="w-full">
        <TypoH1 id="timer-name">{{ timer.title }}</TypoH1>
        <TimerProgress :id="activeTimer?.id" :duration="activeTimer?.duration" @finish="activeIntervalIndex++" />
        <TimerControls @reset="activeIntervalIndex = 0" />
    </section>
</template>

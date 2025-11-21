<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const emit = defineEmits(["close"]);

const { timer } = defineProps<{ timer: Timer }>();
const activeIntervalIndex = ref(0);
const activeInterval = computed(() => {
    return timer.intervals.length > activeIntervalIndex.value ? timer.intervals[activeIntervalIndex.value] : null;
});
</script>

<template>
    <section aria-labelledby="timer-name" class="w-full">
        <TypoH1 id="timer-name">{{ timer.title }}</TypoH1>
        <Transition name="swipe">
            <TypoH2 v-if="activeInterval?.title" class="line-clamp-1 text-neutral-600 dark:text-neutral-400">
                {{ activeInterval?.title }}
            </TypoH2>
        </Transition>
        <TimerProgress :id="activeInterval?.id" :duration="activeInterval?.duration" @finish="activeIntervalIndex++" />
        <TimerControls @reset="activeIntervalIndex = 0" @close="emit('close')" />
    </section>
</template>

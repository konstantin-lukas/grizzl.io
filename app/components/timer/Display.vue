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
        <TypoH1 id="timer-name" class="line-clamp-2 w-full text-center">{{ timer.title }}</TypoH1>
        <div class="h-6 w-full">
            <Transition name="swipe" mode="out-in">
                <TypoH2
                    :key="activeInterval?.id"
                    class="line-clamp-1 w-full text-center text-neutral-600 dark:text-neutral-400"
                >
                    {{ activeInterval?.title }}
                </TypoH2>
            </Transition>
        </div>
        <TimerProgress
            :id="activeInterval?.id"
            :duration="activeInterval?.duration"
            :repetitions="activeInterval?.repeatCount"
            @finish="activeIntervalIndex++"
        />
        <TimerControls @reset="activeIntervalIndex = 0" @close="emit('close')" />
    </section>
</template>

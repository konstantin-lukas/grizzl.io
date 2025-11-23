<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const { timer } = defineProps<{ timer: Timer }>();
const { interval } = useTimer();

const activeIntervalIndex = ref(0);
watch(
    activeIntervalIndex,
    () => {
        interval.value =
            timer.intervals.length > activeIntervalIndex.value ? timer.intervals[activeIntervalIndex.value] : undefined;
    },
    { immediate: true },
);
const rounds = computed(() => timer.intervals.reduce((prev, curr) => prev + curr.repeatCount, 0));
const duration = computed(() => timer.intervals.reduce((prev, curr) => prev + curr.duration * curr.repeatCount, 0));
</script>

<template>
    <section aria-labelledby="timer-name" class="center min-h-main-height-no-padding w-full">
        <TypoH1 id="timer-name" class="line-clamp-2 w-full text-center">{{ timer.title }}</TypoH1>
        <div class="h-6 w-full">
            <Transition name="swipe" mode="out-in">
                <TypoH2
                    :key="interval?.id"
                    class="line-clamp-1 w-full text-center text-neutral-600 dark:text-neutral-400"
                >
                    {{ interval?.title }}
                </TypoH2>
            </Transition>
        </div>
        <TimerProgress :rounds :voice-uri="timer.ttsVoice" :duration @finish="activeIntervalIndex++" />
        <TimerControls :rounds @reset="activeIntervalIndex = 0" />
    </section>
</template>

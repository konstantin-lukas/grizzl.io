<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";

const { timer } = defineProps<{ timer: Timer }>();
const { interval } = useTimer();
const ttsVoices = useVoices();

const activeIntervalIndex = ref(0);
const displayWarning = computed(
    () =>
        ttsVoices.value.length > 0 &&
        typeof timer.ttsVoice === "string" &&
        ttsVoices.value.every(({ voiceURI }) => voiceURI !== timer.ttsVoice),
);

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
    <section aria-labelledby="timer-name" class="center w-full">
        <TypoH1 id="timer-name" class="line-clamp-2 w-full text-center">{{ timer.title }}</TypoH1>
        <div class="relative h-6 w-full" :aria-live="timer.ttsVoice && !displayWarning ? 'off' : 'polite'">
            <Transition name="swipe" mode="out-in">
                <TypoH2
                    :key="interval?.id"
                    class="w-full overflow-hidden text-center text-ellipsis text-neutral-600 dark:text-neutral-400"
                >
                    {{ interval?.title }}
                </TypoH2>
            </Transition>
        </div>
        <div v-if="displayWarning" class="mt-8">
            <UAlert
                color="warning"
                class="mx-auto"
                variant="subtle"
                :title="$t('timer.ttsUnavailableTitle')"
                :description="$t('timer.ttsUnavailableDescription')"
                icon="heroicons:exclamation-triangle"
            />
        </div>
        <TimerProgress :rounds :voice-uri="timer.ttsVoice" :duration @finish="activeIntervalIndex++" />
        <TimerControls :rounds @reset="activeIntervalIndex = 0" />
    </section>
</template>

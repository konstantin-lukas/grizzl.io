<script setup lang="ts">
import type { Timer } from "#shared/features/timer/validators/timer.validator";
import PlaybackControls from "~/features/timer/components/playback/PlaybackControls.vue";
import PlaybackProgress from "~/features/timer/components/playback/PlaybackProgress.vue";
import useTimer from "~/features/timer/composables/useTimer";

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
        <TypoH1 id="timer-name" class="line-clamp-2 w-full text-center" data-test-id="timer-title">
            {{ timer.title }}
        </TypoH1>
        <div class="relative h-6 w-full" :aria-live="timer.ttsVoice && !displayWarning ? 'off' : 'polite'">
            <Transition name="swipe" mode="out-in">
                <span
                    id="interval-title"
                    :key="interval?.id"
                    data-test-id="interval-title"
                    class="block w-full overflow-hidden text-center text-xl leading-tight text-nowrap text-ellipsis text-neutral-600 uppercase sm:text-2xl dark:text-neutral-400"
                >
                    {{ interval?.title }}
                </span>
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
        <PlaybackProgress
            :timer
            :rounds
            :voice-uri="timer.ttsVoice"
            :duration
            :index="activeIntervalIndex"
            @finish="activeIntervalIndex++"
        />
        <PlaybackControls :rounds @reset="activeIntervalIndex = 0" />
    </section>
</template>

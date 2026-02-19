<script setup lang="ts">
import useTimer from "~/features/timer/composables/useTimer";

const emit = defineEmits(["reset"]);
const props = defineProps<{ rounds: number }>();

const { reset, round, playing, mute } = useTimer();
const { request, release } = useWakeLock();

watch(playing, p => {
    if (p) request();
    else release();
});

const togglePlayback = () => {
    playing.value = !playing.value;
    if (round.value > props.rounds && playing.value) {
        emit("reset");
        reset(true);
        playing.value = true;
    }
};
</script>

<template>
    <div class="grid max-w-96 grid-cols-6 gap-6 not-xs:w-[90%] sm:flex sm:grid-cols-5">
        <Button
            size="xl"
            icon="heroicons:arrow-small-left"
            class="col-span-3 justify-center not-sm:order-4"
            :aria-label="$t('ui.previous')"
            variant="subtle"
            data-test-id="timer-controls-previous-button"
        />
        <Button
            size="xl"
            class="col-span-2 flex justify-center not-sm:order-1"
            icon="heroicons:arrow-path-16-solid"
            :aria-label="$t('ui.reset')"
            data-test-id="timer-controls-reset-button"
            @click="
                () => {
                    emit('reset');
                    reset(true);
                }
            "
        />
        <Button
            size="xl"
            class="col-span-2 flex justify-center not-sm:order-2"
            :icon="playing ? 'heroicons:pause-solid' : 'heroicons:play-solid'"
            :aria-label="playing ? $t('ui.pause') : $t('ui.start')"
            :data-test-id="`timer-controls-${playing ? 'pause' : 'play'}-button`"
            @click="togglePlayback"
        />
        <Button
            size="xl"
            class="col-span-2 flex justify-center not-sm:order-3"
            :icon="mute ? 'heroicons:speaker-x-mark' : 'heroicons:speaker-wave'"
            :aria-label="mute ? $t('ui.unmute') : $t('ui.mute')"
            :data-test-id="`timer-controls-${mute ? 'unmute' : 'mute'}-button`"
            :color="mute ? 'neutral' : 'primary'"
            @click="mute = !mute"
        />
        <Button
            size="xl"
            class="col-span-3 flex justify-center not-sm:order-5"
            icon="heroicons:arrow-small-right"
            :aria-label="$t('ui.next')"
            variant="subtle"
            data-test-id="timer-controls-next-button"
        />
    </div>
</template>

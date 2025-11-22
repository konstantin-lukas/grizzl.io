<script setup lang="ts">
const emit = defineEmits(["reset"]);
const props = defineProps<{ rounds: number }>();
const { reset, round, playing, mute } = useTimer();
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
    <div class="flex justify-center gap-6">
        <Button
            size="xl"
            :icon="playing ? 'heroicons:pause-solid' : 'heroicons:play-solid'"
            aria-label="Start"
            @click="togglePlayback"
        />
        <Button
            size="xl"
            icon="heroicons:arrow-path-16-solid"
            aria-label="Reset"
            variant="subtle"
            @click="
                () => {
                    emit('reset');
                    reset(true);
                }
            "
        />
        <Button
            size="xl"
            :icon="mute ? 'heroicons:speaker-x-mark' : 'heroicons:speaker-wave'"
            :aria-label="mute ? 'Unmute beeps' : 'Mute beeps'"
            variant="subtle"
            :color="mute ? 'neutral' : 'primary'"
            @click="mute = !mute"
        />
    </div>
</template>

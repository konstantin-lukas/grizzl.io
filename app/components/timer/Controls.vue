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
            icon="heroicons:arrow-path-16-solid"
            :aria-label="$t('ui.reset')"
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
            :icon="playing ? 'heroicons:pause-solid' : 'heroicons:play-solid'"
            :aria-label="playing ? $t('ui.pause') : $t('ui.start')"
            @click="togglePlayback"
        />
        <Button
            size="xl"
            :icon="mute ? 'heroicons:speaker-x-mark' : 'heroicons:speaker-wave'"
            :aria-label="mute ? $t('ui.unmute') : $t('ui.mute')"
            variant="subtle"
            :color="mute ? 'neutral' : 'primary'"
            @click="mute = !mute"
        />
    </div>
</template>

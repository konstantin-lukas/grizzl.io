<script setup lang="ts">
const emit = defineEmits(["reset", "close"]);
const props = defineProps<{ rounds: number }>();
const { reset, round, playing } = useTimer();
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
            @click="
                () => {
                    emit('reset');
                    reset(true);
                }
            "
        />
        <Button
            size="xl"
            icon="heroicons:arrow-uturn-left-16-solid"
            aria-label="Close"
            @click="
                () => {
                    emit('close');
                    reset(true);
                }
            "
        />
    </div>
</template>

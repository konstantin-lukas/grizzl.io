<script setup lang="ts">
const emit = defineEmits(["reset", "close"]);
const { reset } = useTimer();
</script>

<template>
    <div class="flex justify-center gap-6">
        <Button size="xl" icon="heroicons:play-solid" aria-label="Start" />
        <Button
            size="xl"
            icon="heroicons:arrow-path-16-solid"
            aria-label="Reset"
            @click="
                () => {
                    emit('reset');
                    reset();
                }
            "
        />
        <Button size="xl" icon="heroicons:arrow-uturn-left-16-solid" aria-label="Close" @click="emit('close')" />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["reset"]);
</script>

<template>
    <div class="flex gap-4">
        <Button icon="heroicons:play-solid" aria-label="Start" />
        <Button icon="heroicons:arrow-path-16-solid" aria-label="Reset" @click="emit('reset')" />
    </div>
</template>

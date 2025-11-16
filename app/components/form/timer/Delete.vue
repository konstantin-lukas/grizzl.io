<script setup lang="ts">
const props = defineProps<{ timer: { id: string; title: string } | undefined }>();
const { refresh } = useTimers();
const execute = useSoftDelete(`/api/timers/${props.timer?.id}`, refresh);
</script>

<template>
    <Button aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" @click="execute" />
</template>

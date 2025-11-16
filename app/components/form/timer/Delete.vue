<script setup lang="ts">
const props = defineProps<{ timer: { id: string; title: string } | undefined }>();
const execute = useSoftDelete(`/api/timers/${props.timer?.id}`, async () => {
    await refreshNuxtData("/api/timers");
});
</script>

<template>
    <Button aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" @click="execute" />
</template>

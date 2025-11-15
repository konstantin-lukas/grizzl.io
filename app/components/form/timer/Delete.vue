<script setup lang="ts">
import useTimers from "~/composables/useTimers";

const props = defineProps<{ timer: { id: string; title: string } | undefined }>();

const { timers } = useTimers();
const { execute } = useUndoableAction({
    action: async () => {
        await $fetch(`/api/timers/${props.timer!.id}`, { method: "DELETE" });
    },
    onSuccess: () => {
        timers.value = timers.value?.filter(timer => timer.id !== props.timer?.id);
    },
});
</script>

<template>
    <Button aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" @click="execute" />
</template>

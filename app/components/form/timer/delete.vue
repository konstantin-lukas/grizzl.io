<script setup lang="ts">
const toast = useToast();
const emit = defineEmits(["success"]);
const props = defineProps<{ id: string; title: string }>();
async function deleteTimer() {
    $fetch(`/api/timers/${props.id}`, { method: "DELETE" })
        .then(async () => {
            emit("success");
            toast.add(createToastSuccess(`Timer "${props.title}" deleted successfully.`));
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <UModal :close="false">
        <UTooltip text="Löschen">
            <Button aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" />
        </UTooltip>
        <template #title>
            <p>Are you sure you want to delete the timer titled "{{ props.title }}"?</p>
        </template>
        <template #description>
            <p>This action cannot be undone, so be sure you really want to do this!</p>
        </template>
        <template #footer="{ close }">
            <Button icon="heroicons:trash" :on-async-click="deleteTimer" color="error"> Delete </Button>
            <Button variant="subtle" icon="heroicons:backspace" @click="close"> Cancel </Button>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits(["success", "cancel"]);
const toast = useToast();
const props = defineProps<{ timer: { id: string; title: string } | undefined }>();

async function deleteTimer(id: string, title: string) {
    $fetch(`/api/timers/${id}`, { method: "DELETE" })
        .then(async () => {
            emit("success");
            toast.add(createToastSuccess(`Timer "${title}" deleted successfully.`));
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <UModal :close="false" :open="!!props.timer">
        <template #title>
            <p>Are you sure you want to delete the timer titled "{{ props.timer?.title }}"?</p>
        </template>
        <template #description>
            <p>This action cannot be undone, so be sure you really want to do this!</p>
        </template>
        <template #footer>
            <Button
                icon="heroicons:trash"
                :on-async-click="async () => await deleteTimer(props.timer!.id, props.timer!.title)"
                color="error"
            >
                Delete
            </Button>
            <Button variant="subtle" icon="heroicons:backspace" @click="emit('cancel')"> Cancel </Button>
        </template>
    </UModal>
</template>

<style scoped></style>

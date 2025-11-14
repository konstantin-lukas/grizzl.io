<script setup lang="ts">
import type { TimerType } from "#shared/schema/timer";

const props = defineProps<{ timers: (TimerType & { id: string })[] | undefined }>();
const emit = defineEmits(["delete"]);
const toast = useToast();
const confirmDeleteTimer = ref<{ id: string; title: string } | undefined>(undefined);
async function deleteTimer(id: string, title: string) {
    $fetch(`/api/timers/${id}`, { method: "DELETE" })
        .then(async () => {
            emit("delete");
            toast.add(createToastSuccess(`Timer "${title}" deleted successfully.`));
            confirmDeleteTimer.value = undefined;
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <div v-if="props.timers?.length !== 0" class="mt-16">
        <TransitionGroup name="list" tag="div" class="relative">
            <div
                v-for="timer in props.timers"
                :key="timer.id"
                class="mb-8 flex flex-col justify-between gap-8 border-b border-b-border-accented pb-8 last-of-type:border-none sm:flex-row sm:items-center"
            >
                <div>
                    <TypoH1 class="mb-1 line-clamp-2 break-words">{{ timer.title }}</TypoH1>
                    <span>
                        {{ timer.intervals.length }}
                        {{ `Interval${timer.intervals.length === 1 ? "" : "s"}` }} (~{{
                            Math.trunc(timer.intervals.reduce((prev, curr) => prev + curr.duration, 0) / 1000)
                        }}s)
                    </span>
                </div>
                <div class="flex justify-start gap-4">
                    <UTooltip text="Start">
                        <Button aria-label="Start" icon="heroicons:play-solid" />
                    </UTooltip>
                    <UTooltip text="Bearbeiten">
                        <Button aria-label="Bearbeiten" variant="subtle" icon="heroicons:pencil-square" />
                    </UTooltip>
                    <UTooltip text="Löschen">
                        <Button
                            aria-label="Löschen"
                            color="error"
                            variant="subtle"
                            icon="heroicons:trash"
                            @click="confirmDeleteTimer = timer"
                        />
                    </UTooltip>
                </div>
            </div>
        </TransitionGroup>
    </div>

    <UModal :close="false" :open="!!confirmDeleteTimer">
        <template #title>
            <p>Are you sure you want to delete the timer titled "{{ confirmDeleteTimer?.title }}"?</p>
        </template>
        <template #description>
            <p>This action cannot be undone, so be sure you really want to do this!</p>
        </template>
        <template #footer>
            <Button
                icon="heroicons:trash"
                :on-async-click="async () => await deleteTimer(confirmDeleteTimer!.id, confirmDeleteTimer!.title)"
                color="error"
            >
                Delete
            </Button>
            <Button variant="subtle" icon="heroicons:backspace" @click="() => (confirmDeleteTimer = undefined)">
                Cancel
            </Button>
        </template>
    </UModal>
</template>

<style scoped></style>

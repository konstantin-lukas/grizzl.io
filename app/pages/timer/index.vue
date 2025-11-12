<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => refresh());
const toast = useToast();
async function deleteTimer(id: string, title: string) {
    $fetch(`/api/timers/${id}`, { method: "DELETE" })
        .then(async () => {
            await refresh();
            toast.add(createToastSuccess(`Timer "${title}" deleted successfully.`));
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <LayoutWrapper class="center">
        <div class="max-w-full">
            <UEmpty
                v-if="data?.length === 0"
                :title="$t('timer.noTimersTitle')"
                :description="$t('timer.noTimersDescription')"
                variant="naked"
                icon="heroicons:inbox"
                :actions="[
                    {
                        icon: 'heroicons:plus-small',
                        label: $t('ui.create'),
                        size: 'xl',
                        onClick: () => {
                            open = true;
                        },
                    },
                ]"
            />
            <FormCreateTimer v-model:open="open" @success="open = false" />
            <div v-if="data?.length !== 0" class="flex flex-col gap-16">
                <div v-for="timer in data" :key="timer.id">
                    <TypoH1 class="mb-1 line-clamp-2 break-words">{{ timer.title }}</TypoH1>
                    <span>
                        {{ timer.intervals.length }} Intervals (~{{
                            Math.trunc(timer.intervals.reduce((prev, curr) => prev + curr.duration, 0) / 1000)
                        }}s)
                    </span>
                    <USeparator class="mt-2 mb-4" />
                    <div class="flex gap-4">
                        <Button icon="heroicons:play-solid">Start</Button>
                        <UTooltip text="Bearbeiten">
                            <Button aria-label="Bearbeiten" variant="subtle" icon="heroicons:pencil-square" />
                        </UTooltip>
                        <UModal :close="false">
                            <UTooltip text="Löschen">
                                <Button aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" />
                            </UTooltip>
                            <template #body>
                                <p>Are you sure you want to delete the timer titled "{{ timer.title }}"?</p>
                            </template>
                            <template #footer="{ close }">
                                <Button
                                    icon="heroicons:trash"
                                    :on-async-click="async () => await deleteTimer(timer.id, timer.title)"
                                    color="error"
                                >
                                    Delete
                                </Button>
                                <Button variant="subtle" icon="heroicons:backspace" @click="close"> Cancel </Button>
                            </template>
                        </UModal>
                    </div>
                </div>
            </div>
        </div>
    </LayoutWrapper>
</template>

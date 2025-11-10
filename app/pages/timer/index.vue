<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => refresh());
const toast = useToast();
async function deleteTimer(id: string) {
    const { error } = await tryCatchApi($fetch(`/api/timers/${id}`, { method: "DELETE" }));
    toast.add(error ? createToastError(error) : createToastSuccess("Timer deleted successfully."));
    if (!error) await refresh();
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
                        <UTooltip text="Löschen">
                            <Button
                                aria-label="Löschen"
                                color="error"
                                variant="subtle"
                                icon="heroicons:trash"
                                :on-async-click="async () => await deleteTimer(timer.id)"
                            />
                        </UTooltip>
                    </div>
                </div>
            </div>
        </div>
    </LayoutWrapper>
</template>

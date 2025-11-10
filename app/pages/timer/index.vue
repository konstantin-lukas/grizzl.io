<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => refresh());
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
                        <UButton icon="heroicons:play-solid">Start</UButton>
                        <UTooltip text="Bearbeiten">
                            <UButton aria-label="Bearbeiten" variant="subtle" icon="heroicons:pencil-square" />
                        </UTooltip>
                        <UTooltip text="Löschen">
                            <UButton aria-label="Löschen" color="error" variant="subtle" icon="heroicons:trash" />
                        </UTooltip>
                    </div>
                </div>
            </div>
        </div>
    </LayoutWrapper>
</template>

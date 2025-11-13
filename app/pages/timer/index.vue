<script setup lang="ts">
const open = ref(false);
const { data, refresh } = useFetch("/api/timers");
watch(open, () => {
    if (!open.value) refresh();
});
</script>

<template>
    <LayoutWrapper :class="{ center: data?.length === 0 }">
        <div class="m-auto max-w-xl">
            <DataEmpty
                v-if="data?.length === 0"
                :title="$t('timer.noTimersTitle')"
                :description="$t('timer.noTimersDescription')"
                @open="() => (open = true)"
            />
            <FormTimerCreate v-model:open="open" @success="open = false" />
            <div v-if="data?.length !== 0" class="mt-16">
                <TransitionGroup name="list" tag="div" class="relative">
                    <div
                        v-for="timer in data"
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
                            <FormTimerDelete :id="timer.id" :title="timer.title" @success="refresh" />
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </LayoutWrapper>
</template>

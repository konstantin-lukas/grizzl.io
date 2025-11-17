<script setup lang="ts">
import type { TimerOutput } from "#shared/schema/timer";

const emit = defineEmits(["create"]);
const props = defineProps<{ isLast: boolean; timer: TimerOutput & { id: string } }>();
const open = ref(false);
watch(open, () => {
    if (!open.value) refreshNuxtData("/api/timers");
});
</script>

<template>
    <li class="relative w-full">
        <div
            class="mb-8 flex w-full flex-col justify-between gap-8 border-b border-b-border-accented pb-8 sm:flex-row sm:items-center"
        >
            <div class="min-w-0 shrink-1">
                <TypoH1 class="mb-1 line-clamp-2 overflow-hidden break-words">{{ props.timer.title }}</TypoH1>
                <span>
                    {{ props.timer.intervals.length }}
                    {{ `Interval${props.timer.intervals.length === 1 ? "" : "s"}` }} (~{{
                        Math.trunc(props.timer.intervals.reduce((prev, curr) => prev + curr.duration, 0) / 1000)
                    }}s)
                </span>
            </div>
            <div class="flex justify-start gap-4">
                <Button aria-label="Start" icon="heroicons:play-solid" />
                <Button aria-label="Bearbeiten" variant="subtle" icon="heroicons:pencil-square" @click="open = true" />
                <FormTimerDelete :timer="props.timer" />
            </div>

            <OverlayDrawer v-model:open="open">
                <FormTimer :initial-state="props.timer" @success="open = false" />
                <template #title>Create a new timer</template>
                <template #description>
                    Choose between different types of timer intervals to create a fully customized timer
                </template>
            </OverlayDrawer>
        </div>
        <div v-if="props.isLast" class="center absolute w-full">
            <Button icon="heroicons:plus" color="neutral" size="xl" @click="emit('create')"> Erstellen </Button>
        </div>
    </li>
</template>

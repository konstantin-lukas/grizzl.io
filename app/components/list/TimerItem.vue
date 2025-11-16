<script setup lang="ts">
const props = defineProps<{ timer: { id: string; title: string; intervals: { duration: number }[] } }>();
</script>

<template>
    <li
        class="mb-8 flex w-full flex-col justify-between gap-8 border-b border-b-border-accented pb-8 first-of-type:mt-16 last-of-type:border-none sm:flex-row sm:items-center"
    >
        <div>
            <TypoH1 class="mb-1 line-clamp-2 break-words">{{ props.timer.title }}</TypoH1>
            <span>
                {{ props.timer.intervals.length }}
                {{ `Interval${props.timer.intervals.length === 1 ? "" : "s"}` }} (~{{
                    Math.trunc(props.timer.intervals.reduce((prev, curr) => prev + curr.duration, 0) / 1000)
                }}s)
            </span>
        </div>
        <div class="flex justify-start gap-4">
            <Button aria-label="Start" icon="heroicons:play-solid" />
            <Button aria-label="Bearbeiten" variant="subtle" icon="heroicons:pencil-square" />
            <FormTimerDelete :timer="props.timer" />
        </div>
    </li>
</template>

<style scoped></style>

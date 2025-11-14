<script setup lang="ts">
const emit = defineEmits(["delete"]);
const props = defineProps<{ timer: { id: string; title: string; intervals: { duration: number }[] } }>();
</script>

<template>
    <li
        class="mb-8 flex flex-col justify-between gap-8 border-b border-b-border-accented pb-8 last-of-type:border-none sm:flex-row sm:items-center"
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
                    @click="emit('delete')"
                />
            </UTooltip>
        </div>
    </li>
</template>

<style scoped></style>

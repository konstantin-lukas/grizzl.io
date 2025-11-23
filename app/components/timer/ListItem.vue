<script setup lang="ts">
import type { Timer } from "#shared/schema/timer";
import { formatDuration } from "date-fns";

const emit = defineEmits<{ (e: "create"): void; (e: "start", value: Timer): void }>();
const props = defineProps<{ isLast: boolean; timer: Timer & { id: string } }>();

const open = ref(false);
const duration = useComputedOnLocaleChange(
    () =>
        formatDuration({
            seconds: props.timer.intervals.reduce((prev, curr) => prev + curr.duration * curr.repeatCount, 0) / 1000,
        }),
    () => props.timer.intervals,
);

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
                    {{
                        $t(
                            "timer.round",
                            props.timer.intervals.reduce((prev, curr) => prev + curr.repeatCount, 0),
                        )
                    }}
                    ({{ duration }})
                </span>
            </div>
            <div class="flex justify-start gap-4">
                <Button :aria-label="$t('ui.start')" icon="heroicons:play-solid" @click="emit('start', timer)" />
                <Button
                    :aria-label="$t('ui.edit')"
                    variant="subtle"
                    icon="heroicons:pencil-square"
                    @click="open = true"
                />
                <TimerFormDelete :timer="props.timer" />
            </div>
            <OverlayDrawer v-model:open="open">
                <TimerFormUpsert :initial-state="props.timer" @success="open = false" />
                <template #title>{{ $t("timer.aria.drawer.edit") }}</template>
                <template #description>{{ $t("timer.aria.drawer.description") }}</template>
            </OverlayDrawer>
        </div>
        <Transition name="fade">
            <div v-if="props.isLast" class="center absolute w-full">
                <Button icon="heroicons:plus" color="neutral" size="xl" @click="emit('create')">{{
                    $t("ui.create")
                }}</Button>
            </div>
        </Transition>
    </li>
</template>

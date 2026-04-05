<script setup lang="ts">
import type { Timer } from "#shared/timer/validators/timer.validator";
import { formatDuration } from "date-fns";
import Button from "~/core/components/button/Button.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H2 from "~/core/components/typo/H2.vue";
import useComputedOnLocaleChange from "~/core/composables/useComputedOnLocaleChange";
import { ICON_EDIT, ICON_PLAY, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";
import OverviewDeleteButton from "~/timer/components/overview/OverviewDeleteButton.vue";
import UpsertForm from "~/timer/components/upsert-form/UpsertForm.vue";

const emit = defineEmits<{ (e: "create"): void; (e: "start", value: Timer): void }>();
const props = defineProps<{ isLast: boolean; timer: Timer & { id: string } }>();

const open = ref(false);
const duration = useComputedOnLocaleChange(
    () => {
        const timeInSeconds = Math.floor(
            props.timer.intervals.reduce((prev, curr) => prev + curr.duration * curr.repeatCount, 0) / 1000,
        );
        return formatDuration({
            minutes: Math.floor(timeInSeconds / 60),
            seconds: timeInSeconds % 60,
        });
    },
    () => props.timer.intervals,
);

watch(open, () => {
    if (!open.value) refreshNuxtData("/api/timers");
});
</script>

<template>
    <li class="relative w-full">
        <div
            class="mb-8 flex w-full flex-col justify-between gap-8 border-b border-b-accented pb-8 sm:flex-row sm:items-center"
        >
            <div class="min-w-0 shrink">
                <H2
                    as="h1"
                    class="mb-1 line-clamp-2 overflow-hidden wrap-break-word"
                    data-test-id="timer-list-item-title"
                >
                    {{ props.timer.title }}
                </H2>
                <span data-test-id="timer-list-item-length">
                    {{
                        $t(
                            "timer.round",
                            props.timer.intervals.reduce((prev, curr) => prev + curr.repeatCount, 0),
                        )
                    }}
                    ({{ duration }})
                </span>
            </div>
            <div class="flex justify-start gap-4 hover-none:gap-5">
                <Button
                    :aria-label="$t('ui.start')"
                    :icon="ICON_PLAY"
                    data-test-id="timer-list-item-play-button"
                    @click="emit('start', timer)"
                />
                <Button
                    :aria-label="$t('ui.edit')"
                    variant="subtle"
                    :icon="ICON_EDIT"
                    data-test-id="timer-list-item-edit-button"
                    @click="open = true"
                />
                <OverviewDeleteButton :timer="props.timer" />
            </div>
            <Drawer v-model:open="open">
                <UpsertForm :initial-state="props.timer" @success="open = false" />
                <template #title>{{ $t("timer.aria.drawer.edit") }}</template>
                <template #description>{{ $t("timer.aria.drawer.description") }}</template>
            </Drawer>
        </div>
        <Transition name="fade">
            <div v-if="props.isLast" class="center absolute w-full">
                <Button
                    :icon="ICON_PLUS_CIRCLE"
                    color="neutral"
                    data-test-id="timer-create-button"
                    @click="emit('create')"
                >
                    {{ $t("ui.create") }}
                </Button>
            </div>
        </Transition>
    </li>
</template>

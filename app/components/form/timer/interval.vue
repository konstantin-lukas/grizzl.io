<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import type { TimerIntervalWithId } from "#shared/types/timer";
import { nanoid } from "nanoid";

const beatPattern = defineModel<Beat[] | undefined>("beatPattern");
const title = defineModel<string | undefined>("title");
const repeatCount = defineModel<number | undefined>("repeatCount");
const duration = defineModel<number | undefined>("duration");
const intervals = defineModel<TimerIntervalWithId[]>("intervals");
const { index } = defineProps<{ index: number }>();
</script>

<template>
    <fieldset
        class="group relative rounded-md border border-border-accented bg-back transition-[margin] focus-within:mb-12 sm:focus-within:mb-0"
    >
        <div class="center w-full gap-4 p-4">
            <UFormField label="Interval Title" :name="`intervals.${index}.title`" class="w-full">
                <UInput v-model="title" class="w-full" :maxlength="100" placeholder="Displayed during interval" />
            </UFormField>
            <UFormField label="Interval Type" :name="`intervals.${index}.type`" required class="z-1 w-full">
                <USelect
                    :items="['Temporal', 'Rhythm']"
                    default-value="Temporal"
                    class="w-full"
                    :portal="false"
                    @update:model-value="
                        value => {
                            beatPattern =
                                value === 'Temporal'
                                    ? undefined
                                    : [Beat.ACCENTED, Beat.NORMAL, Beat.NORMAL, Beat.NORMAL];
                        }
                    "
                />
            </UFormField>
            <div class="flex gap-4">
                <UFormField label="Repetitions" :name="`intervals.${index}.repeatCount`" required class="w-full">
                    <UInputNumber v-model="repeatCount" class="w-full" :min="1" />
                </UFormField>
                <UFormField label="Duration" :name="`intervals.${index}.duration`" required class="w-full">
                    <UInputNumber
                        v-model="duration"
                        class="w-full"
                        :step="0.1"
                        :min="1"
                        :format-options="{ style: 'unit', unit: 'second' }"
                    />
                </UFormField>
            </div>
            <Transition name="fade">
                <UFormField
                    v-if="beatPattern !== undefined"
                    label="Beat Pattern"
                    :name="`intervals.${index}.beatPattern`"
                    required
                    class="w-full"
                >
                    <InputBeatPattern
                        :beats="beatPattern!"
                        :bar-length="duration!"
                        class="w-full"
                        @update:beats="value => (beatPattern = value)"
                    />
                </UFormField>
            </Transition>
        </div>
        <USeparator />
        <div class="relative w-full cursor-move overflow-hidden py-6" data-handle>
            <UIcon name="mdi:drag-horizontal" class="absolute top-1/2 left-1/2 size-12 -translate-1/2" />
        </div>
        <div
            class="invisible absolute left-0 mt-4 flex w-full items-center justify-center gap-4 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 sm:top-0 sm:left-full sm:mt-0 sm:ml-4 sm:w-auto sm:flex-col"
        >
            <UTooltip text="Duplicate interval" :content="{ side: 'top', sideOffset: 13 }">
                <Button
                    icon="heroicons:document-duplicate"
                    variant="subtle"
                    aria-label="Duplicate interval"
                    :disabled="intervals?.length === 100"
                    @click="
                        () => {
                            if (intervals?.length === 100) return;
                            const newIntervals = duplicateNthElement(intervals!, index);
                            newIntervals[index + 1] = {
                                ...newIntervals[index + 1]!,
                                id: nanoid(),
                            };
                            intervals = newIntervals;
                        }
                    "
                />
            </UTooltip>
            <UTooltip text="Move interval up" :content="{ side: 'top', sideOffset: 13 }">
                <Button
                    icon="heroicons:arrow-small-up"
                    variant="subtle"
                    aria-label="Move interval up"
                    :disabled="index === 0"
                    @click="
                        () => {
                            intervals = moveElement(intervals!, index, index - 1);
                        }
                    "
                />
            </UTooltip>
            <UTooltip text="Move interval down" :content="{ side: 'top', sideOffset: 13 }">
                <Button
                    icon="heroicons:arrow-small-down"
                    variant="subtle"
                    aria-label="Move interval down"
                    :disabled="index === intervals!.length - 1"
                    @click="
                        () => {
                            intervals = moveElement(intervals!, index, index + 1);
                        }
                    "
                />
            </UTooltip>
            <UTooltip text="Delete interval" :content="{ side: 'top', sideOffset: 13 }">
                <Button
                    icon="heroicons:trash"
                    color="error"
                    variant="subtle"
                    aria-label="Delete interval"
                    :disabled="intervals!.length === 1"
                    @click="
                        () => {
                            if (intervals!.length === 1) return;
                            intervals = deleteNthElement(intervals!, index);
                        }
                    "
                />
            </UTooltip>
        </div>
    </fieldset>
</template>

<style scoped></style>

<script setup lang="ts">
import { Beat } from "#shared/enum/timer";
import type { PutTimer } from "#shared/schema/timer";

const intervals = defineModel<PutTimer["intervals"]>("intervals");
const { index } = defineProps<{ index: number }>();
</script>

<template>
    <fieldset
        class="group relative rounded-md border border-border-accented bg-back transition-[margin] focus-within:mb-12 sm:focus-within:mb-0"
    >
        <div class="center w-full gap-4 p-4">
            <UFormField label="Interval Title" :name="`intervals.${index}.title`" class="w-full">
                <UInput
                    v-model="intervals![index]!.title"
                    class="w-full"
                    :maxlength="100"
                    placeholder="Displayed during interval"
                />
            </UFormField>
            <UFormField label="Interval Type" :name="`intervals.${index}.type`" required class="z-1 w-full">
                <USelect
                    :items="['Temporal', 'Rhythm']"
                    :default-value="intervals![index]!.beatPattern ? 'Rhythm' : 'Temporal'"
                    class="w-full"
                    :portal="false"
                    @update:model-value="
                        value => {
                            intervals![index]!.beatPattern =
                                value === 'Temporal' ? null : [Beat.ACCENTED, Beat.NORMAL, Beat.NORMAL, Beat.NORMAL];
                        }
                    "
                />
            </UFormField>
            <div class="flex gap-4">
                <UFormField label="Repetitions" :name="`intervals.${index}.repeatCount`" required class="w-full">
                    <UInputNumber v-model="intervals![index]!.repeatCount" class="w-full" :min="1" />
                </UFormField>
                <UFormField label="Duration" :name="`intervals.${index}.duration`" required class="w-full">
                    <UInputNumber
                        v-model="intervals![index]!.duration"
                        class="w-full"
                        :step="0.1"
                        :min="1"
                        :format-options="{ style: 'unit', unit: 'second' }"
                    />
                </UFormField>
            </div>
            <Transition name="fade">
                <UFormField
                    v-if="intervals![index]!.beatPattern !== null"
                    label="Beat Pattern"
                    :name="`intervals.${index}.beatPattern`"
                    required
                    class="w-full"
                >
                    <InputBeatPattern
                        :beats="intervals![index]!.beatPattern"
                        :bar-length="intervals![index]!.duration"
                        class="w-full"
                        @update:beats="value => (intervals![index]!.beatPattern = value)"
                    />
                </UFormField>
            </Transition>
        </div>
        <USeparator />
        <div class="relative w-full cursor-move overflow-hidden py-6" data-handle>
            <UIcon name="mdi:drag-horizontal" class="absolute top-1/2 left-1/2 size-12 -translate-1/2" />
        </div>
        <FormTimerIntervalControls v-model:intervals="intervals" :index="index" />
    </fieldset>
</template>

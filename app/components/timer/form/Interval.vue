<script setup lang="ts">
import { COUNT_MIN, TITLE_MAX } from "#shared/constants/data";
import { Beat } from "#shared/enum/timer";
import type { PutTimer } from "#shared/schema/timer";

const intervals = defineModel<PutTimer["intervals"]>("intervals");
const { index } = defineProps<{ index: number }>();
const durationSeconds = computed({
    get: () => intervals!.value![index]!.duration / 1000,
    set: v => (intervals!.value![index]!.duration = v * 1000),
});
</script>

<template>
    <fieldset
        class="group relative rounded-md border border-border-accented bg-back transition-[margin] focus-within:mb-12 sm:focus-within:mb-0"
    >
        <div class="center w-full gap-4 p-4">
            <UFormField :label="$t('timer.form.interval.title')" :name="`intervals.${index}.title`" class="w-full">
                <UInput
                    v-model="intervals![index]!.title"
                    class="w-full"
                    :maxlength="TITLE_MAX"
                    :placeholder="$t('timer.form.interval.titlePlaceholder')"
                />
            </UFormField>
            <UFormField
                :label="$t('timer.form.interval.type')"
                :name="`intervals.${index}.type`"
                required
                class="z-1 w-full"
            >
                <USelect
                    :items="[$t('timer.form.interval.temporal'), $t('timer.form.interval.rhythm')]"
                    :default-value="
                        intervals![index]!.beatPattern
                            ? $t('timer.form.interval.rhythm')
                            : $t('timer.form.interval.temporal')
                    "
                    class="w-full"
                    :portal="false"
                    @update:model-value="
                        value => {
                            intervals![index]!.beatPattern =
                                value === $t('timer.form.interval.temporal')
                                    ? null
                                    : [Beat.ACCENTED, Beat.NORMAL, Beat.NORMAL, Beat.NORMAL];
                        }
                    "
                />
            </UFormField>
            <div class="flex gap-4">
                <UFormField
                    :label="$t('timer.form.interval.repetitions')"
                    :name="`intervals.${index}.repeatCount`"
                    required
                    class="w-full"
                >
                    <UInputNumber v-model="intervals![index]!.repeatCount" class="w-full" :min="COUNT_MIN" />
                </UFormField>
                <UFormField
                    :label="$t('timer.form.interval.duration')"
                    :name="`intervals.${index}.duration`"
                    required
                    class="w-full"
                >
                    <UInputNumber
                        v-model="durationSeconds"
                        class="w-full"
                        :step="0.1"
                        :min="COUNT_MIN"
                        :format-options="{ style: 'unit', unit: 'second' }"
                    />
                </UFormField>
            </div>
            <Transition name="fade">
                <UFormField
                    v-if="intervals![index]!.beatPattern !== null"
                    :label="$t('timer.form.interval.beatPattern')"
                    :name="`intervals.${index}.beatPattern`"
                    required
                    class="w-full"
                >
                    <TimerBeatPatternInput
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
        <TimerFormIntervalControls v-model:intervals="intervals" :index="index" />
    </fieldset>
</template>

<script setup lang="ts">
import { Beat } from "#shared/features/timer/enums/beat.enum";
import {
    type PutTimer,
    TIMER_DURATION_MAX,
    TIMER_DURATION_MIN,
} from "#shared/features/timer/validators/timer.validator";
import { COUNT_MAX, COUNT_MIN, TITLE_MAX, ZERO } from "#shared/validators/core.validator";
import UpsertFormBeatPatternInput from "~/features/timer/components/upsert-form/UpsertFormBeatPatternInput.vue";
import UpsertFormIntervalActionButtons from "~/features/timer/components/upsert-form/UpsertFormIntervalActionButtons.vue";

const intervals = defineModel<PutTimer["intervals"]>("intervals");
const { index } = defineProps<{ index: number }>();
const durationSeconds = computed({
    get: () => intervals!.value![index]!.duration / 1000,
    set: v => (intervals!.value![index]!.duration = v * 1000),
});
const preparationTimeSeconds = computed({
    get: () => intervals!.value![index]!.preparationTime / 1000,
    set: v => (intervals!.value![index]!.preparationTime = v * 1000),
});
</script>

<template>
    <fieldset
        class="group relative rounded-md border border-border-accented bg-back transition-[margin] focus-within:mb-12 sm:focus-within:mb-0"
    >
        <legend class="ml-2 bg-back px-2" data-test-id="interval-legend">
            {{ $t("timer.form.interval.index", index + 1) }}
        </legend>
        <div class="center w-full gap-4 p-4">
            <UFormField :label="$t('timer.form.interval.title')" :name="`intervals.${index}.title`" class="w-full">
                <UInput
                    v-model="intervals![index]!.title"
                    class="w-full"
                    :maxlength="TITLE_MAX"
                    data-test-id="interval-title-input"
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
                    data-test-id="interval-type-select"
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
                >
                    <template #item="{ item }">
                        <span data-test-id="interval-type-option">{{ item }}</span>
                    </template>
                </USelect>
            </UFormField>
            <div class="flex flex-col gap-4 not-sm:flex-wrap xs:flex-row">
                <UFormField
                    :label="$t('timer.form.interval.repetitions')"
                    :name="`intervals.${index}.repeatCount`"
                    required
                    class="w-full grow text-nowrap"
                >
                    <UInputNumber
                        v-model="intervals![index]!.repeatCount"
                        class="w-full"
                        :min="COUNT_MIN"
                        :max="COUNT_MAX"
                        data-test-id="interval-repetitions-input"
                    />
                </UFormField>
                <UFormField
                    :label="$t('timer.form.interval.preparationTime')"
                    :name="`intervals.${index}.preparationTime`"
                    required
                    class="w-[calc(50%-0.5rem)] text-nowrap not-xs:w-full sm:w-full"
                >
                    <UInputNumber
                        v-model="preparationTimeSeconds"
                        class="w-full"
                        data-test-id="interval-preparation-time-input"
                        :min="ZERO"
                        :max="TIMER_DURATION_MAX / 1000"
                        :format-options="{ style: 'unit', unit: 'second' }"
                    />
                </UFormField>
                <UFormField
                    :label="$t('timer.form.interval.duration')"
                    :name="`intervals.${index}.duration`"
                    required
                    class="w-[calc(50%-0.5rem)] text-nowrap not-xs:w-full sm:w-full"
                >
                    <UInputNumber
                        v-model="durationSeconds"
                        class="w-full"
                        data-test-id="interval-duration-input"
                        :min="TIMER_DURATION_MIN / 1000"
                        :max="TIMER_DURATION_MAX / 1000"
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
                    <UpsertFormBeatPatternInput
                        data-test-id="interval-beat-pattern-input"
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
        <UpsertFormIntervalActionButtons v-model:intervals="intervals" :index="index" />
    </fieldset>
</template>

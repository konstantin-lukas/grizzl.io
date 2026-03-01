<script setup lang="ts">
import { COUNT_MAX, COUNT_MIN, TITLE_MAX, ZERO } from "#shared/core/validators/core.validator";
import { Beat } from "#shared/timer/enums/beat.enum";
import { type PutTimer, TIMER_DURATION_MAX, TIMER_DURATION_MIN } from "#shared/timer/validators/timer.validator";
import UAccordion from "#ui/components/Accordion.vue";
import UpsertFormBeatPatternInput from "~/timer/components/upsert-form/UpsertFormBeatPatternInput.vue";
import UpsertFormIntervalActionButtons from "~/timer/components/upsert-form/UpsertFormIntervalActionButtons.vue";

const emit = defineEmits(["toggle"]);
const intervals = defineModel<PutTimer["intervals"]>("intervals");
const { index, expandedOverride } = defineProps<{ index: number; expandedOverride: "open" | "close" | "" }>();

const durationSeconds = computed({
    get: () => intervals!.value![index]!.duration / 1000,
    set: v => (intervals!.value![index]!.duration = v * 1000),
});
const preparationTimeSeconds = computed({
    get: () => intervals!.value![index]!.preparationTime / 1000,
    set: v => (intervals!.value![index]!.preparationTime = v * 1000),
});
const accordionValue = ref(index === 0 ? "0" : undefined);

watch(
    () => expandedOverride,
    value => {
        if (value === "") return;
        accordionValue.value = value === "open" ? "0" : undefined;
        emit("toggle");
    },
);
</script>

<template>
    <fieldset
        data-test-id="interval-fieldset"
        class="group relative w-full rounded-md border border-border-accented bg-back transition-[margin]"
        :class="{ 'not-sm:mb-12 hover-none:not-sm:mb-14': accordionValue !== undefined }"
    >
        <div>
            <UAccordion
                v-model="accordionValue"
                :items="[{ icon: 'mdi:progress-clock' }]"
                :ui="{ trailingIcon: 'mr-4', leadingIcon: 'ml-4' }"
            >
                <template #default>
                    <legend
                        data-test-id="interval-legend"
                        class="max-w-[50dvw] overflow-hidden text-nowrap text-ellipsis sm:max-w-80"
                    >
                        {{ intervals![index]!.title || $t("timer.form.interval.index", index + 1) }}
                    </legend>
                </template>
                <template #content>
                    <USeparator />
                    <div class="flex w-full flex-col items-center gap-4 p-4">
                        <UFormField
                            :label="$t('timer.form.interval.title')"
                            :name="`intervals.${index}.title`"
                            class="w-full"
                        >
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
                        <div class="flex w-full flex-col gap-4 not-sm:flex-wrap xs:flex-row">
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
                </template>
            </UAccordion>
        </div>
        <USeparator />
        <div class="relative w-full cursor-move overflow-hidden py-6" data-handle>
            <UIcon name="mdi:drag-horizontal" class="absolute top-1/2 left-1/2 size-12 -translate-1/2" />
        </div>
        <UpsertFormIntervalActionButtons
            v-model:intervals="intervals"
            :index="index"
            :open="accordionValue !== undefined"
        />
    </fieldset>
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { ICON_CALENDAR, ICON_MINUS } from "~/core/constants/icons.constant";

const inputDate = useTemplateRef("inputDate");

const props = defineProps<{
    start: CalendarDate | undefined;
    end: CalendarDate | undefined;
    min?: CalendarDate;
    max?: CalendarDate;
}>();
const emit = defineEmits<{ update: [{ start: CalendarDate; end: CalendarDate }] }>();

const modelValue = shallowRef({
    start: props.start,
    end: props.end,
});

watch(props, newProps => {
    modelValue.value = { start: newProps.start, end: newProps.end };
});

watch(modelValue, newValue => {
    if (
        !newValue.start ||
        !newValue.end ||
        (props.max && props.max.compare(newValue.start) < 0) ||
        (props.min && props.min.compare(newValue.start) > 0) ||
        (props.max && props.max.compare(newValue.end) < 0) ||
        (props.min && props.min.compare(newValue.end) > 0)
    )
        return;
    emit("update", newValue as { start: CalendarDate; end: CalendarDate });
});
</script>

<template>
    <UInputDate
        ref="inputDate"
        v-model="modelValue"
        range
        :separator-icon="ICON_MINUS"
        :max-value="props.max"
        :min-value="props.min"
    >
        <template #trailing>
            <UPopover :reference="inputDate?.inputsRef[0]?.$el">
                <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="ICON_CALENDAR"
                    :aria-label="$t('ui.selectDateRange')"
                    class="px-0"
                />

                <template #content>
                    <UCalendar v-model="modelValue" class="p-2" range :max-value="props.max" :min-value="props.min" />
                </template>
            </UPopover>
        </template>
    </UInputDate>
</template>

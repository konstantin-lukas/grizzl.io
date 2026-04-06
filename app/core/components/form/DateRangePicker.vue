<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { ICON_CALENDAR, ICON_MINUS } from "~/core/constants/icons.constant";

const inputDate = useTemplateRef("inputDate");

const props = defineProps<{ start: CalendarDate | undefined; end: CalendarDate | undefined }>();
const emit = defineEmits<{ update: [{ start: CalendarDate; end: CalendarDate }] }>();

const modelValue = shallowRef({
    start: props.start,
    end: props.end,
});

watch(modelValue, newValue => {
    if (!newValue.start || !newValue.end) return;
    emit("update", newValue as { start: CalendarDate; end: CalendarDate });
});
</script>

<template>
    <UInputDate ref="inputDate" v-model="modelValue" range :separator-icon="ICON_MINUS">
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
                    <UCalendar v-model="modelValue" class="p-2" range />
                </template>
            </UPopover>
        </template>
    </UInputDate>
</template>

<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import { ICON_CALENDAR, ICON_MINUS } from "~/core/constants/icons.constant";

const inputDate = useTemplateRef("inputDate");

const modelValue = shallowRef({
    start: new CalendarDate(2022, 1, 10),
    end: new CalendarDate(2022, 1, 20),
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
                    <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
                </template>
            </UPopover>
        </template>
    </UInputDate>
</template>

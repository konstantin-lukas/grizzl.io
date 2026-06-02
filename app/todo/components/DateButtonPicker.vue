<script setup lang="ts">
import { ICON_EVENT_AVAILABLE, ICON_EVENT_BUSY } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import type { CalendarDate } from "@internationalized/date";

const modelValue = defineModel<CalendarDate | null>();
const open = ref(false);
const toggle = () => {
    open.value = !open.value;
};
const clear = () => {
    open.value = false;
    modelValue.value = null;
};
const close = (value: boolean) => {
    if (!value) open.value = false;
};
</script>

<template>
    <UPopover :open="open" @update:open="close">
        <Button
            color="neutral"
            variant="ghost"
            :aria-label="$t('todo.aria.scheduleTask')"
            :icon="modelValue ? ICON_EVENT_AVAILABLE : ICON_EVENT_BUSY"
            class="center aspect-square size-7 text-nowrap text-muted hover-none:size-8"
            :on-click="toggle"
            data-test-id="date-picker-button"
        />
        <template #content>
            <UCalendar v-model="modelValue" class="p-2" @update:model-value="open = false" />
            <div class="px-4 pb-4">
                <Button color="error" variant="subtle" class="center w-full" @click="clear">
                    {{ $t("todo.clearDate") }}
                </Button>
            </div>
        </template>
    </UPopover>
</template>

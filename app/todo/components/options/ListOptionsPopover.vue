<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_OPTIONS } from "~/core/constants/icons.constant";
import ListTitleIcon from "~/todo/components/options/ListTitleIcon.vue";
import ListPresetsMenu from "~/todo/components/options/ListPresetsMenu.vue";

const emit = defineEmits(["delete"]);
</script>

<template>
    <UPopover>
        <Button
            :icon="ICON_OPTIONS"
            color="neutral"
            variant="ghost"
            class="absolute top-2 left-4 size-10 hover-none:size-12"
            :aria-label="$t('todo.aria.todoListSettings')"
            data-test-id="todo-list-options-button"
        />
        <template #content>
            <div class="max-w-[calc(100dvw-1rem)]">
                <div class="relative flex items-center gap-2 p-2 pr-12 hover-none:pr-14">
                    <ListTitleIcon />
                </div>
                <USeparator />
                <div class="p-2">
                    <ListPresetsMenu />
                </div>
                <USeparator />
                <div class="p-2">
                    <Button
                        square
                        color="error"
                        class="flex w-full justify-center font-bold"
                        :icon="ICON_DELETE"
                        @click="emit('delete')"
                    >
                        {{ $t("todo.deleteList") }}
                    </Button>
                </div>
            </div>
        </template>
    </UPopover>
</template>

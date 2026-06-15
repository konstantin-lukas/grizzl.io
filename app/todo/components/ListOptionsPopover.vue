<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_DELETE, ICON_OPTIONS, ICON_RESTART, ICON_SAVE } from "~/core/constants/icons.constant";
import CategoryIconSelect from "~/core/components/form/CategoryIconSelect.vue";

const listTitle = ref("");
const listIcon = ref();
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
            <div class="relative flex items-center gap-2 p-2 pr-12">
                <UInput v-model="listTitle" :aria-label="$t('todo.aria.listName')" />
                <div class="absolute top-1/2 right-0 -translate-y-1/2 hover-none:right-1">
                    <CategoryIconSelect
                        v-model="listIcon"
                        :category-name="listTitle"
                        class="scale-75 hover-none:scale-80"
                    />
                </div>
            </div>
            <USeparator />
            <div class="p-2">
                <div class="flex gap-2">
                    <UInput :aria-label="$t('todo.aria.presetName')" />
                    <Button variant="subtle" square :icon="ICON_SAVE" :aria-label="$t('todo.aria.saveNewPreset')" />
                </div>
                <ul>
                    <li class="mt-2 flex items-center gap-2" v-for="preset in [1, 2, 3]" :key="preset">
                        <span class="grow">Preset 1</span>
                        <div>
                            <Button
                                square
                                variant="ghost"
                                color="neutral"
                                :aria-label="$t('todo.aria.applyPreset')"
                                :icon="ICON_RESTART"
                            />
                            <Button
                                square
                                variant="ghost"
                                color="error"
                                :aria-label="$t('todo.aria.deletePreset')"
                                :icon="ICON_DELETE"
                            />
                        </div>
                    </li>
                </ul>
            </div>
            <USeparator />
            <div class="p-2">
                <Button square variant="subtle" color="error" class="flex w-full justify-center" :icon="ICON_DELETE">
                    {{ $t("todo.deleteList") }}
                </Button>
            </div>
        </template>
    </UPopover>
</template>

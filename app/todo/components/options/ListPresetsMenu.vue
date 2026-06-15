<script setup lang="ts">
import { ICON_SAVE } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { useOpenList } from "~/todo/composables/useOpenList";
import { onResponseError } from "~/core/utils/toast";
import ListPresetItem from "~/todo/components/options/ListPresetItem.vue";

const newPresetName = ref("");
const { id, presets, uncompletedItems, refreshPresets } = useOpenList();
const { t } = useI18n();
const toast = useToast();

const handleSavePreset = async () => {
    if (!newPresetName.value.trim()) return;
    await $fetch(`/api/todo/lists/${id.value}/presets`, {
        method: "POST",
        body: {
            title: newPresetName.value,
            items: uncompletedItems.value.map(({ text }) => text),
        },
        onResponseError: onResponseError(toast, t),
    });
    await refreshPresets();
};
</script>

<template>
    <div class="flex gap-2">
        <UInput
            :aria-label="$t('todo.aria.presetName')"
            :placeholder="$t('todo.newPreset')"
            :maxlength="TITLE_MAX"
            class="grow"
            v-model="newPresetName"
            :color="newPresetName.trim().length === 0 ? 'error' : 'primary'"
        />
        <Button
            variant="subtle"
            square
            :disabled="newPresetName.trim().length === 0"
            :icon="ICON_SAVE"
            :aria-label="$t('todo.aria.saveNewPreset')"
            :on-async-click="handleSavePreset"
        />
    </div>

    <ul class="mt-2 max-h-[min(30dvh,20rem)] overflow-auto">
        <TransitionGroup name="list">
            <ListPresetItem
                class="mt-2 flex w-full items-center gap-2 overflow-hidden first-of-type:mt-0"
                v-for="preset in presets"
                :key="preset.id"
                :preset
            />
        </TransitionGroup>
    </ul>
</template>

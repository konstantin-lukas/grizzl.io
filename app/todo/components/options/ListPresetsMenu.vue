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
    }).then(() => (newPresetName.value = ""));
    await refreshPresets();
};
</script>

<template>
    <div class="flex gap-2">
        <UInput
            v-model="newPresetName"
            :aria-label="$t('todo.aria.presetName')"
            :placeholder="$t('todo.newPreset')"
            :maxlength="TITLE_MAX"
            class="grow"
            :color="newPresetName.trim().length === 0 ? 'error' : 'primary'"
            data-test-id="list-options-preset-title-input"
        />
        <Button
            variant="subtle"
            square
            :disabled="newPresetName.trim().length === 0"
            :icon="ICON_SAVE"
            :aria-label="$t('todo.aria.saveNewPreset')"
            :on-async-click="handleSavePreset"
            data-test-id="list-options-preset-save-button"
        />
    </div>
    <ul
        class="relative max-h-[min(30dvh,20rem)] overflow-x-hidden overflow-y-auto"
        :class="{ 'mt-2': presets.length > 0 }"
    >
        <TransitionGroup name="list">
            <ListPresetItem v-for="preset in presets" :key="preset.id" :preset />
        </TransitionGroup>
    </ul>
</template>

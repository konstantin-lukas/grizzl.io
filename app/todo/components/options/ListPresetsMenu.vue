<script setup lang="ts">
import { ICON_DELETE, ICON_RESTART, ICON_SAVE } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { useOpenList } from "~/todo/composables/useOpenList";
import { onResponseError } from "~/core/utils/toast";

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
    refreshPresets();
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
            <li
                class="mt-2 flex w-full items-center gap-2 overflow-hidden first-of-type:mt-0"
                v-for="preset in presets"
                :key="preset.id"
            >
                <span class="grow overflow-hidden text-ellipsis">{{ preset.title }}</span>
                <div class="shrink-0">
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
        </TransitionGroup>
    </ul>
</template>

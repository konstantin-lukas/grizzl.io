<script setup lang="ts">
import { ICON_DELETE, ICON_RESTART } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { type Preset, useOpenList } from "~/todo/composables/useOpenList";
import useSoftDelete from "~/core/composables/useSoftDelete";

const { id, refreshPresets } = useOpenList();
const props = defineProps<{ preset: Preset }>();

const apiRoute = computed(() => `/api/todo/lists/${id.value}/presets/${props.preset.id}`);
const interpolations = computed(() => ({ title: props.preset.title }));
const deletePreset = useSoftDelete(apiRoute, {
    refresh: async () => refreshPresets(),
    successTitle: "todo.toast.deletedPresetTitle",
    successDescription: "todo.toast.deletedPresetDescription",
    interpolations,
});
</script>

<template>
    <li class="mt-2 flex w-full items-center gap-2 overflow-hidden first-of-type:mt-0">
        <span class="grow overflow-hidden pl-2 text-ellipsis">{{ preset.title }}</span>
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
                :on-async-click="deletePreset"
            />
        </div>
    </li>
</template>

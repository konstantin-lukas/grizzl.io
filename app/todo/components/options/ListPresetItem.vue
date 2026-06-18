<script setup lang="ts">
import { ICON_DELETE, ICON_RESTART } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";
import { type Preset, useOpenList } from "~/todo/composables/useOpenList";
import useSoftDelete from "~/core/composables/useSoftDelete";
import { onResponseError } from "~/core/utils/toast";
import { tryCatch } from "#shared/core/utils/result.util";

const { id, refreshPresets, completedItems, uncompletedItems } = useOpenList();
const toast = useToast();
const { t } = useI18n();
const props = defineProps<{ preset: Preset }>();

const apiRoute = computed(() => `/api/todo/lists/${id.value}/presets/${props.preset.id}`);
const interpolations = computed(() => ({ title: props.preset.title }));

const deletePreset = useSoftDelete(apiRoute, {
    refresh: async () => refreshPresets(),
    successTitle: "todo.toast.deletedPresetTitle",
    successDescription: "todo.toast.deletedPresetDescription",
    interpolations,
});

const makeToastError = (e: { response: { status: number; ok: boolean } }) => {
    if (e.response.status === 409) {
        toast.add({
            title: t("todo.presetTooManyItemsTitle"),
            description: t("todo.presetTooManyItemsDescription"),
            color: "error",
        });
        return;
    }
    if (!e.response.ok) {
        onResponseError(toast, t);
        return;
    }
};

const applyPreset = async () => {
    const { data, error } = await tryCatch(
        $fetch(`/api/todo/lists/${id.value}/presets/${props.preset.id}:apply`, {
            method: "POST",
            onResponseError: makeToastError,
        }),
    );
    if (error) return;
    completedItems.value = data.filter(item => item.index === null);
    uncompletedItems.value = data.filter(item => item.index !== null);
};
</script>

<template>
    <li class="mt-2 flex w-full items-center gap-2 overflow-hidden first-of-type:mt-0">
        <span class="grow overflow-hidden pl-2 text-ellipsis">{{ preset.title }}</span>
        <div class="shrink-0">
            <UModal>
                <Button
                    square
                    variant="ghost"
                    color="neutral"
                    :aria-label="$t('todo.aria.applyPreset')"
                    :icon="ICON_RESTART"
                />
                <template #title>
                    <span class="mr-12 block overflow-hidden wrap-anywhere">
                        {{ $t("todo.presetConfirmationTitle", { title: props.preset.title }) }}
                    </span>
                </template>
                <template #description>
                    <span class="mt-4 block">
                        {{ $t("todo.presetConfirmationDescription") }}
                    </span>
                </template>
                <template #footer="{ close }">
                    <Button class="flex w-full justify-center font-bold" :on-async-click="applyPreset">
                        {{ $t("ui.apply") }}
                    </Button>
                    <Button class="flex w-full justify-center font-bold" color="error" @click="close">
                        {{ $t("ui.cancel") }}
                    </Button>
                </template>
            </UModal>
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

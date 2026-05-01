<script setup lang="ts">
import { ICON_WALLET } from "~/core/constants/icons.constant";

const props = withDefaults(defineProps<{ titleTranslationKey?: string; descriptionTranslationKey?: string }>(), {
    titleTranslationKey: "ui.noEntries",
    descriptionTranslationKey: undefined,
});
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center rounded-xl bg-elevated">
        <UEmpty
            variant="naked"
            :icon="ICON_WALLET"
            :title="$t(props.titleTranslationKey)"
            :description="props.descriptionTranslationKey && $t(props.descriptionTranslationKey)"
            :ui="{ avatar: 'bg-default' }"
        />
    </div>
</template>

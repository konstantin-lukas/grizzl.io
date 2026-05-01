<script setup lang="ts">
import { ICON_INBOX } from "~/core/constants/icons.constant";

const props = withDefaults(
    defineProps<{ titleTranslationKey?: string; descriptionTranslationKey?: string; icon?: string }>(),
    {
        titleTranslationKey: "ui.noEntries",
        descriptionTranslationKey: undefined,
        icon: ICON_INBOX,
    },
);
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center rounded-xl bg-elevated">
        <UEmpty
            variant="naked"
            :icon="props.icon"
            :title="$t(props.titleTranslationKey)"
            :description="props.descriptionTranslationKey && $t(props.descriptionTranslationKey)"
            :ui="{ avatar: 'bg-default' }"
        />
    </div>
</template>

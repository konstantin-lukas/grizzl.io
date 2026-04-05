<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_INBOX, ICON_PLUS_CIRCLE } from "~/core/constants/icons.constant";

const emit = defineEmits(["open"]);
const { titleAs = "h1" } = defineProps<{ titleAs?: string }>();
</script>

<template>
    <UEmpty variant="naked" :icon="ICON_INBOX">
        <template #body>
            <component
                :is="titleAs"
                data-test-id="data-empty-title"
                class="-mt-2 mb-2 text-center text-base font-medium text-highlighted"
            >
                {{ $t("ui.noEntries") }}
            </component>
            <Button :icon="ICON_PLUS_CIRCLE" data-test-id="empty-create-button" @click="emit('open')">
                {{ $t("ui.create") }}
            </Button>
        </template>
    </UEmpty>
</template>

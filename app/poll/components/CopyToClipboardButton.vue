<script setup lang="ts">
import { ICON_SHARE } from "~/core/constants/icons.constant";
import Button from "~/core/components/button/Button.vue";

const url = useRequestURL();

const isPopoverOpen = ref(false);
const closePopoverTimeout = ref();

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url.toString());
    if (closePopoverTimeout.value) clearTimeout(closePopoverTimeout.value);
    closePopoverTimeout.value = setTimeout(() => (isPopoverOpen.value = false), 2000);
};
</script>

<template>
    <UPopover
        v-model:open="isPopoverOpen"
        :content="{
            align: 'center',
            side: 'top',
        }"
        :ui="{ content: 'overflow-hidden' }"
        @update:open="copyToClipboard"
    >
        <Button color="neutral" :icon="ICON_SHARE">{{ $t("ui.share") }}</Button>
        <template #content>
            <span class="block bg-primary px-4 py-2 text-back">{{ $t("ui.copiedToClipboard") }}</span>
        </template>
    </UPopover>
</template>

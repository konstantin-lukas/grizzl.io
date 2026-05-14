<script setup lang="ts">
import { ICON_INFO } from "~/core/constants/icons.constant";
const tooltipOpen = ref(false);

const props = defineProps<{ text: string }>();
</script>

<template>
    <UTooltip
        :text="props.text"
        :delay-duration="0"
        class="ml-1"
        :open="tooltipOpen"
        :content="{ side: 'top' }"
        :ui="{ content: 'max-w-[calc(100dvw-1rem)] h-auto', text: 'text-wrap' }"
        @update:open="o => (tooltipOpen = o)"
    >
        <UIcon
            :name="ICON_INFO"
            tabindex="0"
            class="size-5 opacity-50 transition-all hover:text-front hover:opacity-100 focus:text-front focus:opacity-100"
            @touchstart="tooltipOpen = true"
        />
    </UTooltip>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const {
    onAsyncClick = undefined,
    disabled = undefined,
    ariaLabel = undefined,
    ...props
} = defineProps<
    Omit<ButtonProps, "disabled"> & {
        onAsyncClick?: (event: MouseEvent) => Promise<void> | undefined;
        disabled?: boolean | undefined;
        ariaLabel?: string;
    }
>();
const { isLoading, start, finish } = useLoadingIndicator();
async function handleClick(event: MouseEvent) {
    if (!onAsyncClick) return;
    start({ force: true });
    await onAsyncClick(event);
    finish();
}
const handler = computed(() => (typeof onAsyncClick !== "undefined" ? handleClick : props.onClick));
</script>

<template>
    <UTooltip v-if="ariaLabel" :text="ariaLabel">
        <UButton
            v-bind="props"
            :aria-label="ariaLabel"
            :disabled="typeof disabled === 'boolean' ? disabled : isLoading"
            @click="handler"
        >
            <slot />
        </UButton>
    </UTooltip>
    <UButton v-else v-bind="props" :disabled="typeof disabled === 'boolean' ? disabled : isLoading" @click="handler">
        <slot />
    </UButton>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const {
    onAsyncClick = undefined,
    disabled = undefined,
    ...props
} = defineProps<
    Omit<ButtonProps, "disabled"> & {
        onAsyncClick?: (event: MouseEvent) => Promise<void> | undefined;
        disabled?: boolean | undefined;
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
    <UButton v-bind="props" :disabled="typeof disabled === 'boolean' ? disabled : isLoading" @click="handler">
        <slot />
    </UButton>
</template>

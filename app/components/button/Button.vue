<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const {
    onAsyncClick = undefined,
    disabled = undefined,
    ariaLabel = undefined,
    dataTestId = undefined,
    onClick = undefined,
    ...props
} = defineProps<
    Omit<ButtonProps, "disabled" | "onClick"> & {
        onClick?: (event: MouseEvent) => void | Promise<void>;
        onAsyncClick?: ((event: MouseEvent) => Promise<void>) | undefined;
        disabled?: boolean | undefined;
        ariaLabel?: string;
        dataTestId?: string;
    }
>();

const { isLoading, start, finish } = useLoadingIndicator();

async function handler(event: MouseEvent) {
    if (typeof onAsyncClick !== "undefined") {
        start({ force: true });
        await onAsyncClick(event);
        finish();
        return;
    }
    if (typeof onClick === "function") {
        onClick(event);
    }
}

const ui = {
    base: "hover-none:px-3.5 hover-none:py-2 hover-none:text-base gap-1",
    leadingIcon: "hover-none:size-6.5",
    leadingAvatarSize: "hover-none:xs",
    trailingIcon: "hover-none:size-6.5",
};
</script>

<template>
    <UTooltip v-if="ariaLabel" :ui="{ content: 'hover-none:!hidden' }">
        <UButton
            v-bind="props"
            :aria-label="ariaLabel"
            :disabled="typeof disabled === 'boolean' ? disabled : isLoading"
            :data-test-id
            :ui
            @click="handler"
        >
            <slot />
            <slot name="leading" />
        </UButton>
        <template #content>
            <span data-test-id="tooltip">{{ ariaLabel }}</span>
        </template>
    </UTooltip>
    <UButton
        v-else
        v-bind="props"
        :disabled="typeof disabled === 'boolean' ? disabled : isLoading"
        :data-test-id
        :ui
        @click="handler"
    >
        <slot />
        <slot name="leading" />
    </UButton>
</template>

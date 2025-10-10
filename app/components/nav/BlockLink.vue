<script setup lang="ts">
import { NuxtLink } from "#components";
import { clsx } from "clsx/lite";

const { as = NuxtLink } = defineProps<{ as?: string | object }>();
const hoverClass = clsx(
    "absolute",
    "h-full",
    "w-full",
    "px-8",
    "py-3",
    "left-0",
    "top-full",
    "bg-gradient-to-r",
    "from-violet-500",
    "to-rose-500",
);
</script>

<template>
    <component
        :is="as"
        class="group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full text-back"
    >
        <span class="w-full transition-transform group-hover:-translate-y-full group-focus-visible:-translate-y-full">
            <span class="flex h-full w-full items-center justify-center gap-2 bg-front px-8 py-3 text-center">
                <slot />
            </span>
            <span :class="hoverClass">
                <UIcon
                    name="heroicons:arrow-right-20-solid"
                    class="absolute top-1/2 left-1/2 h-8 w-8 -translate-1/2"
                    style="color: var(--color-theme-white)"
                />
            </span>
        </span>
    </component>
</template>

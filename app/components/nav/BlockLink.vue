<script setup lang="ts">
import { clsx } from "clsx/lite";

const { color } = defineProps<{ color: string }>();
const hoverClass = clsx("absolute", "h-full", "w-full", "px-8", "py-3", "left-0", "top-full", color);
</script>

<template>
    <NuxtLink class="text-back group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full">
        <span class="w-full transition-transform group-hover:-translate-y-full group-focus-visible:-translate-y-full">
            <span class="bg-front flex h-full w-full items-center justify-center gap-2 px-8 py-3 text-center">
                <slot />
            </span>
            <span :class="hoverClass">
                <Icon
                    name="heroicons:arrow-right-20-solid"
                    class="-translate-1/2 absolute left-1/2 top-1/2 h-8 w-8"
                    style="color: var(--color-theme-white)"
                />
            </span>
        </span>
    </NuxtLink>
</template>

<style scoped></style>

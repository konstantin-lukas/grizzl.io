<script setup lang="ts">
import { NuxtLink } from "#components";

const { as = NuxtLink } = defineProps<{ as?: string | object }>();
</script>

<template>
    <component
        :is="as"
        class="group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full text-back"
    >
        <span class="w-full transition-transform group-hover:-translate-y-full group-focus-visible:-translate-y-full">
            <span
                class="flex h-full w-full items-center justify-center gap-2 bg-front px-8 py-3 text-center text-nowrap"
            >
                <slot />
            </span>
            <span class="absolute top-full left-0 h-full w-full bg-theme-dark px-8 py-3">
                <UIcon
                    name="heroicons:arrow-right-20-solid"
                    class="absolute top-1/2 left-1/2 h-8 w-8 -translate-1/2 text-theme-white"
                />
            </span>
        </span>
    </component>
</template>

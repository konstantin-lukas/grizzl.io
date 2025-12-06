<script setup lang="ts">
import { NuxtLink } from "#components";

const {
    as = NuxtLink,
    disabled = false,
    dataTestId = undefined,
    to = undefined,
} = defineProps<{ as?: string | object; disabled?: boolean; dataTestId?: string; to?: string }>();
</script>

<template>
    <div class="relative">
        <component
            :is="disabled ? 'span' : as"
            :data-test-id="dataTestId"
            :to="disabled ? null : to"
            class="group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full text-back select-none"
            :aria-hidden="disabled ?? null"
        >
            <span
                class="w-full transition-transform"
                :class="{
                    'group-hover:-translate-y-full group-focus-visible:-translate-y-full': !disabled,
                }"
            >
                <span
                    class="flex h-full w-full items-center justify-center gap-2 px-8 py-3 text-center text-nowrap"
                    :class="disabled ? 'bg-front text-neutral-400' : 'bg-front'"
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
        <span
            v-if="disabled"
            class="absolute top-0 -left-4 -translate-y-1/2 -rotate-5 rounded-full bg-error px-4 py-1 text-sm whitespace-nowrap text-theme-white"
            >{{ $t("menu.comingSoon") }}</span
        >
    </div>
</template>

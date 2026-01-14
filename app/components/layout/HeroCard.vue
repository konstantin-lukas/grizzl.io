<script setup lang="ts">
import { NuxtLink } from "#components";
import type { APP_NAV } from "~/constants/nav";

const {
    label,
    icon,
    disabled,
    class: className = "",
} = defineProps<{
    icon: (typeof APP_NAV)[number][1];
    label: (typeof APP_NAV)[number][0];
    disabled?: boolean;
    class?: string;
}>();
</script>

<template>
    <component
        :is="disabled ? 'div' : NuxtLink"
        :to="disabled ? undefined : `/${label}`"
        :class="{ 'pointer-events-none': disabled }"
        :aria-hidden="disabled || undefined"
    >
        <UCard
            class="center w-48 xs:aspect-square"
            :class="{
                'transition-all hover:scale-110 hover:bg-primary hover:text-back': !disabled,
                'relative': disabled,
                [className ?? '']: !!className,
            }"
        >
            <div class="center gap-2" :class="{ 'text-neutral-400 dark:text-neutral-600': disabled }">
                <UIcon :name="icon" class="size-8 2xs:size-6 xs:size-8" />
                <span class="xs:text-md text-md 2xs:text-sm" data-test-id="hero-card-label">
                    {{ $t(`ui.${label}`) }}
                </span>
            </div>
            <span
                v-if="disabled"
                class="absolute top-1/2 left-1/2 -translate-1/2 rotate-20 rounded-full bg-error px-4 py-1 whitespace-nowrap text-theme-white"
                data-test-id="hero-card-coming-soon"
            >
                {{ $t("menu.comingSoon") }}
            </span>
        </UCard>
    </component>
</template>

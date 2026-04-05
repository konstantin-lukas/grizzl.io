<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import useOnlineStatus from "~/core/composables/useOnlineStatus";
import { ICON_MOON, ICON_SUN } from "~/core/constants/icons.constant";

const isOnline = useOnlineStatus();
const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set(_isDark: boolean) {
        colorMode.preference = _isDark ? "dark" : "light";
    },
});
</script>

<template>
    <Button
        :aria-label="$t('menu.aria.toggleTheme')"
        color="neutral"
        variant="ghost"
        class="center absolute top-4 right-4 z-50 size-10 cursor-pointer hover-none:size-12"
        data-test-id="theme-toggle"
        size="xl"
        @click="isDark = !isDark"
    >
        <template #leading>
            <UIcon
                class="hidden size-8 dark:inline-block"
                :class="isOnline ? 'text-front' : 'text-back'"
                :name="ICON_SUN"
                data-test-id="icon-light-mode"
            />
            <UIcon
                class="size-8 dark:hidden"
                :class="isOnline ? 'text-front' : 'text-back'"
                :name="ICON_MOON"
                data-test-id="icon-dark-mode"
            />
        </template>
    </Button>
</template>

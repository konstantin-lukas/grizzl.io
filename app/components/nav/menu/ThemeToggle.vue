<script setup lang="ts">
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
        class="center absolute top-[calc(1rem_+_env(safe-area-inset-top))] right-4 z-50 size-10 cursor-pointer hover-none:size-12"
        data-test-id="theme-toggle"
        size="xl"
        @click="isDark = !isDark"
    >
        <template #leading>
            <UIcon
                class="hidden size-8 dark:inline-block"
                :class="isOnline ? 'text-front' : 'text-back'"
                name="material-symbols:light-mode-outline-rounded"
                data-test-id="icon-light-mode"
            />
            <UIcon
                class="size-8 dark:hidden"
                :class="isOnline ? 'text-front' : 'text-back'"
                name="material-symbols:dark-mode-outline-rounded"
                data-test-id="icon-dark-mode"
            />
        </template>
    </Button>
</template>

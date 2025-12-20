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
        class="center absolute top-4 right-4 z-50 h-10 w-10 cursor-pointer"
        :data-test-id="`theme-toggle-${$colorMode.preference}`"
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

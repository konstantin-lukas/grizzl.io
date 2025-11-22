<script setup lang="ts">
const isOnline = useOnlineStatus();
const ui = computed(() => ({
    leadingIcon: isOnline.value ? "text-front" : "text-back",
}));
</script>

<template>
    <UColorModeButton
        :aria-label="$t('menu.aria.toggleTheme')"
        class="absolute top-4 right-4"
        :data-test-id="`theme-toggle-${$colorMode.value}`"
        size="xl"
        :ui
        @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'"
    />
</template>

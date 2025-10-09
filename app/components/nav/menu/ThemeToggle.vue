<script setup lang="ts">
const colorMode = useColorMode();
const { t } = useI18n();
</script>

<template>
    <UColorModeButton
        :aria-label="t('menu.aria.toggleTheme')"
        class="absolute top-4 right-4"
        :data-test-id="`theme-toggle-${colorMode.value}`"
        size="xl"
        @click="colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'"
    />
</template>

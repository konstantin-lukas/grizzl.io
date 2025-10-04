<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
    <button
        aria-label="Toggle app theme"
        class="absolute right-4 top-4 h-10 w-10"
        data-test-id="theme-toggle"
        @click="colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'"
    >
        Theme
    </button>
</template>

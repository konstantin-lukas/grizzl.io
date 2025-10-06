<script setup lang="ts">
const { toggle } = useMenu();
</script>

<template>
    <button
        class="fixed left-4 top-4 z-50 h-10 w-10 cursor-pointer"
        aria-label="Toggle the menu"
        data-test-id="menu-button"
        @click="toggle"
    >
        Menu
    </button>
</template>

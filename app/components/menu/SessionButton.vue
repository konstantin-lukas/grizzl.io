<script setup lang="ts">
const { close } = useMenu();
</script>

<template>
    <div class="flex">
        <NuxtLink
            class="inline-link-1 group mx-auto mt-4 flex justify-center gap-2"
            to="/signin"
            data-test-id="session-button"
            @click="close"
        >
            Login
        </NuxtLink>
    </div>
</template>

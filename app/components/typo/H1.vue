<script setup lang="ts">
const { as = "h1" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="text-4xl leading-tight text-front uppercase sm:text-6xl">
        <slot />
    </component>
</template>

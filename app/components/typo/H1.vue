<script setup lang="ts">
const { as = "h1" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="text-3xl leading-tight text-primary uppercase sm:text-4xl">
        <slot />
    </component>
</template>

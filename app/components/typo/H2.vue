<script setup lang="ts">
const { as = "h2" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="text-3xl leading-tight text-primary uppercase sm:text-4xl">
        <slot />
    </component>
</template>

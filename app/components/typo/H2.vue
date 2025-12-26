<script setup lang="ts">
const { as = "h2" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="text-xl leading-tight text-primary uppercase sm:text-2xl">
        <slot />
    </component>
</template>

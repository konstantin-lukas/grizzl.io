<script setup lang="ts">
const { as = "h1" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="line-clamp-2 text-4xl leading-tight text-primary uppercase">
        <slot />
    </component>
</template>

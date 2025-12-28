<script setup lang="ts">
const { as = "h1" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="leading-tight text-primary uppercase text-4xl">
        <slot />
    </component>
</template>

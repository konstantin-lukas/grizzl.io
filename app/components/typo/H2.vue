<script setup lang="ts">
const { as = "h2" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="leading-tight text-primary uppercase text-2xl">
        <slot />
    </component>
</template>

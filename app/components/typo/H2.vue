<script setup lang="ts">
const { as = "h2" } = defineProps<{ as?: string }>();
</script>
<template>
    <component :is="as" class="text-4xl leading-tight text-primary uppercase">
        <slot />
    </component>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>

<template>
    <UIcon :name="'material-symbols:' + props.name" />
</template>

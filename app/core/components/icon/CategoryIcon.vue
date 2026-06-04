<script setup lang="ts">
const props = defineProps<{ categoryName: string }>();
</script>

<template>
    <div class="center aspect-square size-12 rounded-full bg-primary">
        <UIcon :name="'material-symbols:' + props.categoryName" class="size-8 bg-back" />
    </div>
</template>
